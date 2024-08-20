import { filter, types } from "cloudly-analytics-common"

export abstract class BaseFilter<C extends BaseFilter.Configuration = BaseFilter.Configuration> {
	constructor(protected readonly filterConfiguration: C) {}
	get type(): C["type"] {
		return this.filterConfiguration.type
	}
	abstract filter(event: types.EventWithMetadata | object): types.EventWithMetadata | object | undefined
}

export namespace BaseFilter {
	export import Configuration = filter.BaseFilterConfiguration
}
