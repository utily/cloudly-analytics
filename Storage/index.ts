import { DurableObjectNamespace, KVNamespace } from "@cloudflare/workers-types"

export { EventStorage } from "./Events"
export { BucketStorage } from "./Bucket"

export type Environment = {
	eventStorage: DurableObjectNamespace
	bucketStorage: DurableObjectNamespace
	listenerConfigurationStorage: KVNamespace
}
