import { Listener } from "cloudly-analytics-administration"

/**
 * This is a Listener of events that just log to console.
 */
export const config: Listener.Configuration = {
	name: "cloudly-analytics-demo-logger",
	type: "logger",

	filter: [
		{
			type: "selectively",
			expression: "source:cloudly-analytics-demo",
		},
		{ type: "useragent" },
		{
			type: "mapping",
			mapping: {
				created: "created",
				browserName: "browser.name",
				browserVersion: "browser.version",
				osName: "os.name",
				osVersion: "os.version",
				deviceModel: "device.model",
				deviceType: "device.type",
				deviceVendor: "device.vendor",
				country: "cloudflare.country",
				region: "cloudflare.region",
				city: "cloudflare.city",
				postalCode: "cloudflare.postalCode",
				ip: "header.cfConnectionIp",
				isp: "cloudflare.asOrganization",
				airport: "cloudflare.colo",
				eu: "cloudflare.isEUCountry",
				httpProtocol: "cloudflare.httpProtocol",
				tlsVersion: "cloudflare.tlsVersion",
				timezone: "cloudflare.timezone",
				"posObject.x": "cloudflare.longitude",
				"posObject.y": "cloudflare.latitude",
				"pos[1]": "cloudflare.latitude",
				"pos[0]": "cloudflare.longitude",
			},
		},
	],
	batchSize: 10,
	batchInterval: 3,
}
