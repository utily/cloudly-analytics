import { gracely } from "gracely"
import { ExecutionContext } from "@cloudflare/workers-types"
import { types } from "cloudly-analytics-common"
import { http } from "cloudly-http"
import { Environment } from "./Environment"
import { Buffer as ClientBuffer } from "./storageClient/Buffer"

/**
 * Deconstruct + reconstruct.
 * Doesn't change the type, but makes it readable.
 */
type Prettify<T> = T extends infer Tb ? { [K in keyof Tb]: Tb[K] } : never

/**
 * Result is a type with all properties of T and E, with all properties of D as optional.
 *
 * Define extra fields in E.
 * Define type of default values in D.
 * If E is a union it is preserved as union.
 */
type ExtraAndDefault<T extends object, E extends object = object, D extends Partial<T & E> = never> = Prettify<
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
>

type MaybeArray<T> = T | T[]
type MaybePromise<T> = T | Promise<T>

export type WorkerContext<E extends Record<string, any> = object, D extends Partial<types.Event & E> = never> = {
	analytics: ContextMember<E, D>
}
/**
 *
 * When used in worker, always provide executionContext and request.
 *
 * Generics:
 *
 * * E: Type with extra fields to add the event.
 * * D: Type of object providing default values for properties in Event and in E
 */
export class ContextMember<E extends Record<string, any> = object, D extends Partial<types.Event & E> = never> {
	constructor(
		public readonly options: {
			readonly environment: Environment
			readonly executionContext?: Pick<ExecutionContext, "waitUntil">
			readonly request?: http.Request
			readonly default?: D
		}
	) {}

	#buffer?: ClientBuffer | gracely.Error
	private get buffer() {
		return (this.#buffer ??=
			ClientBuffer.open(this.options.environment.bufferStorage) ??
			gracely.server.misconfigured("bufferStorage", "Buffer storage configuration missing."))
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
	 * @param events An Event with E (Properties in D is optional, since they have a default value.).
	 * @param shard For heavy loads (More than )
	 * @returns
	 */
	send(events: MaybePromise<MaybeArray<ExtraAndDefault<types.Event, E, D>>>): void | Promise<void> {
		const { executionContext, default: defaultValue, request } = this.options
		const generateBatch = async () => {
			const eventsMaybeArray = await events
			return {
				cloudflare: request?.cloudflare,
				header: request?.header ?? {},
				events: (Array.isArray(eventsMaybeArray) ? eventsMaybeArray : [eventsMaybeArray]).map(
					e => ({ ...defaultValue, ...e } as types.Event)
				),
			} as types.Batch
		}

		let result: Promise<void> | void = undefined
		if (gracely.Error.is(this.buffer)) {
			console.error("Buffer for sending analytics is missing, will log to console.", this.buffer)
			generateBatch().then(batch => console.log(JSON.stringify(batch, null, 2)))
		} else {
			result = this.buffer
				.addBatch(generateBatch())
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
