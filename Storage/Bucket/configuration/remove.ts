import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Storage } from "../../../util/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

export async function remove(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: void | gracely.Error
	try {
		await context.state.storage.deleteAll()
		await context.state.storage.deleteAlarm()
	} catch (error) {
		result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
	}

	return result
}
bucketRouter.router.add("DELETE", "/configuration", remove)
