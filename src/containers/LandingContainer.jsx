/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import find from 'lodash/find';
import ls from 'local-storage';
import SEO from '../components/seo';
import Button from '../components/site/button/index.js';

@reactn
class InvestigationsLanding extends React.PureComponent {
  constructor(props) {
    super(props);
    const { pageContext } = props;
    const { env: id, investigations } = pageContext;

    this.state = {
      envInvestigation: find(investigations, { id }) || null,
    };
  }

  handleAnswersReset = () => {
    const { envInvestigation } = this.state;
    const globalStateLs = this.global.answers;

    if (globalStateLs) {
      ls(envInvestigation.id, { ...globalStateLs, answers: {} });
    }
  };

  render() {
    const { pageContext } = this.props;
    const { investigations } = pageContext;
    const { envInvestigation } = this.state;
    const isAnswers = Object.keys(this.global.answers).length > 0;

    return (
      <>
        <SEO title="Home" />
        {envInvestigation ? (
          <>
            <p className="copy-primary space-bottom">
              Welcome to the {envInvestigation.title} Investigation.
            </p>
            <div className="space-bottom">
              <Button
                flat
                secondary
                swapTheming
                to={`/${envInvestigation.id}/`}
                component={Link}
              >
                Start {envInvestigation.title} Investigation
              </Button>
            </div>
            {isAnswers && (
              <>
                <br />
                <br />
                <br />
                <div className="space-bottom">
                  <p className="copy-primary space-bottom">
                    It looks like you&apos;ve done this investigation before. If
                    you&apos;d like to start over you can clear your answers.
                  </p>
                  <Button
                    flat
                    primary
                    swapTheming
                    onClick={this.dispatch.empty}
                  >
                    Reset all saved {envInvestigation.title} Investigation
                    answers
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          investigations.map(investigation => {
            const { id, title } = investigation;
            return (
              <div key={id}>
                <Link to={`/${id}/`}>Go to {title} Investigation</Link>
              </div>
            );
          })
        )}
      </>
    );
  }
}

export default InvestigationsLanding;

InvestigationsLanding.propTypes = {
  pageContext: PropTypes.object,
};
