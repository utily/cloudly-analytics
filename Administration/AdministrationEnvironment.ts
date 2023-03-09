import { DurableObjectNamespace, KVNamespace } from "@cloudflare/workers-types"

export type AdministrationEnvironment = Partial<{
	bucketStorage: DurableObjectNamespace
	listenerConfigurationStorage: KVNamespace
}>
