import * as cloudlyRouter from "cloudly-router"
import { Storage } from "../../util/Storage"
import type { BufferStorage } from "."

export const storageRouter: Storage.Router<BufferStorage> = {
	router: new cloudlyRouter.Router(),
}
