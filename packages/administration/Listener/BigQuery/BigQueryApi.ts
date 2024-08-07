import { gracely } from "gracely"
import { authly } from "authly"
import type { InsertRowsOptions, InsertRowsStreamResponse, TableField, TableMetadata } from "@google-cloud/bigquery"
import { http, Response } from "cloudly-http"
import { isly } from "isly"
import type { BigQuery as BigQueryConfiguration } from "."

export class BigQueryApi {
	constructor(protected readonly listenerConfiguration: BigQueryConfiguration) {}
	#token?: string
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
			} else {
				console.error("BigQueryApi:getToken", "Failed to generate token")
			}
		}
		return this.#token
	}

	/**
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tabledata/insertAll
	 */
	async insertAll(rows: InsertRowsOptions["rows"]): Promise<InsertRowsStreamResponse | undefined> {
		const { projectName: projectName, datasetName: datasetName, tableName } = this.listenerConfiguration
		const insertUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables/${tableName}/insertAll`

		const payload: InsertRowsOptions = {
			kind: "bigquery#tableDataInsertAllResponse",
			rows,
		}
		const token = await this.getToken()
		const response = token
			? await http.fetch({
					url: insertUrl,
					method: "POST",
					body: JSON.stringify(payload),
					header: {
						"content-type": "application/json;charset=UTF-8",
						authorization: "Bearer " + (await this.getToken()),
					},
			  })
			: undefined
		return (response && response.status == 200 && (await response.body)) || undefined
	}
	/**
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/insert
	 */
	async createTable(): Promise<BigQueryApi.TableResponse | gracely.Error> {
		const { projectName, datasetName, tableName } = this.listenerConfiguration
		const createUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables`
		const payload: TableMetadata = {
			tableReference: {
				projectId: projectName,
				datasetId: datasetName,
				tableId: tableName,
			},
			schema: {
				fields: this.listenerConfiguration.tableSchema,
			},
		}
		const response = await http.fetch({
			url: createUrl,
			method: "POST",
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
	 * https://cloud.google.com/bigquery/docs/reference/rest/v2/tables/patch
	 */
	async patchTable(): Promise<BigQueryApi.TableResponse | gracely.Error> {
		const { projectName, datasetName, tableName } = this.listenerConfiguration
		const patchUrl = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectName}/datasets/${datasetName}/tables/${tableName}`
		const payload: TableMetadata = {
			tableReference: {
				projectId: projectName,
				datasetId: datasetName,
				tableId: tableName,
			},
			schema: {
				fields: this.listenerConfiguration.tableSchema,
			},
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
	export type BaseField<T extends string = string> = {
		name: T
		type: BaseField.Type
		mode?: BaseField.Mode
		fields?: BaseField[]
	}
	export namespace BaseField {
		export type Type = typeof Type.values[number]
		export namespace Type {
			export const values = [
				"STRING",
				"BYTES",
				"INTEGER",
				// (same as INTEGER)
				"INT64",
				"FLOAT",
				// (same as FLOAT)
				"FLOAT64",
				"NUMERIC",
				"BIGNUMERIC",
				"BOOLEAN",
				// (same as BOOLEAN)
				"BOOL",
				"TIMESTAMP",
				"DATE",
				"TIME",
				"DATETIME",
				"INTERVAL",
				// (where RECORD indicates that the field contains a nested schema)
				"RECORD",
				// (same as RECORD)
				"STRUCT",
				"GEOGRAPHY",
			] as const
			export const type = isly.string<Type>(values)
		}
		export type Mode = typeof Mode.values[number]
		export namespace Mode {
			export const values = ["NULLABLE", "REQUIRED", "REPEATED"] as const
			export const type = isly.string<Mode>(values)
		}
		export const type = isly.object<BaseField>({
			name: isly.string(/^[a-zA-Z_][a-zA-Z0-9_]{0,299}$/),
			type: Type.type,
			mode: Mode.type.optional(),
			fields: isly.lazy((): isly.Type<BaseField[] | undefined> => type.array().optional(), "fields"),
		})
	}
	export type BigQueryTableField = TableField
	export type TableSchemaField = BigQueryTableField & BaseField

	export namespace TableSchemaField {
		export const typeValues = BaseField.Type.values
		export const modeValues = BaseField.Mode.values
		export const type: isly.Type<TableSchemaField> = BaseField.type.extend<TableSchemaField>({
			categories: isly
				.object({
					names: isly.array(isly.string(), { criteria: "maxLength", value: 5 }).optional(),
				})
				.optional(),
			collation: isly.string().optional(),
			description: isly.string(/* TODO: MaxLength 1024 */).optional(),
			fields: isly.array(isly.lazy(() => type, "FieldDefinition")).optional(),
			maxLength: isly.string().optional(),
			policyTags: isly
				.object({
					names: isly.array(isly.string(), { criteria: "maxLength", value: 1 }).optional(),
				})
				.optional(),
			precision: isly.string().optional(),
			scale: isly.string().optional(),
			defaultValueExpression: isly.string().optional(),
			foreignTypeDefinition: isly.string().optional(),
			rangeElementType: isly.object<{ type?: string }>({ type: isly.string().optional() }).optional(),
			roundingMode: isly
				.string<"ROUNDING_MODE_UNSPECIFIED" | "ROUND_HALF_AWAY_FROM_ZERO" | "ROUND_HALF_EVEN">([
					"ROUNDING_MODE_UNSPECIFIED",
					"ROUND_HALF_AWAY_FROM_ZERO",
					"ROUND_HALF_EVEN",
				])
				.optional(),
		})
	}
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
