import '@testing-library/jest-dom';
import * as crypto from 'crypto';
import { TextEncoder, TextDecoder } from 'util';

process.env.DATAMODE_API_URL = 'http://datamodel-api.invalid/datamodel-api';
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

// Workaround for session.save()
//https://stackoverflow.com/a/68468204
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
