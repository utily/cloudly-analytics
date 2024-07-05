import { gracely } from "gracely"
import { DurableObjectNamespace } from "@cloudflare/workers-types"
import { types } from "cloudly-analytics-common"
import { storage } from "cloudly-storage"
import { Listener } from "../Listener"
/**
 * A bucket is a durable object-backed container for events
 * selected for a specific listener.
 */
export class Bucket {
	private bucketClient: Record<string, storage.DurableObject.Client<storage.Error> | undefined> = {}
	private constructor(private readonly backend: storage.DurableObject.Namespace<storage.Error>) {}

	async addEvents(
		listenerConfiguration: Listener.Configuration,
		events: types.HasUuid[]
	): Promise<types.Batch | gracely.Error> {
		const response = await (await this.getBucketClient(listenerConfiguration)).post<types.Batch>("/events", events)
		return storage.Error.is(response)
			? gracely.server.databaseFailure("types.HasUuid[]", "Failed to send events")
			: response
	}

	async delete(name: string): Promise<gracely.Error | void> {
		const bucketClient = this.bucketClient[name] ?? this.backend.open(name)
		delete this.bucketClient[name]
		const response = await bucketClient.delete<void>("/all")
		return storage.Error.is(response) ? gracely.server.databaseFailure("Bucket", `Could not remove bucket`) : response
	}

	private async getBucketClient(
		listenerConfiguration: Listener.Configuration
	): Promise<storage.DurableObject.Client<storage.Error>> {
		let result = this.bucketClient[listenerConfiguration.name]
		if (!result) {
			result = this.backend.open(listenerConfiguration.name)
			const existingName = await result.get<string>("/name")
			if (listenerConfiguration.name != existingName)
				await result.post<string>("/name", listenerConfiguration.name)
			this.bucketClient[listenerConfiguration.name] = result
		}
		return result
	}

	static open(backend?: DurableObjectNamespace | storage.DurableObject.Namespace): Bucket | undefined {
		if (!storage.DurableObject.Namespace.is(backend))
			backend = storage.DurableObject.Namespace.open(backend)
		return backend ? new this(backend) : undefined
	}
}
