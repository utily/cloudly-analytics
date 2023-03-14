import { attachEndpoints } from "@cloudly-analytics/administration"
import { Context } from "Context"
import { router } from "./router"

attachEndpoints<Context>(router, async (request, context) => {
	return (await context.authenticate(request)) == "admin"
})
