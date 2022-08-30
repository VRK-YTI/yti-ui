# Unit testing

Frequently asked questions about unit testings have been collected here.

## TypeError: window.matchMedia is not a function

Just add `import '@app/tests/matchMedia.mock';` at the beginning of your test
file. It is already used in some files so just find examples from the code.

## Mocking next/router in tests

To mock `next/router` and set up the URL, you need to use
`next-router-mock`. Just add the following lines:

```ts
import mockRouter from 'next-router-mock';
jest.mock('next/dist/client/router', () => require('next-router-mock'));
```

Then you can set up the URL as you want. Remember that in addition to the path
you can also define query parameters and even hash.

```ts
mockRouter.setCurrentUrl('/');
```
