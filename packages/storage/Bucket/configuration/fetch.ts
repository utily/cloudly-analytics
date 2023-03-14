import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Listener } from "@cloudly-analytics/administration"
import { Storage } from "../../utility/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

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
bucketRouter.add("GET", "/configuration", fetch)
