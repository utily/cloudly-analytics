import * as cloudlyRouter from "cloudly-router"
import { Storage } from "../../util/Storage"
import type { BufferStorage } from "."

export const bufferRouter: Storage.Router<BufferStorage> = {
	router: new cloudlyRouter.Router(),
}
