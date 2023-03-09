import { Configuration } from "cloudly-analytics/dist/Configuration"

export type Environment = Configuration.Environment &
	Partial<{
		adminSecret: string
	}>
