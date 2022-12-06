export interface Actions {
	[entity: string]: { [action: string]: any }
}
export interface Event {
	entity: string
	action: string
}
export namespace Event {
	export function is(value: Event | any): value is Event {
		return value && typeof value == "object" && typeof value.entity == "string" && typeof value.action == "string"
	}
}
