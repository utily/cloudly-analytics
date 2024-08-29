import { gracely } from "gracely"
import { authly } from "authly"
import * as bigquery from "@google-cloud/bigquery"
import { listener } from "cloudly-analytics-common"
import { http, Response } from "cloudly-http"
import { isly } from "isly"
import type { BigQuery as BigQueryConfiguration } from "."

export class BigQueryApi {
	constructor(protected readonly listenerConfiguration: BigQueryConfiguration) {
		this.#log = listenerConfiguration.logger?.log ?? console.log
	}
	#token?: string
	#log: Required<BigQueryConfiguration>["logger"]["log"]
	/**
	 * https://developers.google.com/identity/protocols/oauth2/service-account#jwt-auth
	 * @returns
	 */
	private async getToken() {
		if (!this.#token) {
			const privateKey = this.listenerConfiguration.privateKey
			// The downloaded key from google has the private_key in PEM-format, transform it:
			const base64key = (
				(privateKey.private_key.match(
					/(?:^|-+\s*BEGIN PRIVATE KEY\s*-+\s*)([A-Za-z0-9+/\s]+={0,3})(?:\s*-+\s*END PRIVATE KEY\s*-+|$)/s
				) ?? [])[1] ?? ""
			).replace(/\s/g, "")
			if (base64key.length == 0) {
				this.#log(`BigQuery private key has wrong format${/\\/.test(privateKey.private_key) ? ": Badly escaped" : ""}.`)
			}
			const key = authly.Algorithm.RS256(undefined, base64key)
			if (key) {
				key.kid = privateKey.private_key_id
				const issuer = authly.Issuer.create(privateKey.client_email, key)
				issuer.duration = 3600 // Always exactly an hour
				this.#token = await issuer.sign({
					iss: privateKey.client_email,
					sub: privateKey.client_email,
					aud: "https://bigquery.googleapis.com/",
				})
				if (!this.#token)
					this.#log("BigQueryApi:getToken - Failed to sign token")
			} else
				this.#log("BigQueryApi:getToken - Failed to generate token")
		}
		return this.#token
	}
	/**
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tabledata/insertAll
	 */
	async insertAll(rows: bigquery.InsertRowsOptions["rows"]): Promise<bigquery.InsertRowsStreamResponse | undefined> {
		const { projectName: projectName, datasetName: datasetName, tableName } = this.listenerConfiguration
		const insertUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables/${tableName}/insertAll`
		const payload: bigquery.InsertRowsOptions = { kind: "bigquery#tableDataInsertAllResponse", rows }
		let result: bigquery.InsertRowsStreamResponse | undefined = undefined
		const token = await this.getToken()
		if (!token)
			await this.listenerConfiguration.errorHandler?.("BiqQuery token not found.")
		else {
			const response = await http.fetch({
				url: insertUrl,
				method: "POST",
				body: JSON.stringify(payload),
				header: { "content-type": "application/json;charset=UTF-8", authorization: "Bearer " + token },
			})
			const body = await response.body
			result =
				response.status != 200
					? (this.#log(`Request to ${insertUrl} failed`, body),
					  await this.listenerConfiguration.errorHandler?.({ ...response, body }))
					: body
		}
		return result
	}
	/**
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/insert
	 */
	async createTable(): Promise<BigQueryApi.TableResponse | gracely.Error> {
		const { projectName, datasetName, tableName } = this.listenerConfiguration
		const createUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables`
		const payload: bigquery.TableMetadata = {
			tableReference: {
				projectId: projectName,
				datasetId: datasetName,
				tableId: tableName,
			},
			schema: { fields: this.listenerConfiguration.tableSchema },
		}
		const response = await http.fetch({
			url: createUrl,
			method: "POST",
			body: JSON.stringify(payload),
			header: { "content-type": "application/json;charset=UTF-8", authorization: "Bearer " + (await this.getToken()) },
		})
		const body = await response.body
		let result: BigQueryApi.TableResponse | gracely.Error
		if (response.status == 200 && BigQueryApi.TableResponse.type.is(body))
			result = body
		else
			result = gracely.server.backendFailure("bigquery.googleapis.com", body)
		return result
	}
	/**
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/patch
	 */
	async patchTable(): Promise<BigQueryApi.TableResponse | gracely.Error> {
		const { projectName, datasetName, tableName } = this.listenerConfiguration
		const patchUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables/${tableName}`
		const payload: bigquery.TableMetadata = {
			tableReference: { projectId: projectName, datasetId: datasetName, tableId: tableName },
			schema: { fields: this.listenerConfiguration.tableSchema },
		}
		const response = await http.fetch({
			url: patchUrl,
			method: "PATCH",
			body: JSON.stringify(payload),
			header: {
				"content-type": "application/json;charset=UTF-8",
				authorization: "Bearer " + (await this.getToken()),
			},
		})
		const body = await response.body
		let result: BigQueryApi.TableResponse | gracely.Error
		if (response.status == 200 && BigQueryApi.TableResponse.type.is(body)) {
			result = body
		} else {
			result = gracely.server.backendFailure("bigquery.googleapis.com", body)
		}
		return result
	}
	/**
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/get
	 */
	async getTable(view: "BASIC" | "STORAGE_STATS" | "FULL" = "BASIC"): Promise<BigQueryApi.TableResponse | undefined> {
		const { projectName, datasetName, tableName } = this.listenerConfiguration
		const tableInfoUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables/${tableName}?view=${view}`
		const response: Response = await http.fetch({
			url: tableInfoUrl,
			method: "GET",
			header: {
				authorization: "Bearer " + (await this.getToken()),
			},
		})
		let result: BigQueryApi.TableResponse | undefined
		const body = await response.body
		if (response.status == 200 && BigQueryApi.TableResponse.type.is(body)) {
			result = body
		} else {
			result = undefined // response
		}
		return result
	}
}
export namespace BigQueryApi {
	export import BaseField = listener.BigQueryApi.BaseField
	export import TableSchemaField = listener.BigQueryApi.TableSchemaField
	export type TableResponse = {
		kind: "bigquery#table"
		schema: {
			fields: TableSchemaField[]
		}
	}
	export namespace TableResponse {
		export const type = isly.object<TableResponse>({
			kind: isly.string("bigquery#table"),
			schema: isly.object({ fields: isly.array(TableSchemaField.type) }),
		})
	}
}
