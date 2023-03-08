import * as gracely from "gracely"
import { DurableObjectNamespace } from "@cloudflare/workers-types"
import * as http from "cloudly-http"
import * as storage from "cloudly-storage"
import * as types from "../types"

export class Events {
	private constructor(private readonly backend: storage.DurableObject.Namespace<gracely.Error>) {}

	public async addEvents(events: types.Event | types.Event[], request: http.Request) {
		return this.addBatch({
			events: Array.isArray(events) ? events : [events],
			cloudflare: request?.cloudflare,
			header: request?.header ?? {},
		})
	}

	async addBatch(batch: types.Batch, shard?: number): Promise<types.Batch | gracely.Error> {
		const storageClient = this.backend.open("events" + (shard ?? ""))
		return await storageClient.post<types.Batch>("/batch", batch)
	}

	async fetch(shard?: number): Promise<types.Event[] | gracely.Error> {
		const storageClient = this.backend.open("events" + (shard ?? ""))
		return await storageClient.get<types.Event[]>("/events")
	}
	static open(backend?: DurableObjectNamespace | storage.DurableObject.Namespace): Events | undefined {
		if (!storage.DurableObject.Namespace.is(backend))
			backend = storage.DurableObject.Namespace.open(backend)
		return backend ? new this(backend) : undefined
	}
}
