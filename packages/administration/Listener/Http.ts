import { listener, types } from "cloudly-analytics-common"
import { BaseListener } from "./Base"

export type Http = listener.Http

export namespace Http {
	export const type = listener.Http.type
	export class Implementation extends BaseListener<Http> {
		setup(oldConfiguration?: Http | undefined): Promise<BaseListener.SetupResult> {
			return Promise.resolve({ success: true as const })
		}
		processBatch(batch: types.HasUuid[]): Promise<boolean[]> {
			throw new Error("Method not implemented.")
		}
	}
}
