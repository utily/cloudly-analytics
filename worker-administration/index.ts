import { Context } from "./Context"

// Let endpoints register:
import "./version"
import "./analytics"

// Worker:
export default {
	async fetch(request: Request, environment: Context.Environment, executionContext: ExecutionContext) {
		return await Context.handle(request, environment)
	},
}

// All code that is needed for a worker to be responsible for the durable object is this:
export { BufferStorage, BucketStorage } from "@cloudly-analytics/storage"
/**
 * Also add this to wrangler.toml
 * [durable_objects]
 * bindings = [
 *   { name = "bufferStorage", class_name = "BufferStorage" },
 *   { name = "bucketStorage", class_name = "BucketStorage" },
 * ]
 */
