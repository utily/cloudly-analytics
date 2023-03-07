import { DurableObject } from "@cloudflare/workers-types"
import * as cloudlyRouter from "cloudly-router"
import { Context } from "./Context"

export interface Router<DO extends DurableObject> {
	router: cloudlyRouter.Router<Context<DO>>
	alarm?: (storageContext: Context<DO>) => Promise<void> | void
}
