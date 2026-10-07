import type { RequestHandler } from "express";

// declare global {   // This makes every Express handler to know about res.locals.userId so even handlers with RequestHandler typings also have res.locals.userId
//     namespace Express {
//         interface Locals {
//             userId?: string;
//         }
//     }
// }

export interface AuthLocals {
    // This allows us to only apply res.locals.userId typing to certain handlers we are damn sure that will be used after authentication
    userId: string;
}

export type BodyHandler<B> = RequestHandler<unknown, unknown, B>;
export type QueryHandler<Q> = RequestHandler<unknown, unknown, unknown, Q>;
export type ParamsHandler<P> = RequestHandler<P>;
export type TypedHandler<B = unknown, Q = unknown, P = unknown, L extends Record<string, any> = Record<string, any>> = RequestHandler<
    P,
    unknown,
    B,
    Q,
    L
>;

export type ProtectedHandler<B = unknown, Q = unknown, P = unknown> = TypedHandler<B, Q, P, AuthLocals>;
