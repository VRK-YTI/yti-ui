# Coding conventions

To follow coding conventions we have set up some enforcement tools which make it
easier to follow the coding conventions. These tools are run in CI so your PR
will not be accepted unless you fix found problems. But to make your life
easier, some of those tools can fix problems automatically.

## Project structure

```
docs/             # General documentation
public/           # Served as is. E.g. favicon and robots.txt are here
  locales/        # Translation files
src/              #
  common/         # Default place for components, interfaces, and hooks
    components/   #
    interfaces/   #
    hooks/        #
  layouts/        # Layout components
  modules/        # Place for complex components, interfaces, and hooks
    moduleX/      #
      components/ #
      interfaces/ #
      hooks/      #
  pages/          # Next.js routes
    api/          # Next.js API routes
  store/          # All Redux Toolkit related stuff
  tests/          # Place for tests files if there is no better place
  utils/          # Default place for helpers
```

Now you probably think why there are components, interfaces, and hooks multiple
times. Here is the answer:

Consider `common` to be the default place for all components, interfaces, and
hooks. There are no modules. Then you think that you'd like to group some
components, interfaces, and hooks that belong to signup, sign in, or sign out.
Now you have `auth` module.

Later you think that you'd like to group some components, interfaces, and hooks
that belong to creating or editing terminology. Now you have `terminology-form`
module.

Once you have grouped things under modules, `common` would be something like
a place for components, interfaces, and hooks that don't belong to any module.

## Component structure

When you create a new component, hook, etc. wrap everything under a new
directory called `my-component`. Under it, you can create the following files:

```
my-component/             # Wrapper directory
  index.ts                # Entrypoint that exports components' public API
  my-component.tsx        # The actual component
  my-component.styles.tsx # Styles
  my-component.test.tsx   # Unit tests
  my-component.md         # Internal documentation
```

You may not always need all of these files. And sometimes you need some other
files. Feel free to use the files you need.

Use at least `index` file so that your component can be imported as
`.../components/my-component` instead of
`.../components/my-component/my-component`.

## Module structure

When you create a new module which contains some components, hooks, etc. export
only its public API from `index.ts`. This way module will be more modular
instead of a directory with a set of components. This way the module can hide
its internal things.

## Filenames

Use kebab-case instead of pascal-case everywhere. So use this notation:
`path/to/my-component/my-component.tsx`.

## Tests

Usually, tests should be placed inside the component's directory. There is still
at least one exception: `src/pages`. Next.js thinks everything under `src/pages`
as pages so you can't place tests under that directory.

In these situations, you should place test files under `src/tests` directory.
Also, test utils can be placed there too.
