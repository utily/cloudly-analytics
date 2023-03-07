import { DurableObject } from "@cloudflare/workers-types"
import { Context as StorageContext } from "./Context"
import { Processor as StorageProcessor } from "./Processor"
import { Router as StorageRouter } from "./Router"

export namespace Storage {
	export const Context = StorageContext
	export type Context<DO extends DurableObject> = StorageContext<DO>

	export const Processor = StorageProcessor
	export type Processor<DO extends DurableObject> = StorageProcessor<DO>

	export type Router<DO extends DurableObject> = StorageRouter<DO>
}
