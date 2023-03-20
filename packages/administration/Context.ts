import * as gracely from "gracely"
import { Environment } from "./Environment"
import { Listener } from "./Listener"
import { ListenerConfigurationClient } from "./storageClient"
import { Bucket as ClientBucket } from "./storageClient/Bucket"

export type WorkerContext = { analyticsAdministration: ContextMember }

export class ContextMember {
	/**
	 * @param environment
	 * @param listenerConfiguration If supplied, This fixed configuration will be used. KeyValue-store is not used.
	 */
	constructor(
		public readonly environment: Environment,
		public readonly listenerConfiguration?: Listener.Configuration[]
	) {}

	#bucket?: ClientBucket | gracely.Error
	get bucket(): ClientBucket | gracely.Error {
		return (this.#bucket ??=
			ClientBucket.open(this.environment.bucketStorage) ??
			gracely.server.misconfigured("bucketStorage", "Bucket storage configuration missing."))
	}

	#listenerConfiguration?: ListenerConfigurationClient | gracely.Error
	get listenerConfigurationClient(): ListenerConfigurationClient | gracely.Error {
		return (this.#listenerConfiguration ??= this.listenerConfiguration
			? new ListenerConfigurationClient.TypescriptApi(this.listenerConfiguration)
			: (this.environment.listenerConfigurationStorage &&
					ListenerConfigurationClient.KeyValueStorage.open(this.environment.listenerConfigurationStorage)) ??
			  gracely.server.misconfigured("listenerConfiguration", "Configuration or KeyValueNamespace missing."))
	}
}
