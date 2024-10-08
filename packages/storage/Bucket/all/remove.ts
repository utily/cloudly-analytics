import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Storage } from "../../utility/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

export async function remove(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: void | gracely.Error = undefined
	try {
		await context.state.storage.deleteAll()
		await context.state.storage.deleteAlarm()
	} catch (error) {
		result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
	}

	return result
}
bucketRouter.add("DELETE", "/all", remove)
