import { Listener } from "service/Listener"

export const examples: Listener.Configuration[] = [
	{
		name: "all",
		filter: [
			// {
			// 	type: "mapping",
			// 	mapping: [
			// 		["created", "created"],
			// 		["cloudflare.asOrganization", "as"],
			// 		["cloudflare.region", "region"],
			// 		["action", "action"],
			// 	],
			// },
		],
		type: "logger",
		batchSize: 10,
		batchInterval: 2,
	},
	{
		name: "worker-analytics-test",

		filter: [
			{
				type: "selectively",
				expression: "source:worker-analytics-test",
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
					region: "cloudflare.region", //regionCode is also available
					country: "cloudflare.country",
					continent: "cloudflare.continent",
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
		type: "logger",
		batchSize: 10,
		batchInterval: 3,
	},

	// 	{
	// 		name: "localhost",
	// 		filter: "source:localhost",
	// 		comment: "Get all with localhost as source.",
	// 		type: "http",
	// 		target: "localhost",
	// 		batchSize: 10,
	// 	},
	{
		name: "big-query-paxport-paxshop-analytics-dev-event2",
		type: "bigquery",
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
		filter: [
			{
				type: "selectively",
				expression: "source:localhost",
			},
			{
				type: "mapping",
				mapping: {
					// ["source", "source"],
					// ["action", "action"],
					// ["entity", "entity"],
					created: "created",
					// ["cloudflare.country", "country"],
					// ["cloudflare.country", "location"],
					// // ["cloudflare.latitude", "location[1]"],
					// ["cloudflare.longitude", "location[0]"],
					// ["cloudflare.isEUCountry", "isEu"],
					// ["cloudflare.city", "city"],
					//["", "browser"],
					//["", "browserVersion"],
					//["", "os"],
					//["", "osVersion"],
					// ["", "ip"],
					// ["", "ref"],
				},
			},
		],
		batchSize: 10,
		batchInterval: 4,

		projectName: "prefab-backbone-377710",
		datasetName: "paxport_paxshop_analytics_dev",
		tableName: "event2",
		tableSchema: [
			{
				name: "created",
				type: "STRING",
			},
		],
	},
]
