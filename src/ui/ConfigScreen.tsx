import React from 'react';
import {
  generateCascaderOptions,
  generateCascader,
  generateField,
} from 'utils/UIElemGenerators';
import { ConfigParser, ConfigParserState } from 'utils/ConfigParser';
import { validateType } from 'utils/typeValidation';

interface ConfigScreenProps {
  analysisOptions: any;
  configPlaceholder?: string;
  configUpdater(updatedConf: any): void;
  addOptionToConfiguration(optionKey: string, option: any): void;
}

interface ConfigScreenState {
  chosenOption: string | null;
  fieldsAreValid: boolean;
}

/**
 * Implements the main analysis config options, that can be seen on the
   EditModal window. Generates dropdown menus and input fields dynamically
   based on the chosen main config option.
 */
export class ConfigScreen extends React.Component<
  ConfigScreenProps,
  ConfigScreenState
> {
  // Attributes
  static optionsCascaderDescription =
    'Select an analysis configuration option:';

  static typeErrorMsgs: Map<string, string> = new Map([
    ['string', ''],
    ['number', 'Invalid number.'],
    ['int', 'The input is not representable as an integer'],
    [
      'time',
      'The input is not in format signYears:Days:Hours:Minutes:Seconds:Milliseconds',
    ],
  ]);

  parser: ConfigParser;

  constructor(props: ConfigScreenProps) {
    super(props);

    this.state = {
      chosenOption: null,
      fieldsAreValid: false,
    };

    // Bind ConfigScreen to the generators
    this.parser = new ConfigParser({
      inputOnChangeGen: this.onChangeGenerator.bind(this),
      cascaderOnSelectGen: this.onSelectGenerator.bind(this),
      inputValidatorGen: this.inputValidationGen.bind(this),
      selectValidatorGen: this.selectValidatorGen.bind(this),
      inputErrorMsgGen: ConfigScreen.errorMsgGen,
    });
  }

  render() {
    return (
      <p>
        {this.renderConfigurationOptionCascader()}
        {this.renderConfigOptions()}
      </p>
    );
  }

  /**
   * Constructs and renders the main Cascader, where the user chooses the
   * analysis configuration option.
   */
  renderConfigurationOptionCascader(): JSX.Element {
    const mainOptions: string[] = Object.keys(this.props.analysisOptions);
    const cascaderOptions = generateCascaderOptions(mainOptions);

    const onSelect: (val: string) => void = (val) => {
      var configuration = {
        display_name: null,
        command: val,
        options: {},
      };
      this.setState({ chosenOption: val });
      this.props.configUpdater(configuration);
    };

    return generateField(
      ConfigScreen.optionsCascaderDescription,
      generateCascader(cascaderOptions, onSelect, this.props.configPlaceholder)
    );
  }

  /**
   * Parses the options for the current option and generates the UI structure
   * based on that.
   * @returns The parsed options, or nothing if the chosen option is invalid.
   */
  renderConfigOptions(): JSX.Element | void {
    const chosen_option = this.getChosenOption();
    if (chosen_option === null) {
      return;
    }
    const config_options = this.props.analysisOptions;
    const option_structure = config_options[chosen_option];
    const options = option_structure.options;

    const parsed_structure = this.parser.parseConfigOptions(options);

    return (
      <div>
        <p>{option_structure.description}</p>
        <p>{parsed_structure}</p>
      </div>
    );
  }

  /**
   * Checks that the chosen option is in analysisOptions and returns an option
     based on that check.
     @returns
      if the chosen option was not in analysisOptions:
      ConfigScreen.defaultOption. Otherwise, returns the chosen option.
   */
  getChosenOption(): string | null {
    const config_options = this.props.analysisOptions;
    const chosen_option = this.state.chosenOption;

    if (chosen_option === null || !(chosen_option in config_options)) {
      console.log('ERROR: Chosen config option was not found in options.');
      return null;
    }
    return chosen_option;
  }

  /**
   * Create a closure that the Cascader calls on every select
   */
  onSelectGenerator(parserState: ConfigParserState) {
    return (val: string) => {
      this.props.addOptionToConfiguration(parserState.optionName, val);
    };
  }

  /**
   * Creates a closure that the input field calls with every change.
   */
  onChangeGenerator(parserState: ConfigParserState) {
    // Create a closure that encloses the optionKey
    return (event: React.FormEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      this.props.addOptionToConfiguration(parserState.optionName, value);
    };
  }

  /**
   * Closure for validating input. Also updates the object's state
   * fieldsAreValid.
   */
  inputValidationGen(parserState: ConfigParserState) {
    const inputType = parserState.options.dataType;

    return (val: string) => {
      const isValid = validateType(inputType, val);
      this.setState({ fieldsAreValid: isValid });

      return isValid;
    };
  }

  /**
   * Closure for validating selections. Just like the input one, updates
   * object's state.
   * @param parserState
   */
  selectValidatorGen(parserState: ConfigParserState) {
    const options = parserState.options;
    const isMandatory =
      parserState.options.hasOwnProperty('mandatory') &&
      options.mandatory === 'true';

    return (val: string) => {
      return isMandatory && val !== ConfigParser.cascaderDefaultValue;
    };
  }

  /**
   * Gets the error message for a given input type.
   */
  static errorMsgGen(parserState: ConfigParserState) {
    const inputType: string = parserState.options.dataType;

    if (!ConfigScreen.typeErrorMsgs.has(inputType)) {
      return '';
    }

    return ConfigScreen.typeErrorMsgs.get(inputType) as string;
  }
}
