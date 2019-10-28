import React from 'react';
import PropTypes from 'prop-types';
import GlobalStore from '../state/GlobalStore';
import Header from '../components/site/header';
// import Footer from '../components/site/footer';

class Layout extends React.Component {
  constructor() {
    super();
    const store = new GlobalStore();

    store.addCallbacks();
    store.addReducers();
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <Header siteTitle="Investigation" />
        <div>
          <main className="container-main">{children}</main>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
