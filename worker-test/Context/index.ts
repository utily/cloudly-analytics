import * as gracely from "gracely"
import { Analytics } from "cloudly-analytics"
import * as http from "cloudly-http"
import { router } from "../router"
import { analyticsConfiguration, AnalyticsDefault, analyticsDefault, AnalyticsExtra } from "./analytics"
import { Environment as ContextEnvironment } from "./Environment"

export class Context {
	#analytics?: Analytics<AnalyticsExtra, AnalyticsDefault>
	get analytics() {
		return (this.#analytics ??= new Analytics<AnalyticsExtra, AnalyticsDefault>({
			executionContext: this.executionContext,
			request: this.request,
			default: analyticsDefault,
			configuration: analyticsConfiguration,
		}))
	}

	constructor(
		public readonly environment: Context.Environment,
		public readonly executionContext?: ExecutionContext,
		public readonly request?: http.Request
	) {}
	async authenticate(request: http.Request): Promise<"admin" | undefined> {
		return this.environment.adminSecret && request.header.authorization == `Basic ${this.environment.adminSecret}`
			? "admin"
			: undefined
	}

	static async handle(
		request: Request,
		environment: Context.Environment,
		executionContext: ExecutionContext
	): Promise<Response> {
		let result: http.Response
		try {
			const httpRequest = http.Request.from(request)
			result = await router.handle(httpRequest, new Context(environment, executionContext, httpRequest))
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
