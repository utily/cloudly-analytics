import { types } from "cloudly-analytics-common"
import * as isly from "isly"
import { BaseFilter } from "../Base"
import { Selector } from "./Selector"

const transformNames = ["string", "boolean", "float", "integer", "number", "point"] as const

type Transform = typeof transformNames[number]
const transformers: Record<Transform, (value: any) => any> = {
	string: value => `${value}`,
	boolean: value => Boolean(value),
	float: value => Number.parseFloat(value),
	integer: value => Number.parseInt(value),
	number: value => +value,
	point: value => {
		const xy = isly.array(isly.number()).get(Array.isArray(value) && value.map(item => +item))
		return xy ? `POINT(${xy[0]} ${xy[1]})` : undefined
	},
}

function transform(type: Getter["transform"], value: any | undefined): any {
	return type && value != undefined ? transformers[type](value) : value
}
type RecordWithSelector<T extends string> = Record<string, T | Getter<T>>

type MaybeArray<T> = T | T[]
type Getter<T extends string = string> = {
	selector: MaybeArray<T>
	default?: MaybeArray<number | string | boolean>
	transform?: Transform
}

export interface Mapping extends BaseFilter.Configuration {
	type: "mapping"
	/**
	 * Specify all properties of the mapped object.
	 * Source is normally EventWithMetadata,
	 * but not if mapping-filters are chained.
	 *
	 * The Selector is just a string, but `& Record<never, never>` fools the IDE to not collapse it to a string, which gives type-prediction in IDE.
	 */
	mapping: RecordWithSelector<types.EventWithMetadata.Selector | (Selector & Record<never, never>)>
}

export namespace Mapping {
	export const type = BaseFilter.Configuration.type.extend<Mapping>(
		{
			type: isly.string("mapping"),
			mapping: isly.record(
				Selector.type,
				isly.union(
					Selector.type,
					isly.object<Getter<Selector>>({
						selector: isly.union(Selector.type, isly.array(Selector.type)),
						default: isly.any().optional(),
						transform: isly.string(transformNames).optional(),
					})
				)
			),
		},
		"Filter.Mapping"
	)
	export const is = type.is
	export const flaw = type.flaw

	export class Implementation extends BaseFilter<Mapping> {
		filter(event: types.EventWithMetadata | object): types.EventWithMetadata | object | undefined {
			return Object.entries(this.filterConfiguration.mapping).reduce((object, [setSelector, getterValue]) => {
				const getter: Getter = typeof getterValue == "string" ? { selector: getterValue } : getterValue

				return Selector.set(
					object,
					setSelector,
					transform(
						getter.transform,
						!getter.selector
							? getter.default
							: Array.isArray(getter.selector)
							? getter.selector.map(
									(getSelector, index) =>
										Selector.get(event, getSelector) ??
										(Array.isArray(getter.default) ? getter.default[index] : getter.default)
							  )
							: Selector.get(event, getter.selector) ?? getter.default
					)
				)
			}, {})
		}
	}
}
