import { DurableObjectNamespace } from "@cloudflare/workers-types"

export type SenderEnvironment = Partial<{
	eventStorage: DurableObjectNamespace
}>
