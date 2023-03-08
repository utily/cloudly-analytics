import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../../Context"
import { router } from "../../router"

export async function fetch(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	if (gracely.Error.is(context.events))
		result = context.events
	else {
		const response = await context.events.fetch()
		result = gracely.Error.is(response) ? gracely.server.databaseFailure(response) : gracely.success.ok(response)
	}
	return result
}
router.add("GET", "/events", fetch)
