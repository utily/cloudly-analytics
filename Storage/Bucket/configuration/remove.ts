import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Storage } from "../../../util/Storage"
import { BucketStorage } from ".."
import { storageRouter } from "../storageRouter"

export async function remove(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: void | gracely.Error
	try {
		await context.state.storage.deleteAll()
	} catch (error) {
		result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
	}

	return result
}
storageRouter.router.add("DELETE", "/configuration", remove)
