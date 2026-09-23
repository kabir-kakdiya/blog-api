import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Locals {
      userId?: string;
    }
  }
}

export interface AuthLocals {
  userId: string;
}

export type BodyHandler<B> = RequestHandler<unknown, unknown, B>;
export type QueryHandler<Q> = RequestHandler<unknown, unknown, unknown, Q>;
export type ParamsHandler<P> = RequestHandler<P>;
export type TypedHandler<
  B = unknown,
  Q = unknown,
  P = unknown,
  L extends Record<string, any> = Record<string, any>
> = RequestHandler<P, unknown, B, Q, L>;


export type ProtectedHandler<
  B = unknown,
  Q = unknown,
  P = unknown
> = TypedHandler<B, Q, P, AuthLocals>