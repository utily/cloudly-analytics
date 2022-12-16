import * as cryptly from "cryptly"
import * as gracely from "gracely"
import * as analytics from "cloudly-analytics"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function update(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	let listener = await request.body
	const id = request.parameter.id
	const listeners = context.listeners
	const key = await context.authenticate(request)
	if (!key)
		result = gracely.client.unauthorized()
	else if (!id || !cryptly.Identifier.is(id, 8))
		result = gracely.client.invalidPathArgument(
			"/listener/:id",
			"id",
			"string",
			"A valid listener id identifier is required."
		)
	else if (!analytics.Listener.is(listener))
		result = gracely.client.invalidContent("Listener", "Body is not a valid listener.")
	else if (gracely.Error.is(listeners))
		result = listeners
	else {
		listener = { ...listener, id: id }
		result = gracely.success.created(listeners.listen(listener))
	}
	return result
}
router.add("PATCH", "/listener/:id", update)
