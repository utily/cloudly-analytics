import * as isly from "isly"

export interface Event {
	source: string
	entity: string
	action: string
	// TODO: isoly-date?
	created?: string
}

export const Event = isly.object<Event>(
	{
		source: isly.string(),
		entity: isly.string(),
		action: isly.string(),

		created: isly.optional(isly.string()),
	},
	"Event"
)
