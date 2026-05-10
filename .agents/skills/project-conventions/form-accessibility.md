# Form Accessibility Chain

A form field is *not* accessible just because it has a `<label>` and an
`<input>` next to each other in JSX. The label has to reference the input
by id (`htmlFor`), and any helper/error text has to be linked via
`aria-describedby` so assistive tech announces it when the input is focused.
Validation state is conveyed via `aria-invalid`.

In `src/components/ui/form/`, each leaf (`FormLabel`, `FormInput`,
`FormError`, `FormCheckbox`) is independent and has no shared id, so the
chain is broken by default.

## The Chain

```html
<label for="email-field">Email</label>
<input
  id="email-field"
  aria-describedby="email-field-error email-field-hint"
  aria-invalid="true"
/>
<p id="email-field-hint">We'll never share your email.</p>
<p id="email-field-error">Email is required.</p>
```

A user on VoiceOver/NVDA hearing the input announced will hear: *"Email,
required, edit text, invalid entry, We'll never share your email, Email is
required."* If the chain is broken, they hear *"edit text"*.

## The Pattern (FormField context)

The right way to enforce the chain across many fields is a `FormField`
provider that allocates a single id per field and exposes it to children:

```tsx
// form-field.context.ts
type FormFieldContextValue = {
  id: string
  hintId: string
  errorId: string
  describedBy: string                  // join of hintId + errorId, omitting empties
  invalid: boolean
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function useFormFieldContext(): FormFieldContextValue {
  const ctx = useContext(FormFieldContext)
  if (!ctx) throw new Error('Form sub-components must be rendered inside <Form.Field>')
  return ctx
}
```

```tsx
// form-field.tsx
export function FormField({ children, invalid = false }: FormFieldProps) {
  const id = useId()
  const value = useMemo<FormFieldContextValue>(() => ({
    id,
    hintId: `${id}-hint`,
    errorId: `${id}-error`,
    describedBy: invalid ? `${id}-error` : `${id}-hint`,
    invalid,
  }), [id, invalid])

  return (
    <FormFieldContext.Provider value={value}>
      <div className="flex flex-col gap-1">{children}</div>
    </FormFieldContext.Provider>
  )
}
```

```tsx
// form-label.tsx
export function FormLabel(props: ComponentProps<'label'>) {
  const { id } = useFormFieldContext()
  return <label htmlFor={id} {...props} />
}

// form-input.tsx
export function FormInput(props: ComponentProps<'input'>) {
  const { id, describedBy, invalid } = useFormFieldContext()
  return (
    <input
      id={id}
      aria-describedby={describedBy || undefined}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

// form-error.tsx
export function FormError({ children, ...props }: ComponentProps<'p'>) {
  const { errorId, invalid } = useFormFieldContext()
  if (!invalid) return null
  return <p id={errorId} role="alert" {...props}>{children}</p>
}
```

The consumer writes:

```tsx
<Form.Field invalid={!!errors.email}>
  <Form.Label>Email</Form.Label>
  <Form.Input type="email" {...register('email')} />
  <Form.Error>{errors.email?.message}</Form.Error>
</Form.Field>
```

…and the chain is wired automatically.

## Rules

1. Every field rendered inside the `Form` compound must be inside a
   `<Form.Field>`. The `useFormFieldContext` guard hook enforces this at
   render time.
2. `htmlFor` / `id` are *never* hand-written — they're allocated by
   `useId()` inside `FormField`. Hand-writing leads to duplicates on lists.
3. `aria-describedby` joins **all** describing elements (hint + error). If
   you have both, use a space-joined string.
4. `aria-invalid` is set only when truthy — passing `aria-invalid="false"`
   is fine but noisy; prefer `undefined` when valid.
5. Error nodes use `role="alert"` so screen readers announce them when they
   appear, not just when focus enters the field.

## Why Not Just Pass `id` as a Prop?

You can — and that's worse. Once five different consumers are wiring three
ids each, drift is guaranteed. The context centralizes the contract:
there's exactly one place where ids are allocated and one place where
they're consumed. The `react-hook-form` integration also benefits — register
the field by name, let `FormField` handle the ids.

## Detection

```sh
# Inputs without an id are usually unlabeled to AT.
rg "<input" src/components/ui/form/ | rg -v "id="
# FormLabel without htmlFor — same problem from the other side.
rg "<label" src/components/ui/form/ | rg -v "htmlFor"
# FormError without role="alert" — error is rendered but not announced.
rg "form-error" src/components/ui/form/
```

## Reference Inspirations

- React Aria Components' `TextField` — same pattern, more thorough variants.
- Radix `Form` primitives — same pattern, headless.
- shadcn/ui `Form` — same pattern, opinionated.
