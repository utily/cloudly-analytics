import * as gracely from "gracely"
import { DurableObjectNamespace } from "@cloudflare/workers-types"
import { types } from "cloudly-analytics-common"
import * as http from "cloudly-http"
import * as storage from "cloudly-storage"

type MaybePromise<T> = T | Promise<T>

export class Buffer {
	private constructor(private readonly backend: storage.DurableObject.Namespace<gracely.Error>) {}

	public async addEvents(events: types.Event | types.Event[], request: http.Request) {
		return this.addBatch({
			events: Array.isArray(events) ? events : [events],
			cloudflare: request?.cloudflare,
			header: request?.header ?? {},
		})
	}

	async addBatch(batch: MaybePromise<types.Batch>, shard?: number): Promise<types.Batch | gracely.Error> {
		const bufferClient = this.backend.open("buffer" + (shard ?? ""))
		return await bufferClient.post<types.Batch>("/batch", await batch)
	}

	static open(backend?: DurableObjectNamespace | storage.DurableObject.Namespace): Buffer | undefined {
		if (!storage.DurableObject.Namespace.is(backend))
			backend = storage.DurableObject.Namespace.open(backend)
		return backend ? new this(backend) : undefined
	}
}
