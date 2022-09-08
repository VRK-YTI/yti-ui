# CreateCommonGetServerSideProps

Pages can define getServerSideProps function. It is run on the server side for
each page load and its result is then passed to the page component. It is widely
used in this project. That's why we have created a function that reduces some
boilerplate by handling the most common things for you.

## Usage

In the simplest use case, just call it and export its result.

```ts
export const getServerSideProps = createCommonGetServerSideProps();
```

It does the following things that you will need on every page:

- It initializes translations.
- It checks if the user uses a mobile device (used in SSR).
- It picks selected environment variables into the page's props.
- It initializes Redux Toolkit's store with session and other details.

### Customizations

What if my use case is not the simplest one? Just pass a callback function to
the `createCommonGetServerSideProps` and do other things there. It's result will
be merged with the other stuff inside the `createCommonGetServerSideProps`.

```ts
export const getServerSideProps = createCommonGetServerSideProps(
  async ({ params, /* ... */ }: LocalHandlerParams) => {
    // Do something here with params, store, etc. Then return at least {} that
    // will be merged to the result of createCommonGetServerSideProps.

    return {};
  }
);
```
