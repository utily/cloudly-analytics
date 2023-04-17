import * as gracely from "gracely"
import { Environment } from "./Environment"
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
		public readonly listenerConfigurationClientFactory?: () => ListenerConfigurationClient | gracely.Error
	) {}

	#bucket?: ClientBucket | gracely.Error
	get bucket(): ClientBucket | gracely.Error {
		return (this.#bucket ??=
			ClientBucket.open(this.environment.bucketStorage) ??
			gracely.server.misconfigured("bucketStorage", "Bucket storage configuration missing."))
	}

	#listenerConfigurationClient?: ListenerConfigurationClient | gracely.Error
	get listenerConfigurationClient(): ListenerConfigurationClient | gracely.Error {
		return (this.#listenerConfigurationClient ??= this.listenerConfigurationClientFactory
			? this.listenerConfigurationClientFactory()
			: // Default is a KeyValueStorage-backed client
			  (this.environment.listenerConfigurationStorage &&
					ListenerConfigurationClient.KeyValueStorage.open(this.environment.listenerConfigurationStorage)) ??
			  gracely.server.misconfigured("listenerConfiguration", "Configuration or KeyValueNamespace missing."))
	}
}
