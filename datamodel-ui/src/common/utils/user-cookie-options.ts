import { IronSessionOptions } from 'iron-session';

export const userCookieOptions: IronSessionOptions = {
  cookieName: 'user-session-cookie',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: undefined,
  },
  password: process.env.SECRET_COOKIE_PASSWORD ?? '',
};
