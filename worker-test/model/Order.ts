import * as isly from "isly"
export interface Order {
	id: string
	number: string
	amount: number
	currency?: string
	paid: boolean
}

export namespace Order {
	export const type = isly.object<Order>(
		{
			id: isly.string(),
			number: isly.string(),
			amount: isly.number(),
			currency: isly.string().optional(),
			paid: isly.boolean(),
		},
		"Order"
	)
	export const UnPaid = type.extend({ paid: isly.boolean(false) })
	export const Paid = type.extend({ paid: isly.boolean(true) })

	export const is = type.is
	export const flaw = type.flaw

	export type AnalyticEvents = { entity: "order"; order: Order } & (
		| {
				action: "prepared"
		  }
		| {
				action: "paid"

				currency: string
				amount: number
		  }
	)
}
