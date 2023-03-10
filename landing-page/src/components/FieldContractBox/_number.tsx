type NumberFieldProps = {
  field: any;
  changeField: Function;
  value: string;
}

export default function NumberField({
  field,
  changeField,
  value,
}: NumberFieldProps) {
  return (
    <input
      type="number"
      name={field.slug}
      required={field.required}
      value={value ? value : ''}
      onChange={(e) =>
        changeField(field.id, field.slug, e.target.value)
      }
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm form-control ${field.required && !value ? 'is-invalid' : ''}`}
    />
  );
}