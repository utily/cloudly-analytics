// Let handlers register in the storageRouter!
import "./all"
import "./name"
import "./events"
import "./alarm"
import { Request, Response } from "@cloudflare/workers-types"
import { StorageBase } from "../Base"
import { Storage } from "../utility/Storage"
import { bucketRouter } from "./bucketRouter"

export const bucketProcessor = new Storage.Processor(bucketRouter)

/**
 * This is the actual durable object-class
 *
 * Batcher-inspiration from
 * https://blog.cloudflare.com/durable-objects-alarms/
 */
export class BucketStorage extends StorageBase {
	private listenerConfigurationName: string | undefined

	async getName(): Promise<string | undefined> {
		return (this.listenerConfigurationName ??= await this.state.storage.get<string>("/name"))
	}

	async fetch(request: Request): Promise<Response> {
		return bucketProcessor.handle(request, this.environment, this.state, this)
	}
	async alarm(): Promise<void> {
		return bucketProcessor.alarm(this.environment, this.state, this)
	}
}
