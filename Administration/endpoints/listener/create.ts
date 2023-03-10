import * as gracely from "gracely"
import * as http from "cloudly-http"
import { Listener } from "../../../Listener"
import type { AdministrationContext } from "../../AdministrationContext"
import { administrationRouter } from "../administrationRouter"

async function create(request: http.Request, context: AdministrationContext): Promise<http.Response.Like | any> {
	let result: gracely.Result
	const listenerConfiguration = await request.body

	const listenerConfigurationClient = context.listenerConfiguration
	const bucketClient = context.bucket

	if (!Listener.Configuration.is(listenerConfiguration))
		result = gracely.client.flawedContent(Listener.Configuration.flaw(listenerConfiguration))
	else if (gracely.Error.is(listenerConfigurationClient))
		result = listenerConfigurationClient
	else if (gracely.Error.is(bucketClient))
		result = bucketClient
	else {
		const createResult = await listenerConfigurationClient.create(listenerConfiguration)

		if (createResult.action == "updated") {
			const updateConfiguration = await bucketClient.updateConfiguration(listenerConfiguration)
			if (gracely.Error.is(updateConfiguration)) {
				;(createResult.setup.details ??= []).push("Failed to update configuration in bucket.")
				createResult.setup.success = false
			}
		}

		if (!createResult.setup.success) {
			result = gracely.server.backendFailure(createResult)
		} else
			result = gracely.success.created(createResult)
	}
	return result
}

administrationRouter.add("POST", "/listener", create)
