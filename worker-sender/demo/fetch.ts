import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function fetch(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	context.analytics.send({ entity: { type: "demo" }, action: "ping", metadata: { meta: "data" } })
	context.analytics.send(
		new Promise(resolve => {
			resolve({ entity: { type: "demo" }, action: "pong" })
		})
	)
	context.analytics.send(
		new Promise(resolve => {
			setTimeout(() => resolve({ entity: { type: "demo" }, action: "ping", metadata: { meta: "timeout" } }), 2000)
		})
	)

	return gracely.success.ok("ok")
}
router.add("GET", "/demo", fetch)
