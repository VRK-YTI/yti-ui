import toUri from './to-uri';

describe('to-uri', () => {
  it('should return itself if empty', () => {
    const returned = toUri('');
    expect(returned).toBe('');
  });

  it('should return itself when a valid uri', () => {
    const returnedHttp = toUri('http://www.suomi.fi');
    const returnedHttps = toUri('https://www.suomi.fi');

    expect(returnedHttp).toBe('http://www.suomi.fi');
    expect(returnedHttps).toBe('https://www.suomi.fi');
  });

  it('should add https:// in the beginning if missing', () => {
    const returned = toUri('suomi.fi');

    expect(returned).toBe('https://suomi.fi');
  });
});
