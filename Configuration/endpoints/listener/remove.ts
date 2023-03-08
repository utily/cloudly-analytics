import * as gracely from "gracely"
import * as http from "cloudly-http"
import * as isly from "isly"
import type { ConfigurationContext } from "../../ConfigurationContext"
import { configurationRouter } from "../configurationRouter"

async function remove(request: http.Request, context: ConfigurationContext): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const name = request.parameter.name
	if (!isly.string().is(name))
		result = gracely.client.invalidPathArgument("listener/:name", "name", "string", "A valid identifier is required.")
	else if (gracely.Error.is(context.listenerConfiguration)) {
		result = context.listenerConfiguration
	} else {
		if (!(await context.listenerConfiguration.remove(name)))
			result = gracely.client.notFound(`No listener found with the name ${name}.`)
		else
			result = gracely.success.ok(true)
	}
	return result
}
configurationRouter.add("DELETE", "/listener/:name", remove)
