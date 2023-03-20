import * as gracely from "gracely"
import * as http from "cloudly-http"
import type { ContextMember } from "../../Context"
import { administrationRouter } from "../administrationRouter"

async function list(request: http.Request, context: ContextMember): Promise<http.Response.Like | any> {
	let result: gracely.Result
	if (gracely.Error.is(context.listenerConfigurationClient)) {
		result = context.listenerConfigurationClient
	} else {
		const value = await context.listenerConfigurationClient.listKeys()
		if (gracely.Error.is(value))
			result = value
		else
			result = gracely.success.ok(value)
	}

	return result
}
administrationRouter.add("GET", "/listener", list)
