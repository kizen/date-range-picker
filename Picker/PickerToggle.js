/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Ripple from '../Ripple';
import { prefix, defaultProps, createChainedFunction } from '../utils';

class PickerToggle extends React.Component {
  static propTypes = {
    classPrefix: PropTypes.string,
    hasValue: PropTypes.bool,
    cleanable: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    caret: PropTypes.bool,
    componentClass: PropTypes.elementType,
    onClean: PropTypes.func,
    active: PropTypes.bool
  };

  static defaultProps = {
    componentClass: 'a',
    tabIndex: 0,
    caret: true
  };

  constructor(props) {
    super(props);
    this.state = {
      active: false
    };

    this.toggleRef = React.createRef();
  }

  addPrefix = (name) => prefix(this.props.classPrefix)(name);

  handleClean = (event) => {
    this.props.onClean && this.props.onClean(event);
    event.stopPropagation();
    this.handleBlur();
  };

  handleFocus = () => {
    this.setState({ active: true });
  };

  handleBlur = () => {
    this.setState({ active: false });
  };

  getToggleNode = () => {
    return this.toggleRef.current;
  };

  onFocus = () => {
    if (
      typeof this.toggleRef &&
      this.toggleRef.current &&
      this.toggleRef.current.focus === 'function'
    ) {
      this.toggleRef.current.focus();
    }
  };

  renderToggleClean() {
    return (
      <span
        className={this.addPrefix('clean')}
        role="button"
        tabIndex={-1}
        onClick={this.handleClean}
      >
        ✕
      </span>
    );
  }

  render() {
    const {
      componentClass: Component,
      children,
      className,
      hasValue,
      cleanable,
      classPrefix,
      caret,
      active,
      tabIndex,
      onClick
    } = this.props;

    const defaultClassName =
      Component === 'a' ? classPrefix : this.addPrefix('custom');
    const classes = classNames(defaultClassName, className, {
      active: active || this.state.active
    });

    return (
      <Component
        onClick={onClick}
        role="combobox"
        tabIndex={tabIndex}
        className={classes}
        ref={this.toggleRef}
        onFocus={createChainedFunction(this.handleFocus)}
        onBlur={createChainedFunction(this.handleBlur)}
      >
        <span className={this.addPrefix(hasValue ? 'value' : 'placeholder')}>
          {children}
        </span>
        {hasValue && cleanable && this.renderToggleClean()}
        {caret && <span className={this.addPrefix('caret')} />}
        <Ripple />
      </Component>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'picker-toggle'
});

export default enhance(PickerToggle);
