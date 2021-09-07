import * as express from 'express';
import { GeneralError } from '../errors/GeneralError';

export const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: any,
): express.Response => {
  // eslint-disable-next-line no-console
  console.warn(`Caught Error for ${req.path}:`, err.message);

  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json(err.toJSON());
  }

  return next(err);

  // return res.status(500).json({
  //   code: 500,
  //   status: 'Internal Server Error',
  //   message: err.message,
  // });
};
