import React from 'react';

export const WithGraphToggler = ComposedComponent => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        activeGraph: 0,
      };
    }

    onGraphSelect = e => {
      const { value } = e.target;

      this.setState(prevState => ({
        ...prevState,
        activeGraph: parseInt(value, 10),
      }));
    };

    render() {
      const { activeGraph } = this.state;

      return (
        <ComposedComponent
          {...this.props}
          activeGraph={activeGraph}
          graphSelectHandler={this.onGraphSelect}
        />
      );
    }
  }

  return WrappedComponent;
};

export default WithGraphToggler;
