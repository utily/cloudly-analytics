import * as gracely from "gracely"
import * as http from "cloudly-http"
import { isly } from "isly"
import { Storage } from "../../utility/Storage"
import { BucketStorage } from ".."
import { bucketRouter } from "../bucketRouter"

const SECONDS = 1000

export async function create(
	request: http.Request,
	storageContext: Storage.Context<BucketStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const events = await request.body

	const listenerConfigurationClient = storageContext.durableObject.getListenerConfigurationClient(
		storageContext.environment
	)
	if (gracely.Error.is(listenerConfigurationClient))
		result = listenerConfigurationClient
	else {
		const listenerConfigurationName = await storageContext.durableObject.getName()

		if (!listenerConfigurationName)
			result = gracely.server.databaseFailure(`Can't read name of bucket while trying to create events.`)
		else {
			const listenerConfiguration = await listenerConfigurationClient.getListenerConfiguration(
				listenerConfigurationName
			)

			if (!isly.array(isly.object()).is(events))
				result = gracely.client.flawedContent(isly.array(isly.object()).flaw(events))
			else if (!listenerConfiguration?.batchInterval)
				result = gracely.client.notFound("No configuration found for bucket.")
			else
				try {
					await storageContext.state.storage.put<object[]>(
						`/events/${new Date(storageContext.durableObject.getUniqueTimestamp()).toISOString()}`,
						events
					)
					// If there is no alarm currently set, set one for 10 seconds from now
					// Any further POSTs in the next 10 seconds will be part of this kh.
					if ((await storageContext.state.storage.getAlarm()) == null) {
						await storageContext.state.storage.setAlarm(Date.now() + listenerConfiguration.batchInterval * SECONDS)
					}

					result = gracely.success.created(events)
				} catch (error) {
					result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
				}
		}
	}
	return result
}

bucketRouter.add("POST", "/events", create)
