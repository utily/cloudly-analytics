export type Environment = Partial<{
	adminSecret: string
	hookNamespace: DurableObjectNamespace
	listenerStore: string
}>
