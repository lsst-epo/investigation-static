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

  render() {
    const {
      title,
      onMenuOpen,
      onMenuClose,
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
            onClick={menuIsOpen ? onMenuClose : onMenuOpen}
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
  onMenuOpen: PropTypes.func,
  onMenuClose: PropTypes.func,
  menuIsOpen: PropTypes.bool,
  interactableToolbar: PropTypes.bool,
  toolbarStyles: PropTypes.object,
};
