import { Context } from "./Context"

import "./version"
import "./order"
import "./demo"

export default {
	async fetch(request: Request, environment: Context.Environment, executionContext: ExecutionContext) {
		return await Context.handle(request, environment, executionContext)
	},
}

/**
 * Add this to wrangler.toml
 * script_name is the worker responsible for the durable objects.
 * [durable_objects]
 * bindings = [
 *   { name = "bufferStorage", class_name = "BufferStorage", script_name = "cloudly-analytics-storage" }
 * ]
 */
// Uncomment this to run locally with Miniflare
//export { BufferStorage } from "@cloudly-analytics/storage"
