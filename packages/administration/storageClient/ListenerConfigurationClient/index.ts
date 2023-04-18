import * as gracely from "gracely"
import { Environment } from "../../Environment"
import { Listener } from "../../Listener"
import { BaseListener } from "../../Listener/Base"
import { KeyValueStorage as NKeyValueStorage } from "./KeyValueStorage"
import { TypescriptApi as NTypescriptApi } from "./TypescriptApi"

export type FetchResult = {
	configuration: Listener.Configuration
	status: BaseListener.StatusResult
	readonly?: boolean
} & Partial<Listener.Configuration.Metadata>

export type CreateResult = Partial<FetchResult> & { setup: Listener.SetupResult; action?: "created" | "updated" }

export type ListenerConfigurationResult = { value: Listener.Configuration; meta?: Listener.Configuration.Metadata }

export type ListenerConfigurationClient = NKeyValueStorage | NTypescriptApi

export namespace ListenerConfigurationClient {
	export type Factory = (environment: Environment) => ListenerConfigurationClient | gracely.Error
	export const KeyValueStorage = NKeyValueStorage
	export type KeyValueStorage = NKeyValueStorage
	export const TypescriptApi = NTypescriptApi
	export type TypescriptApi = NTypescriptApi
}
