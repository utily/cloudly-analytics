import type { ExecutionContext } from "@cloudflare/workers-types"
import { http, Request as HttpRequest } from "cloudly-http"
import * as isly from "isly"
import { Batch } from "./Batch"
import { Event } from "./Event"
/**
 * Define extra fields in E,
 * Define type of default values in D,
 *
 * Result is a type with all properties of T and E, with all properties of D as optional.
 * If E is a union it is preserved.
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
export class Analytics<E extends Record<string, any> = object, D extends Partial<Event & E> = never> {
	private readonly configuration: Analytics.Configuration
	private readonly executionContext?: Pick<ExecutionContext, "waitUntil">
	private readonly request?: HttpRequest
	private readonly default: D
	constructor(options: {
		readonly configuration?: Analytics.Configuration
		readonly executionContext?: Pick<ExecutionContext, "waitUntil">
		readonly request?: HttpRequest
		readonly default?: D
	}) {
		this.configuration = options.configuration ?? {}
		this.executionContext = options.executionContext
		this.request = options.request
		this.default = options.default ?? ({} as never)
	}

	/**
	 * In worker: (Where executionContext exists)
	 * NonBlocking. (Returns void)
	 * Usage: `analytics.register(...)`
	 *
	 * In DurableObject alarm:
	 * Returns Promise<void>
	 * Usage: `await analytics.register(...)`
	 *
	 * @param events
	 * @returns
	 */
	send(events: MaybeArray<ExtraAndDefault<Event, E, D>>): void | Promise<void> {
		const batch: Batch = {
			events: (Array.isArray(events) ? events : [events]).map(event => ({ ...this.default, ...event } as Event)),
			cloudflare: this.request?.cloudflare,
			header: this.request?.header ?? {},
		}
		let result: Promise<void>
		if (this.configuration.httpEndpoint)
			result = this.sendHttp(batch, this.configuration.httpEndpoint)
		else {
			console.error("Analytics without httpEndpoint. Not implemented!")
			throw "Not implemented!"
		}
		return this.executionContext ? this.executionContext.waitUntil(result) : result
	}
	// listeners?: {
	// 	[System.]
	// 	listen(listener)
	// 	unlisten(listener)
	// }
	private sendHttp(batch: Batch, endpoint: string): Promise<void> {
		return http
			.fetch({
				url: `${endpoint}/batch`,
				method: "POST",
				body: batch,
			})
			.then(async response => {
				if (response.status != 201) {
					console.error(`Unexpected result from analytics-backend. (${endpoint})`)
					console.error(JSON.stringify(await response.body, null, 2))
				}
			})
			.catch(error => console.error("Error in Analytics.register", error))
	}
}
export namespace Analytics {
	export type Configuration = {
		httpEndpoint?: string
	}
	export const Configuration = isly.object<Configuration>({
		httpEndpoint: isly.string(),
	})
}
