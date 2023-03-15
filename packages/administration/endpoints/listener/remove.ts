import * as gracely from "gracely"
import * as http from "cloudly-http"
import { isly } from "isly"
import type { ContextMember } from "../../Context"
import { administrationRouter } from "../administrationRouter"

async function remove(request: http.Request, context: ContextMember): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const name = request.parameter.name

	const listenerConfigurationClient = context.listenerConfiguration
	const bucketClient = context.bucket

	if (!isly.string().is(name))
		result = gracely.client.invalidPathArgument("listener/:name", "name", "string", "A valid identifier is required.")
	else if (gracely.Error.is(listenerConfigurationClient))
		result = listenerConfigurationClient
	else if (gracely.Error.is(bucketClient))
		result = bucketClient
	else {
		if ((await listenerConfigurationClient.remove(name)) == "missing")
			result = gracely.client.notFound(`No listener found with the name ${name}.`)
		else {
			bucketClient.delete(name)
			result = gracely.success.ok(true)
		}
	}
	return result
}
administrationRouter.add("DELETE", "/listener/:name", remove)
