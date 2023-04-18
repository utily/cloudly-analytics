// Let handlers register in the storageRouter:
import "./batch"
import "./events"
import "./alarm"
import { Request, Response } from "@cloudflare/workers-types"
import { StorageBase } from "../Base"
import { Storage } from "../utility/Storage"
import { bufferRouter } from "./bufferRouter"

export const bufferProcessor = new Storage.Processor(bufferRouter)

/**
 * This is the actual durable object-class
 *
 * Batcher-inspiration from
 * https://blog.cloudflare.com/durable-objects-alarms/
 */
export class BufferStorage extends StorageBase {
	async fetch(request: Request): Promise<Response> {
		return bufferProcessor.handle(request, this.environment, this.state, this)
	}
	async alarm(): Promise<void> {
		return bufferProcessor.alarm(this.environment, this.state, this)
	}
}
