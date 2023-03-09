import * as gracely from "gracely"
import { DurableObjectState, Request, Response } from "@cloudflare/workers-types"
import * as http from "cloudly-http"
import { Context } from "./Context"
import { DurableObjectWithEnvironment } from "./DurableObjectWithEnvironment"
import { Router } from "./Router"
/**
 * @template DO DurableObject-implementation class
 * @template E Environment
 */
export class Processor<DO extends DurableObjectWithEnvironment> {
	constructor(public readonly storageRouter: Router<DO>) {}
	/**
	 * The DurableObject is calling this method
	 */
	async handle(
		request: Request,
		environment: DO["environment"],
		state: DurableObjectState,
		durableObject: DO
	): Promise<Response> {
		let result: http.Response
		try {
			result = await this.storageRouter.router.handle(
				http.Request.from(request),
				new Context<DO>(environment, state, durableObject)
			)
		} catch (e) {
			const details = (typeof e == "object" && e && e.toString()) || undefined
			result = http.Response.create(gracely.server.unknown(details, "exception"))
		}
		return http.Response.to(result) as unknown as Response
	}
	/**
	 * The DurableObject is calling this method
	 */
	async alarm(environment: DO["environment"], state: DurableObjectState, durableObject: DO): Promise<void> {
		const storageContext = new Context<DO>(environment, state, durableObject)
		if (this.storageRouter.alarm) {
			await this.storageRouter.alarm(storageContext)
		} else {
			console.error("No alarm-handler is registered.")
		}
	}
}
