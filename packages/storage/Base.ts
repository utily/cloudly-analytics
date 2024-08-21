import { gracely } from "gracely"
import { DurableObjectState, Request, Response } from "@cloudflare/workers-types"
import { Environment } from "cloudly-analytics-administration"
import { ListenerConfigurationClient } from "cloudly-analytics-administration"
import { DurableObjectWithEnvironment } from "./utility/Storage/DurableObjectWithEnvironment"

export abstract class StorageBase implements DurableObjectWithEnvironment<Environment> {
	protected lastTimestamp = 0
	/**
	 * Get a current timestamp, guaranteed to be unique in this durable object.
	 *
	 * Here's where this.lastTimestamp comes in -- if we receive a bunch of
	 * messages at the same time (or if the clock somehow goes backwards????), we'll assign
	 * them sequential timestamps, so at least the ordering is maintained.
	 * @returns Milliseconds since 1970
	 */
	public getUniqueTimestamp() {
		this.lastTimestamp = Math.max(Date.now(), this.lastTimestamp + 1)
		return this.lastTimestamp
	}

	constructor(protected readonly state: DurableObjectState, public readonly environment: Environment) {}

	abstract fetch(request: Request): Promise<Response>

	/**
	 * @returns Override to not use ListenerConfigurationClient.KeyValueStorage
	 */
	public getListenerConfigurationClient(environment: Environment): ListenerConfigurationClient | gracely.Error {
		return ListenerConfigurationClient.KeyValueStorage.factory(environment)
	}
}
