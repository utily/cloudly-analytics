import { isly } from "isly"

/**
 * This is the format for private keys downloaded form Google.
 * (Optional properties are not used by the BigQuery-Listener
 * and therefor not necessary.)
 */
export type PrivateKey = {
	type?: string
	project_id?: string
	private_key_id: string
	private_key: string
	client_email: string
	client_id?: string
	auth_uri?: string
	token_uri?: string
	auth_provider_x509_cert_url?: string
	client_x509_cert_url?: string
}

export namespace PrivateKey {
	export const type = isly.object<PrivateKey>({
		type: isly.string().optional(),
		project_id: isly.string().optional(),
		private_key_id: isly.string(),
		private_key: isly.string(),
		client_email: isly.string(),
		client_id: isly.string().optional(),
		auth_uri: isly.string().optional(),
		token_uri: isly.string().optional(),
		auth_provider_x509_cert_url: isly.string().optional(),
		client_x509_cert_url: isly.string().optional(),
	})
	export const is = type.is
	export const flaw = type.flaw
}
