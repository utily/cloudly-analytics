import { Analytics, Event } from "cloudly-analytics"

// It is possible to declare a type with extra properties for analytics.
// This will be added to Event
export type AnalyticsExtra =
	| {
			entity: "order"
			action: "prepare"
	  }
	| {
			entity: "order"
			action: "paid"
			
			currency: string
			amount: number
	  }

/**
 * It is possible to set default values for analytics:
 *
 * Both properties in Event and in AnalyticsExtra can be used.
 * This needs to satisfies Partial<Event & AnalyticsExtra>, but not be declared as that.
 * Do not use `as` or declare the const as Partial<Event & AnalyticsExtra>.
 * If older typescript, remove type-declaration.
 */
export const analyticsDefault = {
	source: "test-worker",
	currency: "SEK",
} satisfies Partial<Event & AnalyticsExtra>

export type AnalyticsDefault = typeof analyticsDefault

export const analyticsConfiguration: Analytics.Configuration = {}
