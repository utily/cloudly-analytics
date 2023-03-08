import * as gracely from "gracely"
import * as http from "cloudly-http"
import * as isly from "isly"
import * as model from "model"
import { Context } from "../../Context"
import { router } from "../../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const events = await request.body
	// if (!request.header.authorization)
	// 	result = gracely.client.unauthorized()
	if (!(model.Event.type.is(events) || isly.array(model.Event.type).is(events))) {
		result = gracely.client.flawedContent(
			Array.isArray(events) ? isly.array(model.Event.type).flaw(events) : model.Event.type.flaw(events)
		)
	} else if (gracely.Error.is(context.events)) {
		result = context.events
	} else {
		const response = await context.events.addEvents(events, request)
		result = gracely.Error.is(response) ? gracely.server.databaseFailure(response) : gracely.success.created(response)
	}
	return result
}
router.add("POST", "/events", create)
