import { Analytics } from "Analytics"
import * as isly from "isly"
import { Environment } from "../Environment"

export interface Configuration {
	analytics: Analytics.Configuration
	analyticsExtraFields?: {
		amount: number
		currency: string
	}
	analyticsDefaultValues: {
		source: string
		currency: string
	}
}

const configuration: Configuration = {
	analytics: {
		endpoint: "http://localhost:8788",
	},
	analyticsDefaultValues: {
		source: "worker-analytics",
		currency: "SEK",
	},
}

export namespace Configuration {
	export const type = isly.object<Configuration>(
		{
			analytics: Analytics.Configuration.type,
			analyticsDefaultValues: isly.object({ source: isly.string(), currency: isly.string() }),
			analyticsExtraFields: isly.any().optional(),
		},
		"Configuration"
	)
	export const is = type.is
	export const flaw = type.flaw

	export async function load(environment: Environment) {
		let result: Configuration | undefined
		if (is(configuration))
			result = configuration
		else
			console.error(JSON.stringify(flaw(configuration), null, 2))

		return result
	}
}
