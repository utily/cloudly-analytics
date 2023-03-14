import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function fetch(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	context.analytics.send({ entity: "demo", action: "ping", metadata: { meta: "data" } })

	return gracely.success.ok("ok")
}
router.add("GET", "/demo", fetch)
