import React from 'react';
import { css, cx } from 'emotion';
import { Modal, ModalTabsHeader, TabContent } from '@grafana/ui';
import { validateType } from 'utils/typeValidation';
import { EditConfigTab } from 'ui/EditConfigTab';
import { NewConfigTab } from 'ui/NewConfigTab';

/* interface for parsing the analysis options into
   Different text and input fields here or in its own file. Parameter is the
   json for the analysis option, result is the different
   html for the fields.
   User selections on this fields should be saved in an analysis configuration
   Json structure.
   NOTE: might need to be part of the modal class, because the selections need
   to be saved
*/

/* interface for testing a analysis configuration against an analysis option
   here. This should test each user input to make sure they are of the same type
   that the analysis option requires. Parameters are an analysis configuration and option
   Json, result is either a True if everything is well, or error messages for inputa that are wrong.
*/

// Some typing for tabs, move?
interface ShareModalTabProps {
  onDismiss?(): void;
}

//type ShareModalTab = React.ComponentType<ShareModalTabProps>;
type ShareModalTab = any;

interface ShareModalTabModel {
  label: string;
  value: string;
  component: ShareModalTab;
}

/**
 * Tabs for (1) adding and (2) editing or removing configurations.
 */
const editModalTabs: ShareModalTabModel[] = [
  {
    label: 'New Configuration',
    value: 'new_configuration',
    component: NewConfigTab,
  },
  {
    label: 'Edit Configuration',
    value: 'edit_configuration',
    component: EditConfigTab,
  },
];

/**
 * Internal state for EditModal
 */
interface State {
  tabs: any;
  activeTab: string;
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
  addConfiguration(conf: any, properties: any): void;
  /** Function to delete configuration */
  deleteConfiguration(conf: any): void;
  /** Available analysis configurations */
  analysisConfigurations: any;
}

function getInitialState(props: Props): State {
  const tabs = getTabs(props);
  return {
    tabs,
    activeTab: tabs[0].value,
    newConfiguration: null,
    configurationName: '',
  };
}

function getTabs(props: Props) {
  const tabs = [...editModalTabs];

  return tabs;
}
export class EditModal extends React.Component<Props, State> {
  /* Edit modal should have access to the available analysis options,
     And already made analysis configurations. There should be
     Logic for creating a new configuration, and for editing an old one.
  */
  constructor(props: Props) {
    super(props);

    this.state = getInitialState(props);
  }

  analysis_configurations = {
    statistic_example2: {
      display_name: 'statistic_example2',
      command: 'statistics',
      options: {
        Robust_only: 'All',
        Percentile: 50,
      },
    },
  };

  getActiveTab() {
    const { tabs, activeTab } = this.state;
    return tabs.find((t) => t.value === activeTab)!;
  }

  getTabs() {
    return getTabs(this.props);
  }

  onSelectTab = (t: any) => {
    this.setState({ activeTab: t.value });
  };

  renderTitle() {
    const { activeTab } = this.state;
    const title = 'Edit Configurations';
    const tabs = this.getTabs();

    return (
      <ModalTabsHeader
        title={title}
        icon="calculator-alt"
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={this.onSelectTab}
      />
    );
  }

  /**
   * Closes the modal
   */
  onDismiss = () => {
    this.props.onDismiss();
  };

  /**
   * Render the modal
   */
  render() {
    const activeTabModel = this.getActiveTab();
    const ActiveTab = activeTabModel.component;
    return (
      <Modal
        isOpen={true}
        title={this.renderTitle()}
        onDismiss={this.onDismiss}
      >
        <div
          className={cx(
            css`
              width: 500px;
              height: 500px;
            `
          )}
        >
          <TabContent>
            <ActiveTab
              onDismiss={this.onDismiss}
              analysisOptions={this.props.analysisOptions}
              addConfiguration={this.props.addConfiguration}
              deleteConfiguration={this.props.deleteConfiguration}
              analysisConfigurations={this.props.analysisConfigurations}
            />
          </TabContent>
        </div>
      </Modal>
    );
  }
}
