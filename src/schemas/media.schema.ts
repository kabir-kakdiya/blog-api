import * as v from "valibot";

import { ALLOWED_TYPES } from "../lib/constants.ts";

export const mediaSchema = v.object({
    contentType: v.picklist(ALLOWED_TYPES, "Unsupported type"),
    size: v.pipe(v.number("size must be a number")),
});

export type MediaInput = v.InferOutput<typeof mediaSchema>;

export const mediaParamSchema = v.object({
    mediaId: v.pipe(v.string(), v.nonEmpty("Media Id is required")),
});
export type MediaParamInput = v.InferOutput<typeof mediaParamSchema>;
