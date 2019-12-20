/* eslint-disable react/static-property-placement */
import { getClassNamePrefix } from './prefix';

function defaultProps(props) {
  const { classPrefix, ...rest } = props;

  return (WrappedComponent) => {
    class DefaultPropsComponent extends WrappedComponent {
      // for IE9 & IE10 support
      static contextTypes = WrappedComponent.contextTypes;

      static childContextTypes = WrappedComponent.childContextTypes;

      static getDerivedStateFromProps =
        WrappedComponent.getDerivedStateFromProps;

      static defaultProps = {
        ...WrappedComponent.defaultProps,
        classPrefix: classPrefix
          ? `${getClassNamePrefix()}${classPrefix}`
          : undefined,
        ...rest
      };

      render() {
        return super.render();
      }
    }

    // for IE9 & IE10 support
    if (WrappedComponent.contextType) {
      DefaultPropsComponent.contextType = WrappedComponent.contextType;
    }

    return DefaultPropsComponent;
  };
}

export default defaultProps;
