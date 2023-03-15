import { types } from "cloudly-analytics-common"
import { isly } from "isly"
import { BaseListener } from "./Base"
export interface Logger extends BaseListener.Configuration {
	readonly type: "logger"
	/**
	 * Url
	 */
}
export namespace Logger {
	export const type = BaseListener.Configuration.type.extend<Logger>(
		{
			type: isly.string("logger"),
		},
		"Listener.Logger"
	)

	export class Implementation extends BaseListener<Logger> {
		async addStatusDetails(result: BaseListener.StatusResult): Promise<BaseListener.StatusResult> {
			console.log(`Status from Listener.Logger (Name: ${this.configuration.name})`)
			return result
		}
		setup() {
			console.log(`Listener.logger setup. (Name: ${this.configuration.name})`)
			return Promise.resolve({ success: true as const })
		}
		processBatch(batch: types.HasUuid[]): Promise<boolean[]> {
			console.log(`Listener.Logger (Name: ${this.configuration.name}, BatchSize: ${this.configuration.batchSize})`)
			console.log(batch)
			return Promise.resolve(batch.map(() => true))
		}
	}
}
