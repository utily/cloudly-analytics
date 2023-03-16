import * as isoly from "isoly"
import { isly } from "isly"

export interface Event {
	source: string
	entity: { type: string; id?: string }
	action: string
	created?: isoly.DateTime
	isError?: boolean
	message?: string
}

export namespace Event {
	export const type = isly.object<Event>(
		{
			source: isly.string(),
			entity: isly.object({ type: isly.string(), id: isly.string().optional() }),
			action: isly.string(),
			created: isly.fromIs("DateTime", isoly.DateTime.is).optional(),
			isError: isly.boolean().optional(),
			message: isly.string().optional(),
		},
		"Event"
	)
	export const is = type.is
	export const flaw = type.flaw
}
