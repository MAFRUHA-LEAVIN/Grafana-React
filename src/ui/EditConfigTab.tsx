import React from 'react';
import { Button } from '@grafana/ui';
import {
  generateCascaderOptions,
  generateCascader,
  generateField,
} from 'utils/UIElemGenerators';

/**
 * Internal state for new config tab
 */
interface EditConfigTabState {
  /** The configuration that is currently selected */
  selectedConfiguration: any;
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

export class EditConfigTab extends React.Component<Props, EditConfigTabState> {
  static configurationCascaderDescription = 'Select an analysis configuration:';

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedConfiguration: null,
    };
  }

  /**
   * Deletes a new configuration from the analysis panel
   * @param conf  Configuration to be saved
   */
  deleteConfiguration = (conf: any) => {
    this.props.deleteConfiguration(conf);
    this.onDismiss();
  };

  /**
   * Closes the modal
   */
  onDismiss = () => {
    this.props.onDismiss();
  };

  /**
   * Constructs and renders the main Cascader, where the user chooses the
   * analysis configuration.
   */
  renderConfigurationCascader(): JSX.Element {
    const mainOptions: string[] = Object.keys(
      this.props.analysisConfigurations
    );
    const cascaderOptions = generateCascaderOptions(mainOptions);

    const onSelect: (val: string) => void = (val) => {
      var configuration = this.props.analysisConfigurations[val];
      this.setState({ selectedConfiguration: configuration });
    };

    return generateField(
      EditConfigTab.configurationCascaderDescription,
      generateCascader(cascaderOptions, onSelect, 'Select a configuration')
    );
  }

  /**
   * Renders the delete button
   */
  renderDeleteButton() {
    return (
      <div className={'gf-form-button'}>
        <Button
          onClick={() => {
            this.deleteConfiguration(this.state.selectedConfiguration);
          }}
          title="Delete"
          size="lg"
        >
          Delete
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderConfigurationCascader()}
        {this.renderDeleteButton()}
      </div>
    );
  }
}
