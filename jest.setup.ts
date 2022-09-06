import '@testing-library/jest-dom';
import * as crypto from 'crypto';

process.env.TERMINOLOGY_API_URL =
  'http://terminology-api.invalid/terminology-api';
process.env.AUTH_PROXY_URL = 'http://auth-proxy.invalid';
process.env.SECRET_COOKIE_PASSWORD = crypto.randomBytes(16).toString('hex');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
