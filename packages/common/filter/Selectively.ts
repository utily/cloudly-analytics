import { isly } from "isly"
import { types } from "../types"
import { BaseFilterConfiguration } from "./BaseFilterConfiguration"

export interface Selectively extends BaseFilterConfiguration {
	type: "selectively"
	/**
	 * A selectively-expression
	 * Real type is string, rest is for type-prediction.
	 */
	expression: `${types.EventWithMetadata.Selector}:` | (string & Record<never, never>)
}

export namespace Selectively {
	export const type = BaseFilterConfiguration.type.extend<Selectively>(
		{
			type: isly.string("selectively"),
			expression: isly.string(),
		},
		"Filter.Selectively"
	)
}
