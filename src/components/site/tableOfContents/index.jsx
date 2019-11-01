import React from 'react';
import { Button, Drawer, Toolbar } from 'react-md';
import PropTypes from 'prop-types';
import styles from './table-of-contents.module.scss';
import NavItemLink from './NavItemLink';
import ArrowLeft from '../icons/ArrowLeft';

const TO_PREFIX = '/';
const tocListItems = [
  {
    label: 'Inbox',
    to: TO_PREFIX,
    icon: 'inbox',
  },
  {
    label: 'Inbox',
    to: TO_PREFIX + 'test',
    icon: 'inbox',
  },
];
class TableOfContents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  componentDidUpdate() {
    const { openSidebar } = this.props;
    this.toggleDrawer(openSidebar);
  }

  toggleDrawer = bool => {
    this.setState({ visible: bool });
  };

  handleVisibility = visible => {
    this.setState({ visible });
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible } = this.state;

    return (
      <Drawer
        id={styles.table_of_contents}
        type={TEMPORARY}
        className={styles.tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={tocListItems.map(props => (
          <NavItemLink {...props} key={props.to} />
        ))}
      />
    );
  }
}

TableOfContents.propTypes = {
  openSidebar: PropTypes.bool.isRequired,
};

export default TableOfContents;
