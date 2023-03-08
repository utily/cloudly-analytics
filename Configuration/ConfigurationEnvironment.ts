import { DurableObjectNamespace, KVNamespace } from "@cloudflare/workers-types"

export type ConfigurationEnvironment = Partial<{
	bucketStorage: DurableObjectNamespace
	listenerConfigurationStorage: KVNamespace
}>
