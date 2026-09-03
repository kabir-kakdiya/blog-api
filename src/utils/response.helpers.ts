import type { Response } from "express"

export const successResponse = (res: Response, data = {}, message = 'The request has succeeded') => {
    res.send({ success: true, data, message })
}
export const 