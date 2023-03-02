import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const order = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Order.UnPaid.is(order))
		result = gracely.client.flawedContent(model.Order.UnPaid.flaw(order))
	else {
		context.analytics.register({ entity: "order", action: "prepared", order })

		result = gracely.success.created(order)
	}
	return result
}
router.add("POST", "/order", create)
