type CheckboxFieldProps = {
  field: any;
  changeField: Function;
  value: string;
}

export const generateVariable = (value: string|string[], options: any[]) => {
  const values = typeof value === 'string' ? (value || '').split(',').filter(val => val) : value;
  const label = options.filter(opt => values.indexOf(`${opt.id}`) !== -1).map(opt => opt.label);
  return label.join(', ');
}

export default function CheckboxField({
  field,
  changeField,
  value,
}: CheckboxFieldProps) {
  return (
    <div>
      {field.options.map((option: any, idx: number) => (
        <div className="form-check" key={idx}>
          <input
            className={`form-check-input ${field.required && !value ? 'is-invalid' : ''}`}
            type="checkbox"
            id={field.slug + idx}
            name={field.slug}
            required={field.required}
            value={option.id}
            onChange={(e) => {
              let values = (value || '').split(',').filter(val => val);
              values = e.target.checked
                ? [...values, e.target.value]
                : values.filter(val => val !== e.target.value);

              const variable = generateVariable(values, field.options);
              changeField(field.id, field.slug, [values.join(','), variable]);
            }}
            checked={(value || '').split(',').indexOf(option.id.toString()) !== -1}
          />
          <label className="form-check-label inline-block text-gray-800" htmlFor={field.slug + idx}>{option.label}</label>
        </div>
      ))}
    </div>
  );
}
