/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import find from 'lodash/find';
import ls from 'local-storage';
import SEO from '../components/seo';
import Button from '../components/site/button/index.js';
import EducatorModeToggle from '../components/site/educatorModeToggle';

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

  componentDidMount() {
    this.dispatch.updatePageId(null);
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
                to="/introduction/"
                component={Link}
              >
                Start {envInvestigation.title} Investigation
              </Button>
            </div>
            <div className="space-bottom landing-page-toggle">
              <EducatorModeToggle />
            </div>
            {isAnswers && (
              <>
                <br />
                <br />
                <div className="space-bottom">
                  <p className="copy-primary space-bottom">
                    It looks like you&apos;ve started this investigation before.
                  </p>
                  <div className="space-bottom">
                    <Button
                      flat
                      secondary
                      swapTheming
                      to="/qa-review/"
                      component={Link}
                    >
                      Review Your Answers
                    </Button>
                  </div>
                  <Button
                    flat
                    primary
                    swapTheming
                    onClick={this.dispatch.empty}
                    style={{ backgroundColor: '#df0039' }}
                  >
                    Clear all saved answers
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
                <Link to={`/${id}/introduction/`}>
                  Go to {title} Investigation
                </Link>
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
