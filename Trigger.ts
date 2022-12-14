import { Event } from "./Event"
import { Listeners } from "./Listeners"

export type Trigger = (event: Event) => Promise<void>
export namespace Trigger {
	export function create(backend: Listeners | undefined): Trigger | undefined {
		return backend && (async event => backend.receive(event))
	}
}
