import { Event } from "./Event"

export interface Actions {
	account: {
		create: AccountCreateEvent
		remove: string
		list: string
	}
}

export interface AccountCreateEvent extends Event {
	entity: "account"
	action: "create"
	account: string
	organization: string
}
