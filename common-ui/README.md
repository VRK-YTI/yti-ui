## Information

YTI Common components library

## Getting started

To use common-ui you will need to install its node modules. You can do this by
running `npm i` inside the [yti-ui] root folder. `package.json` should
be present in this folder.

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
This is done by adding the following to `next.config.js`.

```json
  "transpilePackages": ["common-ui"]
```

### Done

After this is done you should be able to import files from common-ui as if it were a normal dependency.
