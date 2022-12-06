export interface Order {
	id: string
	number: string
	amount: number
	currency: string
}

export namespace Order {
	export function is(value: any | Order): value is Order {
		return (
			value &&
			typeof value == "object" &&
			typeof value.id == "string" &&
			typeof value.number == "string" &&
			typeof value.amount == "number" &&
			typeof value.currency == "string"
		)
	}
}
