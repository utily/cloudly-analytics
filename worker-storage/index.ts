import { Context } from "./Context"

// Let endpoints register:
import "./version"

// Worker:
export default {
	async fetch(request: Request, environment: Context.Environment, executionContext: ExecutionContext) {
		return await Context.handle(request, environment)
	},
}

// Durable objects:
export { EventStorage, BucketStorage } from "cloudly-analytics/Storage"
// export const EventStorage = Context.Events.Storage
// export const BucketStorage = Context.Bucket.Storage
