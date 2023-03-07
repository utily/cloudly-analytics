// Let handlers register in the storageRouter!
import "./configuration"
import "./events"
import "./alarm"
import { DurableObject, DurableObjectState, Request, Response } from "@cloudflare/workers-types"
import { Listener } from "../../Listener"
import { Storage } from "../../util/Storage"
import { Environment } from ".."
import { storageRouter } from "./storageRouter"

export const storageProcessor = new Storage.Processor(storageRouter)

/**
 * This is the actual durable object-class
 *
 * Batcher-inspiration from
 * https://blog.cloudflare.com/durable-objects-alarms/
 */
export class BucketStorage implements DurableObject {
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

	private listenerConfiguration: Listener.Configuration | undefined
	public async getListenerConfiguration(): Promise<Listener.Configuration | undefined> {
		return (this.listenerConfiguration ??= await this.state.storage.get<Listener.Configuration>("/configuration"))
	}

	constructor(private readonly state: DurableObjectState, private readonly environment: Environment) {}
	async fetch(request: Request): Promise<Response> {
		return storageProcessor.handle(request, this.environment, this.state, this)
	}
	async alarm(): Promise<void> {
		return storageProcessor.alarm(this.environment, this.state, this)
	}
}
