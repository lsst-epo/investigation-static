import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import HubblePlot2D from '../components/charts/hubblePlot/HubblePlot2D.jsx';

class HubblePlot2DContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    axios.get('/data/galaxies/galaxy_selector.json').then(response => {
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
    const { options } = this.props;

    return (
      <div>
        <HubblePlot2D
          className="hubble-plot"
          {...{
            data,
            options,
          }}
          selectionCallback={this.hubbleSelectionCallback}
        />
      </div>
    );
  }
}

HubblePlot2DContainer.propTypes = {
  // images: PropTypes.array,
  data: PropTypes.object,
  // templatesData: PropTypes.object,
  options: PropTypes.object,
  answers: PropTypes.object,
  activeQuestionId: PropTypes.string,
  activeAnswer: PropTypes.object,
  updateAnswer: PropTypes.func,
  // preSelected: PropTypes.bool,
  // toggleDataPointsVisibility: PropTypes.string,
};

export default HubblePlot2DContainer;
