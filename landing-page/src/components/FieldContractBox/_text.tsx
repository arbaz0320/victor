import extenso from 'extenso';
import { useRef } from 'react';

type TextFieldProps = {
  field: any;
  changeField: Function;
  value: string;
}

export const generateVariable = (value: string) => {
  const money = value.replace(/^R\$ (.*?)(,)?$/, '$1') || '0';
  return `${value} (${extenso(money, { mode: 'currency' })})`;
}

export default function TextField({
  field,
  changeField,
  value,
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const maskRegex: {[key:string]:RegExp} = {
    cpf: /(\d{1,3})(\d{0,3})(\d{0,3})(\d{0,2})/,
    cnpj: /(\d{1,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/,
    phone: /^(\d{1,2})(\d{0,4}|\d{0,5})(\d{0,4})$/,
    money: /(\d+)[,]?(\d+)?/,
    cep: /(\d{1,5})(\d{0,3})/,
  };
  const maskFormat = (values: string[]) => {
    const isEmpty = (value: string, delimiter: string) => value ? `${delimiter}${value}` : ''
    switch (field.mask) {
      case 'cpf':
        return `${values[1]}${isEmpty(values[2], '.')}${isEmpty(values[3], '.')}${isEmpty(values[4], '-')}`;
      case 'cnpj':
        return `${values[1]}${isEmpty(values[2], '.')}${isEmpty(values[3], '.')}${isEmpty(values[4], '/')}${isEmpty(values[5], '-')}`;
      case 'phone':
        return `${isEmpty(values[1], '(')}${isEmpty(values[2], ') ')}${isEmpty(values[3], '-')}`;
      case 'money':
        return 'R$ ' + parseFloat(values[1]).toLocaleString('pt-BR') + isEmpty(values[2], ',');
      case 'cep':
        return `${values[1]}${isEmpty(values[2], '-')}`;
    }
    return '';
  }

  const handleChange = (e: any) => {
    if (inputRef.current?.value) {
      if (e.nativeEvent.data === ',' && field.mask === 'money') {
        return;
      }

      const inputValue = inputRef.current.value
        .replace(field.mask === 'money' ? /[^\d,]/g : /\D/g, '')
        .match(maskRegex[field.mask]);

      if (inputValue) {
        inputRef.current.value = maskFormat(inputValue);
      }
    }
  };

  return (
    <input
      type={field.type}
      name={field.slug}
      required={field.required}
      value={value ? value : ''}
      ref={inputRef}
      onChange={(e) => {
        field.mask && handleChange(e);
        if (field.mask && field.mask === 'money') {
          const variable = generateVariable(e.target.value);
          changeField(field.id, field.slug, [e.target.value, variable]);
        } else {
          changeField(field.id, field.slug, e.target.value);
        }
      }}
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm form-control ${field.required && !value ? 'is-invalid' : ''}`}
    />
  );
}