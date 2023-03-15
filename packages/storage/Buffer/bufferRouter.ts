import * as cloudlyRouter from "cloudly-router"
import { Storage } from "../utility/Storage"
import type { BufferStorage } from "."

export const bufferRouter: Storage.Router<BufferStorage> = new cloudlyRouter.Router()
