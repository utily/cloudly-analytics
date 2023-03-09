import { Administration } from "cloudly-analytics/Administration"

export type Environment = Administration.Environment &
	Partial<{
		adminSecret: string
	}>
