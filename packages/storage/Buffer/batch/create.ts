import * as gracely from "gracely"
import { types } from "cloudly-analytics-common"
import * as http from "cloudly-http"
import { Storage } from "../../utility/Storage"
import type { BufferStorage } from ".."
import { bufferRouter } from "../bufferRouter"

const SECONDS = 1000

async function create(
	request: http.Request,
	storageContext: Storage.Context<BufferStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const batch = await request.body
	if (!types.Batch.type.is(batch)) result = gracely.client.flawedContent(types.Batch.flaw(batch))
	else {
		try {
			const timestamp = storageContext.durableObject.getUniqueTimestamp()

			const savedBatch: types.SavedBatch = { ...batch, created: new Date(timestamp).toISOString() }
			await storageContext.state.storage.put<types.Batch>(savedBatch.created, savedBatch)
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

bufferRouter.add("POST", "/batch", create)
