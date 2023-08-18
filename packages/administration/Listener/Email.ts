import { types } from "cloudly-analytics-common"
import * as http from "cloudly-http"
import { isly } from "isly"
import { BaseListener } from "./Base"

export interface Email extends BaseListener.Configuration {
	type: "email"
	subject: string
	sender: { name: string; email: string }
	receiver: { name: string; email: string }
}

export namespace Email {
	export const type = BaseListener.Configuration.type.extend<Email>(
		{
			type: isly.string("email"),
			subject: isly.string(),
			sender: isly.object({ name: isly.string(), email: isly.string() }),
			receiver: isly.object({ name: isly.string(), email: isly.string() }),
		},
		"Listener.Email"
	)
	export class Implementation extends BaseListener<Email> {
		setup(oldConfiguration?: Email | undefined): Promise<BaseListener.SetupResult> {
			return Promise.resolve({ success: true as const })
		}
		async processBatch(batch: types.HasUuid[]): Promise<boolean[]> {
			const result: boolean[] = []
			const receiver = this.configuration.receiver
			const sender = this.configuration.sender

			for (const item of batch) {
				const email = http.Request.create({
					url: `https://api.mailchannels.net/tx/v1/send`,
					header: { contentType: "application/json" },
					method: "POST",
					body: {
						personalizations: [{ to: [{ email: receiver.email, name: receiver.name }] }],
						from: {
							email: sender.email,
							name: sender.name,
						},
						subject: this.configuration.subject,
						content: [
							{
								type: "text/plain",
								value: JSON.stringify(item),
							},
						],
					},
				})
				const response = await http.fetch(email)
				response.status == 202 ? result.push(true) : result.push(false)
			}
			return result
		}
	}
}
