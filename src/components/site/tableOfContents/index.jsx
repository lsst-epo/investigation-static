import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { Button, Drawer, Toolbar } from 'react-md';
import ArrowLeft from '../icons/ArrowLeft';
import styles from './table-of-contents.module.scss';

class TableOfContents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.navLinks = props.tocLinks.map(link => {
      if (link.divider || link.subheader) return link;

      if (link.to) {
        link.component = Link;
      }
      return link;
    });
  }

  componentDidUpdate() {
    const { openSidebar: visible } = this.props;
    this.handleVisibility(visible);
  }

  handleVisibility = visible => {
    const { toggleSidebar } = this.props;
    toggleSidebar(visible);
    this.setState({ visible });
  };

  render() {
    const { TEMPORARY } = Drawer.DrawerTypes;
    const { visible } = this.state;
    const { toggleSidebar } = this.props;

    const closeBtn = (
      <Button icon onClick={toggleSidebar}>
        <ArrowLeft />
      </Button>
    );
    return (
      <Drawer
        type={TEMPORARY}
        className={styles.tableOfContents}
        visible={visible}
        onVisibilityChange={this.handleVisibility}
        navItems={this.navLinks}
        overlay
        header={
          <Toolbar
            colored
            actions={closeBtn}
            className="md-divider-border md-divider-border--bottom"
          />
        }
      />
    );
  }
}

TableOfContents.propTypes = {
  openSidebar: PropTypes.bool.isRequired,
  tocLinks: PropTypes.array.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default TableOfContents;
