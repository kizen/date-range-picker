/* eslint-disable react/static-property-placement */
function withPickerMethods() {
  return (WrappedComponent) => {
    class PickerComponent extends WrappedComponent {
      // for IE9 & IE10 support
      static defaultProps = WrappedComponent.defaultProps;

      static contextTypes = WrappedComponent.contextTypes;

      static childContextTypes = WrappedComponent.childContextTypes;

      static getDerivedStateFromProps =
        WrappedComponent.getDerivedStateFromProps;

      open = () => {
        if (typeof this.handleOpenDropdown === 'function') {
          this.handleOpenDropdown();
        }
      };

      close = () => {
        if (typeof this.handleCloseDropdown === 'function') {
          this.handleCloseDropdown();
        }
      };

      render() {
        return super.render();
      }
    }

    return PickerComponent;
  };
}

export default withPickerMethods;
