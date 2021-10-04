import { SessionOptions } from 'next-iron-session';

export const userCookieOptions: SessionOptions = {
  cookieName: 'user-session-cookie',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
  password: process.env.SECRET_COOKIE_PASSWORD ?? '',
};
