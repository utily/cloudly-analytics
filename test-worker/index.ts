import { HookStorage } from "cloudly-hook"
import { Context } from "./Context"

import "./model"
import "./version"
import "./order"

export default {
	async fetch(request: Request, environment: Context.Environment) {
		return await Context.handle(request, environment)
	},
}
export { HookStorage }
