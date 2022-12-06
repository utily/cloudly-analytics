import { Order as EventOrder, Paid as OrderPaid, Prepare as OrderPrepare } from "./Order"

export type Event = Event.Order
export namespace Event {
	export type Order = EventOrder
	export type Paid = OrderPaid
	export const Paid = OrderPaid
	export type Prepare = OrderPrepare
	export const Prepare = OrderPrepare
	export type Event = OrderPaid | OrderPrepare
}
