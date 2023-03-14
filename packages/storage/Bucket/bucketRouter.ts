import * as cloudlyRouter from "cloudly-router"
import { Storage } from "../utility/Storage"
import { BucketStorage } from "."

export const bucketRouter: Storage.Router<BucketStorage> = new cloudlyRouter.Router()
