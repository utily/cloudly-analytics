import { DurableObjectNamespace } from "@cloudflare/workers-types"

export type Environment = Partial<{
	eventStorage: DurableObjectNamespace
}>
