import { SenderContext } from "./SenderContext"
import { SenderEnvironment } from "./SenderEnvironment"

export namespace Sender {
	export type Context<E extends Record<string, any> = object, D extends Partial<Event & E> = never> = SenderContext<
		E,
		D
	>
	export const Context = SenderContext

	export type Environment = SenderEnvironment

	// export const attachEndpoints = senderAttachEndpoints

	export type WorkerContext<E extends Record<string, any> = object, D extends Partial<Event & E> = never> = {
		analytics: SenderContext<E, D>
	}
}
