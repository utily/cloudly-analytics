// Let handlers register in the storageRouter:
import "./batch"
import "./events"
import { DurableObject, DurableObjectState, Request, Response } from "@cloudflare/workers-types"
import { Storage } from "../../util/Storage"
import type { Environment } from ".."
import { storageRouter } from "./storageRouter"
//import "./alarm"

export const storageProcessor = new Storage.Processor(storageRouter)

/**
 * This is the actual durable object-class
 *
 * Batcher-inspiration from
 * https://blog.cloudflare.com/durable-objects-alarms/
 */
export class EventStorage implements DurableObject {
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

	constructor(private readonly state: DurableObjectState, private readonly environment: Environment) {}

	async fetch(request: Request): Promise<Response> {
		return storageProcessor.handle(request, this.environment, this.state, this)
	}
	async alarm(): Promise<void> {
		return storageProcessor.alarm(this.environment, this.state, this)
	}
}
