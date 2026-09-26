import * as v from "valibot"
import { ALLOWED_TYPES, MAX_SIZE, MIN_STRING_LENGTH } from "../lib/constants.ts";
import { minLengthMessage } from "../lib/helpers.ts";

export const mediaSchema = v.object({
    contentType: v.picklist(ALLOWED_TYPES, "Unsupported type"),
    size: v.pipe(v.number(), v.maxValue(MAX_SIZE, "File too large")),
    filename: v.pipe(v.string(), v.trim(), v.minLength(MIN_STRING_LENGTH, minLengthMessage('filename')), v.toLowerCase())
})

export type MediaInput = v.InferOutput<typeof mediaSchema>