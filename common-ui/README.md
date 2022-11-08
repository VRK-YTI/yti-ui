## Information

YTI Common components library

## Getting started

To use common-ui you will need to run `npm i` first in the root folder so that package.json and are present package-lock.json.
After that you will need to install its node modules. You can do this by running `npm i` inside the common-ui folder.

### tsconfig

Open the `tsconfig.json` file of your project and add make sure this line is added

```json
  "compilerOptions": {
    ...
    "paths": {
      ...
      "@common/*": ["../common-ui/*"]
    }
  }
```

### Next.js transpiling

The common library will need to be transpiled so it can run.
This is done by adding the dependency `next-transpile-modules` to your package.json.

In `next.config.js` you will need to add the common library to the transpiling options with
`const withTM = require("next-transpile-modules")(["../common-ui"]);`

and `const nextConfig = withTM({...})`

### Done

After this is done you should be able to import files from common-ui as if it were a normal dependency.
