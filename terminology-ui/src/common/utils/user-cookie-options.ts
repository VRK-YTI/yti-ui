import { SessionOptions } from 'iron-session';
import { User } from 'yti-common-ui/interfaces/user.interface';

export interface SessionData {
  user?: User;
  cookies?: { [value: string]: string };
}

export const sessionOptions: SessionOptions = {
  cookieName: 'user-session-cookie',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: undefined,
  },
  password: process.env.SECRET_COOKIE_PASSWORD ?? '',
};
