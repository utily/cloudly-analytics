import { filter, types } from "cloudly-analytics-common"
import { BaseFilter } from "./Base"

export type Mapping = filter.Mapping

export namespace Mapping {
	export import Transform = filter.Mapping.Transform
	export import RecordWithSelector = filter.Mapping.RecordWithSelector
	export import Getter = filter.Mapping.Getter
	export import Selector = filter.Mapping.Selector
	export const type = filter.Mapping.type
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
				: Array.isArray(type)
				? Transform.to[type[0]](value).map((item: any) => this.filter(item, type[1]))
				: Array.isArray(value)
				? value.map(item => this.filter(item, type))
				: this.filter(value, type)
		}
	}
}
