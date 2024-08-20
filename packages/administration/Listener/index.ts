import { isoly } from "isoly"
import { isly } from "isly"
import { BaseListener } from "./Base"
import { BigQuery as BigQueryListener } from "./BigQuery"
import { Http as HttpListener } from "./Http"
import { Logger as LogListener } from "./Logger"

export namespace Listener {
	export type SetupResult = BaseListener.SetupResult
	export type Configuration = LogListener | HttpListener | BigQueryListener
	export namespace Configuration {
		export import Logger = LogListener
		export import Http = HttpListener
		export import BigQuery = BigQueryListener
		export const type = isly.union<Configuration, Logger, Http, BigQuery>(Logger.type, Http.type, BigQueryListener.type)
		export const is = type.is
		export const flaw = type.flaw
		export type Metadata = { created: isoly.DateTime; updated?: isoly.DateTime }
	}
	type Implementations = {
		[T in Configuration["type"]]: {
			// About constructor-signature: https://stackoverflow.com/a/13408029/1003172
			new (configuration: Configuration & { type: T }): BaseListener<Configuration & { type: T }>
		}
	}
	const implementations: Implementations = {
		// List all implementations her:
		bigquery: BigQueryListener.Implementation,
		http: HttpListener.Implementation,
		logger: LogListener.Implementation,
	}
	export function create<C extends Configuration>(listenerConfiguration: C) {
		return new implementations[listenerConfiguration.type](listenerConfiguration as any) as BaseListener<C>
	}
}
