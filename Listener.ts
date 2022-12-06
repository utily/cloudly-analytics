import * as cryptly from "cryptly"

export class Listener {
	owner: cryptly.Identifier
	target: string
	filter: string
	permitted: string
}

export namespace Listener {
	export function is(value: Listener | any): value is Listener {
		return (
			value &&
			typeof value == "object" &&
			cryptly.Identifier.is(value.owner) &&
			typeof value.target == "string" &&
			typeof value.filter == "string" &&
			typeof value.permitted == "string"
		)
	}
}
