import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from 'react-md';
import Button from '../../../../site/button';
import ViewListIcon from '../../../../site/icons/ViewList';
import CloseIcon from '../../../../site/icons/Close';

import { toolbar, menuToggle } from './toolbar.module.scss';

class NavDrawerToolbar extends React.PureComponent {
  render() {
    const { title, onMenuOpen, onMenuClose, actions, menuIsOpen } = this.props;

    return (
      <Toolbar
        className={toolbar}
        nav={
          <Button
            className={menuToggle}
            primary
            flat
            onClick={menuIsOpen ? onMenuClose : onMenuOpen}
            iconEl={menuIsOpen ? <CloseIcon /> : <ViewListIcon />}
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
};
