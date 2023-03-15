import * as cloudlyRouter from "cloudly-router"
import { Context } from "./Context"
import { DurableObjectWithEnvironment } from "./DurableObjectWithEnvironment"

export interface Router<DO extends DurableObjectWithEnvironment> extends cloudlyRouter.Router<Context<DO>> {
	alarm?: (storageContext: Context<DO>) => Promise<void> | void
}
