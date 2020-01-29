import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import HubblePlot3D from '../components/charts/hubblePlot/HubblePlot3D.jsx';

class HubblePlot3DContainer extends React.PureComponent {
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

  hubbleSelectionCallback = d => {
    console.log(d); // eslint-disable-line no-console
    // const { activeQuestionId } = this.props;
    // if (activeQuestionId) {
    //   updateAnswer(activeQuestionId, activeSupernova);
    // }
  };

  render() {
    const { data } = this.state;

    return (
      <div>
        <HubblePlot3D
          className="hubble-plot"
          {...{
            data,
          }}
          selectionCallback={this.hubbleSelectionCallback}
        />
      </div>
    );
  }
}

HubblePlot3DContainer.propTypes = {
  data: PropTypes.object,
  widget: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default HubblePlot3DContainer;
