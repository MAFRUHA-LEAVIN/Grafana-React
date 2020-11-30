import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { IconButton, ModalsController, Cascader } from '@grafana/ui';

import { EditModal } from 'ui/EditModal';
import { ResultModal } from 'ui/ResultModal';
import { sendAnalysisRequest, getAnalysisOptions } from 'utils/requestHandler';
import { AnalysisPayload } from 'types';
import { generateCascaderOptions } from 'utils/UIElemGenerators';

/* NOTE: Terminology for comments
  analysis options: the different ways data can be analysed,
    fetch from the analysis server. Each option needs different
    parameters in analysis configuration, and the information for
    these parameters is a part of the analysis option.
  analysis configuration: An corresponding structure to an analysis
    option, with all the required parameters filled with input by the user,
    or some default value.
  analysis server: the server that does the analysis, returning
    embedable results
  analysis request interface: the functions or class that is used to send
    all requests.
*/

/**
 * @param selectedAnalysisConfiguration the analysis configuration being used
 * @param analysisConfigurations saved analysis configurations as JSON
 */
export interface AnalysisPanelOptions {
  selectedAnalysisConfiguration: any;
  analysisConfigurations: any;
}

interface Props extends PanelProps<AnalysisPanelOptions> {}

// The state of the component holding all analysisOptions as JSON
interface State {
  analysisOptions: any;
}

/**
 * The main interface of the panel. Handles opening/closing of modal windows and
 * data flow between the components.
 * @param State state of the component
 * @param Props properties of the component
 */
export class AnalysisPanel extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    // Bind Config addition to this panel
    this.addConfiguration = this.addConfiguration.bind(this);
    // Bind Config deletion to this panel
    this.deleteConfiguration = this.deleteConfiguration.bind(this);
  }

  /**
   * Fetch the analysis options from the analysis server and set them in the
   * component state when the component mounts
   */
  async componentDidMount() {
    // Request is being handled by the analysis request interface
    const analysisOptions = await getAnalysisOptions();
    this.setState({
      analysisOptions: analysisOptions,
    });
    console.log(analysisOptions);
  }

  /**
   * Add an analysis configuration to the component properties
   * @param conf configuration being added as JSON
   * @param properties properties of this component
   */
  addConfiguration(conf: any) {
    const { options } = this.props;
    if (conf.display_name == null) {
      console.log('Cannot add configuration: Invalid configuration format!');
    } else if (options.analysisConfigurations[conf.display_name] != null) {
      console.log('Cannot add configuration: Configuration already exists!');
    } else {
      console.log(conf);
      var newAnalysisConfigurations = options.analysisConfigurations;
      newAnalysisConfigurations[conf.display_name] = conf;
      const new_options: AnalysisPanelOptions = {
        selectedAnalysisConfiguration: options.analysisConfigurations,
        analysisConfigurations: newAnalysisConfigurations,
      };
      this.props.onOptionsChange(new_options);
    }
  }

  /**
   * Delete an analysis configuration from the component properties
   * @param conf configuration being added as JSON
   * @param properties properties of this component
   */
  deleteConfiguration(conf: any) {
    const { options } = this.props;
    if (conf.display_name == null) {
      console.log('Cannot add configuration: Invalid configuration format!');
    } else if (options.analysisConfigurations[conf.display_name] == null) {
      console.log(
        'Cannot delete configuration: Configuration no longer exists!'
      );
    } else {
      var newAnalysisConfigurations = options.analysisConfigurations;
      delete newAnalysisConfigurations[conf.display_name];
      const new_options: AnalysisPanelOptions = {
        selectedAnalysisConfiguration: options.analysisConfigurations,
        analysisConfigurations: newAnalysisConfigurations,
      };
      this.props.onOptionsChange(new_options);
    }
  }

  /**
   * Change the selected analysis configuration and save it in the component properties
   * @param selection the identifier of the configuration being selected
   */
  updateSelectedConfiguration(selection: any) {
    const { options } = this.props;
    const new_options: AnalysisPanelOptions = {
      selectedAnalysisConfiguration: options.analysisConfigurations[selection],
      analysisConfigurations: options.analysisConfigurations,
    };
    this.props.onOptionsChange(new_options);
    console.log(
      'selectedAnalysisOption updated to: ' +
        options.analysisConfigurations[selection]
    );
  }

  /**
   * Generate an analysis request JSON for the analysis request interface
   * @returns payload for analyysis request interface as JSON
   */
  makeAnalysisRequestPayload(): AnalysisPayload {
    // TODO: The series should be determined by the analysis configuration
    const series = this.props.data.series[0];

    const x_values = series.fields[0].values.buffer;
    const y_values = series.fields[1].values.buffer;
    const data_points = [];
    for (let index = 0; index < y_values.length; index++) {
      data_points.push([y_values[index], x_values[index]]);
    }

    if (this.props.options.selectedAnalysisConfiguration === undefined) {
      throw 'No analysis configuration selected';
    }

    const request_payload: AnalysisPayload = {
      rangeData: [
        {
          name: series.name,
          rows: data_points,
        },
      ],
      command: this.props.options.selectedAnalysisConfiguration.command,
      options: this.props.options.selectedAnalysisConfiguration.options,
    };

    return request_payload;
  }

  /**
   * Fetch the analysis results from the analysis server
   * @param showModal modal component control method that shows result the modal
   * @param hideModal modal component control method that hides result the modal
   */
  async getAnalysisResult(showModal: any, hideModal: any) {
    let request_payload: AnalysisPayload;
    try {
      request_payload = this.makeAnalysisRequestPayload();
    } catch (err) {
      // TODO: some kind of prompt to select an analysis
      return;
    }
    // Request is being handled by the analysis request interface
    const html = await sendAnalysisRequest(request_payload);
    /*
    const first_script_tag = html.indexOf("<script>")
    const second_script_tag = html.indexOf("</script>")
    if (first_script_tag != -1 && second_script_tag != -1){
      const script_tag = html.slice(first_script_tag + 8, second_script_tag)
      console.log(first_script_tag, second_script_tag, script_tag)
      const executeScript = new Function(script_tag)
      await executeScript()
    }*/
    showModal(ResultModal, {
      onDismiss: hideModal,
      html: html,
    });
  }

  /**
   * Render a cascader in which the options are analysis configuration names
   * that have been saved to the component properties
   */
  renderCascader() {
    const { options } = this.props;
    var initialOption;
    if (!options.selectedAnalysisConfiguration) {
      initialOption = 'Select an option';
    } else {
      initialOption = options.selectedAnalysisConfiguration.display_name;
    }

    var cascaderOptions: any = [];
    if (options.analysisConfigurations !== {}) {
      cascaderOptions = generateCascaderOptions(
        Object.keys(options.analysisConfigurations)
      );
    }

    return (
      <div>
        <Cascader
          options={cascaderOptions}
          allowCustomValue
          initialValue={initialOption}
          onSelect={(val) => {
            this.updateSelectedConfiguration(val);
          }}
        />
      </div>
    );
  }

  /**
   * Render the edit button and handle passing of the available analysis options
   * and the saved analysis configurations to the edit modal when the button is
   * pressed
   */
  renderEditButton() {
    const { options } = this.props;
    return (
      <div className={'gf-form-btn'}>
        <ModalsController>
          {({ showModal, hideModal }) => (
            <IconButton
              onClick={() => {
                showModal(EditModal, {
                  onDismiss: hideModal,
                  analysisOptions: this.state.analysisOptions,
                  addConfiguration: this.addConfiguration,
                  deleteConfiguration: this.deleteConfiguration,
                  analysisConfigurations: options.analysisConfigurations,
                });
              }}
              name="cog"
              size="xxl"
              surface="panel"
              iconType="default"
              tooltip="Configure analysis"
              tooltipPlacement="auto"
            ></IconButton>
          )}
        </ModalsController>
      </div>
    );
  }

  /**
   * Render the result button and handle the fetching and showing of analysis
   * results when the button is pressed
   */
  renderResultButton() {
    return (
      <div className={'gf-form-btn'}>
        <ModalsController>
          {({ showModal, hideModal }) => (
            <IconButton
              onClick={async () => {
                await this.getAnalysisResult(showModal, hideModal);
              }}
              name="arrow-right"
              size="xxl"
              surface="panel"
              iconType="default"
              tooltip="Execute the analysis"
              tooltipPlacement="auto"
            ></IconButton>
          )}
        </ModalsController>
      </div>
    );
  }

  /**
   * Render the panel components
   */
  render() {
    const { width, height } = this.props;

    return (
      <div style={{ width, height }}>
        {this.renderCascader()}
        {this.renderEditButton()}
        {this.renderResultButton()}
      </div>
    );
  }
}
