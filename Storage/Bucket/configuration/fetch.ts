import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Listener } from "../../../Listener"
import { Storage } from "../../../util/Storage"
import { BucketStorage } from ".."
import { storageRouter } from "../storageRouter"

export async function fetch(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: Listener.Configuration | gracely.Error

	try {
		result =
			(await context.durableObject.getListenerConfiguration()) ??
			gracely.client.notFound("No configuration found in bucket.")
	} catch (error) {
		result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
	}

	return result
}
storageRouter.router.add("GET", "/configuration", fetch)
