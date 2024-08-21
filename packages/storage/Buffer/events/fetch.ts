import { gracely } from "gracely"
import { types } from "cloudly-analytics-common"
import { http } from "cloudly-http"
import { Storage } from "../../utility/Storage"
import type { BufferStorage } from ".."
import { bufferRouter } from "../bufferRouter"

async function fetch(
	request: http.Request,
	storageContext: Storage.Context<BufferStorage>
): Promise<http.Response.Like | any> {
	let result: gracely.Result
	try {
		const waitingEvents: types.Event[] = []
		const waitingBatches = await storageContext.state.storage.list<types.SavedBatch>()
		Array.from(waitingBatches.entries()).forEach(([timestamp, batch]) => {
			batch.events.forEach(event =>
				waitingEvents.push({
					created: batch.created,
					...event,
				})
			)
		})
		result = gracely.success.ok(waitingEvents)
	} catch (error) {
		result = gracely.server.databaseFailure(error instanceof Error ? error.message : undefined)
	}

	return result
}

bufferRouter.add("GET", "/events", fetch)
