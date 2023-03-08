import * as gracely from "gracely"
import * as http from "cloudly-http"
import type { ConfigurationContext } from "../../ConfigurationContext"
import { configurationRouter } from "../configurationRouter"

async function list(request: http.Request, context: ConfigurationContext): Promise<http.Response.Like | any> {
	let result: gracely.Result
	if (gracely.Error.is(context.listenerConfiguration)) {
		result = context.listenerConfiguration
	} else {
		const value = await context.listenerConfiguration.listKeys()
		if (gracely.Error.is(value))
			result = value
		else
			result = gracely.success.ok(value)
	}

	return result
}
configurationRouter.add("GET", "/listener", list)
