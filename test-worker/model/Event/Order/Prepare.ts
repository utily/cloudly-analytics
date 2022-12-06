import * as analytics from "cloudly-analytics"
import { Order } from "../../Order"

export interface Prepare extends analytics.Event {
	entity: "order"
	action: "prepare"
	order: Order
}
export namespace Prepare {
	export function create(order: Order): Prepare {
		return { entity: "order", action: "prepare", order: order }
	}
}
