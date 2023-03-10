type SelectFieldProps = {
  field: any;
  changeField: Function;
  value: string;
}

export const generateVariable = (value: string, options: any[]) => {
  return options.filter(option => option.id == value)[0]?.label;
}

export default function SelectField({
  field,
  changeField,
  value,
}: SelectFieldProps) {
  return (
    <select
      name={field.slug}
      required={field.required}
      value={value ? value : ''}
      onChange={(e) =>
        changeField(field.id, field.slug, [e.target.value, e.target.options[e.target.selectedIndex].text])
      }
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm form-control custom-select ${field.required && !value ? 'is-invalid' : ''}`}
    >
      <option value="" disabled>- SELECIONE -</option>
      {field.options.map((option: any, idx: number) => (
        <option value={option.id} key={idx}>{option.label}</option>
      ))}
    </select>
  );
}