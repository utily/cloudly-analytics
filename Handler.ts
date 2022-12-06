import * as cryptly from "cryptly"
import * as selectively from "selectively"
import * as hook from "cloudly-hook"
import * as storage from "cloudly-storage"
import { Event } from "./Event"
import { Listener } from "./Listener"

export class Handler<E extends Event> {
	private constructor(
		private readonly listeners: storage.KeyValueStore<Listener>,
		private readonly hooks: hook.Hooks
	) {}
	async receive(events: E[]): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const listeners = (await this.listeners.list()).map(item => item.value!)
		await Promise.all(
			listeners.map(listener =>
				selectively
					.filter(selectively.parse(listener.filter), selectively.filter(selectively.parse(listener.permitted), events))
					.map(event => this.hooks.trigger(listener?.target, event))
			)
		)
	}
	async listen(listener: Listener & { id?: cryptly.Identifier }): Promise<Listener & { id: cryptly.Identifier }> {
		const id = listener.id ?? cryptly.Identifier.generate(8)
		await this.listeners.set(`${listener.owner}|${id}`, listener)
		return { ...listener, id }
	}
	async unlisten(owner: cryptly.Identifier, listener: cryptly.Identifier): Promise<Listener | undefined> {
		const result = await this.listeners.get(`${owner}|${listener}`)
		await this.listeners.set(`${owner}|${listener}`)
		return result?.value
	}
	static open<E extends Event>(listeners: storage.KeyValueStore, hooks: hook.Hooks): Handler<E> | undefined {
		listeners = storage.KeyValueStore.OnlyMeta.create(listeners)
		return listeners && new Handler(listeners, hooks)
	}
}
