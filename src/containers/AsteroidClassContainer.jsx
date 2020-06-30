import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API from '../lib/API.js';
import AsteroidClass from '../components/charts/asteroidClass/index.jsx';

class AsteroidClassContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      overlayData: null,
      data: null,
      group: null,
      twoUp: false,
    };
  }

  componentDidMount() {
    const {
      widget: { source, sources },
    } = this.props;

    if (sources && !source) {
      axios.all(this.allGets(sources)).then(
        axios.spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });

          this.setState(prevState => ({
            ...prevState,
            data: data.map(d => d.data),
            group: data.map(d => d.group),
            twoUp: true,
          }));
        })
      );
    } else if (source && !sources) {
      API.get(source).then(response => {
        const { data } = response;
        const { data: neos, group } = data;
        this.setState(prevState => ({
          ...prevState,
          data: neos,
          group,
          twoUp: false,
        }));
      });
    } else if (source && sources) {
      axios.all(this.allGets([...sources, source])).then(
        axios.spread((...responses) => {
          const data = responses.map(reponse => {
            const { data: rData } = reponse;
            return rData;
          });
          const overlayData = data.pop();

          this.setState(prevState => ({
            ...prevState,
            overlayData,
            data: data.map(d => d.data),
            group: data.map(d => d.group),
            twoUp: true,
          }));
        })
      );
    }
  }

  allGets(sources) {
    return sources.map(source => {
      return API.get(source);
    });
  }

  render() {
    const { data, overlayData, group, twoUp } = this.state;
    const { options } = this.props;
    const {
      yAxisLabel,
      tooltipAccessors,
      tooltipUnits,
      tooltipLabels,
      preSelected,
    } = options || {};

    return (
      <>
        {twoUp ? (
          <div className="container-flex">
            {data.map((d, i) => {
              const dGroup = group[i] ? group[i].toUpperCase() : null;

              return (
                <div key={`${dGroup}`} className="col-width-50">
                  <h2 className="space-bottom">
                    {dGroup
                      ? `${dGroup} Type Classification`
                      : 'Asteroid Class'}
                  </h2>
                  <AsteroidClass
                    className="brightness-vs-distance"
                    xAxisLabel={dGroup ? `${dGroup} Class` : 'Asteroid Class'}
                    data={d}
                    group={dGroup}
                    {...{
                      overlayData,
                      options,
                      yAxisLabel,
                      tooltipAccessors,
                      tooltipUnits,
                      tooltipLabels,
                      preSelected,
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <h2 className="space-bottom">
              {group
                ? `${group.toUpperCase()} Type Classification `
                : 'Asteroid Class'}
            </h2>
            <AsteroidClass
              className="brightness-vs-distance"
              xAxisLabel={
                group ? `${group.toUpperCase()} Class` : 'Asteroid Class'
              }
              {...{
                overlayData,
                data,
                group,
                options,
                yAxisLabel,
                tooltipAccessors,
                tooltipUnits,
                tooltipLabels,
                preSelected,
              }}
            />
          </div>
        )}
      </>
    );
  }
}

AsteroidClassContainer.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
};

export default AsteroidClassContainer;
