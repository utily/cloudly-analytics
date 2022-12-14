import * as gracely from "gracely"
import * as analytics from "cloudly-analytics"
import * as hook from "cloudly-hook"
import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import { router } from "../router"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	#hooks?: Context.Hooks | gracely.Error
	get hooks(): Context.Hooks | gracely.Error {
		return (
			this.#hooks ??
			(this.#hooks =
				hook.Hooks.open(this.environment.hookNamespace) ??
				gracely.server.misconfigured("namespaces", "Hook queue namespace not correctly configured."))
		)
	}
	#listeners?: analytics.Listeners | gracely.Error
	get listeners(): analytics.Listeners | gracely.Error {
		const kv = storage.KeyValueStore.Json.create(this.environment.listenerStore)
		const listenerKVpartition = storage.KeyValueStore.partition(kv, "l|")
		const hooks = this.hooks
		return (
			this.#listeners ??
			(this.#listeners = gracely.Error.is(hooks)
				? hooks
				: analytics.Listeners.open(listenerKVpartition, hooks) ??
				  gracely.server.misconfigured("Listeners", "Listeners returned undefined."))
		)
	}
	#trigger?: analytics.Trigger | gracely.Error
	get trigger(): analytics.Trigger | gracely.Error {
		const listeners = this.listeners
		return (
			this.#trigger ??
			(this.#trigger = gracely.Error.is(listeners)
				? listeners
				: analytics.Trigger.create(listeners) ?? gracely.server.misconfigured("Trigger", "Trigger returned undefined."))
		)
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
