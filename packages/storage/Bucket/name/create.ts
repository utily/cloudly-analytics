import { gracely } from "gracely"
import { http } from "cloudly-http"
import { isly } from "isly"
import { Storage } from "../../utility/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

export async function create(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const configurationName = await request.body
	if (!isly.string().is(configurationName))
		result = gracely.client.flawedContent(isly.string().flaw(configurationName))
	else {
		try {
			await context.state.storage.put<string>("/name", configurationName)

			result = gracely.success.created(configurationName)
		} catch (error) {
			result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
		}
	}
	return result
}

bucketRouter.add("POST", "/name", create)
