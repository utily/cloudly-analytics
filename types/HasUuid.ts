import * as isly from "isly"

export interface HasUuid {
	uuid: string
}

export const HasUuid = isly.object<HasUuid>({
	uuid: isly.string(),
})
