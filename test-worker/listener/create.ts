import * as gracely from "gracely"
import * as analytics from "cloudly-analytics"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const listener = await request.body
	const queue = context.handler
	const key = await context.authenticate(request)
	if (!key)
		result = gracely.client.unauthorized()
	else if (!analytics.Listener.is(listener))
		result = gracely.client.invalidContent("Listener", "Body is not a valid listener.")
	else if (gracely.Error.is(queue))
		result = queue
	else {
		result = gracely.success.created(queue.listen(listener))
	}
	return result
}
router.add("POST", "/listener", create)
