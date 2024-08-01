import * as isoly from "isoly"
import { isly } from "isly"
import { BaseListener } from "./Base"
import { BigQuery as BigQueryListener } from "./BigQuery"
import { Http as HttpListener } from "./Http"
import { Logger as LogListener } from "./Logger"

type Implementations = {
	[T in Listener.Configuration["type"]]: {
		// About constructor-signature: https://stackoverflow.com/a/13408029/1003172
		new (configuration: Listener.Configuration & { type: T }): BaseListener<Listener.Configuration & { type: T }>
	}
}

const implementations: Implementations = {
	// List all implementations her:
	bigquery: BigQueryListener.Implementation,
	http: HttpListener.Implementation,
	logger: LogListener.Implementation,
}

export namespace Listener {
	export function create<C extends Configuration>(listenerConfiguration: C) {
		return new implementations[listenerConfiguration.type](listenerConfiguration as any) as BaseListener<C>
	}

	export type Configuration = LogListener | HttpListener | BigQueryListener
	export type SetupResult = BaseListener.SetupResult
	export namespace Configuration {
		export const type = isly.union(Logger.type, Http.type, BigQueryListener.type)
		export const is = type.is
		export const flaw = type.flaw
		export type Metadata = { created: isoly.DateTime; updated?: isoly.DateTime }
		export import Logger = LogListener
		export import Http = HttpListener
		export import BigQuery = BigQueryListener
	}
}
