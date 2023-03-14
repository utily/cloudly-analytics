import * as isoly from "isoly"
import * as isly from "isly"
import { BaseListener } from "./Base"
import { BigQuery } from "./BigQuery"
import { Http } from "./Http"
import { Logger } from "./Logger"

type Implementations = {
	[T in Listener.Configuration["type"]]: {
		// About constructor-signature: https://stackoverflow.com/a/13408029/1003172
		new (configuration: Listener.Configuration & { type: T }): BaseListener<Listener.Configuration & { type: T }>
	}
}

const implementations: Implementations = {
	// List all implementations her:
	bigquery: BigQuery.Implementation,
	http: Http.Implementation,
	logger: Logger.Implementation,
}

export namespace Listener {
	export function create<C extends Configuration>(listenerConfiguration: C) {
		return new implementations[listenerConfiguration.type](listenerConfiguration as any) as BaseListener<C>
	}

	export type Configuration = Logger | Http | BigQuery
	export type SetupResult = BaseListener.SetupResult
	export namespace Configuration {
		export const type = isly.union(Logger.type, Http.type, BigQuery.type)
		export const is = type.is
		export const flaw = type.flaw
		export type Metadata = { created: isoly.DateTime; updated?: isoly.DateTime }
	}
}
