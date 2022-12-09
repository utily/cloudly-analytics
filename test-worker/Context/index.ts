import * as gracely from "gracely"
import * as analytics from "cloudly-analytics"
import * as hook from "cloudly-hook"
import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import * as model from "../model"
import { router } from "../router"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	#hooks?: Context.Hooks | gracely.Error
	get hooks(): Context.Hooks | gracely.Error {
		return (
			this.#hooks ??
			(this.#hooks =
				hook.Hooks.open(this.environment.hookNamespace) ??
				gracely.server.misconfigured(
					"namespaces",
					"Hook queue namespace or hook destination namespace not correctly configured."
				))
		)
	}

	#handler?: analytics.Handler<model.Event> | gracely.Error
	get handler(): analytics.Handler<model.Event> | gracely.Error {
		const kv = storage.KeyValueStore.Json.create(this.environment.listenerStore)
		const listenerKVpartition = storage.KeyValueStore.partition(kv, "l|")
		const hooks = this.hooks
		return gracely.Error.is(hooks)
			? hooks
			: analytics.Handler.open(listenerKVpartition, hooks) ??
					gracely.server.misconfigured("Handler", "Analytics Handler returned undefined, namespaces misconfigured.")
	}
	#trigger?: analytics.Trigger<model.Event> | gracely.Error
	get trigger(): analytics.Trigger<model.Event> | gracely.Error {
		const queue =
			this.environment.queueNamespace ?? gracely.server.misconfigured("Queue", "Queue namespace misconfigured.")
		return gracely.Error.is(queue)
			? queue
			: analytics.Trigger.create<model.Event>(queue) ??
					gracely.server.misconfigured("Trigger", "Analytics Trigger returned undefined, namespace misconfigured.")
	}
	constructor(public readonly environment: Context.Environment) {}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}
	static async handle(request: Request, environment: Context.Environment): Promise<Response> {
		let result: http.Response
		try {
			result = await router.handle(http.Request.from(request), new Context(environment))
		} catch (e) {
			const details = (typeof e == "object" && e && e.toString()) || undefined
			result = http.Response.create(gracely.server.unknown(details, "exception"))
		}
		return http.Response.to(result)
	}
}

export namespace Context {
	export type Environment = ContextEnvironment
	export type Hooks = hook.Hooks
}
