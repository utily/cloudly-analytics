import * as gracely from "gracely"
import * as http from "cloudly-http"
import type { AdministrationContext } from "../../AdministrationContext"
import { administrationRouter } from "../administrationRouter"

async function list(request: http.Request, context: AdministrationContext): Promise<http.Response.Like | any> {
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
administrationRouter.add("GET", "/listener", list)
