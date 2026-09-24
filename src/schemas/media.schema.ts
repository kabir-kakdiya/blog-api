import * as v from "valibot"
import { ALLOWED_TYPES } from "../lib/constants.ts";

export const mediaSchema = v.object({
    contentType: v.picklist(ALLOWED_TYPES, "Unsupported type")
})

export type MediaInput = v.InferOutput<typeof mediaSchema>