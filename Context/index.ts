import { DurableObjectNamespace } from "@cloudflare/workers-types"
import * as http from "cloudly-http"
// import { storageRouter } from "./Events/Storage/storageRouter"

export type ContextWithStorage = {
	analytics: any
}
export type AuthenticateFunction = (request: http.Request) => boolean

export type EnvironmentSender = Partial<{
	eventStorage: DurableObjectNamespace
}>

// TODO exportera denna:

// export class AnalyticsSenderContext<E extends Record<string, any> = object, D extends Partial<Event & E> = never> {
// 	constructor(
// 		public readonly options: {
// 			readonly environment: EnvironmentSender
// 			readonly executionContext?: Pick<ExecutionContext, "waitUntil">
// 			readonly request?: http.Request
// 			readonly default?: D
// 		}
// 	) {}
// 	#events?: Context.Events | gracely.Error
// 	get events(): Context.Events | gracely.Error {
// 		return (this.#events ??=
// 			Context.Events.open(this.options.environment.eventStorage) ??
// 			gracely.server.misconfigured("eventStorage", "Events storage configuration missing."))
// 	}
// 	#analytics?: Analytics<E, D>
// 	get analytics() {
// 		return (this.#analytics ??= new Analytics<E, D>(this.options))
// 	}
// }

// export class Context {
// 	/**
// 	 * Incoming Request's Cloudflare Properties
// 	 * https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
// 	 */
// 	constructor(
// 		public readonly configuration: Configuration,
// 		public readonly environment: Context.Environment,
// 		public readonly executionContext?: ExecutionContext,
// 		public readonly request?: http.Request
// 	) {}

// 	async authenticate(request: http.Request): Promise<"admin" | undefined> {
// 		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
// 			? "admin"
// 			: undefined
// 	}

// 	static async handle(
// 		request: Request,
// 		environment: Context.Environment,
// 		executionContext: ExecutionContext
// 	): Promise<Response> {
// 		let result: http.Response
// 		const httpRequest = http.Request.from(request)
// 		const context = await Context.load(environment, executionContext, httpRequest)
// 		if (!context)
// 			result = http.Response.create(gracely.server.misconfigured("Configuration", "Configuration is missing."))
// 		else {
// 			try {
// 				result = await router.handle(httpRequest, context)
// 			} catch (e) {
// 				const details = (typeof e == "object" && e && e.toString()) || undefined
// 				result = http.Response.create(gracely.server.unknown(details, "exception"))
// 			}
// 		}
// 		return http.Response.to(result)
// 	}
// 	/**
// 	 * Loads the context.
// 	 * This can be called from an Durable Object alarm which does not have
// 	 * executionContext neither a request.
// 	 */
// 	static async load(
// 		environment: Context.Environment,
// 		executionContext?: ExecutionContext,
// 		request?: http.Request
// 	): Promise<Context | undefined> {
// 		const configuration = await Configuration.load(environment)
// 		return !configuration ? undefined : new Context(configuration, environment, executionContext, request)
// 	}
// }

// export namespace Context {
// 	export type Environment = CEnvironment

// 	export const Events = CEvents
// 	export type Events = CEvents

// 	export const Bucket = CBucket
// 	export type Bucket = CBucket

// 	export const ListenerConfiguration = CListenerConfiguration
// 	export type ListenerConfiguration = CListenerConfiguration
// }
