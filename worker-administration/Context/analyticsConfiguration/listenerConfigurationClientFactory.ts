import { gracely } from "gracely"
import { Listener, ListenerConfigurationClient } from "cloudly-analytics-administration"
import { types } from "cloudly-analytics-common"
import { Environment } from "Context/Environment"
import { config as cloudlyAnalyticsDemoBigquery } from "./cloudly-analytics-demo-bigquery"
import { config as cloudlyAnalyticsDemoLogger } from "./cloudly-analytics-demo-logger"

/**
 * Takes configuration in cloudly-analytics-demo-bigquery and cloudly-analytics-demo-logger.
 *
 * @returns
 */
export const listenerConfigurationClientFactory = (environment: Environment) => {
	let result: gracely.Error | ListenerConfigurationClient
	const privateKey = environment.bigQueryPrivateKey && JSON.parse(environment.bigQueryPrivateKey)

	if (!types.PrivateKey.is(privateKey)) {
		result = gracely.server.misconfigured("bigQueryPrivateKey", "Private key for analytics is missing")
	} else {
		result = new ListenerConfigurationClient.TypescriptApi([
			// Config is listed here.
			// Inject privateKey for BigQuery from environment here:
			Listener.Configuration.BigQuery.createConfiguration(cloudlyAnalyticsDemoBigquery, privateKey),
			cloudlyAnalyticsDemoLogger,
		])
	}
	return result
}
