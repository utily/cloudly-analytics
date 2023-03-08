import * as gracely from "gracely"
import * as http from "cloudly-http"
import * as isly from "isly"
import type { ConfigurationContext } from "../../ConfigurationContext"
import { configurationRouter } from "../configurationRouter"

async function fetch(request: http.Request, context: ConfigurationContext): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const name = request.parameter.name
	if (!isly.string().is(name))
		result = gracely.client.invalidPathArgument("listener/:name", "name", "string", "A valid identifier is required.")
	else if (gracely.Error.is(context.listenerConfiguration)) {
		result = context.listenerConfiguration
	} else {
		const value = await context.listenerConfiguration.fetch(name)
		if (!value)
			result = gracely.client.notFound(`Listener with name "${name}" not found.`)
		else if (gracely.Error.is(value))
			result = value
		else
			result = gracely.success.ok(value)
	}
	return result
}
configurationRouter.add("GET", "/listener/:name", fetch)
