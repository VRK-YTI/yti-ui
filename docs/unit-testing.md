# Unit testing

# Mocks

Usually, when you need mocks you can use `jest.fn` or other Jest's features. But
sometimes you need to implement the mock manually.

In jest mocks are stored under multiple `__mocks__` directories. The most common
use case is to mock some npm package that does side effects like networking.
Read more about mocking from
[jest's documentation](https://jestjs.io/docs/manual-mocks).

Another common use case is to mock things that are not implemented in the test
environment. Otherwise, you will get something like
`TypeError: window.matchMedia is not a function`. Put these mock implementations
in `jest.setup.ts` so that you don't need to import them into every test.
