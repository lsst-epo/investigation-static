import React, { PureComponent } from 'react';
import { Button, DialogContainer } from 'react-md';
import PropTypes from 'prop-types';
import ButtonIcon from '../button/ButtonIcon';
import InfoIcon from '../icons/InfoIcon';
import { widgetBtn, help } from './help-menu.module.scss';
import { renderDef } from '../../../lib/utilities';

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
    const { title, content, modalClasses, helpButtonClasses } = this.props;

    const actions = [];
    actions.push({
      secondary: true,
      children: 'Cancel',
      onClick: this.handleHide,
    });

    return (
      <div>
        <div className={`${widgetBtn} ${help}`}>
          <Button
            icon
            iconEl={<ButtonIcon srText="Help" Icon={InfoIcon} />}
            className={helpButtonClasses}
            onClick={this.handleShow}
          />
        </div>
        <DialogContainer
          id="simple-action-dialog"
          visible={visible}
          onHide={this.handleHide}
          className={modalClasses}
          actions={actions}
          title={title}
        >
          <div dangerouslySetInnerHTML={renderDef(content)}></div>
        </DialogContainer>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  modalClasses: PropTypes.string,
  helpButtonClasses: PropTypes.string,
};
