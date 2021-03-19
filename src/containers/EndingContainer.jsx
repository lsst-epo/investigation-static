/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import find from 'lodash/find';
import ls from 'local-storage';
import SEO from '../components/seo';
import Button from '../components/site/button/index.js';
import Progress from '../components/site/progress/index.jsx';

@reactn
class LastPage extends React.PureComponent {
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
        <SEO title="Last pageContext" />
        {envInvestigation && (
          <>
            <h1 className="space-bottom heading-primary">
              Congratulations! You&apos;ve reached the end of the{' '}
              {envInvestigation.title} investigation.
            </h1>
            <div style={{ maxWidth: '50%' }}>
              <Progress type="big" />
            </div>
            <br />
            <br />
            <p className="subheading-primary space-bottom">
              Thank you for your participation.
            </p>
            <p className="subheading-primary space-bottom">
              We hope you had as much fun exploring the {envInvestigation.title}{' '}
              investigation as we had building it.
            </p>
            <br />
          </>
        )}
        {envInvestigation ? (
          <div>
            <div className="space-bottom">
              <Button
                flat
                secondary
                swapTheming
                to="/introduction/"
                component={Link}
              >
                Start from the beginning
              </Button>
            </div>
            {isAnswers && (
              <>
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
              </>
            )}
            {isAnswers && (
              <div className="space-bottom">
                <br />
                <br />
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
            )}
          </div>
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

export default LastPage;

LastPage.propTypes = {
  pageContext: PropTypes.object,
};
