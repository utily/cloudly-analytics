import { gracely } from "gracely"
import { http } from "cloudly-http"
import type { ContextMember as ContextMember } from "../../Context"
import { Listener } from "../../Listener"
import { administrationRouter } from "../administrationRouter"

async function create(request: http.Request, context: ContextMember): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const listenerConfiguration = await request.body

	const listenerConfigurationClient = context.listenerConfigurationClient
	const bucketClient = context.bucket

	if (!Listener.Configuration.is(listenerConfiguration))
		result = gracely.client.flawedContent(Listener.Configuration.flaw(listenerConfiguration))
	else if (gracely.Error.is(listenerConfigurationClient))
		result = listenerConfigurationClient
	else if (gracely.Error.is(bucketClient))
		result = bucketClient
	else {
		const create = listenerConfigurationClient.create(listenerConfiguration)
		if (create === false) {
			result = gracely.client.methodNotAllowed(["POST"])
		} else {
			const createResult = await create

			if (!createResult.setup.success) {
				result = gracely.server.backendFailure(createResult)
			} else
				result = gracely.success.created(createResult)
		}
	}
	return result
}

administrationRouter.add("POST", "/listener", create)
