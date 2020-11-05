import React, { PureComponent } from 'react';
import { Button, DialogContainer } from 'react-md';
import ButtonIcon from '../button/ButtonIcon';
import InfoIcon from '../icons/InfoIcon';
import { helpBtn } from './help-menu.module.scss';

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
        <div className={helpBtn}>
          <Button
            icon
            iconEl={<ButtonIcon srText="Help" Icon={InfoIcon} />}
            onClick={this.handleShow}
          />
        </div>
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.handleHide}
          actions={actions}
          title="Lorem ipsum"
        >
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse at aliquam purus. In lacinia nunc urna. Interdum et
              malesuada fames ac ante ipsum primis in faucibus. Morbi vel nibh
              magna. Donec ultricies vehicula egestas. Praesent dui ex, lobortis
              quis lectus quis, pretium porta felis.
            </p>
          </div>
        </DialogContainer>
      </div>
    );
  }
}
