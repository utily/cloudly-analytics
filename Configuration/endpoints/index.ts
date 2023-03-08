// Let endpoints register
import "./listener"
import * as http from "cloudly-http"
import * as cloudlyRouter from "cloudly-router"
import type { Configuration } from ".."
import { configurationRouter } from "./configurationRouter"

async function handle(
	request: http.Request,
	workerContext: Configuration.WorkerContext
): Promise<http.Response.Like | any> {
	//TODO: Add Authentication here!
	// if (!request.header.authorization)
	// 	result = gracely.client.unauthorized()
	// else
	let result
	try {
		result = await configurationRouter.handle(request, workerContext.analyticsConfiguration)
	} catch (e) {
		console.error(e)
	}

	return result
}

/**
 * @param router The router for your worker.
 */
export function attachEndpoints(router: cloudlyRouter.Router<Configuration.WorkerContext>) {
	router.add(["POST", "GET", "DELETE"], "/listener*", handle)
}
