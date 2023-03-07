import { Context } from "./Context"

// Let endpoints register:
import "./version"

// Worker:
export default {
	async fetch(request: Request, environment: Context.Environment, executionContext: ExecutionContext) {
		return await Context.handle(request, environment)
	},
}

/**
 * Durable objects:
 *
 * Also add this to wrangler.toml
 * [durable_objects]
 * bindings = [
 *   { name = "eventStorage", class_name = "EventStorage" },
 *   { name = "bucketStorage", class_name = "BucketStorage" },
 * ]
 */
export { EventStorage, BucketStorage } from "cloudly-analytics/Storage"
