import { isly } from "isly"
import { BaseFilter } from "./Base"
import { Mapping as FilterMapping } from "./Mapping"
import { Selectively as FilterSelectively } from "./Selectively"
import { Useragent as FilterUseragent } from "./Useragent"

type Implementations = {
	[Type in Filter.Configuration["type"]]: {
		// About constructor-signature: https://stackoverflow.com/a/13408029/1003172
		new (configuration: Filter.Configuration & { type: Type }): BaseFilter<Filter.Configuration & { type: Type }>
	}
}

const implementations: Implementations = {
	// List all implementations here:
	selectively: Filter.Selectively.Implementation,
	mapping: Filter.Mapping.Implementation,
	useragent: Filter.Useragent.Implementation,
}

export namespace Filter {
	export function create<C extends Configuration>(filterConfiguration: C) {
		return new implementations[filterConfiguration.type](filterConfiguration as any) as BaseFilter<C>
	}
	export function createList(filter: Configuration[]) {
		return filter.map(filterConfiguration => create(filterConfiguration))
	}
	export type Configuration = Selectively | Mapping | Useragent
	export const Configuration = isly.union(Selectively.type, Mapping.type, Useragent.type)
	export type Base = BaseFilter
	export const Base = BaseFilter
	export import Selectively = FilterSelectively
	export import Mapping = FilterMapping
	export import Useragent = FilterUseragent
}
