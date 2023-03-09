import * as gracely from "gracely"
import { ExecutionContext } from "@cloudflare/workers-types"
import * as http from "cloudly-http"
import { Events as ClientEvents } from "../StorageClient/Events"
import { Batch, Event } from "../types"
import { SenderEnvironment } from "./SenderEnvironment"

/**
 * Result is a type with all properties of T and E, with all properties of D as optional.
 *
 * Define extra fields in E.
 * Define type of default values in D.
 * If E is a union it is preserved as union.
 */
type ExtraAndDefault<T extends object, E extends object = object, D extends Partial<T & E> = never> =
	// E: Extends type, with default values as optional
	// `E extends any ? ... : never` is a trick to keep E as a possible union: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
	(E extends any
		? Omit<E, D extends never ? never : keyof D> &
				Partial<
					// This create a type with all properties which E and D has in common:
					{
						[K in keyof E & keyof D]: E[K] | D[K]
					}
				>
		: never) &
		// T: The core type, with default values as optional
		Omit<T, D extends never ? never : keyof D> &
		Partial<
			// This create a type with all properties which E and T has in common:
			{
				[K in keyof T & keyof D]: T[K] | D[K]
			}
		>
type MaybeArray<T> = T | T[]

/**
 *
 * When used in worker, always provide executionContext and request.
 *
 * Generics:
 *
 * * E: Type with extra fields to add the event.
 * * D: Type of object providing default values for properties in Event and in E
 */
export class SenderContext<E extends Record<string, any> = object, D extends Partial<Event & E> = never> {
	constructor(
		public readonly options: {
			readonly environment: SenderEnvironment
			readonly executionContext?: Pick<ExecutionContext, "waitUntil">
			readonly request?: http.Request
			readonly default?: D
		}
	) {}

	#events?: ClientEvents | gracely.Error
	private get events() {
		return (this.#events ??=
			ClientEvents.open(this.options.environment.eventStorage) ??
			gracely.server.misconfigured("eventStorage", "Events storage configuration missing."))
	}
	/**
	 * In worker: (Where executionContext exists)
	 * NonBlocking. (Returns void)
	 * Usage: `analytics.send(...)`
	 *
	 * In DurableObject alarm:
	 * Returns Promise<void>
	 * Usage: `await analytics.send(...)`
	 *
	 * @param events An Event with E and D optional.
	 * @returns
	 */
	send(events: MaybeArray<ExtraAndDefault<Event, E, D>>): void | Promise<void> {
		const { executionContext, default: defaultValue, request } = this.options
		const batch: Batch = {
			events: (Array.isArray(events) ? events : [events]).map(event => ({ ...defaultValue, ...event } as Event)),
			cloudflare: request?.cloudflare,
			header: request?.header ?? {},
		}
		let result: Promise<void> | void
		if (gracely.Error.is(this.events))
			console.error("Error when sending analytics.", this.events)
		else {
			result = this.events
				.addBatch(batch)
				.then(response => {
					if (gracely.Error.is(response)) {
						console.error("Analytics.send: Error when storing analytics.", response)
					}
				})
				.catch(error => {
					console.error("Analytics.send: Error thrown.", error)
				})
		}
		return result && executionContext ? executionContext.waitUntil(result) : result
	}
}
