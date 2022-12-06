export interface Environment extends Record<string, undefined | string | DurableObjectNamespace | KVNamespace | Queue> {
	adminSecret?: string
	queueNamespace?: Queue
	hookNamespace?: DurableObjectNamespace
	destinationStore?: KVNamespace
	queueStore?: KVNamespace
	listenerStore?: string
}
