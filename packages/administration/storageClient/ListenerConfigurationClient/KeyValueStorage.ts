import * as isoly from "isoly"
import { KVNamespace } from "@cloudflare/workers-types"
import * as storage from "cloudly-storage"
import { Listener } from "../../Listener"
import type { CreateResult, FetchResult, ListenerConfigurationResult } from "."
import { Base } from "./Base"

export class KeyValueStorage extends Base {
	private constructor(
		private readonly backend: storage.KeyValueStore<Listener.Configuration, Listener.Configuration.Metadata>
	) {
		super()
	}

	async create(listenerConfiguration: Listener.Configuration) {
		const result: CreateResult = {
			setup: await Listener.create(listenerConfiguration).setup(),
		}
		if (result.setup.success) {
			result.action = await this.saveListenerConfiguration(listenerConfiguration)

			const fetchResult = await this.fetch(listenerConfiguration.name)
			if (!fetchResult) {
				result.setup.success = false
				;(result.setup.details ??= []).push("Failed to store listener configuration in KeyValue-store.")
			} else {
				;(result.setup.details ??= []).push("Listener configuration stored in KeyValue-store.")
				Object.assign(result, fetchResult)
			}
		}
		return result
	}
	async setup(name: string) {
		const listenerConfiguration = await this.getListenerConfiguration(name)
		if (!listenerConfiguration)
			return undefined
		const result: CreateResult = {
			setup: await Listener.create(listenerConfiguration).setup(),
		}
		if (result.setup.success) {
			result.action == "updated"
			Object.assign(result, await this.fetch(listenerConfiguration.name))
		}
		return result
	}
	async fetch(name: string): Promise<FetchResult | undefined> {
		let result: FetchResult | undefined
		const listenerConfiguration = await this.getListenerConfiguration(name, true)
		if (!listenerConfiguration) {
			result = undefined
		} else {
			const listener = Listener.create(listenerConfiguration.value)
			result = {
				configuration: listener.getConfiguration(),
				...listenerConfiguration.meta,
				status: await listener.getStatus(),
			}
		}
		return result
	}

	async remove(name: string): Promise<"missing" | "deleted"> {
		return (await this.getListenerConfiguration(name).then(Boolean)) && (await this.backend.set(name).then(() => true))
			? "deleted"
			: "missing"
	}

	async listKeys(): Promise<string[]> {
		return (await this.backend.list({ values: false })).map(item => item.key)
	}

	async listValues(): Promise<Listener.Configuration[]> {
		return (await this.backend.list({ values: true })).map(item => item.value).flatMap(item => (item ? item : []))
	}

	private async getListenerConfiguration(name: string, metadata: true): Promise<ListenerConfigurationResult | undefined>
	private async getListenerConfiguration(name: string, metadata?: false): Promise<Listener.Configuration | undefined>
	private async getListenerConfiguration(
		name: string,
		metadata?: boolean
	): Promise<ListenerConfigurationResult | Listener.Configuration | undefined> {
		const valueWithMetadata = await this.backend.get(name)
		return valueWithMetadata && (metadata ? valueWithMetadata : valueWithMetadata.value)
	}

	private async saveListenerConfiguration(
		listenerConfiguration: Listener.Configuration
	): Promise<"created" | "updated"> {
		const { meta: oldMetadata } = (await this.backend.get(listenerConfiguration.name)) ?? { meta: undefined }

		const [result, newMetadata]: ["created" | "updated", Listener.Configuration.Metadata] = oldMetadata?.created
			? ["updated", { created: oldMetadata.created, updated: isoly.DateTime.now() }]
			: ["created", { created: isoly.DateTime.now() }]
		await this.backend.set(listenerConfiguration.name, listenerConfiguration, { meta: newMetadata })
		return result
	}

	static open(kvNamespace: KVNamespace): KeyValueStorage | undefined {
		const backend = storage.KeyValueStore.Json.create(kvNamespace)
		return backend ? new KeyValueStorage(backend) : undefined
	}
}
