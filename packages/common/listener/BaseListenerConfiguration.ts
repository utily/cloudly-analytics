import { isly } from "isly"
import { filter } from "../filter"

export interface BaseListenerConfiguration {
	readonly name: string
	/**
	 * Number of events to send in every call to processBatch().
	 */
	readonly batchSize: number
	/**
	 * Number of seconds between every batch.
	 * Note: If queue is bigger than batchSize, the calls will be directly after each other.
	 */
	readonly batchInterval: number
	/**
	 * A selectively-expression
	 */
	readonly filter: filter.Configuration[]

	readonly comment?: string
	errorHandler?: (error: unknown) => Promise<void>
	logger?: { log: (message: string, ...args: any[]) => void }
}
export namespace BaseListenerConfiguration {
	export const namePattern = /^[a-z0-9_-]+$/
	export const type = isly.object<BaseListenerConfiguration>(
		{
			name: isly.string(namePattern),
			batchSize: isly.number("positive"),
			batchInterval: isly.number("positive"),
			filter: isly.array(filter.Configuration.type),
			comment: isly.string().optional(),
			errorHandler: isly.function<Required<BaseListenerConfiguration>["errorHandler"]>().optional(),
			logger: isly
				.object<Required<BaseListenerConfiguration>["logger"]>({
					log: isly.function<(message: string, ...args: any[]) => void>(),
				})
				.optional(),
		},
		"ListenerConfiguration"
	)
}
