import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Listener } from "../../../Listener"
import type { ConfigurationContext } from "../../ConfigurationContext"
import { configurationRouter } from "../configurationRouter"

async function create(request: http.Request, context: ConfigurationContext): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const listenerConfiguration = await request.body
	const client = context.listenerConfiguration
	if (!Listener.Configuration.is(listenerConfiguration))
		result = gracely.client.flawedContent(Listener.Configuration.flaw(listenerConfiguration))
	else if (gracely.Error.is(client))
		result = client
	else {
		const createResult = await client.create(listenerConfiguration)
		if (!createResult.setup.success) {
			result = gracely.server.backendFailure(createResult)
		} else
			result = gracely.success.created(createResult)
	}
	return result
}

configurationRouter.add("POST", "/listener", create)
