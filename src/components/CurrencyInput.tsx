import React, { useRef } from 'react';
import { maskCurrency, parseCurrencyToNumber } from '../utils/currencyMask';

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string | number;
  onChangeValue?: (numericValue: number, formattedValue: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeValue,
  onChange,
  className = 'input',
  placeholder = '0,00',
  ...restProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Garante que o valor exibido esteja formatado
  const displayValue = typeof value === 'number' 
    ? maskCurrency(value) 
    : (value ? maskCurrency(value) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const formatted = maskCurrency(rawInput);
    const numeric = parseCurrencyToNumber(formatted);

    if (onChangeValue) {
      onChangeValue(numeric, formatted);
    }

    if (onChange) {
      // Cria evento sintético com o valor formatado
      e.target.value = formatted;
      onChange(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').trim();
    // Se colou número inteiro sem separador decimal (ex: "150000")
    if (/^\d+$/.test(pasteData)) {
      e.preventDefault();
      const num = Number(pasteData);
      const formatted = maskCurrency(num);
      const numeric = parseCurrencyToNumber(formatted);
      if (onChangeValue) {
        onChangeValue(numeric, formatted);
      }
      if (onChange && inputRef.current) {
        inputRef.current.value = formatted;
        const syntheticEvent = Object.create(e) as React.ChangeEvent<HTMLInputElement>;
        syntheticEvent.target = inputRef.current;
        onChange(syntheticEvent);
      }
    }
  };

  return (
    <input
      {...restProps}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      className={className}
      value={displayValue}
      onChange={handleChange}
      onPaste={handlePaste}
      placeholder={placeholder}
    />
  );
};

