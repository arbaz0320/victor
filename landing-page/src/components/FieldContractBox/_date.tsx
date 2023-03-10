import { format, parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

registerLocale('ptBR', ptBR)
setDefaultLocale('ptBR')

type DateFieldProps = {
  field: any;
  changeField: Function;
  value: string;
}

export default function DateField({
  field,
  changeField,
  value,
}: DateFieldProps) {
  return (
    <div className="relative form-floating mb-3">
      <DatePicker
        locale="ptBR"
        dateFormat="P"
        name={field.slug}
        placeholderText="Selecionar Data"
        required={field.required}
        selected={value ? parse(value, 'P', new Date(), { locale: ptBR }) : null}
        onChange={(date: Date) =>
          changeField(field.id, field.slug, format(date, 'P', { locale: ptBR }))
        }
        className={`form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${field.required && !value ? 'is-invalid' : ''}`}
      />
    </div>
  );
}