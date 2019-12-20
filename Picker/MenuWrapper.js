/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
/* eslint-disable react/no-find-dom-node */
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';
import { addStyle, getWidth } from 'dom-lib';
import bindElementResize, {
  unbind as unbindElementResize
} from 'element-resize-event';
import { defaultProps } from '../utils';

const omitProps = [
  'placement',
  'shouldUpdatePosition',
  'arrowOffsetLeft',
  'arrowOffsetTop',
  'positionLeft',
  'positionTop',
  'getPositionInstance',
  'getToggleInstance',
  'autoWidth'
];

const resizePlacement = [
  'topStart',
  'topEnd',
  'leftEnd',
  'rightEnd',
  'auto',
  'autoVerticalStart',
  'autoVerticalEnd',
  'autoHorizontalEnd'
];

class MenuWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.menuElementRef = React.createRef();
  }

  componentDidMount() {
    const { autoWidth } = this.props;
    if (resizePlacement.includes(this.props.placement)) {
      bindElementResize(this.menuElementRef.current, this.handleResize);
    }
    if (autoWidth) {
      this.updateMenuStyle();
    }
  }

  componentWillUnmount() {
    if (this.menuElementRef.current) {
      unbindElementResize(this.menuElementRef.current);
    }
  }

  handleResize = () => {
    const { getPositionInstance } = this.props;
    const instance = getPositionInstance ? getPositionInstance() : null;
    if (instance) {
      instance.updatePosition(true);
    }
  };

  updateMenuStyle() {
    const { getToggleInstance } = this.props;

    if (this.menuElementRef.current && getToggleInstance) {
      const instance = getToggleInstance();
      if (instance && instance.toggleRef && instance.toggleRef.current) {
        const width = getWidth(findDOMNode(instance.toggleRef.current));
        addStyle(this.menuElementRef.current, 'min-width', `${width}px`);
      }
    }
  }

  render() {
    const { className, classPrefix, ...rest } = this.props;
    return (
      <div
        {..._.omit(rest, omitProps)}
        ref={this.menuElementRef}
        className={classNames(classPrefix, className)}
      />
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'picker-menu'
});

export default enhance(MenuWrapper);
