import { Listener } from "../../Listener"
import type { CreateResult, FetchResult } from "."

export abstract class Base {
	abstract create(listenerConfiguration: Listener.Configuration): Promise<CreateResult> | false
	abstract setup(name: string): Promise<CreateResult | undefined> | false
	abstract fetch(name: string): Promise<FetchResult | undefined>
	abstract getListenerConfiguration(name: string): Promise<Listener.Configuration | undefined>

	abstract remove(name: string): Promise<"missing" | "deleted"> | false

	abstract listKeys(): Promise<string[]>

	abstract listValues(): Promise<Listener.Configuration[]>
}
