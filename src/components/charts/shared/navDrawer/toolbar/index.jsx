import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from 'react-md';
import Button from '../../../../site/button';
import ViewListIcon from '../../../../site/icons/ViewList';
import CloseIcon from '../../../../site/icons/Close';

import { toolbar, menuToggle } from './toolbar.module.scss';
import ButtonIcon from '../../../../site/button/ButtonIcon';

class NavDrawerToolbar extends React.PureComponent {
  icon = (Icon, srText) => <ButtonIcon srText={srText} Icon={Icon} />;

  handleClick = () => {
    const { toggleMenu, menuIsOpen } = this.props;

    toggleMenu(!menuIsOpen);
  };

  render() {
    const {
      title,
      actions,
      menuIsOpen,
      interactableToolbar,
      toolbarStyles,
    } = this.props;

    return (
      <Toolbar
        className={toolbar}
        style={toolbarStyles}
        nav={
          <Button
            className={menuToggle}
            disabled={!interactableToolbar}
            primary
            flat
            onClick={this.handleClick}
            iconEl={
              menuIsOpen
                ? this.icon(CloseIcon, 'Close')
                : this.icon(ViewListIcon, 'Open')
            }
          >
            {menuIsOpen ? 'Close Nav Drawer' : 'Open Nav Drawer'}
          </Button>
        }
        title={title}
        actions={actions}
      />
    );
  }
}
export default NavDrawerToolbar;

NavDrawerToolbar.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.node,
  toggleMenu: PropTypes.func,
  menuIsOpen: PropTypes.bool,
  interactableToolbar: PropTypes.bool,
  toolbarStyles: PropTypes.object,
};
