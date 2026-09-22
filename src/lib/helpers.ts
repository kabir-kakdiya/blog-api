import { MIN_STRING_LENGTH } from "./constants.ts";

export function minLengthMessage(entity: string, minStringLength = MIN_STRING_LENGTH) {
    return `${entity} must be of atleast ${minStringLength} characters`;
}