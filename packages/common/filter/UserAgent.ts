import { isly } from "isly"
import { BaseFilterConfiguration } from "./BaseFilterConfiguration"

export interface Useragent extends BaseFilterConfiguration {
	type: "useragent"
	fields?: Useragent.Field[]
}
export namespace Useragent {
	export type Field = typeof Field.values[number]
	export namespace Field {
		export const values = [
			"useragent:string",
			"browser:{name,version}",
			"browser:string",
			"browserVersion:string",
			"device:{model,type,vendor}",
			"deviceType:string",
			"engine:{name,version}",
			"os:{name,version}",
			"os:string",
			"osVersion:string",
			"cpu:string",
		] as const
	}
	export const type = BaseFilterConfiguration.type.extend<Useragent>(
		{
			type: isly.string("useragent"),
			fields: isly.array(isly.string(Field.values)).optional(),
		},
		"Filter.Useragent"
	)
}
