import React from 'react';
import { CardText } from 'react-md';
import PropTypes from 'prop-types';
import { includes } from 'lodash';
import classnames from 'classnames';
import ConditionalWrapper from '../../../ConditionalWrapper';
import DistanceCalculator from './distanceCalculator/index.jsx';
import KineticEnergyCalculator from './kineticEnergyCalculator/index.jsx';
import MassCalculator from './massCalculator/index.jsx';
import SizeCalculator from './sizeCalculator/index.jsx';
import VolumeCalculator from './volumeCalculator/index.jsx';
import ImpactCalculator from './impactCalculator/index.jsx';
import Card from '../../../site/card';
import { active, qaCard } from '../../styles.module.scss';
import { qaCalc, marginTop } from './qaCalculator.module.scss';

class QACalculator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.calculators = {
      DistanceCalculator,
      KineticEnergyCalculator,
      MassCalculator,
      SizeCalculator,
      VolumeCalculator,
      ImpactCalculator,
    };

    this.state = {
      hasFocus: false,
    };
  }

  updateActive = hasFocus => {
    this.setState(prevState => ({
      ...prevState,
      hasFocus,
    }));
  };

  render() {
    const { question } = this.props;
    const { hasFocus } = this.state;

    const { questionType } = question;
    const cardClasses = classnames(qaCard, qaCalc, marginTop, {
      [active]: hasFocus,
    });

    const QACalc = this.calculators[questionType];

    return (
      <ConditionalWrapper
        condition={!includes(questionType, 'DistanceCalculator')}
        wrapper={children => (
          <Card className={cardClasses}>
            <CardText>{children}</CardText>
          </Card>
        )}
      >
        <QACalc {...this.props} focusCallback={this.updateActive} />
      </ConditionalWrapper>
    );
  }
}

QACalculator.propTypes = {
  activeId: PropTypes.string,
  question: PropTypes.object,
  answerHandler: PropTypes.func,
  answer: PropTypes.object,
};

export default QACalculator;
