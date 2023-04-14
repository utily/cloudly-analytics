import * as gracely from "gracely"
import * as http from "cloudly-http"
import { isly } from "isly"
import type { ContextMember as ContextMember } from "../../Context"
import { administrationRouter } from "../administrationRouter"

async function setup(request: http.Request, context: ContextMember): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const name = request.parameter.name

	if (!isly.string().is(name))
		result = gracely.client.invalidPathArgument("listener/:name", "name", "string", "A valid identifier is required.")
	else if (gracely.Error.is(context.listenerConfigurationClient))
		result = context.listenerConfigurationClient
	else {
		const value = await context.listenerConfigurationClient.setup(name)
		if (!value)
			result = gracely.client.notFound(`Listener with name "${name}" not found.`)
		else if (gracely.Error.is(value))
			result = value
		else {
			if (!value.setup.success) {
				result = gracely.server.backendFailure(value)
			} else
				result = gracely.success.ok(value)
		}
	}
	return result
}

administrationRouter.add("POST", "/listener/:name", setup)
