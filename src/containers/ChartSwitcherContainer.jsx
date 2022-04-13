import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';
import Icon from '../components/site/icons/CustomIcon';
import ConditionalWrapper from '../components/ConditionalWrapper';
import NavDrawer from '../components/charts/shared/navDrawer/index.jsx';
import { widgetTags } from '../components/widgets/widgets-utilities.js';
import style from '../components/charts/shared/navDrawer/nav-drawer.module.scss';

class ChartSwitcherContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      navItems: null,
      activeIndex: 0,
    };
  }

  componentDidMount() {
    const { activeIndex } = this.state;

    this.setState(prevState => ({
      ...prevState,
      navItems: this.generateNavItems(activeIndex),
    }));
  }

  setActiveIndex(index) {
    this.setState(prevState => ({
      ...prevState,
      activeIndex: index,
      navItems: this.generateNavItems(index),
    }));
  }

  generateNavItems(activeIndex) {
    const { widget, t } = this.props;
    const { widgets: nestedWidgets } = widget;

    return nestedWidgets.map((nestedWidget, i) => {
      const { options } = nestedWidget;
      const { xAxisLabel, title, icon, color } = options || {};
      const label = title || xAxisLabel;
      const isActive = activeIndex === i;

      return {
        leftAvatar: (
          <span>
            <Icon name={icon || 'barChart'} />
            <span className="screen-reader-only">
              <Trans>{label}</Trans>
            </span>
          </span>
        ),
        primaryText: t(label),
        className: classnames({
          [style.navItem]: !color,
          [style.activeItem]: isActive,
          [style[`colorizedNavItem${color}`]]: color,
          [style.active]: isActive,
          [style.inactive]: !isActive,
        }),
        onClick: () => this.setActiveIndex(i),
      };
    });
  }

  render() {
    const { navItems, activeIndex } = this.state;
    const { widget, answers, updateAnswer, t } = this.props;
    const { widgets: nestedWidgets } = widget;
    const activeWidget = nestedWidgets[activeIndex];
    const { options: activeOptions } = activeWidget;
    const { title } = activeOptions || {};
    const twoOrMoreNestedWidgets = nestedWidgets.length >= 2;

    return (
      <>
        {navItems && (
          <ConditionalWrapper
            condition={twoOrMoreNestedWidgets}
            wrapper={children => (
              <NavDrawer
                interactableToolbar
                navItems={navItems}
                toolbarTitle={t(title)}
              >
                {children}
              </NavDrawer>
            )}
          >
            <div
              className={classnames({
                [style.paddedDrawerInner]: twoOrMoreNestedWidgets,
              })}
            >
              {nestedWidgets.map((nestedWidget, i) => {
                const { type, options: nestedOptions } = nestedWidget;
                const key = type + i;
                const WidgetTag = widgetTags[type];
                const isActive = activeIndex === i;

                if (!WidgetTag || !isActive) return null;

                const itemClasses = classnames(style.stackedItem, {
                  [style.visibilityActive]: isActive,
                });

                return (
                  <div key={key} className={itemClasses}>
                    {!twoOrMoreNestedWidgets && (
                      <h2>
                        <Trans>{title}</Trans>
                      </h2>
                    )}
                    <WidgetTag
                      type={type}
                      widget={nestedWidget}
                      answers={answers}
                      updateAnswer={updateAnswer}
                      options={nestedOptions}
                      nested
                    />
                  </div>
                );
              })}
            </div>
          </ConditionalWrapper>
        )}
      </>
    );
  }
}

ChartSwitcherContainer.propTypes = {
  widget: PropTypes.object,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation()(ChartSwitcherContainer);
