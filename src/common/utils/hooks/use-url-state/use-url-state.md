# UseUrlState hook

Next/router handles query parameters automatically and you can store state
directly in the URL. This way users can share a link directly to some view. For
example query parameter `q` is used in search and `page` in pagination.

The current language is not handled by `useUrlState` but instead by next/router.
It is also part of the URL.

## Usage

When you need a value from the URL state, just call the `useUrlState` hook and
use the value from the returned result.

```ts
const { urlState } = useUrlState();
```

### Initial state

Sometimes you need to check if the URL state is in the initial state or not.
This way you can for example disable or enable a button that resets the URL
state.

```ts
const { urlState } = useUrlState();
isInitial(urlState, 'q');
```

### Updating URL state

There are three ways to update the URL state: update, patch and reset. The
update replaces the whole state while the patch updates only a part of it.
Usually, you want to use the patch instead of the update. And of course, reset
clears it to the initial state.

```ts
const { updateUrlState, patchUrlState, resetUrlState } = useUrlState();
```

Changes don't take effect immediately but instead on the next render.
