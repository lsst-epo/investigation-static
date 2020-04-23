import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import GalaxiesPosition3D from '../components/charts/galaxiesPosition3D/index.jsx';

class GalaxiesPosition3DContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const {
      widget: { source },
    } = this.props;

    axios.get(source).then(response => {
      this.setState(prevState => ({
        ...prevState,
        data: response.data,
      }));
    });
  }

  selectionCallback = d => {
    console.log(d); // eslint-disable-line no-console
  };

  render() {
    const { data } = this.state;

    return (
      <div>
        <GalaxiesPosition3D
          className="hubble-plot"
          {...{
            data,
          }}
          selectionCallback={this.selectionCallback}
        />
      </div>
    );
  }
}

GalaxiesPosition3DContainer.propTypes = {
  data: PropTypes.object,
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default GalaxiesPosition3DContainer;
