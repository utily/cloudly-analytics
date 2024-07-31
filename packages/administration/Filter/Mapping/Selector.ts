import { isly } from "isly"

// Inspired by https://github.com/pax2pay/model-cde/blob/master/Proxy/Selector.ts

export type Selector = string

export namespace Selector {
	export const type = isly.string(/^((^|(?<!^)\.)[a-zA-Z]\w*|(\[\d+\]))*$/)

	function parse(selector: Selector): (string | number)[] {
		return selector
			.split(".")
			.flatMap(property => (property.endsWith("]") ? property.split("[") : property))
			.map(property =>
				property.endsWith("]")
					? (prop => (prop == "*" ? prop : Number.parseInt(prop)))(property.slice(0, -1))
					: property
			)
	}
	export function get<T = any>(data: any, selector: Selector | (string | number)[]): T | undefined {
		let result: any
		if (typeof selector == "string")
			result = get(data, parse(selector))
		else if (data == undefined)
			result = undefined
		else
			result =
				selector.length == 0
					? data
					: selector[0] == "*" && Array.isArray(data)
					? data.map(element => get(element, selector.slice(1)))
					: get(data[selector[0]], selector.slice(1))
		return result as T
	}

	export function set<T extends any[] | Record<string, any>>(
		data: T,
		selector: Selector | (string | number)[],
		value: any
	): T {
		let result: T
		if (typeof selector == "string")
			result = set(data, parse(selector), value)
		else
			result =
				selector.length == 1 && !Array.isArray(data) && value == undefined
					? (({ [selector[0]]: _, ...left }) => left)(data)
					: selector.length == 0
					? value
					: selector[0] == "*" && Array.isArray(value)
					? value.map((item, index) => set(data, ([index] as (string | number)[]).concat(selector.slice(1)), item))
					: Object.assign(Array.isArray(data) ? [...data] : { ...data }, {
							[selector[0]]: set(
								((data as any)[selector[0]] ??= typeof selector[1] == "string" && selector[1] != "*" ? {} : []),
								selector.slice(1),
								value
							),
					  })
		return result
	}
}
