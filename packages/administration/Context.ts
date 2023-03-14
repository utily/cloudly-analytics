import * as gracely from "gracely"
import { Environment } from "./Environment"
import { ListenerConfiguration as ClientListenerConfiguration } from "./storageClient"
import { Bucket as ClientBucket } from "./storageClient/Bucket"

export type WorkerContext = { analyticsAdministration: Context }

export class Context {
	constructor(public readonly environment: Environment) {}

	#bucket?: ClientBucket | gracely.Error
	get bucket(): ClientBucket | gracely.Error {
		return (this.#bucket ??=
			ClientBucket.open(this.environment.bucketStorage) ??
			gracely.server.misconfigured("bucketStorage", "Bucket storage configuration missing."))
	}

	#listenerConfiguration?: ClientListenerConfiguration | gracely.Error
	get listenerConfiguration(): ClientListenerConfiguration | gracely.Error {
		return (this.#listenerConfiguration ??=
			(this.environment.listenerConfigurationStorage &&
				ClientListenerConfiguration.open(this.environment.listenerConfigurationStorage)) ??
			gracely.server.misconfigured("listenerConfiguration", "KeyValueNamespace missing."))
	}
}
