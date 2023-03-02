import { Analytics, Event } from "cloudly-analytics"
import type { Order, Test } from "../model"

// It is possible to declare a type with extra properties for analytics.
// This will be added to Event, effects the type Analytics.register accepts.
export type AnalyticsExtra = Order.AnalyticEvents | Test.AnalyticEvents
	
/**
 * It is possible to set default values for analytics:
 *
 * Both properties in Event and in AnalyticsExtra can be used.
 * This needs to satisfies Partial<Event & AnalyticsExtra>, but not be declared as that.
 * Do not use `as` or declare the const as Partial<Event & AnalyticsExtra>.
 * If older typescript, remove type-declaration.
 * 
 * This is because the actual  type of this object will effect the type of
 * the event-parameter for `Analytics.register(event)`
 */
export const analyticsDefault = {
	source: "test-worker",
	currency: "SEK",
} satisfies Partial<Event & AnalyticsExtra>

export type AnalyticsDefault = typeof analyticsDefault

export const analyticsConfiguration: Analytics.Configuration = {
	httpEndpoint: "http://localhost:8788"
}
