import React from 'react';
import { FieldProps } from '@grafana/ui/components/Forms/Field';
import { Field, CascaderOption, Cascader } from '@grafana/ui';

/* Extends the FieldProps, but omits several attributes, that are used by the
   class itself:
     invalid: used with the validation
     children: Cascader is already set as the child
*/
interface CascaderWithValidationProps
  extends Omit<FieldProps, 'invalid' | 'children'> {
  validatorFunc(val: string): boolean;
  options: CascaderOption[];
  onSelect: (val: string) => void;
  initialValue?: string;
}

interface CascaderWithValidationState {
  validState: boolean;
  currentErrorMsg: string;
}

/**
 * Simple interface that offers select validation through arrow functions.
 */
export class CascaderWithValidation extends React.PureComponent<
  CascaderWithValidationProps,
  CascaderWithValidationState
> {
  static mandatoryEmptyErrorMsg = 'Mandatory option not chosen.';

  constructor(props: CascaderWithValidationProps) {
    super(props);

    this.state = {
      validState: true,
      currentErrorMsg: '',
    };

    this.onSelect = this.onSelect.bind(this);
  }

  render() {
    const { error, options, initialValue, ...props } = this.props;
    const validState = this.state.validState;

    return (
      <Field
        invalid={!validState}
        error={this.state.currentErrorMsg}
        {...props}
      >
        <Cascader
          options={options}
          onSelect={this.onSelect}
          initialValue={initialValue}
        ></Cascader>
      </Field>
    );
  }

  /**
   * Called when input gets updated.
   * @param event - Input event
   */
  onSelect(val: string) {
    // Calls the one set in the props first
    if (this.props.onSelect !== undefined) {
      this.props.onSelect(val);
    }
    this.checkSelectAndSetState(val);
  }

  /**
   * Checks the select value and sets the state accordingly
   * @param newValue - New select value
   */
  checkSelectAndSetState(value: string) {
    if (this.props.validatorFunc(value)) {
      this.setState({
        validState: true,
        currentErrorMsg: '',
      });
    } else {
      this.setState({
        validState: false,
        currentErrorMsg: CascaderWithValidation.mandatoryEmptyErrorMsg,
      });
    }
  }
}
