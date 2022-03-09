/* eslint-disable react/jsx-handler-names */
import React from 'react';
import reactn from 'reactn';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
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
              Below we include links and descriptions for the currently
              available full drafts of the classroom investigations.
            </p>
            <p className="copy-primary">
              <a
                href="https://explodingstars.netlify.app/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Exploding Stars
              </a>{' '}
              - Learn how to associate images with light curves, classify the
              light curves of Type Ia and Type IIp SNe, and use the Ia light
              curve to make distance measurements.
            </p>
            <p className="copy-primary">
              <a
                href="https://observableuniverse.netlify.app/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Exploring the Observable Universe
              </a>{' '}
              - Use light to measure distances to far away galaxies.
            </p>
            <p className="copy-primary">
              <a
                href="https://expandinguniverse.netlify.app/"
                rel="noopener noreferrer"
                target="_blank"
              >
                The Expanding Universe
              </a>{' '}
              - Learn how to populate a Hubble diagram from observed
              astronomical images and how the diagram is used to determine the
              expansion of the universe. You also explore the idea of isotropy
              for the expanding universe.
            </p>
            <p className="copy-primary">
              <a
                href="https://surveyingthesolarsystem.netlify.app/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Surveying the Solar System
              </a>{' '}
              - Make observations of newly-discovered solar system objects using
              an orbit visualizer to determine the object type.
            </p>
            <p className="copy-primary">
              <a
                href="https://windowtothestars.netlify.app/#/"
                rel="noopener noreferrer"
                target="_blank"
              >
                A Window to the Stars
              </a>{' '}
              - Examine what types of stars live in our Galaxy and discover
              whether our Sun is a typical star. You also examine the HR
              Diagrams (Temp-Lumo) of several star clusters to look at a range
              of star properties: temperatures, sizes, masses, lifetimes, and
              energy outputs.
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

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
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

LastPage.propTypes = {
  pageContext: PropTypes.object,
};
