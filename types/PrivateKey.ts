import * as isly from "isly"
export type PrivateKey = {
	type: string
	project_id: string
	private_key_id: string
	private_key: string
	client_email: string
	client_id: string
	auth_uri: string
	token_uri: string
	auth_provider_x509_cert_url: string
	client_x509_cert_url: string
}

export namespace PrivateKey {
	export const type = isly.object<PrivateKey>({
		type: isly.string(),
		project_id: isly.string(),
		private_key_id: isly.string(),
		private_key: isly.string(),
		client_email: isly.string(),
		client_id: isly.string(),
		auth_uri: isly.string(),
		token_uri: isly.string(),
		auth_provider_x509_cert_url: isly.string(),
		client_x509_cert_url: isly.string(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
