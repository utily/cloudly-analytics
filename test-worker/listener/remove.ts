import * as cryptly from "cryptly"
import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function remove(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const body = await request.body
	const queue = context.handler
	const key = await context.authenticate(request)
	if (!key)
		result = gracely.client.unauthorized()
	else if (!(cryptly.Identifier.is(body.owner) && cryptly.Identifier.is(body.id)))
		result = gracely.client.invalidContent("Owner, Id", "Body must contain a valid owner id, and a valid listener id.")
	else if (gracely.Error.is(queue))
		result = queue
	else {
		result = gracely.success.created(queue.unlisten(body.owner, body.id))
	}
	return result
}
router.add("DELETE", "/listener", remove)
