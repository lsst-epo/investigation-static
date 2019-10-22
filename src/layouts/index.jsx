import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../state/GlobalStore';

class LayoutPrimary extends React.Component {
  constructor() {
    super();
    const store = new GlobalStore();

    store.addCallbacks();
    store.addReducers();
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

LayoutPrimary.propTypes = {
  children: PropTypes.node,
};

export default LayoutPrimary;
