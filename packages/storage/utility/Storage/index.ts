import { Context as StorageContext } from "./Context"
import { DurableObjectWithEnvironment } from "./DurableObjectWithEnvironment"
import { Processor as StorageProcessor } from "./Processor"
import { Router as StorageRouter } from "./Router"

export namespace Storage {
	export const Context = StorageContext
	export type Context<DO extends DurableObjectWithEnvironment> = StorageContext<DO>

	export const Processor = StorageProcessor
	export type Processor<DO extends DurableObjectWithEnvironment> = StorageProcessor<DO>

	export type Router<DO extends DurableObjectWithEnvironment> = StorageRouter<DO>
}
