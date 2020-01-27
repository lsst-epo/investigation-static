import React from 'react';
import PropTypes from 'prop-types';
import ObservationsTable from './ObservationsTable';

class ObservationsTables extends React.PureComponent {
  render() {
    const { tables, answers } = this.props;
    return (
      <>
        {tables.map(table => (
          <ObservationsTable key={table.id} answers={answers} {...table} />
        ))}
      </>
    );
  }
}

export default ObservationsTables;

ObservationsTables.propTypes = {
  tables: PropTypes.array,
  answers: PropTypes.object,
};
