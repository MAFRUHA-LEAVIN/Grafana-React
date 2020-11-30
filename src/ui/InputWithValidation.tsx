import React from 'react';
import { FieldProps } from '@grafana/ui/components/Forms/Field';
import { Field, Input } from '@grafana/ui';

/* Extends the FieldProps, but omits several attributes, that are used by the
   class itself:
     children: Input field is already a child
     invalid: used with the validation
*/
interface InputWithValidationProps
  extends Omit<FieldProps, 'children' | 'invalid'> {
  validatorFunc(val: string): boolean;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
  error: string;
}

interface InputWithValidationState {
  validState: boolean;
  currentErrorMsg: string;
}

/**
 * Simple interface that offers inputValidation through arrow functions, unlike
 * Grafana's Field.
 *
 * Input fields that are marked as required are checked that they're not empty.
 */
export class InputWithValidation extends React.PureComponent<
  InputWithValidationProps,
  InputWithValidationState
> {
  static mandatoryEmptyErrorMsg = 'Mandatory input cannot be empty.';

  constructor(props: InputWithValidationProps) {
    super(props);

    this.state = {
      validState: true,
      currentErrorMsg: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  render() {
    const { error, ...props } = this.props;
    const validState = this.state.validState;

    return (
      <Field
        invalid={!validState}
        error={this.state.currentErrorMsg}
        {...props}
      >
        <Input onChange={this.onChange}></Input>
      </Field>
    );
  }

  /**
   * Called when input gets updated.
   * @param event - Input event
   */
  onChange(event: React.FormEvent<HTMLInputElement>) {
    // Calls the one set in the props first
    if (this.props.onChange !== undefined) {
      this.props.onChange(event);
    }
    const value: string = event.currentTarget.value;
    this.checkInputAndSetState(value);
  }

  /**
   * Checks the input value and sets the state accordingly
   * @param newValue - New input value
   */
  checkInputAndSetState(value: string) {
    if (this.props.required !== undefined && value.length === 0) {
      this.setState({
        validState: false,
        currentErrorMsg: InputWithValidation.mandatoryEmptyErrorMsg,
      });
    } else if (this.props.validatorFunc(value)) {
      this.setState({
        validState: true,
        currentErrorMsg: '',
      });
    } else {
      this.setState({
        validState: false,
        currentErrorMsg: this.props.error,
      });
    }
  }
}
