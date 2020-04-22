import React from 'react';
import PropTypes from 'prop-types';
import QACompoundSelect from '../qaCompoundSelect/index.jsx';
import QACompoundTextInput from '../qaCompoundTextInput/index.jsx';

class QACompound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.compoundTypes = {
      compoundInput: QACompoundTextInput,
      compoundSelect: QACompoundSelect,
    };
  }

  render() {
    const { questions } = this.props;
    const { questionType } = questions[0];
    const CompoundComponent = this.compoundTypes[questionType];

    return CompoundComponent ? <CompoundComponent {...this.props} /> : null;
  }
}

QACompound.propTypes = {
  questions: PropTypes.array,
};

export default QACompound;
