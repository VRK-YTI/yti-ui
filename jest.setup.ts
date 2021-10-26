import '@testing-library/jest-dom';
import * as crypto from 'crypto';

process.env.TERMINOLOGY_API_URL = 'http://terminology-api.invalid/terminology-api';
process.env.AUTH_PROXY_URL = 'http://auth-proxy.invalid';
process.env.SECRET_COOKIE_PASSWORD = crypto.randomBytes(16).toString('hex');
