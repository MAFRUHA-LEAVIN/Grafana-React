import React from 'react';
import { css, cx } from 'emotion';
import { Modal } from '@grafana/ui';

interface Props {
  onDismiss(): void;
  html: any;
}
/** Receive html embedable text as a parameter, and then include that in the
 *  modal contents.
 */
export class ResultModal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    console.log(this.props);
  }

  componentDidMount = () => {
    // Code to execute the script in the response.
    const first_script_tag = this.props.html.indexOf('<script>');
    const second_script_tag = this.props.html.indexOf('</script>');
    if (first_script_tag !== -1 && second_script_tag !== -1) {
      const script_tag = this.props.html.slice(
        first_script_tag + 8,
        second_script_tag
      );
      console.log(first_script_tag, second_script_tag, script_tag);
      const executeScript = new Function(script_tag);
      executeScript();
    }
  };
  /**
   * Close the modal
   */
  onDismiss = () => {
    this.setState({
      html: '',
    });
    this.props.onDismiss();
  };
  /**
   * Render the modal
   */
  render() {
    let modalContentClass = cx(
      css`
        width: 100%;
        background-color: black;
        max-height: 93vh;
        overflow-y: auto;
        overflow-x: auto;
      `
    );
    let modalClass = cx(
      css`
        width: 90vw;
        left: 5%;
        top: 5%;
        position: fixed;
      `
    );
    return (
      <Modal
        isOpen={true}
        title={'Result view'}
        className={modalClass}
        onDismiss={this.onDismiss}
      >
        <div className={modalContentClass}>
          <div dangerouslySetInnerHTML={{ __html: this.props.html }}></div>
        </div>
      </Modal>
    );
  }
}
