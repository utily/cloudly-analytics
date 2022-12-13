import * as cryptly from "cryptly"
import * as selectively from "selectively"
import * as hook from "cloudly-hook"
import * as storage from "cloudly-storage"
import { Listener } from "./Listener"

export class Listeners {
	#listeners?: Promise<Listener[]>
	get listeners(): Promise<Listener[]> {
		// find some way to have this time out after some set period.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.#listeners ?? (this.#listeners = this.listenerStore.list().then(v => v.map(item => item.value!)))
	}

	private constructor(
		private readonly listenerStore: storage.KeyValueStore<Listener>,
		private readonly hooks: hook.Hooks
	) {}
	async receive(event: any): Promise<void> {
		const listeners = await this.listeners
		await Promise.all(
			listeners.map(listener =>
				selectively
					.filter(
						selectively.parse(listener.filter),
						selectively.filter(selectively.parse(listener.permitted), [event])
					)
					.map(event => this.hooks.trigger(listener?.target, event))
			)
		)
	}
	async listen(listener: Listener & { id?: cryptly.Identifier }): Promise<Listener & { id: cryptly.Identifier }> {
		const id = listener.id ?? cryptly.Identifier.generate(8)
		await this.listenerStore.set(`${listener.owner}|${id}`, listener)
		return { ...listener, id }
	}
	async unlisten(owner: cryptly.Identifier, listener: cryptly.Identifier): Promise<Listener | undefined> {
		const result = await this.listenerStore.get(`${owner}|${listener}`)
		await this.listenerStore.set(`${owner}|${listener}`)
		return result?.value
	}
	static open(listeners: storage.KeyValueStore, hooks: hook.Hooks): Listeners | undefined {
		listeners = storage.KeyValueStore.OnlyMeta.create(listeners)
		return listeners && new Listeners(listeners, hooks)
	}
}
