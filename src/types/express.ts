import type { RequestHandler } from "express";
// Handler helpers
export type BodyHandler<B> = RequestHandler<unknown, unknown, B>;
export type QueryHandler<Q> = RequestHandler<unknown, unknown, unknown, Q>;
export type ParamsHandler<P> = RequestHandler<P>;
export type TypedHandler<B = unknown, Q = unknown, P = unknown> = RequestHandler<P, unknown, B, Q>;