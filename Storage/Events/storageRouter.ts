import * as cloudlyRouter from "cloudly-router"
import { Storage } from "../../util/Storage"
import type { EventStorage } from "."

export const storageRouter: Storage.Router<EventStorage> = {
	router: new cloudlyRouter.Router(),
}
