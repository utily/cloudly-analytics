import { isly } from "isly"
import { BaseListenerConfiguration } from "./BaseListenerConfiguration"

export interface Http extends BaseListenerConfiguration {
	type: "http"
	/**
	 * Url
	 */
	target: string
}

export namespace Http {
	export const type = BaseListenerConfiguration.type.extend<Http>(
		{
			type: isly.string("http"),
			target: isly.string(),
		},
		"Listener.Http"
	)
}
