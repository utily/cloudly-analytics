import { DurableObjectNamespace, KVNamespace } from "@cloudflare/workers-types"

export type Environment = Partial<{
	bucketStorage: DurableObjectNamespace
	listenerConfigurationStorage: KVNamespace
}>
