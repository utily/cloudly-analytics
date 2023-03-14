import * as isly from "isly"
import { Batch } from "./Batch"

export interface SavedBatch extends Batch {
	created: string
}

export namespace SavedBatch {
	export const type = Batch.type.extend<SavedBatch>(
		{
			created: isly.string(),
		},
		"SavedBatch"
	)
	export const is = type.is
	export const flaw = type.flaw
}
