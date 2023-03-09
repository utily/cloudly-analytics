import { Sender } from "cloudly-analytics/Sender"

export type Environment = Sender.Environment &
	Partial<{
		adminSecret: string
	}>
