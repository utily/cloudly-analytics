import * as analytics from "cloudly-analytics"
import { Order } from "../../Order"

export interface Paid extends analytics.Event {
	entity: "order"
	action: "paid"
	order: Order
	payment: { type: "card" }
}
export namespace Paid {
	export function create(order: Order): Paid {
		return { entity: "order", action: "paid", order: order, payment: { type: "card" } }
	}
}
