import { DurableObject } from "@cloudflare/workers-types"

export interface DurableObjectWithEnvironment<E extends Partial<Record<string, any>> = object> extends DurableObject {
	environment: E
}
