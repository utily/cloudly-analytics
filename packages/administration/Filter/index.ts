import { filter } from "cloudly-analytics-common"
import { BaseFilter } from "./Base"
import { Mapping as FilterMapping } from "./Mapping"
import { Selectively as FilterSelectively } from "./Selectively"
import { Useragent as FilterUseragent } from "./Useragent"

export namespace Filter {
	export import Selectively = FilterSelectively
	export import Mapping = FilterMapping
	export import Useragent = FilterUseragent
	export import Base = BaseFilter
	export import Configuration = filter.Configuration
	type Implementations = {
		[Type in Configuration["type"]]: {
			// About constructor-signature: https://stackoverflow.com/a/13408029/1003172
			new (configuration: Configuration & { type: Type }): BaseFilter<Configuration & { type: Type }>
		}
	}
	const implementations: Implementations = {
		// List all implementations here:
		selectively: Selectively.Implementation,
		mapping: Mapping.Implementation,
		useragent: Useragent.Implementation,
	}
	export function create<C extends Configuration>(filterConfiguration: C) {
		return new implementations[filterConfiguration.type](filterConfiguration as any) as BaseFilter<C>
	}
	export function createList(filter: Configuration[]) {
		return filter.map(filterConfiguration => create(filterConfiguration))
	}
}
