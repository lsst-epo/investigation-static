import React from 'reactn';

export const WithProgress = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    render() {
      const { visitedPages, pageProgress, investigationProgress } = this.global;

      return (
        <ComposedComponent
          {...this.props}
          investigationProgress={investigationProgress}
          pageProgress={pageProgress}
          visitedPages={visitedPages}
        />
      );
    }
  }

  return WrappedComponent;
};

export default WithProgress;
