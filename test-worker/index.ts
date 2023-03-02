import { Context } from "./Context"

import "./version"
import "./order"
import "./test"

export default {
	async fetch(request: Request, environment: Context.Environment, executionContext: ExecutionContext) {
		return await Context.handle(request, environment, executionContext)
	},
}
