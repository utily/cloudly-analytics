import * as isly from "isly"
import { EventWithMetadata } from "../types"

export abstract class BaseFilter<C extends BaseFilter.Configuration = BaseFilter.Configuration> {
	constructor(protected readonly filterConfiguration: C) {}
	get type(): C["type"] {
		return this.filterConfiguration.type
	}
	abstract filter(event: EventWithMetadata | object): EventWithMetadata | object | undefined
}

export namespace BaseFilter {
	export interface Configuration<T extends string = string> {
		type: T
		comment?: string
	}
	export namespace Configuration {
		export const type = isly.object<Configuration>(
			{
				type: isly.string(),
				comment: isly.string().optional(),
			},
			"FilterConfiguration"
		)
	}
}
