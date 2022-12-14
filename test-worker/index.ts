import { HookStorage } from "cloudly-hook"
import { Context } from "./Context"

import "./version"
import "./listener"
import "./order"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await Context.handle(request, environment)
	},
}
export { HookStorage }
