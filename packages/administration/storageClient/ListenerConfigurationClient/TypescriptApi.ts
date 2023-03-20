import { Listener } from "../../Listener"
import type { FetchResult } from "."
import { Base } from "./Base"

export class TypescriptApi extends Base {
	private listenerConfiguration: { [N in string]: Listener.Configuration & { name: N } }

	constructor(listenerConfiguration: Listener.Configuration[]) {
		super()
		this.listenerConfiguration = Object.fromEntries(listenerConfiguration.map(v => [v.name, v]))
	}

	create(listenerConfiguration: Listener.Configuration) {
		return false as const
	}

	async fetch(name: string): Promise<FetchResult | undefined> {
		let result: FetchResult | undefined
		const listenerConfiguration = this.listenerConfiguration[name]
		if (!listenerConfiguration) {
			result = undefined
		} else {
			const listener = Listener.create(listenerConfiguration)
			result = {
				configuration: listener.getConfiguration(),
				status: await listener.getStatus(),
				readonly: true,
			}
		}
		return result
	}

	remove(name: string) {
		return false as const
	}

	async listKeys(): Promise<string[]> {
		return Object.keys(this.listenerConfiguration)
	}

	async listValues(): Promise<Listener.Configuration[]> {
		return Object.values(this.listenerConfiguration)
	}
}
