import { types } from "cloudly-analytics-common"
import * as isly from "isly"
import { UAParser } from "ua-parser-js"
import { BaseFilter } from "./Base"

const fieldValues = [
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

type Field = typeof fieldValues[number]
export interface Useragent extends BaseFilter.Configuration {
	type: "useragent"
	fields?: Field[]
}
export namespace Useragent {
	export const type = BaseFilter.Configuration.type.extend<Useragent>(
		{
			type: isly.string("useragent"),
			fields: isly.array(isly.string(fieldValues)).optional(),
		},
		"Filter.Useragent"
	)

	export class Implementation extends BaseFilter<Useragent> {
		constructor(filterConfiguration: Useragent) {
			super(filterConfiguration)
		}
		filter(event: types.EventWithMetadata | object): types.EventWithMetadata | object | undefined {
			let result: object | undefined
			const useragentRaw = (event as types.EventWithMetadata)?.header?.userAgent
			if (useragentRaw) {
				const parser = new UAParser(useragentRaw)

				const transformers: Record<Field, () => object> = {
					"useragent:string": () => ({
						useragent: parser.getUA(),
					}),
					"browser:{name,version}": () => ({
						browser: parser.getBrowser(),
					}),
					"browser:string": () => ({
						browser: parser.getBrowser().name,
					}),
					"browserVersion:string": () => ({
						browserVersion: parser.getBrowser().version,
					}),
					"device:{model,type,vendor}": () => ({
						device: parser.getDevice(),
					}),
					"deviceType:string": () => ({
						device: parser.getDevice().type,
					}),
					"engine:{name,version}": () => ({
						engine: parser.getEngine(),
					}),
					"os:{name,version}": () => ({
						os: parser.getOS(),
					}),
					"os:string": () => ({
						os: parser.getOS().name,
					}),
					"osVersion:string": () => ({
						osVersion: parser.getOS().version,
					}),
					"cpu:string": () => ({
						cpu: parser.getCPU().architecture,
					}),
				}
				const filteredValue = {
					...event,
				}
				;(
					this.filterConfiguration.fields ??
					(["browser:{name,version}", "os:{name,version}", "device:{model,type,vendor}"] as const)
				).forEach(field => Object.assign(filteredValue, transformers[field]()))
				result = filteredValue
			} else
				result = event
			return result
		}
	}
}
