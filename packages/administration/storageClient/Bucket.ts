import * as gracely from "gracely"
import { DurableObjectNamespace } from "@cloudflare/workers-types"
import { types } from "cloudly-analytics-common"
import * as storage from "cloudly-storage"
import { Listener } from "../Listener"
/**
 * A bucket is a durable object-backed container for events
 * selected for a specific listener.
 */
export class Bucket {
	private bucketClient: Record<string, storage.DurableObject.Client<gracely.Error> | undefined> = {}
	private constructor(private readonly backend: storage.DurableObject.Namespace<gracely.Error>) {}

	async addEvents(
		listenerConfiguration: Listener.Configuration,
		events: types.HasUuid[]
	): Promise<types.Batch | gracely.Error> {
		return (await this.getBucketClient(listenerConfiguration)).post<types.Batch>("/events", events)
	}

	async delete(name: string): Promise<gracely.Error | void> {
		const bucketClient = this.bucketClient[name] ?? this.backend.open(name)
		delete this.bucketClient[name]
		return await bucketClient.delete("/all")
	}

	private async getBucketClient(
		listenerConfiguration: Listener.Configuration
	): Promise<storage.DurableObject.Client<gracely.Error>> {
		return (this.bucketClient[listenerConfiguration.name] ??= this.backend.open(listenerConfiguration.name))
	}

	static open(backend?: DurableObjectNamespace | storage.DurableObject.Namespace): Bucket | undefined {
		if (!storage.DurableObject.Namespace.is(backend))
			backend = storage.DurableObject.Namespace.open(backend)
		return backend ? new this(backend) : undefined
	}
}
