# UseConfirmBeforeLeavingPage hook

UseConfirmBeforeLeavingPage hook is used in pages with forms to confirm before
the user leaves the page if there are unsaved changes on the page. It injects
both next/router for in-page navigation and window's beforeunload event for
actual page changes. It handles all situations where the user can leave the
page.

There is still at least one caveat. If the user is using a mobile browser and
closes the browser in the background then this confirmation is not performed at
all.

Remember that you don't need this hook on every page. It clears its state
automatically so this behavior will be disabled if the hook is not used on some
page.

## Usage

Using useConfirmBeforeLeavePage is quite simple. All you need is to call it and
pass the default state (enabled or disabled) as an argument. Then you need to
call the returned `enableConfirmation` and `disableConfirmation` functions when
you want to enable or disable the behavior.

```tsx
const { enableConfirmation, disableConfirmation } =
  useConfirmBeforeLeavingPage('enabled');
```

Both of these callback functions are idempotent so just call them as many times
as you like. For example, you would like to call `enableConfirmation` every
time the data in your form has changed and `disableConfirmation` when saving or
discarding the form. Unlike normal stateful hooks, useConfirmBeforeLeavingPage
applies changes immediately. So you don't need to wait until the next render
for changes to take effect. That's why you can call `disableConfirmation` and
right after it triggers a page change.

```tsx
const updateName = (name: string) => {
  setName(name);
  enableConfirmation();
};

const saveForm = () => {
  disableConfirmation();
  save();
};

const cancelForm = () => {
  disableConfirmation();
  router.back();
};

<form>
  <input name="name" value={name} onChange={updateName} />

  <button onClick={saveForm}>Save</button>
  <button onClick={cancelForm}>Cancel</button>
</form>;
```
