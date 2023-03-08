import * as gracely from "gracely"
import { ListenerConfiguration as ClientListenerConfiguration } from "../StorageClient"
import { Bucket as ClientBucket } from "../StorageClient/Bucket"
import { ConfigurationEnvironment } from "./ConfigurationEnvironment"

export class ConfigurationContext {
	constructor(public readonly environment: ConfigurationEnvironment) {}

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
