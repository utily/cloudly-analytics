import { Environment as SenderEnvironment } from "@cloudly-analytics/sender"

export type Environment = SenderEnvironment &
	Partial<{
		adminSecret: string
	}>
