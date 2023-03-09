import { Sender } from "cloudly-analytics/dist/Sender"

export type Environment = Sender.Environment &
	Partial<{
		adminSecret: string
	}>
