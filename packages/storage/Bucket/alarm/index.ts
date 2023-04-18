import * as gracely from "gracely"
import { ContextMember, Listener } from "cloudly-analytics-administration"
import { types } from "cloudly-analytics-common"
import { generateKeyBatch } from "../../utility/Storage/functions"
import { bucketRouter } from "../bucketRouter"

/**
 * WaitingBatches is stored in the Bucket. This generator function read these,
 * and make new batches of specific size for listener.
 *
 * This is a generator function:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
 *
 * @param waitingBatches
 * @param size
 */
function* generateListenerBatch(waitingBatches: Map<string, types.HasUuid[]>, size: number) {
	let batch: types.HasUuid[] = []
	for (const waitingBatch of waitingBatches.values()) {
		for (const event of waitingBatch) {
			batch.push(event)
			if (batch.length >= size) {
				yield batch
				batch = []
			}
		}
	}
	if (batch.length > 0)
		yield batch
}

bucketRouter.alarm = async function (storageContext) {
	const administrationContext = new ContextMember(storageContext.environment)

	const listenerConfigurationClient = administrationContext.listenerConfigurationClient
	if (gracely.Error.is(listenerConfigurationClient)) {
		console.error("Bucket.alarm: Can't initiate listenerConfigurationClient.", listenerConfigurationClient.error)
		throw listenerConfigurationClient
	}
	const listenerConfigurationName = await storageContext.durableObject.getName()
	console.log(`Bucket.alarm ${listenerConfigurationName}`)

	const listenerConfiguration =
		listenerConfigurationName && (await listenerConfigurationClient.getListenerConfiguration(listenerConfigurationName))

	if (!listenerConfiguration) {
		// Id the listenerConfigurationClient has a delay before values are fully propagated (Like KeyValueStorage)
		// this could happen when listener is first added. However, the listener will be recreated when new events
		// is added later.
		storageContext.state.storage.deleteAll()
		storageContext.state.storage.deleteAlarm()
		console.error(`No listenerConfiguration for bucket '${listenerConfigurationName}'.`, "Bucket terminated")
		return
	}
	const listener = Listener.create(listenerConfiguration)

	try {
		const waitingEventBatches = await storageContext.state.storage.list<types.HasUuid[]>({
			prefix: "/events/",
		})
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
		for (const listenerBatch of generateListenerBatch(waitingEventBatches, listenerConfiguration.batchSize)) {
			const failedValues = (await listener.processBatch(listenerBatch)).flatMap((result, index) =>
				result ? [] : [listenerBatch[index]]
			)
			// Save failed objects:
			if (failedValues.length > 0) {
				console.error(`Listener ${listenerConfiguration.name}/alarm failed to store ${failedValues.length} objects.`)
				await storageContext.state.storage.put<types.HasUuid[]>(
					`/failed/${new Date(storageContext.durableObject.getUniqueTimestamp()).toISOString()}`,
					failedValues
				)
			}
		}
		//delete takes a maximum of 128 keys
		for (const keyBatch of generateKeyBatch(waitingEventBatches, 128)) {
			await storageContext.state.storage.delete(keyBatch)
		}
	} catch (error) {
		console.error(`Listener ${listenerConfiguration.name}/alarm:`, error)
	}
}
