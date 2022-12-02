export interface Actions {
	[entity: string]: { [action: string]: any }
}
export interface Event {
	entity: string
	action: string
}
