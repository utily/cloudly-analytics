import { listener, types } from "cloudly-analytics-common"
import { BaseListener } from "./Base"

export type Logger = listener.Logger
export namespace Logger {
	export const type = listener.Logger.type
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
