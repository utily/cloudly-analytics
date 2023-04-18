import * as gracely from "gracely"
import { Environment } from "./Environment"
import { ListenerConfigurationClient } from "./storageClient"
import { Bucket as ClientBucket } from "./storageClient/Bucket"

export type WorkerContext = { analyticsAdministration: ContextMember }

export class ContextMember {
	/**
	 * @param environment
	 */
	constructor(
		public readonly environment: Environment,
		public readonly listenerConfigurationClientFactory?: ListenerConfigurationClient.Factory
	) {}

	#bucket?: ClientBucket | gracely.Error
	get bucket(): ClientBucket | gracely.Error {
		return (this.#bucket ??=
			ClientBucket.open(this.environment.bucketStorage) ??
			gracely.server.misconfigured("bucketStorage", "Bucket storage configuration missing."))
	}

	#listenerConfigurationClient?: ListenerConfigurationClient | gracely.Error
	get listenerConfigurationClient(): ListenerConfigurationClient | gracely.Error {
		return (this.#listenerConfigurationClient ??= (
			this.listenerConfigurationClientFactory ??
			// Default is a KeyValueStorage-backed client
			ListenerConfigurationClient.KeyValueStorage.factory
		)(this.environment))
	}
}
