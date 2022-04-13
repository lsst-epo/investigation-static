/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';
import find from 'lodash/find';
import ls from 'local-storage';
import Link from '../components/site/link';
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
    const { pageContext, t } = this.props;
    const { investigations } = pageContext;
    const { envInvestigation } = this.state;
    const investigationTitle = t(`${envInvestigation.id}::title`);
    const isAnswers = Object.keys(this.global.answers).length > 0;

    return (
      <>
        <SEO title={t('interface::locations.home')} />
        {envInvestigation ? (
          <>
            <p className="copy-primary space-bottom">
              <Trans values={{ investigation: investigationTitle }}>
                interface::landing.welcome
              </Trans>
            </p>
            <div className="space-bottom">
              <Button
                flat
                secondary
                swapTheming
                to="/introduction/"
                component={Link}
              >
                <Trans values={{ investigation: investigationTitle }}>
                  interface::landing.start
                </Trans>
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
                    <Trans>interface::landing.already_started</Trans>
                  </p>
                  <div className="space-bottom">
                    <Button
                      flat
                      secondary
                      swapTheming
                      to="/qa-review/"
                      component={Link}
                    >
                      <Trans>interface::actions.review_your_answers</Trans>
                    </Button>
                  </div>
                  <Button
                    flat
                    primary
                    swapTheming
                    onClick={this.dispatch.empty}
                    style={{ backgroundColor: '#df0039' }}
                  >
                    <Trans>interface::actions.clear_answers</Trans>
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
                  <Trans values={{ investigation: title }}>
                    interface::landing.go_to_investigation
                  </Trans>
                </Link>
              </div>
            );
          })
        )}
      </>
    );
  }
}

export default withTranslation()(InvestigationsLanding);

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

InvestigationsLanding.propTypes = {
  pageContext: PropTypes.object,
  t: PropTypes.func,
};
