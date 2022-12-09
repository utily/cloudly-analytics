import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const order = await request.body
	const trigger = context.trigger
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Order.is(order))
		result = gracely.client.invalidContent("Order", "Body is not a valid order.")
	else if (gracely.Error.is(trigger))
		result = trigger
	else {
		const event = model.Event.Prepare.create(order)
		trigger(event)
		result = gracely.success.created(order)
	}
	return result
}
router.add("POST", "/order", create)
