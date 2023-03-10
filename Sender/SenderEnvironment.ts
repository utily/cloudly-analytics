import { DurableObjectNamespace } from "@cloudflare/workers-types"

export type SenderEnvironment = Partial<{
	bufferStorage: DurableObjectNamespace
}>
