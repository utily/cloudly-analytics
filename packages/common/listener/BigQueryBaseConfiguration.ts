import { isly } from "isly"
import { BaseListenerConfiguration } from "./BaseListenerConfiguration"
import { BigQueryApi } from "./BigQueryApi"

export interface BigQueryBaseConfiguration extends BaseListenerConfiguration {
	type: "bigquery"
	projectName: string
	datasetName: string
	tableName: string
	tableSchema: BigQueryApi.TableSchemaField[]
}
export namespace BigQueryBaseConfiguration {
	export const type = BaseListenerConfiguration.type.extend<BigQueryBaseConfiguration>(
		{
			type: isly.string("bigquery"),
			projectName: isly.string(),
			datasetName: isly.string(),
			tableName: isly.string(),
			tableSchema: isly.array(BigQueryApi.TableSchemaField.type),
		},
		"Listener.BigQuery.BaseConfiguration"
	)
}
