import { json, type Request, type Response, type NextFunction } from 'express';

export function bodyParserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path.startsWith('/auth/')) {
    next();
  } else {
    json()(req, res, next);
  }
}
