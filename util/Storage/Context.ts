import { DurableObject, DurableObjectState } from "@cloudflare/workers-types"
import { Environment } from "../../Storage"

/**
 * This context is created and sent with every request to Storage (The DurableObject)
 */
export class Context<DO extends DurableObject> {
	public constructor(
		public readonly environment: Environment,
		public readonly state: DurableObjectState,
		public readonly durableObject: DO
	) {}
}
