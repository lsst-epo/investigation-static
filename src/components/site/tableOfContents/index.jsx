import React from 'react';
import { Button, Drawer, Toolbar } from 'react-md';
import PropTypes from 'prop-types';
import styles from './table-of-contents.module.scss';

export class TableOfContents extends React.PureComponent {
  constructor(props) {
    super(props);

    const { openSidebar } = props;

    this.state = {
      visible: openSidebar,
    };
  }

  openDrawerLeft = () => {
    this.setState({
      visible: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibility = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;

    return (
      <Drawer
        id={styles.table_of_contents}
        className={styles.tableOfContents}
        visible={visible}
        position="left"
        onVisibilityChange={this.handleVisibility}
        // navItems={tocListItems}
        header={
          <Toolbar
            nav={
              <Button icon onClick={this.closeDrawer}>
                arrow_back
              </Button>
            }
          />
        }
      />
    );
  }
}

TableOfContents.propTypes = {
  openSidebar: PropTypes.bool.isRequired,
};

export default TableOfContents;
