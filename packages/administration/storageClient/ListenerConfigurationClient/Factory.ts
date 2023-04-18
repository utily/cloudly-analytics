import * as gracely from "gracely"
import type { Environment } from "../../Environment"
import type { ListenerConfigurationClient } from "."

export type Factory = (environment: Environment) => ListenerConfigurationClient | gracely.Error
