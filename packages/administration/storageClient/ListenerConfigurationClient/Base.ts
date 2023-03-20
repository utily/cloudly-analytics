import { Listener } from "../../Listener"
import type { CreateResult, FetchResult } from "."

export abstract class Base {
	abstract create(listenerConfiguration: Listener.Configuration): Promise<CreateResult> | false

	abstract fetch(name: string): Promise<FetchResult | undefined>

	abstract remove(name: string): Promise<"missing" | "deleted"> | false

	abstract listKeys(): Promise<string[]>

	abstract listValues(): Promise<Listener.Configuration[]>
}
