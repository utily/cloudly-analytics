import { gracely } from "gracely"
import { listener, types } from "cloudly-analytics-common"
import { BaseListener } from "../Base"
import { BigQueryApi } from "./BigQueryApi"

export interface BigQuery extends BigQuery.BaseConfiguration {
	privateKey: types.PrivateKey
}

export namespace BigQuery {
	export import Api = BigQueryApi
	export import BaseConfiguration = listener.BigQueryBaseConfiguration
	export const type = BaseConfiguration.type.extend<BigQuery>(
		{
			privateKey: types.PrivateKey.type,
		},
		"Listener.BigQuery"
	)
	export function createConfiguration(
		bigQueryConfiguration: BaseConfiguration,
		privateKey: types.PrivateKey,
		errorHandler?: (error?: unknown) => Promise<void>,
		logger?: { log: (message: string) => void }
	): BigQuery {
		return { ...bigQueryConfiguration, privateKey, errorHandler, logger }
	}
	export class Implementation extends BaseListener<BigQuery> {
		async addStatusDetails(result: BaseListener.StatusResult): Promise<BaseListener.StatusResult> {
			const bigQueryApi = new BigQueryApi(this.configuration)
			;(result.details ??= {}).table = await bigQueryApi.getTable()
			return result
		}
		getConfiguration() {
			return { ...this.configuration, privateKey: { ...this.configuration.privateKey, private_key: "********" } }
		}

		async setup(oldConfiguration?: BigQuery): Promise<BaseListener.SetupResult> {
			const bigQueryApi = new BigQueryApi(this.configuration)
			const result: BaseListener.SetupResult = { success: true }
			const table = await bigQueryApi.getTable()
			if (BigQueryApi.TableResponse.type.is(table)) {
				;(result.details ??= []).push(`Table ${this.configuration.tableName} exists.`)
				const allFieldsExists = this.configuration.tableSchema.every(field =>
					table.schema.fields.some(existingField =>
						(["name", "type", "mode"] as const).every(
							property => !field[property] || existingField[property] == field[property]
						)
					)
				)
				if (allFieldsExists) {
					;(result.details ??= []).push(`Table ${this.configuration.tableName} has all needed fields.`)
				} else {
					;(result.details ??= []).push(`Table ${this.configuration.tableName} needs to be patched.`)
					const patchResult = await bigQueryApi.patchTable()
					if (gracely.Error.is(patchResult)) {
						result.success = false
						;(result.details ??= []).push(patchResult)
					} else
						(result.details ??= []).push(`Table ${this.configuration.tableName} successfully patched.`)
				}
			} else {
				;(result.details ??= []).push(`Table ${this.configuration.tableName} does not exists.`)
				const createResult = await bigQueryApi.createTable()
				if (gracely.Error.is(createResult)) {
					result.success = false
					;(result.details ??= []).push(createResult)
				} else
					(result.details ??= []).push(`Table ${this.configuration.tableName} created.`)
			}
			this.log(JSON.stringify(result, undefined, 2))
			return result
		}

		async processBatch(batch: types.HasUuid[]): Promise<boolean[]> {
			const bigQueryApi = new BigQueryApi(this.configuration)
			const response = await bigQueryApi.insertAll(
				batch.map((item, index) => {
					const { uuid: insertId, ...json } = item
					return {
						// https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery#dataconsistency
						insertId,
						json,
					}
				})
			)
			let success = false
			if (!response) {
				this.log(`Listener.BigQuery (Name: ${this.configuration.name}) failed to store values. Http-request failed.`)
			} else if ((response.insertErrors?.length ?? 0) > 0) {
				this.log(`Listener.BigQuery (Name: ${this.configuration.name}) failed to store values.`)
				this.log(JSON.stringify(response.insertErrors))
			} else {
				success = true
			}
			return batch.map(item => success)
		}
	}
}
