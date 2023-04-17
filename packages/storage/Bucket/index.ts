// Let handlers register in the storageRouter!
import "./all"
import "./name"
import "./events"
import "./alarm"
import { DurableObjectState, Request, Response } from "@cloudflare/workers-types"
import { Environment } from "cloudly-analytics-administration"
import { Storage } from "../utility/Storage"
import { DurableObjectWithEnvironment } from "../utility/Storage/DurableObjectWithEnvironment"
import { bucketRouter } from "./bucketRouter"

export const bucketProcessor = new Storage.Processor(bucketRouter)

/**
 * This is the actual durable object-class
 *
 * Batcher-inspiration from
 * https://blog.cloudflare.com/durable-objects-alarms/
 */
export class BucketStorage implements DurableObjectWithEnvironment<Environment> {
	private lastTimestamp = 0
	/**
	 * Get a current timestamp, guaranteed to be unique in this durable object.
	 *
	 * Here's where this.lastTimestamp comes in -- if we receive a bunch of
	 * messages at the same time (or if the clock somehow goes backwards????), we'll assign
	 * them sequential timestamps, so at least the ordering is maintained.
	 * @returns Milliseconds since 1970
	 */
	public getUniqueTimestamp() {
		this.lastTimestamp = Math.max(Date.now(), this.lastTimestamp + 1)
		return this.lastTimestamp
	}

	private listenerConfigurationName: string | undefined
	async getName(): Promise<string | undefined> {
		return (this.listenerConfigurationName ??= await this.state.storage.get<string>("/name"))
	}

	constructor(private readonly state: DurableObjectState, public readonly environment: Environment) {}

	async fetch(request: Request): Promise<Response> {
		return bucketProcessor.handle(request, this.environment, this.state, this)
	}
	async alarm(): Promise<void> {
		return bucketProcessor.alarm(this.environment, this.state, this)
	}
}
