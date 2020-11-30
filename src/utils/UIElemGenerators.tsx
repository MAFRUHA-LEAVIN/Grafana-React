import React from 'react';
import { CascaderOption, Cascader, Field } from '@grafana/ui';
import { InputWithValidation } from 'ui/InputWithValidation';
import { CascaderWithValidation } from 'ui/CascaderWithValidation';

/* Implements some general functions for generating Grafana's UI components.
   The functions usually take in strings that specify how the components are
   built.
*/

/**
 * Generates a simple CascaderOption[] given a list of strings of options.
 * The CascaderOption[] follow the syntax defined by grafana.
 * @param options - A list of options
 * @returns CascaderOption[]
 */
export function generateCascaderOptions(options: string[]): CascaderOption[] {
  var cascaderOptions: CascaderOption[] = [];

  options.map((option) => {
    const cascaderOption: CascaderOption = {
      label: option,
      value: option,
    };
    cascaderOptions.push(cascaderOption);
  });

  return cascaderOptions;
}

/**
 * Generates an input field with an attached validator.
 * @param label - Short label
 * @param validatorFunc - a function to validate inputs
 * @param errorMsg - An error message when the validation fails
 * @param onChange - A function to be called with every new input
 * @param description - Short description of what the input should include
 * @param isRequired - Can the input be non-empty?
 * @returns InputWithValidation JSX.Element
 */
export function generateInputWithValidation(
  label: string,
  validatorFunc: (val: string) => boolean,
  onChange:
    | ((event: React.FormEvent<HTMLInputElement>) => void)
    | undefined = undefined,
  description: string | undefined = undefined,
  isRequired: boolean | undefined = undefined,
  errorMsg = ''
): JSX.Element {
  return (
    <InputWithValidation
      label={label}
      description={description}
      required={isRequired}
      validatorFunc={validatorFunc}
      onChange={onChange}
      error={errorMsg}
    ></InputWithValidation>
  );
}

/**
 *`Generates an cascader with attached validator.
 * @param options - options for the cascader
 * @param onSelect - Select function for the cascader
 * @param validatorFunc
 * @param label - Short label
 * @param errorMsg - errorMsg for invalid selections
 * @param initialValue - initial value for the cascader
 * @param description - Short description
 * @param isRequired - Is the option required?
 */
export function generateCascaderWithValidation(
  options: CascaderOption[],
  onSelect: (val: string) => void,
  validatorFunc: (val: string) => boolean,
  label: string,
  initialValue: string | undefined = undefined,
  description: string | undefined = undefined,
  isRequired: boolean | undefined = undefined
): JSX.Element {
  return (
    <CascaderWithValidation
      label={label}
      description={description}
      required={isRequired}
      validatorFunc={validatorFunc}
      options={options}
      onSelect={onSelect}
      initialValue={initialValue}
    ></CascaderWithValidation>
  );
}

/**
 * Generates a grafana Field with children.
 * @param label - Short label for the field
 * @param fieldChildren - Field's children
 * @param description - A short description of what the Field is
 * @param isRequired - Is the Field required?
 * @returns Grafana's Field JSX.Element with a child
 */
export function generateField(
  label: string,
  fieldChildren: JSX.Element,
  description: string | undefined = undefined,
  isRequired: boolean | undefined = undefined
): JSX.Element {
  return (
    <p>
      <Field label={label} description={description} required={isRequired}>
        {fieldChildren}
      </Field>
    </p>
  );
}

/**
 * Generates a grafana Cascader given a list of options and an initial value.
 * @param options - Options for the cascading list
 * @param onSelect - Function called with every select
 * @param initialValue - Initial value for the cascader
 * @returns Grafana's Cascader JSX.Element
 */
export function generateCascader(
  options: CascaderOption[],
  onSelect: (val: string) => void,
  initialValue: string | undefined = undefined
): JSX.Element {
  return (
    <Cascader
      options={options}
      allowCustomValue
      initialValue={initialValue}
      onSelect={onSelect}
    />
  );
}
