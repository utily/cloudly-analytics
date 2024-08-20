import { isly } from "isly"
import { Mapping } from "./Mapping"
import { Selectively } from "./Selectively"
import { Useragent } from "./UserAgent"

export type Configuration = Selectively | Mapping | Useragent
export namespace Configuration {
	export const type = isly.union(Selectively.type, Mapping.type, Useragent.type)
}
