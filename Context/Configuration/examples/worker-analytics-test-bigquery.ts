import { Listener } from "service/Listener"

export const config: Listener.Configuration = {
	name: "worker-analytics-test-bigquery",
	type: "bigquery",

	filter: [
		{
			type: "selectively",
			expression: "source:worker-analytics",
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
	privateKey: {
		type: "service_account",
		project_id: "prefab-backbone-377710",
		private_key_id: "6cdc74f54679b8935a3aaaa853474f511eacfe27",
		private_key:
			"-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCDthMBZMl3xeXJ\nh2r9dg36h3vAzRA1VP/WWoXJzobydDmwyxVpBWi/qdmliudTEOneo3cPYH0x1gOq\nUEduM7aWbEhTZ5WZ80+LcPsQJyjcP/cz/p1RIbETH7ClojCcAztfAFGvKGjxqY/P\nPRPCF0KjvAebWZ6gx6Vk9/YhJEZK42gGrE+2koCeqGfiYq9+hneddyoB4Vo8Cvxr\n1SCH7O8E3Rvugeqz/Szzaqa5C6YOlvsaDvSnbVf7kgvv43vsRMVnwZqxW6gdgQAB\nTjO6+ya2MWXFClgNaNcwuEd7vz4SVK1xNlIp6b8DDTNo4kuSq2PaWDpDQsOfTdV0\nObm43xIpAgMBAAECgf8pB89j38HjTgMHhOgPjXdNVGd46GjkNFZ+sDR9aZkgbpSK\nPrmsvcKj8oWazGrDtcElWkb8w1I89C6wH9Igwnte4NynHt2719Av4EJWBdz0v/iC\neg8H9zbyfizJbH04HMmiDrdjmXMX1Xq3VI+TJyvbVfgIrSJ9c7RSf+xs5p//M+YL\nZ3KsAffpcFkE8ktCLpymxpCHIRm3etLiPrQlpaLQmjLi0cl/5kOshWHrUPP5XSKu\nS7cmcJmluBApSUADREVbPc8rjmQu0FuD3PY47TaLJy0ZUfBTyEJNOkCZRDtOPjyK\nsIR62tvkQKuabO2BAoQtL0pKrFe2vw7trUBlP10CgYEAuNIvuSYw4HwyMmbhDzMl\nLqZOZyOmghTt1PO4Vocqg0Q/N5cmYInHQD2u3quFPHivbsza63mMSz9RtFnCmjG7\nvvGdcTR5hDP+5s+4qCepPcEJZbpVRovyuMk7oM0aXwP0ttHrm/YkpDuyiaQmvF7Q\nXQgYVW30vxgIQDnPgAKB7i0CgYEAtm+z/D0QHzBm7jGIpUEGNwrHxE0n+YzGWncW\n5AeoonICKWTxDY3s2gREBtcefx+4pqQYR/LMLvacwebc9AeFtQNXyxNiWBw1uwv1\n65oZI6Ltg6WadvOCrpYTWWWOJKSGWTgBfkkLcKiALqUgk3EL6iKoU6et4y+DTgvq\n2fth7W0CgYEAmHDM6hLFB7OIl6fhg+70gSiszEdMZEis7hNj/QKZnxGgbtKd1cxu\nat81p/Wi/ICyelo/Sy/C9qGwW2gZqaLRrymMab4VaGSWn3u/W/ryjbv1a1GoWnq9\n5YodQ4FIegxCQLSed9Iq4MdYeEzLol010TYHFBeQYjmJPKgyLOxkjLUCgYBBf38l\n+yJToEQEFmKRufOqRUONVYoZjRIVnpXoTlub3sSp6eSlUiQL7eYico8vYssfgOB6\nzE/EOKP09Za0QhMd9tJJRW9UZORhgBzNdmi6I5+UWRtIw4pSde0CdnR+8VaOp43Z\nsg3aZ5SFqqE0biyx5bl7N0M1wnQozByIIDl7TQKBgAc/zvRKyybeI3Gq9Bp76zga\nDmuCBGEPQL06HhI1BC/yW2FKPwE2nN1lEGCCIkdpumyhbOV59kZD82ZIntpo7LlZ\nUSv0ZQ5fAOdoZIDVoEMgOw4wSaSJ679jP0QC8W+CGc/xdQ7mk5/awx+TaiujAeES\nwDD7maP87TtSRyrwBhvI\n-----END PRIVATE KEY-----\n",
		client_email: "paxport-paxshop-analytics-dev@prefab-backbone-377710.iam.gserviceaccount.com",
		client_id: "116287929807825169678",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url:
			"https://www.googleapis.com/robot/v1/metadata/x509/paxport-paxshop-analytics-dev%40prefab-backbone-377710.iam.gserviceaccount.com",
	},

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
