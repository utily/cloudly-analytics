import * as gracely from "gracely"
import { ContextMember as AdministrationContextMember, WorkerContext } from "cloudly-analytics-administration"
import * as http from "cloudly-http"
import { router } from "../router"
import { config as cloudlyAnalyticsDemoBigquery } from "./analyticsConfiguration/cloudly-analytics-demo-bigquery"
import { config as cloudlyAnalyticsDemoLogger } from "./analyticsConfiguration/cloudly-analytics-demo-logger"
import { Environment as ContextEnvironment } from "./Environment"

const config = [cloudlyAnalyticsDemoBigquery, cloudlyAnalyticsDemoLogger]

export class Context implements WorkerContext {
	constructor(public readonly environment: Context.Environment) {}

	#analyticsAdministration?: AdministrationContextMember
	get analyticsAdministration() {
		// Remove `config` to store and use key-value-store.
		return (this.#analyticsAdministration ??= new AdministrationContextMember(this.environment, config))
	}

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
}
