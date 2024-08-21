import { gracely } from "gracely"
import { http } from "cloudly-http"
import { isly } from "isly"
import type { ContextMember } from "../../Context"
import { administrationRouter } from "../administrationRouter"

async function remove(request: http.Request, context: ContextMember): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const name = request.parameter.name

	const listenerConfigurationClient = context.listenerConfigurationClient
	const bucketClient = context.bucket

	if (!isly.string().is(name))
		result = gracely.client.invalidPathArgument("listener/:name", "name", "string", "A valid identifier is required.")
	else if (gracely.Error.is(listenerConfigurationClient))
		result = listenerConfigurationClient
	else if (gracely.Error.is(bucketClient))
		result = bucketClient
	else {
		const remove = listenerConfigurationClient.remove(name)
		if (remove === false) {
			result = gracely.client.methodNotAllowed(["DELETE"])
		} else {
			if ((await remove) == "missing")
				result = gracely.client.notFound(`No listener found with the name ${name}.`)
			else {
				bucketClient.delete(name)
				result = gracely.success.ok(true)
			}
		}
	}
	return result
}
administrationRouter.add("DELETE", "/listener/:name", remove)
