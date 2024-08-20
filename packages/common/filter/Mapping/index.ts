import { isly } from "isly"
import { types } from "../../types"
import { BaseFilterConfiguration } from "../BaseFilterConfiguration"
import { Selector as MappingSelector } from "./Selector"
import { Transform as MappingTransform } from "./Transform"

export interface Mapping extends BaseFilterConfiguration {
	type: "mapping"
	/**
	 * Specify all properties of the mapped object.
	 * Source is normally EventWithMetadata,
	 * but not if mapping-filters are chained.
	 *
	 * The Selector is just a string, but `& Record<never, never>` fools the IDE to not collapse it to a string, which gives type-prediction in IDE.
	 */
	mapping: Mapping.RecordWithSelector<types.EventWithMetadata.Selector | (Mapping.Selector & Record<never, never>)>
}

export namespace Mapping {
	export import Selector = MappingSelector
	export import Transform = MappingTransform
	type MaybeArray<T> = T | T[]
	export type RecordWithSelector<T extends string> = Record<string, T | Getter<T>>
	export namespace RecordWithSelector {
		export const type = isly.record<RecordWithSelector<string>>(
			isly.string(),
			isly.union<string | Getter, string, Getter>(
				isly.string(),
				isly.lazy<Getter>((): isly.Type<Getter> => Getter.type)
			)
		)
	}
	export type Getter<T extends string = string> = {
		selector: MaybeArray<T>
		default?: MaybeArray<number | string | boolean>
		transform?: Transform | RecordWithSelector<string>
	}
	export namespace Getter {
		type Default = number | string | boolean
		const defaultType = isly
			.union<Default | Default[], Default, Default[]>(
				isly.union<Default>(isly.number(), isly.string(), isly.boolean()),
				isly.union<Default>(isly.number(), isly.string(), isly.boolean()).array()
			)
			.optional()
		export const type = isly.object<Getter>({
			selector: isly.union<string | string[], string, string[]>(isly.string(), isly.string().array()),
			default: defaultType,
			transform: isly
				.union<Transform | RecordWithSelector<string>, Transform, RecordWithSelector<string>>(
					Transform.type,
					RecordWithSelector.type
				)
				.optional(),
		})
	}
	export const type = BaseFilterConfiguration.type.extend<Mapping>(
		{
			type: isly.string("mapping"),
			mapping: isly.record(Selector.type, isly.union(Selector.type, Getter.type)),
		},
		"Filter.Mapping"
	)
	export const is = type.is
	export const flaw = type.flaw
}
