import { AdministrationContext } from "./AdministrationContext"
import { AdministrationEnvironment } from "./AdministrationEnvironment"
import { attachEndpoints as administrationAttachEndpoints } from "./endpoints"

export namespace Administration {
	export type Context = AdministrationContext
	export const Context = AdministrationContext

	export type Environment = AdministrationEnvironment
	/**
	 * Attach endpoints for administration of analytics listeners.
	 * @param router The router for your worker.
	 * @param authenticator Method to authenticate for administration of analytics. Return true if user is allowed to access.
	 */
	export const attachEndpoints = administrationAttachEndpoints

	export type WorkerContext = { analyticsAdministration: Context }
}
