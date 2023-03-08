import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "Context"
import { router } from "router"

export async function fetch(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	context.analytics.register({ action: "purchased", entity: "order", amount: 123 })

	return gracely.success.ok("ok")
}
router.add("GET", "/test", fetch)
