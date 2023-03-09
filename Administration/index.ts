import { AdministrationContext } from "./AdministrationContext"
import { AdministrationEnvironment } from "./AdministrationEnvironment"
import { attachEndpoints as administrationAttachEndpoints } from "./endpoints"

export namespace Administration {
	export type Context = AdministrationContext
	export const Context = AdministrationContext

	export type Environment = AdministrationEnvironment

	export const attachEndpoints = administrationAttachEndpoints

	export type WorkerContext = { analyticsAdministration: Context }
}
