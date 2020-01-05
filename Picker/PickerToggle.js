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
import DownIcon from '../Icons/DownIcon';
import CalendarIcon from '../Icons/CalendarIcon';

class PickerToggle extends React.Component {
  static propTypes = {
    classPrefix: PropTypes.string,
    hasValue: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    componentClass: PropTypes.elementType,
    active: PropTypes.bool
  };

  static defaultProps = {
    componentClass: 'a',
    tabIndex: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      active: false
    };

    this.toggleRef = React.createRef();
  }

  addPrefix = (name) => prefix(this.props.classPrefix)(name);

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

  render() {
    const {
      componentClass: Component,
      children,
      className,
      hasValue,
      classPrefix,
      active,
      tabIndex,
      onClick
    } = this.props;

    const defaultClassName =
      Component === 'a' ? classPrefix : this.addPrefix('custom');
    const classes = classNames(defaultClassName, className, {
      active: active || this.state.active,
    }, 'kizen-date-range-picker-dropdown');

    return (
      <div className="nav-link kizen-navbar-calendar-icons-wrapper">
        <div className="kizen-navbar-calendar-innerwrapper">
          <i
            onClick={onClick}
            onFocus={createChainedFunction(this.handleFocus)}
            onBlur={createChainedFunction(this.handleBlur)}
            tabIndex={tabIndex}
            ref={this.toggleRef}
            className='fa-layers fa-2x kizen-navbar-calendar-i'
          >
            <CalendarIcon />
          </i>
        </div>
        <span className="kizen-navbar-calendar-daterange">
          {children}
        </span>
        <Ripple />
      </div>
    );

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
        {/* <span className={this.addPrefix(hasValue ? 'value' : 'placeholder')}>
          {children}
        </span>
        <DownIcon className="kizen-date-range-picker-dropdown-icon"/>
        <Ripple /> */}
        <CalendarIcon />
      </Component>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'picker-toggle'
});

export default enhance(PickerToggle);
