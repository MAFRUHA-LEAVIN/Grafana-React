import React from 'react';
import {
  generateCascaderOptions,
  generateCascaderWithValidation,
  generateInputWithValidation,
} from 'utils/UIElemGenerators';

export interface ConfigParserState {
  optionName: string;
  options: any;
}

type HTMLEvent = React.FormEvent<HTMLInputElement>;

interface ConfigParserFunctors {
  inputOnChangeGen: (state: ConfigParserState) => (val: HTMLEvent) => void;
  cascaderOnSelectGen: (state: ConfigParserState) => (val: string) => void;
  inputValidatorGen: (state: ConfigParserState) => (val: string) => boolean;
  selectValidatorGen: (state: ConfigParserState) => (val: string) => boolean;
  inputErrorMsgGen: (state: ConfigParserState) => string;
}

/**
 * A Stateful parser for the analysis configuration options. Is able to create
 * UI elements based on the json input.
 */
export class ConfigParser {
  static cascaderDefaultValue = 'Please choose an option';
  functors: ConfigParserFunctors;
  state: ConfigParserState;

  constructor(functors: ConfigParserFunctors) {
    this.functors = functors;
    this.state = { optionName: '', options: null };
  }

  /**
   * Parses the different configurations in the option structure and generates
   * UI elements from them.
   * @param configOptions
   * @returns An array that holds the parsed UI structure
   */
  parseConfigOptions(configOptions: {}): JSX.Element[] {
    var uiComponents: JSX.Element[] = [];

    for (const [optionName, options] of Object.entries(configOptions)) {
      this.state = { optionName, options };
      switch (options.optionType) {
        case 'select':
          uiComponents.push(this.parseSelectType(options, optionName));
          break;

        case 'input':
          uiComponents.push(this.parseInputType(options, optionName));
          break;

        case 'seriesSelect':
          uiComponents.push(this.parseSeriesSelectType(options, optionName));
          break;

        default:
          break;
      }
    }
    return uiComponents;
  }

  /**
   * Generates JSX for 'select' configuration option
   * @param options - Options for the 'selectType'
   * @param optionName - The analysis who has these options.
   */
  parseSelectType(options: any, optionName: string) {
    const cascaderOptions = generateCascaderOptions(options.selectOptions);
    const initValue = this.getCascaderDefaultValue(options, optionName);

    const onSelect = this.functors.cascaderOnSelectGen(this.state);
    const selectValidator = this.functors.selectValidatorGen(this.state);
    const description: string | undefined = options.hasOwnProperty(
      'description'
    )
      ? options.description
      : undefined;

    const optionLabel = options.optionLabel;
    const isRequired: boolean = options.hasOwnProperty('mandatory');

    return (
      <p>
        {generateCascaderWithValidation(
          cascaderOptions,
          onSelect,
          selectValidator,
          optionLabel,
          initValue,
          description,
          isRequired
        )}
      </p>
    );
  }

  /**
   * Generates JSX for 'seriesSelect' configuration option
   * @param option - Options for this 'seriesSelect'
   * @param optionKey - The analysis who has these options.
   */
  parseSeriesSelectType(option: any, optionKey: string) {
    // TODO
    return this.parseInputType(option, optionKey);
  }

  /**
   * Generates JSX for 'input' configuration option
   * @param options - The options for the field
   * @param optionName - The name of the options
   * @returns InputWithValidation JSX.Element
   */
  parseInputType(options: any, optionName: string) {
    const optionLabel = options.optionLabel;
    const isRequired: boolean =
      options.hasOwnProperty('mandatory') && options.mandatary === 'true';
    const description: string | undefined = options.hasOwnProperty(
      'description'
    )
      ? options.description
      : undefined;

    const onChange = this.functors.inputOnChangeGen(this.state);
    const InputValidator = this.functors.inputValidatorGen(this.state);
    const errorMsg: string = this.functors.inputErrorMsgGen(this.state);

    return (
      <p>
        {generateInputWithValidation(
          optionLabel,
          InputValidator,
          onChange,
          description,
          isRequired,
          errorMsg
        )}
      </p>
    );
  }

  /**
   * Get a the default value for a cascader
   * @param options - Options for the cascader
   * @param optionName
   */
  getCascaderDefaultValue(options: any, optionName: string): string {
    if (!options.hasOwnProperty('defaultOptionIndex')) {
      return ConfigParser.cascaderDefaultValue;
    }
    const selectOptions = options.selectOptions;
    const defaultIndex: number = options.defaultOptionIndex;

    if (selectOptions.length <= defaultIndex) {
      console.log(
        'ERROR: defaultIndex for option name ' +
          optionName +
          'goes out of bounds.'
      );
      return ConfigParser.cascaderDefaultValue;
    }

    return selectOptions[defaultIndex];
  }
}
