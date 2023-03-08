import * as gracely from "gracely"
import { DurableObjectNamespace } from "@cloudflare/workers-types"
import * as storage from "cloudly-storage"
import { Listener } from "../Listener"
import { Batch, HasUuid } from "../types"
/**
 * A bucket is a durable object-backed container for events
 * selected for a specific listener.
 */
export class Bucket {
	private storageClient: Record<string, storage.DurableObject.Client<gracely.Error> | undefined> = {}
	private constructor(private readonly backend: storage.DurableObject.Namespace<gracely.Error>) {}

	async addEvents(listenerConfiguration: Listener.Configuration, events: HasUuid[]): Promise<Batch | gracely.Error> {
		return (await this.getStorageClient(listenerConfiguration)).post<Batch>("/events", events)
	}

	private async getStorageClient(
		listenerConfiguration: Listener.Configuration
	): Promise<storage.DurableObject.Client<gracely.Error>> {
		let result = this.storageClient[listenerConfiguration.name]
		if (!result) {
			result = this.backend.open(listenerConfiguration.name)
			await result.post<Listener.Configuration>("/configuration", listenerConfiguration)
		}
		return result
	}

	static open(backend?: DurableObjectNamespace | storage.DurableObject.Namespace): Bucket | undefined {
		if (!storage.DurableObject.Namespace.is(backend))
			backend = storage.DurableObject.Namespace.open(backend)
		return backend ? new this(backend) : undefined
	}
}
