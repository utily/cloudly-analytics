import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Storage } from "../../utility/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

export async function fetch(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: string | gracely.Error

	try {
		result = (await context.durableObject.getName()) ?? gracely.client.notFound("No name found in bucket.")
	} catch (error) {
		result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
	}

	return result
}
bucketRouter.add("GET", "/name", fetch)
