import * as gracely from "gracely"
import * as http from "cloudly-http"
import * as isly from "isly"
import { Storage } from "../../../util/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

const SECONDS = 1000

export async function create(
	request: http.Request,
	context: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const events = await request.body
	const listenerConfiguration = await context.durableObject.getListenerConfiguration()
	if (!isly.array(isly.object()).is(events))
		result = gracely.client.flawedContent(isly.array(isly.object()).flaw(events))
	else if (!listenerConfiguration?.batchInterval)
		result = gracely.client.notFound("No configuration found in bucket.")
	else
		try {
			await context.state.storage.put<object[]>(
				`/events/${new Date(context.durableObject.getUniqueTimestamp()).toISOString()}`,
				events
			)
			// If there is no alarm currently set, set one for 10 seconds from now
			// Any further POSTs in the next 10 seconds will be part of this kh.
			if ((await context.state.storage.getAlarm()) == null) {
				await context.state.storage.setAlarm(Date.now() + listenerConfiguration.batchInterval * SECONDS)
			}

			result = gracely.success.created(events)
		} catch (error) {
			result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
		}

	return result
}

bucketRouter.router.add("POST", "/events", create)
