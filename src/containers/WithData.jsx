import React from 'react';
import PropTypes from 'prop-types';
import { arrayify } from '../../../lib/utilities';
import API from '../../site/API';

export const WithData = (ComposedComponent, filter) => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        clusterData: [],
      };
    }

    componentDidMount() {
      const { dataPath } = this.props;
      const paths = arrayify(dataPath);

      Promise.all(this.allGets(paths)).then(res => {
        let clusterData = this.combineData(res);

        if (filter) {
          clusterData = clusterData.filter(datum => {
            return !!datum.is_member;
          });
        }

        this.setState(prevState => ({
          ...prevState,
          clusterData,
        }));
      });
    }

    allGets(paths) {
      return paths.map(path => {
        return API.get(path);
      });
    }

    combineData(res) {
      return res
        .map(r => {
          return r.data.stars;
        })
        .flat(1);
    }

    render() {
      const { clusterData } = this.state;
      return <ComposedComponent {...this.props} clusterData={clusterData} />;
    }
  }

  WrappedComponent.propTypes = {
    dataPath: PropTypes.string,
  };

  return WrappedComponent;
};

export default WithData;
