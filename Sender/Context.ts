import * as gracely from "gracely"
import { ExecutionContext } from "@cloudflare/workers-types"
import * as http from "cloudly-http"
import { Analytics } from "../Analytics"
import { Events as ClientEvents } from "../StorageClient/Events"
import { Environment } from "./Environment"

export class Context<E extends Record<string, any> = object, D extends Partial<Event & E> = never> {
	constructor(
		public readonly options: {
			readonly environment: Environment
			readonly executionContext?: Pick<ExecutionContext, "waitUntil">
			readonly request?: http.Request
			readonly default?: D
		}
	) {}
	#events?: ClientEvents | gracely.Error
	get events(): ClientEvents | gracely.Error {
		return (this.#events ??=
			ClientEvents.open(this.options.environment.eventStorage) ??
			gracely.server.misconfigured("eventStorage", "Events storage configuration missing."))
	}
	#analytics?: Analytics<E, D>
	get analytics() {
		return (this.#analytics ??= new Analytics<E, D>(this.options))
	}
}
