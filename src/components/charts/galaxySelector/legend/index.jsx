import React from 'react';
import PropTypes from 'prop-types';
import LegendBox from './LegendBox.jsx';
import { legend } from './legend.module.scss';

class Legend extends React.PureComponent {
  constructor(props) {
    super(props);

    this.boxes = [
      {
        id: 'galaxy',
        valueAccessor: 'velocity',
        label: 'Galaxy Velocity',
      },
      {
        id: 'supernova',
        valueAccessor: 'distance',
        label: 'Supernova Distance',
      },
    ];
  }

  render() {
    const { activeGalaxy, selectedData } = this.props;

    return (
      <>
        {activeGalaxy && (
          <div className={legend} data-testid="gs-legend">
            {this.boxes.map(box => {
              const { name } = activeGalaxy;
              const { id, label, valueAccessor } = box;

              return (
                <LegendBox
                  key={`${id}-${name}`}
                  {...{ label, valueAccessor, selectedData, id }}
                  value={activeGalaxy[valueAccessor]}
                />
              );
            })}
          </div>
        )}
      </>
    );
  }
}
export default Legend;

Legend.propTypes = {
  activeGalaxy: PropTypes.object,
  selectedData: PropTypes.array,
};
