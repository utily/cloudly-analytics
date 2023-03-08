import { ConfigurationContext } from "./ConfigurationContext"
import { ConfigurationEnvironment } from "./ConfigurationEnvironment"
import { attachEndpoints as configurationAttachEndpoints } from "./endpoints"

export namespace Configuration {
	export type Context = ConfigurationContext
	export const Context = ConfigurationContext

	export type Environment = ConfigurationEnvironment

	export const attachEndpoints = configurationAttachEndpoints

	export type WorkerContext = { analyticsConfiguration: Context }
}
