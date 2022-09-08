# Environment variables

> Warning! I'm not 100% sure of the content of this chapter. Please remove this
> warning once you have verified it.

You can't use environment variables freely in the app. On the client side, only
environment variables prefixed with `NEXT_PUBLIC_` are available. In addition,
`process.env.PRODUCTION` is also available on the client side. Other environment
variables are available on the server side. That's why you should pick
environment variables e.g. in the `getServerSideProps` and pass them to the page
as props.

## Build time variables

Normal environment variables are evaluated at build time. It means that you
can't change their values runtime. Consider the following code:

```ts
// Your code before building
const isProd = process.env.NODE_ENV === 'production';

// Your code after building
const isProd = 'production' === 'production';
```

## Runtime environment variables

There is still a way to use environment variables like you would like to use. It
is called runtime configuration.

In `next.config.js` you should export `serverRuntimeConfiguration` section and
assign values of runtime environment variables.

```ts
module.exports = {
  // ...
  serverRuntimeConfig: {
    mySecret: process.env.MY_SECRET,
  },
  // ...
};
```

Then you can access that configuration on the server side.

```ts
import getConfig from 'next/config';

// Inside e.g. getServerSideProps
const { serverRuntimeConfig } = getConfig();
const mySecret = serverRuntimeConfig.mySecret;
// Now you can pass the value to the page as a prop.
```
