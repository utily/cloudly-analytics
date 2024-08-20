import { selectively } from "selectively"
import { filter, types } from "cloudly-analytics-common"
import { BaseFilter } from "./Base"

export type Selectively = filter.Selectively

export namespace Selectively {
	export const type = filter.Selectively.type
	export class Implementation extends BaseFilter<Selectively> {
		protected selectivelyFilter: selectively.Rule

		constructor(filterConfiguration: Selectively) {
			super(filterConfiguration)
			this.selectivelyFilter = selectively.parse(this.filterConfiguration.expression)
		}

		filter(event: types.EventWithMetadata | object): types.EventWithMetadata | object | undefined {
			return this.selectivelyFilter.is(event) ? event : undefined
		}
	}
}
