import { selectively } from "selectively"
import { types } from "@cloudly-analytics/common"
import * as isly from "isly"
import { BaseFilter } from "./Base"

export interface Selectively extends BaseFilter.Configuration {
	type: "selectively"
	/**
	 * A selectively-expression
	 * Real type is string, rest is for type-prediction.
	 */
	expression: `${types.EventWithMetadata.Selector}:` | (string & Record<never, never>)
}

export namespace Selectively {
	export const type = BaseFilter.Configuration.type.extend<Selectively>(
		{
			type: isly.string("selectively"),
			expression: isly.string(),
		},
		"Filter.Selectively"
	)

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
