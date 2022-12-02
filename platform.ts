export interface Queue<Body = any> {
	send(body: Body): Promise<void>
}
export interface MessageBatch<Body = any> {
	readonly queue: string
	readonly messages: Message<Body>[]
	retryAll(): void
}
export interface Message<Body = any> {
	readonly id: string
	readonly timestamp: Date
	readonly body: Body
}
