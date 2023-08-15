import { Listener } from "cloudly-analytics-administration"

// https://docs.openbridge.com/en/articles/1856793-how-to-set-up-google-bigquery-creating-and-configuring-service-accounts-in-google-cloud-console
/**
 * This listener store information in BigQuery. privateKey is omitted, and is injected by listenerConfigurationClientFactory.
 */
export const config: Listener.Configuration.BigQuery.BaseConfiguration = {
	name: "cloudly-analytics-demo-bigquery",
	type: "bigquery",

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
				source: "source",
				entity: "entity",
				action: "action",
				currency: "currency",
				amount: "amount",
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
				location: {
					selector: ["cloudflare.longitude", "cloudflare.latitude"],
					transform: "point",
				},
				ip: "header.cfConnectionIp",
				isp: "cloudflare.asOrganization",
				cloudflareAirport: "cloudflare.colo",
				eu: { selector: "cloudflare.isEUCountry", transform: "boolean" },
				httpProtocol: "cloudflare.httpProtocol",
				tlsVersion: "cloudflare.tlsVersion",
				timezone: "cloudflare.timezone",
			},
		},
	],

	batchSize: 10,
	batchInterval: 3,

	projectName: "prefab-backbone-377710",
	datasetName: "paxport_paxshop_analytics_dev",
	tableName: "worker_analytics_test",
	tableSchema: [
		{ name: "created", type: "TIMESTAMP" },
		{ name: "source", type: "STRING" },
		{ name: "entity", type: "STRING" },
		{ name: "action", type: "STRING" },
		{ name: "currency", type: "STRING" },
		{ name: "amount", type: "NUMERIC" },
		{
			name: "browserName",
			type: "STRING",
		},
		{
			name: "browserVersion",
			type: "STRING",
		},
		{
			name: "osName",
			type: "STRING",
		},
		{
			name: "osVersion",
			type: "STRING",
		},
		{
			name: "deviceModel",
			type: "STRING",
		},
		{
			name: "deviceType",
			type: "STRING",
		},
		{
			name: "deviceVendor",
			type: "STRING",
		},
		{
			name: "country",
			type: "STRING",
		},
		{
			name: "region",
			type: "STRING",
		},
		{
			name: "city",
			type: "STRING",
		},
		{
			name: "postalCode",
			type: "STRING",
		},
		{
			name: "location",
			type: "GEOGRAPHY",
			mode: "NULLABLE",
			description: "Use: POINT(longitude latitude)",
		},
		{
			name: "ip",
			type: "STRING",
		},
		{
			name: "isp",
			type: "STRING",
		},
		{
			name: "cloudflareAirport",
			type: "STRING",
		},
		{
			name: "eu",
			type: "BOOLEAN",
		},
		{
			name: "httpProtocol",
			type: "STRING",
		},
		{
			name: "tlsVersion",
			type: "STRING",
		},
		{
			name: "timezone",
			type: "STRING",
		},
	],
}
