import { DurableObjectNamespace } from "@cloudflare/workers-types"

export type Environment = Partial<{
	bufferStorage: DurableObjectNamespace
}>
