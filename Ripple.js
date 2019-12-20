/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-properties */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/require-default-props */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'rsuite-utils/lib/Animation/Transition';
import { getOffset, on } from 'dom-lib';
import { defaultProps, prefix } from './utils';

class Ripple extends React.Component {
  constructor(props) {
    super(props);
    this.mousedownListener = null;
    this.getPosition = (event) => {
      const offset = getOffset(this.triggerRef.current);
      const offsetX = (event.pageX || 0) - offset.left;
      const offsetY = (event.pageY || 0) - offset.top;
      const radiusX = Math.max(offset.width - offsetX, offsetX);
      const radiusY = Math.max(offset.height - offsetY, offsetY);
      const radius = Math.sqrt(Math.pow(radiusX, 2) + Math.pow(radiusY, 2));
      return {
        width: radius * 2,
        height: radius * 2,
        left: offsetX - radius,
        top: offsetY - radius
      };
    };
    this.handleMouseDown = (event) => {
      const position = this.getPosition(event);
      const { onMouseDown } = this.props;
      this.setState({
        rippling: true,
        position
      });
      onMouseDown && onMouseDown(position, event);
    };
    this.handleRippled = () => {
      this.setState({
        rippling: false
      });
    };
    this.addPrefix = (name) => prefix(this.props.classPrefix)(name);
    this.state = {
      rippling: false,
      position: {}
    };
    this.triggerRef = React.createRef();
  }

  componentDidMount() {
    if (this.triggerRef.current) {
      this.mousedownListener = on(
        this.triggerRef.current.parentNode,
        'mousedown',
        this.handleMouseDown
      );
    }
  }
  componentWillUnmount() {
    if (this.mousedownListener) {
      this.mousedownListener.off();
    }
  }

  render() {
    const { className, classPrefix } = this.props;
    const classes = classNames(this.addPrefix('pond'), className);
    const { position, rippling } = this.state;

    return (
      <span className={classes} ref={this.triggerRef}>
        <Transition
          in={rippling}
          enteringClassName={this.addPrefix('rippling')}
          onEntered={this.handleRippled}
        >
          <span className={classPrefix} style={position} />
        </Transition>
      </span>
    );
  }
}
Ripple.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  onMouseDown: PropTypes.func
};
export default defaultProps({
  classPrefix: 'ripple'
})(Ripple);
