import { Listener } from "../../Listener"
import type { CreateResult, FetchResult } from "."
import { Base } from "./Base"

export class TypescriptApi extends Base {
	private listenerConfiguration: { [N in string]: Listener.Configuration & { name: N } }

	constructor(listenerConfiguration: Listener.Configuration[]) {
		super()
		this.listenerConfiguration = Object.fromEntries(listenerConfiguration.map(v => [v.name, v]))
	}
	/**
	 * It is not possible to create an listener defined by Typescript.
	 */
	create(_: Listener.Configuration) {
		return false as const
	}

	async setup(name: string) {
		const listenerConfiguration = this.getListenerConfiguration(name)

		const result: CreateResult | undefined = listenerConfiguration
			? {
					setup: await Listener.create(listenerConfiguration).setup(),
			  }
			: undefined
		if (listenerConfiguration && result && result.setup.success) {
			result.action = "updated"
			Object.assign(result, await this.fetch(listenerConfiguration.name))
		}
		return result
	}

	async fetch(name: string): Promise<FetchResult | undefined> {
		let result: FetchResult | undefined
		const listenerConfiguration = this.getListenerConfiguration(name)
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

	private getListenerConfiguration(name: string): Listener.Configuration | undefined {
		return this.listenerConfiguration[name]
	}
}
