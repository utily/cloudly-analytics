import { BucketStorage as BucketStorageBase, BufferStorage as BufferStorageBase } from "cloudly-analytics-storage"
import { listenerConfigurationClientFactory } from "Context/analyticsConfiguration/listenerConfigurationClientFactory"

// Overridden storage, where we replace `getListenerConfigurationClient` to use configuration defined in Typescript-files.

export class BufferStorage extends BufferStorageBase {
	getListenerConfigurationClient = listenerConfigurationClientFactory
}

export class BucketStorage extends BucketStorageBase {
	getListenerConfigurationClient = listenerConfigurationClientFactory
}
