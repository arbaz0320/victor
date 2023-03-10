type RadioFieldProps = {
  field: any;
  changeField: Function;
  value: string;
}

export const generateVariable = (value: string, options: any[]) => {
  return options.filter(option => option.id == value)[0]?.label;
}

export default function RadioField({
  field,
  changeField,
  value,
}: RadioFieldProps) {
  return (
    <div>
      {field.options.map((option: any, idx: number) => (
        <div className="form-check" key={idx}>
          <input
            className={`form-check-input ${field.required && !value ? 'is-invalid' : ''}`}
            type="radio"
            id={field.slug + idx}
            name={field.slug}
            required={field.required}
            value={option.id}
            onChange={(e) =>
              changeField(field.id, field.slug, [e.target.value, option.label])
            }
            checked={option.id == value}
          />
          <label className="form-check-label inline-block text-gray-800" htmlFor={field.slug + idx}>{option.label}</label>
        </div>
      ))}
    </div>
  );
}