// Let endpoints register
import "./listener"
import * as http from "cloudly-http"
import * as cloudlyRouter from "cloudly-router"
import type { Administration } from ".."
import { administrationRouter } from "./administrationRouter"

async function handle(
	request: http.Request,
	workerContext: Administration.WorkerContext
): Promise<http.Response.Like | any> {
	//TODO: Add Authentication here!
	// if (!request.header.authorization)
	// 	result = gracely.client.unauthorized()
	// else
	let result
	try {
		result = await administrationRouter.handle(request, workerContext.analyticsAdministration)
	} catch (e) {
		console.error(e)
	}

	return result
}

/**
 * @param router The router for your worker.
 */
export function attachEndpoints(router: cloudlyRouter.Router<Administration.WorkerContext>) {
	router.add(["POST", "GET", "DELETE"], "/listener*", handle)
}
