import React from 'react';

interface TextFieldProps
  extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'ref'> {
  value: string;
  setValue: (nextValue: string) => void;
  multiple?: boolean;
}

export const Input: React.FC<TextFieldProps> = ({ setValue, multiple, ...props }) =>
  multiple ? (
    <textarea
      onChange={(evt): void => {
        setValue(evt.target.value);
      }}
      {...props}
    />
  ) : (
    <input
      onChange={(evt): void => {
        setValue(evt.target.value);
      }}
      {...props}
    />
  );

interface InputWithLabelProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
}

export const InputWithLabel: React.FC<InputWithLabelProps> = ({ label, ...props }) => (
  <label>
    <input {...props} />
    {label}
  </label>
);

interface CheckboxProps extends InputWithLabelProps {
  setChecked: (nextChecked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ setChecked, ...props }) => (
  <InputWithLabel
    type="checkbox"
    onChange={(evt): void => {
      setChecked(evt.target.checked);
    }}
    {...props}
  />
);

type RawOption = string | { value: string; label?: React.ReactNode };

type NormalizedOption = { value: string; label: React.ReactNode };

const normalizeOptions = (rawOptions: RawOption[]): NormalizedOption[] =>
  rawOptions.map((rawOption) =>
    typeof rawOption === 'string'
      ? { value: rawOption, label: rawOption }
      : { ...rawOption, label: rawOption.label ?? rawOption.value }
  );

export const RadioButtons: React.FC<{
  name: string;
  value: string;
  setValue: (nextValue: string) => void;
  options: RawOption[];
}> = ({ name, value, setValue, options }) => (
  <>
    {normalizeOptions(options).map((option) => (
      <InputWithLabel
        key={option.value}
        type="radio"
        name={name}
        checked={option.value === value}
        onChange={(evt): void => {
          setValue(evt.target.value);
        }}
        {...option}
      />
    ))}
  </>
);

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  value: string;
  setValue: (nextValue: string) => void;
  options: RawOption[];
}

export const Select: React.FC<SelectProps> = ({ setValue, options, ...props }) => (
  <select
    onChange={(evt): void => {
      setValue(evt.target.value);
    }}
    {...props}
  >
    {normalizeOptions(options).map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);
