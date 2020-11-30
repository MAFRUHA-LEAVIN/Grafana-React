import React from 'react';
import { Button } from '@grafana/ui';
import { generateInputWithValidation } from 'utils/UIElemGenerators';
import { ConfigScreen } from 'ui/ConfigScreen';

/**
 * Internal state for new config tab
 */
interface NewConfigTabState {
  /** Json object for new configuration */
  newConfiguration: any;
  /** Name for the new configuration */
  configurationName: string;
}

/**
 * Properties for EditModal
 */
interface Props {
  /** Function for closing the modal on dismiss */
  onDismiss(): void;
  /** Available analysis option commands */
  analysisOptions: any;
  /** Function to add configuration */
  addConfiguration(conf: any): void;
  /** Function to delete configuration */
  deleteConfiguration(conf: any): void;
  /** Available analysis configurations */
  analysisConfigurations: any;
}

export class NewConfigTab extends React.Component<Props, NewConfigTabState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newConfiguration: null,
      configurationName: '',
    };
    // Bind EditModal to the config updaters
    this.updateConfiguration = this.updateConfiguration.bind(this);
    this.addOptionToConfiguration = this.addOptionToConfiguration.bind(this);
  }

  /**
   * Adds a new option to the configuration. Used by ConfigScreen
   * @param optionKey Name for the option
   * @param option    The option value
   */
  addOptionToConfiguration(optionKey: string, option: any) {
    var updatedConf = this.state.newConfiguration;
    updatedConf.options[optionKey] = option;

    this.setState({
      newConfiguration: updatedConf,
    });
  }

  /**
   * Updates the configuration in the state. Used by ConfigScreen.
   * @param updatedConf   Updated configuration
   */
  updateConfiguration(updatedConf: any) {
    this.setState({
      newConfiguration: updatedConf,
    });
  }

  /**
   * Closes the modal
   */
  onDismiss = () => {
    this.props.onDismiss();
  };

  /**
   * Saves a new configuration to the analysis panel
   * @param conf  Configuration to be saved
   */
  saveConfigurations = (conf: any) => {
    conf.display_name = this.state.configurationName;
    this.props.addConfiguration(conf);
    this.onDismiss();
  };

  /**
   * Renders the save button
   */
  renderSaveButton() {
    return (
      <div className={'gf-form-button'}>
        <Button
          onClick={() => {
            this.saveConfigurations(this.state.newConfiguration);
          }}
          title="Save"
          size="lg"
        >
          Save
        </Button>
      </div>
    );
  }

  /**
   * Render option name input field
   */
  renderOptionNameInput() {
    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      this.setState({
        newConfiguration: this.state.newConfiguration,
        configurationName: value,
      });
    };
    const validatorFunc = (val: string) => {
      return val.length !== 0;
    };
    const label = 'Option name';
    const description = 'Give name to the option to save.';
    return (
      <p>
        {generateInputWithValidation(
          label,
          validatorFunc,
          onChange,
          description,
          true
        )}
      </p>
    );
  }

  /**
   * Render the tab
   */
  render() {
    return (
      <div>
        <ConfigScreen
          analysisOptions={this.props.analysisOptions}
          configUpdater={this.updateConfiguration}
          addOptionToConfiguration={this.addOptionToConfiguration}
          configPlaceholder={'Configuration option'}
        ></ConfigScreen>
        {this.renderOptionNameInput()}
        {this.renderSaveButton()}
      </div>
    );
  }
}
