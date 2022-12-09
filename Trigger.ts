import { Event } from "./Event"
import * as platform from "./platform"

export type Trigger<E extends Event> = (event: E) => Promise<void>
export namespace Trigger {
	export function create<E extends Event>(backend: platform.Queue | undefined): Trigger<E> | undefined {
		return backend && (async event => backend.send(event))
	}
}
