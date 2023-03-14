export function* generateKeyBatch(mapOfValues: Map<string, any>, size = 128) {
	let batch: string[] = []
	for (const key of mapOfValues.keys()) {
		batch.push(key)
		if (batch.length >= size) {
			yield batch
			batch = []
		}
	}
	if (batch.length > 0)
		yield batch
}
