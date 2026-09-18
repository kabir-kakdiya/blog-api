import type { RequestHandler } from 'express';
import * as v from 'valibot';
import { sendValidationError } from '../lib/response.helpers.ts';

interface ValidationConfig {
  body?: v.GenericSchema;
  query?: v.GenericSchema;
  params?: v.GenericSchema;
}

export default function validate(schemas: ValidationConfig): RequestHandler {
  return (req, res, next) => {
    if (schemas.body) {
      const resBody = v.safeParse(schemas.body, req.body);
      if (!resBody.success) return sendValidationError(res, resBody.issues);
      req.body = resBody.output;
    }

    if (schemas.query) {
      const resQuery = v.safeParse(schemas.query, req.query);
      if (!resQuery.success) return sendValidationError(res, resQuery.issues);
      req.query = resQuery.output as any;
    }

    if (schemas.params) {
      const resParams = v.safeParse(schemas.params, req.params);
      if (!resParams.success) return sendValidationError(res, resParams.issues);
      req.params = resParams.output as any;
    }

    next();
  };
}
