import { DurableObjectState } from "@cloudflare/workers-types"
import { DurableObjectWithEnvironment } from "./DurableObjectWithEnvironment"

/**
 * This context is created and sent with every request to Storage (The DurableObject)
 *
 * @template
 * @template E
 */
export class Context<DO extends DurableObjectWithEnvironment> {
	public constructor(
		public readonly environment: DO["environment"],
		public readonly state: DurableObjectState,
		public readonly durableObject: DO
	) {}
}
