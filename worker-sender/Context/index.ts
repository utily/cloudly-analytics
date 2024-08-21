import { gracely } from "gracely"
import * as sender from "cloudly-analytics-sender"
import { http } from "cloudly-http"
import { router } from "../router"
import { analyticsDefault, AnalyticsExtra } from "./analytics"
import { Environment as ContextEnvironment } from "./Environment"

export class Context implements sender.WorkerContext<AnalyticsExtra, typeof analyticsDefault> {
	constructor(
		public readonly environment: ContextEnvironment,
		public readonly executionContext?: ExecutionContext,
		public readonly request?: http.Request
	) {}

	#analytics?: sender.ContextMember<AnalyticsExtra, typeof analyticsDefault>
	get analytics() {
		return (this.#analytics ??= new sender.ContextMember<AnalyticsExtra, typeof analyticsDefault>({
			environment: this.environment,
			executionContext: this.executionContext,
			request: this.request,
			default: analyticsDefault,
		}))
	}

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
