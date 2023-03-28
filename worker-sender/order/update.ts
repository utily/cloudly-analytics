import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import * as model from "../model"
import { router } from "../router"

export async function update(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const order = await request.body
	if (!request.header.authorization)
		result = gracely.client.unauthorized()
	else if (!model.Order.is(order))
		result = gracely.client.flawedContent(model.Order.flaw(order))
	else {
		const updatedOrder = { ...order, paid: true }
		// Demonstrating sending analytics.
		// Note that type { entity: "order", action: "paid"} demands
		// property amount. See Context/analytics.
		// This function uses executionEnvironment.waitUntil, and will not block thread or response.
		context.analytics.send({
			entity: { type: "order" },
			action: "paid",
			amount: updatedOrder.amount,
			order: updatedOrder,
		})
		result = gracely.success.ok(updatedOrder)
	}
	return result
}
router.add("PATCH", "/order", update)
