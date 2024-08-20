import { isly } from "isly"

export interface BaseFilterConfiguration<T extends string = string> {
	type: T
	comment?: string
}
export namespace BaseFilterConfiguration {
	export const type = isly.object<BaseFilterConfiguration>(
		{
			type: isly.string(),
			comment: isly.string().optional(),
		},
		"FilterConfiguration"
	)
}
