import * as gracely from "gracely"
import { Administration } from "../../../Administration"
import { Filter } from "../../../Filter"
import { BaseFilter } from "../../../Filter/Base"
import { Listener } from "../../../Listener"
import { Batch, EventWithMetadata, HasUuid } from "../../../types"
import { generateKeyBatch } from "../../../util/Storage/functions"
import { storageRouter } from "../storageRouter"
type CompiledListeners = Record<string, Listener.Configuration & { filterImplementations: BaseFilter[] }>

function* generateBucket(waitingBatches: Map<string, Batch>, listeners: CompiledListeners) {
	const buckets: Record<string, HasUuid[]> = {}
	const bucketsSize: Record<string, number> = {}
	for (const [timestamp, batch] of waitingBatches.entries()) {
		for (const event of batch.events) {
			for (const listener of Object.values(listeners)) {
				const eventWithMetaData: EventWithMetadata = {
					created: timestamp,
					cloudflare: batch.cloudflare,
					header: batch.header,
					uuid: crypto.randomUUID(),
					...event,
				}
				const uuid = eventWithMetaData.uuid
				// Run all filters on this eventWithMetaData
				const filteredValue: any | undefined = listener.filterImplementations.reduce<object | undefined>(
					(filterValue, filter) => {
						return filterValue ? filter.filter(filterValue) : filterValue
					},
					eventWithMetaData
				)

				if (filteredValue) {
					filteredValue.uuid = uuid
					// Limit for bucket is: 131072 bytes
					const size = JSON.stringify(filteredValue).length
					let accumulatedSize = (bucketsSize[listener.name] ?? 0) + size + 1
					// Unknown how the serialization is done, when the value is stored.
					// We need some margins here:
					if (accumulatedSize > 100 * 1024) {
						yield [listener.name, buckets[listener.name]] as const
						accumulatedSize = size
						buckets[listener.name] = []
					}
					;(buckets[listener.name] ??= []).push(filteredValue)
					bucketsSize[listener.name] = accumulatedSize
				}
			}
		}
	}
	for (const bucket of Object.entries(buckets)) {
		yield bucket
	}
}

storageRouter.alarm = async function alarm(storageContext) {
	console.log("Enter Events:alarm")
	const configurationContext = new Administration.Context(storageContext.environment)

	const kvListenerConfiguration = configurationContext.listenerConfiguration
	if (gracely.Error.is(kvListenerConfiguration))
		throw kvListenerConfiguration
	const waitingBatches = await storageContext.state.storage.list<Batch>()
	const listeners: CompiledListeners = Object.fromEntries(
		(await kvListenerConfiguration.listValues()).map(listener => [
			listener.name,
			{
				...listener,
				filterImplementations: Filter.createList(listener.filter),
			},
		])
	)
	const bucketStorage = configurationContext.bucket
	if (gracely.Error.is(bucketStorage)) {
		throw bucketStorage
	}
	for (const [listenerName, events] of generateBucket(waitingBatches, listeners)) {
		console.log(`Filling bucket "${listenerName}" with ${events.length} events.`)
		const appendResult = await bucketStorage.addEvents(listeners[listenerName], events)
		if (gracely.Error.is(appendResult)) {
			console.error(appendResult)
		}
	}
	// Delete bucketed values:
	for (const keyBatch of generateKeyBatch(waitingBatches, 128)) {
		await storageContext.state.storage.delete(keyBatch)
	}
}
