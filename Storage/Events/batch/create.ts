import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Batch, SavedBatch } from "../../../types"
import { Storage } from "../../../util/Storage"
import type { EventStorage } from ".."
import { storageRouter } from "../storageRouter"

const SECONDS = 1000

async function create(
	request: http.Request,
	storageContext: Storage.Context<EventStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const batch = await request.body
	if (!Batch.type.is(batch))
		result = gracely.client.flawedContent(Batch.flaw(batch))
	else {
		try {
			const timestamp = storageContext.durableObject.getUniqueTimestamp()

			const savedBatch: SavedBatch = { ...batch, created: new Date(timestamp).toISOString() }
			await storageContext.state.storage.put<Batch>(savedBatch.created, savedBatch)
			// If there is no alarm currently set, set one for 10 seconds from now
			// Any further POSTs in the next 10 seconds will be part of this kh.
			if ((await storageContext.state.storage.getAlarm()) == null)
				await storageContext.state.storage.setAlarm(Date.now() + 5 * SECONDS)

			result = gracely.success.created(savedBatch.events)
		} catch (error) {
			result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
		}
	}
	return result
}

storageRouter.router.add("POST", "/batch", create)
