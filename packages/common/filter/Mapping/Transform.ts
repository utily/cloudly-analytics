import { isly } from "isly"

export type Transform = typeof Transform.values[number]

export namespace Transform {
	export const values = ["string", "stringify", "boolean", "float", "integer", "number", "point", "array"] as const
	export const type = isly.string<Transform>(values)
	export const to: Record<Transform, (value: any) => any> = {
		string: value => `${value}`,
		stringify: value => JSON.stringify(value),
		boolean: value => Boolean(value),
		float: value => Number.parseFloat(value),
		integer: value => Number.parseInt(value),
		number: value => +value,
		point: value => {
			const xy = isly.array(isly.number()).get(Array.isArray(value) && value.map(item => +item))
			return xy ? `POINT(${xy[0]} ${xy[1]})` : undefined
		},
		array: value => Object.entries(value).map(([key, value]) => ({ key, value })), //To handle records with generic keys
	}
}
