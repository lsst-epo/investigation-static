import React, { PureComponent } from 'react';
import { Button, DialogContainer } from 'react-md';
import ButtonIcon from '../button/ButtonIcon';
import InfoIcon from '../icons/InfoIcon';

export default class SimpleModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  handleShow = () => {
    this.setState({ visible: true });
  };

  handleHide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;

    const actions = [];
    actions.push({
      secondary: true,
      children: 'Cancel',
      onClick: this.handleHide,
    });

    return (
      <div>
        <Button
          icon
          iconEl={<ButtonIcon srText="Help" Icon={InfoIcon} />}
          onClick={this.handleShow}
        />
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.handleHide}
          actions={actions}
          title="Lorem ipsum"
        />
      </div>
    );
  }
}
