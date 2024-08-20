import { isly } from "isly"
import { BaseListenerConfiguration } from "./BaseListenerConfiguration"

export interface Logger extends BaseListenerConfiguration {
	readonly type: "logger"
	/**
	 * Url
	 */
}
export namespace Logger {
	export const type = BaseListenerConfiguration.type.extend<Logger>(
		{
			type: isly.string("logger"),
		},
		"Listener.Logger"
	)
}
