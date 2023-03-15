import { isly } from "isly"
export interface Test {
	metadata: Record<string, string>
}

export namespace Test {
	export const type = isly.object<Test>({
		metadata: isly.record(isly.string(), isly.string()),
	})

	export const is = type.is
	export const flaw = type.flaw

	export type AnalyticEvents = {
		entity: "demo"
		action: "ping"
		metadata: Test["metadata"]
	}
}
