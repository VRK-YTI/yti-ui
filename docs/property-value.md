# Property Value

You will find `Property[]` as a type everywhere. This is because of how the data
is stored in the back end.

E.g. objects can have a property called `prefLabel`. It will look like this:

```ts
interface Obj {
  properties: {
    prefLabel: Property[];
  };
}

const obj: Obj = {
  properties: {
    prefLabel: [
      {
        lang: 'en',
        value: "Object's name",
        regex: '(?s)^.*$',
      },
      {
        lang: 'fi',
        value: 'Objektin nimi',
        regex: '(?s)^.*$',
      },
    ],
  },
};
```

# Usage

When you want to render a property use `PropertyValue` component or
`getPropertyValue` function. Prefer `PropertyValue` component where possible and
only use `getPropertyValue` in situations where you can't use the component.
`PropertyValue` component is a wrapper for `getPropertyValue` function so they
are the same but `PropertyValue` component is a bit easier to use.

In general, using `PropertyValue` component is pretty straightforward. It takes
at least the property (actually `Property[]`) as a prop and then it
automatically renders the correct text based on the current language of the UI.

```tsx
// This will render either "Object's name" or "Objektin nimi" depending on
// the current language.
<PropertyValue property={obj.properties.prefLabel} />
```

[Read more](../terminology-ui/src/common/components/property-value/property-value.md)
in its documentation.
