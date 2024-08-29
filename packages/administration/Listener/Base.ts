import { gracely } from "gracely"
import { listener, types } from "cloudly-analytics-common"

export abstract class BaseListener<C extends BaseListener.Configuration> {
	constructor(protected readonly configuration: C) {
		this.log = configuration.logger?.log ?? console.log
	}
	log: (message: string, ...args: any[]) => void
	/**
	 * Returns configuration, used by REST-API when returning the configuration.
	 *
	 * Override to protected sensitive data. (Eg passwords)
	 */
	getConfiguration(): C {
		return this.configuration
	}
	/**
	 * This is called when the listener i configured, or reconfigured.
	 */
	abstract setup(oldConfiguration?: C): Promise<BaseListener.SetupResult>

	/**
	 * Returns status of the listener.
	 * Override `getStatus` instead to add details.
	 */
	async getStatus() {
		const result: BaseListener.StatusResult = await this.addStatusDetails({ ok: true })
		// TODO: Get statistics from bucket.
		return result
	}
	/**
	 * Returns status of the listener.
	 *
	 * This is a stub, made to be overridden.
	 * Override this to add details.
	 */
	async addStatusDetails(result: BaseListener.StatusResult): Promise<BaseListener.StatusResult> {
		return result
	}

	abstract processBatch(batch: types.HasUuid[]): Promise<boolean[]>
}

export namespace BaseListener {
	export type SetupResult = { success: boolean; details?: (string | gracely.Error)[] }
	export type StatusResult = { ok: boolean; details?: Record<string, any> }
	export import Configuration = listener.BaseListenerConfiguration
}
