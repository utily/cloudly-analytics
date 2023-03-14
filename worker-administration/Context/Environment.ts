import { Environment as AdministrationEnvironment } from "@cloudly-analytics/administration"

export type Environment = AdministrationEnvironment &
	Partial<{
		adminSecret: string
	}>
