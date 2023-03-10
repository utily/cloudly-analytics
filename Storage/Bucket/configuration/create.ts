import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Listener } from "../../../Listener"
import { Storage } from "../../../util/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

export async function create(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const configuration = await request.body
	if (!Listener.Configuration.type.is(configuration))
		result = gracely.client.flawedContent(Listener.Configuration.type.flaw(configuration))
	else {
		try {
			await context.state.storage.put<Listener.Configuration>("/configuration", configuration)

			result = gracely.success.created(configuration)
		} catch (error) {
			result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
		}
	}
	return result
}

bucketRouter.router.add("POST", "/configuration", create)
