import { Configuration } from "cloudly-analytics/Configuration"

export type Environment = Configuration.Environment &
	Partial<{
		adminSecret: string
	}>
