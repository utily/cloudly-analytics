import { Paid as OrderPaid } from "./Paid"
import { Prepare as OrderPrepare } from "./Prepare"

export type Paid = OrderPaid
export const Paid = OrderPaid
export type Prepare = OrderPrepare
export const Prepare = OrderPrepare
export type Order = OrderPrepare | OrderPaid
