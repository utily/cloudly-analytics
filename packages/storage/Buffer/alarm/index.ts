import * as gracely from "gracely"
import { ContextMember, Filter, Listener } from "@cloudly-analytics/administration"
import { types } from "@cloudly-analytics/common"
import { generateKeyBatch } from "../../utility/Storage/functions"
import { bufferRouter } from "../bufferRouter"
type CompiledListeners = Record<string, Listener.Configuration & { filterImplementations: Filter.Base[] }>

function* generateBucket(waitingBatches: Map<string, types.Batch>, listeners: CompiledListeners) {
	const buckets: Record<string, types.HasUuid[]> = {}
	const bucketsSize: Record<string, number> = {}
	for (const [timestamp, batch] of waitingBatches.entries()) {
		for (const event of batch.events) {
			for (const listener of Object.values(listeners)) {
				const eventWithMetaData: types.EventWithMetadata = {
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

bufferRouter.alarm = async function alarm(storageContext) {
	const administrationContext = new ContextMember(storageContext.environment)

	const kvListenerConfiguration = administrationContext.listenerConfiguration
	if (gracely.Error.is(kvListenerConfiguration))
		throw kvListenerConfiguration
	const waitingBatches = await storageContext.state.storage.list<types.Batch>()
	const listeners: CompiledListeners = Object.fromEntries(
		(await kvListenerConfiguration.listValues()).map(listener => [
			listener.name,
			{
				...listener,
				filterImplementations: Filter.createList(listener.filter),
			},
		])
	)
	const bucketStorage = administrationContext.bucket
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