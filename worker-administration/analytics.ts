import { Administration } from "cloudly-analytics/dist/Administration"
import { Context } from "Context"
import { router } from "./router"

Administration.attachEndpoints<Context>(router, async (request, context) => {
	return (await context.authenticate(request)) == "admin"
})
