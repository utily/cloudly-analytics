import { types } from "cloudly-analytics-common"
import { isly } from "isly"
import { BaseFilter } from "../Base"
import { Selector } from "./Selector"
import { Transform as MappingTransform } from "./Transform"

export interface Mapping extends BaseFilter.Configuration {
	type: "mapping"
	/**
	 * Specify all properties of the mapped object.
	 * Source is normally EventWithMetadata,
	 * but not if mapping-filters are chained.
	 *
	 * The Selector is just a string, but `& Record<never, never>` fools the IDE to not collapse it to a string, which gives type-prediction in IDE.
	 */
	mapping: Mapping.RecordWithSelector<types.EventWithMetadata.Selector | (Selector & Record<never, never>)>
}

export namespace Mapping {
	type MaybeArray<T> = T | T[]
	export type RecordWithSelector<T extends string> = Record<string, T | Getter<T>>
	export type Getter<T extends string = string> = {
		selector: MaybeArray<T>
		default?: MaybeArray<number | string | boolean>
		transform?: Transform | RecordWithSelector<string>
	}
	export import Transform = MappingTransform
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
						transform: Transform.type.optional(),
					})
				)
			),
		},
		"Filter.Mapping"
	)
	export const is = type.is
	export const flaw = type.flaw

	export class Implementation extends BaseFilter<Mapping> {
		filter(
			event: types.EventWithMetadata | object,
			mapping?: RecordWithSelector<types.EventWithMetadata.Selector | (Selector & Record<never, never>)>
		): types.EventWithMetadata | object | undefined {
			return Object.entries(mapping ?? this.filterConfiguration.mapping).reduce(
				(object, [setSelector, getterValue]) => {
					const getter: Getter = typeof getterValue == "string" ? { selector: getterValue } : getterValue
					return this.set(object, setSelector, event, getter)
				},
				{}
			)
		}
		private set<T extends any[] | Record<string, any>>(
			data: T,
			selector: Selector,
			event: types.EventWithMetadata | object,
			getter: Getter
		): T {
			return Selector.set(
				data,
				selector,
				this.transform(
					getter.transform,
					!getter.selector
						? getter.default
						: Array.isArray(getter.selector)
						? getter.selector.map(
								(getSelector, index) =>
									Selector.get(event, getSelector) ??
									(Array.isArray(getter.default) ? getter.default[index] : getter.default)
						  )
						: Selector.get(event, getter.selector) ?? getter.default,
					Array.isArray(getter.selector) ? getter.selector.some(s => s == "*") : getter.selector.includes("*")
				)
			)
		}
		private transform(type: Getter["transform"], value: any | undefined, map: boolean): any {
			return !type || value == undefined
				? value
				: typeof type == "string"
				? map && Array.isArray(value) // TODO: make it work for nested arrays
					? value.map(item => Transform.to[type](item))
					: Transform.to[type](value)
				: Array.isArray(value)
				? value.map(item => this.filter(item, type))
				: this.filter(value, type)
		}
	}
}
