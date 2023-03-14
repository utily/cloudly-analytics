import * as isoly from "isoly"
import * as isly from "isly"

export interface Event {
	source: string
	entity: string
	action: string
	created?: isoly.DateTime
}

export namespace Event {
	export const type = isly.object<Event>(
		{
			source: isly.string(),
			entity: isly.string(),
			action: isly.string(),
			created: isly.fromIs("DateTime", isoly.DateTime.is).optional(),
		},
		"Event"
	)
	export const is = type.is
	export const flaw = type.flaw
}
