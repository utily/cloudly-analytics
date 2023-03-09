// Worker:
export default {
	async fetch(request: Request, environment: Partial<Record<string, any>>, executionContext: ExecutionContext) {
		return new Response(
			JSON.stringify({
				name: "cloudly-analytics-storage",
			})
		)
	},
}

// This is just for demonstration, an other alternative is to combine storage and administration in same worker.

// All that is needed for a worker to be responsible for the durable object is this:
export { EventStorage, BucketStorage } from "cloudly-analytics/dist/Storage"
/**
 * Also add this to wrangler.toml
 * [durable_objects]
 * bindings = [
 *   { name = "eventStorage", class_name = "EventStorage" },
 *   { name = "bucketStorage", class_name = "BucketStorage" },
 * ]
 */
