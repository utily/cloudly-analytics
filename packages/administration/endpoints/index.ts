import { gracely } from "gracely"
// Let endpoints register
import "./listener"
import { http } from "cloudly-http"
import * as cloudlyRouter from "cloudly-router"
import type { WorkerContext } from "../index"
import { administrationRouter } from "./administrationRouter"

type MaybePromise<T> = T | Promise<T>
/**
 * Attach endpoints for administration of analytics listeners.
 * @param router The router for your worker.
 * @param authenticator Method to authenticate for administration of analytics. Return true if user is allowed to access.
 */
export function attachEndpoints<C extends WorkerContext>(
	router: cloudlyRouter.Router<C>,
	authenticator: (request: http.Request, context: C) => MaybePromise<boolean>
) {
	router.add(["POST", "GET", "DELETE"], "/listener*", async function (request: http.Request, workerContext: C): Promise<
		http.Response.Like | any
	> {
		let result
		if (!(await authenticator(request, workerContext)))
			result = gracely.client.unauthorized()
		else
			try {
				result = await administrationRouter.handle(request, workerContext.analyticsAdministration)
			} catch (e) {
				result = gracely.server.backendFailure(
					"Unexpected error in Analytics Administration",
					e instanceof Error ? e.message : undefined
				)
			}
		return result
	})
}
