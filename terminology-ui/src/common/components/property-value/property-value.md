# Property value

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
        regex: '',
      },
      {
        lang: 'fi',
        value: 'Objektin nimi',
        regex: '',
      },
    ],
  },
};
```

## The procedure of resolving matching values

Property is actually a list of values. The main purpose of the `PropertyValue`
is to automate the process of picking the correct value. The most common use
case is that an object has a name in multiple languages and you want to render
it in the same language as the UI. So, if the UI is in English, you want to
render the object's name in English. Or if the UI is in Finnish, you want to
render the object's name in Finnish.

But there are also many caveats. What if the object's name is not defined in
that language? What if there is no name at all? The `PropertyValue` handles
these issues automatically for you. You just need to say that "render this
property here".

So how matching values are resolved? Here is the procedure:

```
1. Try to take values in the following order. If the rule doesn't match any values, try the next rule.
  1.1. Take values whose language matches the specifically given language.
  1.2. Take values whose language matches the current language.
  1.3. Take values whose language is Finnish.
  1.4. Take values whose language is English.
  1.5. Take values whose language is Swedish.
  1.6. If none of the above rules don't match any values, just take all values regardless of their language.
2. Extract the values from properties.
3. Join them, strip HTML markup, and so on.
4. Return the result.
```

## PropertyValue component

Always prefer `PropertyValue` component over `getPropertyValue` function where
possible. It is a wrapper component that uses the latter under the hood and thus
is a bit easier to use.

### Usage

Using `PropertyValue` component is simple. Just give it the property as a prop.
It chooses the correct text and renders it.

```tsx
// This will render either "Object's name" or "Objektin nimi" depending on
// the current language.
<PropertyValue property={obj.properties.prefLabel} />
```

In addition, you can pass other props that manipulate the result.

### Fallback

If the property is an empty array or undefined, it doesn't render any value. But
if you give `fallback` prop, it will be rendered instead.

```tsx
// This will render "No name".
<PropertyValue property={[]} fallback="No name" />
```

### Delimiter

If there can be multiple values in the same language, you can join them all by
defining a delimiter. Otherwise the first will be rendered.

```tsx
// This will render "Value 1, Value 2".
<PropertyValue
  property={[
    { lang: '', value: 'Value 1', regex: '' },
    { lang: '', value: 'Value 2', regex: '' },
  ]}
  delimiter=", "
/>
```

### StripHtml

If there can be HTML markup in the value, you can strip them by adding stipHtml
flag.

```tsx
// This will render "This text contains HTML markup.".
<PropertyValue
  property={[
    { lang: '', value: 'This text contains <b>HTML</b> markup.', regex: '' },
  ]}
  stripHtml
/>
```

### Language

Normally you don't need to give a language prop as its default value is
the current language of the UI. But if you explicitly need another language you
can override this behavior.

```tsx
// This will render "Objektin nimi" regardless of the current language.
<PropertyValue property={obj.properties.prefLabel} language="fi" />
```

### ValueAccessor

Normally you don't need to give valueAccessor. It is a function that takes
property and returns its value. You will need this if you want to render
something else than the value of the property.

```tsx
// This will render "sv".
<PropertyValue
  property={[{ lang: 'sv', value: '', regex: '' }]}
  valueAccessor={(property) => property.lang}
/>
```

## GetPropertyValue function

The `getPropertyValue` function takes almost the same arguments as
the `PropertyValue` component as its props. Language is the only difference.

### Usage

Using `getPropertyValue` function is simple. Just give it the property as
an argument. It returns the first value regardless of the language.

```tsx
// This will return "Object's name" regardless of the current language.
getPropertyValue({ property: obj.properties.prefLabel });
```

### Language

Unlike the `PropertyValue` component the `getPropertyValue` function can't
access the current language. That's why you have to specify the language if you
want to get the result in some specific language.

```tsx
// This will return "Objektin nimi".
getPropertyValue({ property: obj.properties.prefLabel, language: 'fi' });
```
