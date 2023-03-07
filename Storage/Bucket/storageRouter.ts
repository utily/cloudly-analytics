import * as cloudlyRouter from "cloudly-router"
import { Storage } from "../../util/Storage"
import { BucketStorage } from "."

export const storageRouter: Storage.Router<BucketStorage> = {
	router: new cloudlyRouter.Router(),
}
