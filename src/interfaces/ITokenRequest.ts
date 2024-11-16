import { Request } from 'express';

/** Request that contains token and basic user info */
interface ITokenRequest extends Request {
  userId?: number;
  username?: string;
  token?: string;
}

export default ITokenRequest;
