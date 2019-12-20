/* eslint-disable import/prefer-default-export */
import classNames from 'classnames';
import _ from 'lodash';
import placementPolyfill from '../utils/placementPolyfill';

function getToggleWrapperClassName(name, prefix, props, hasValue, classes) {
  const {
    className,
    placement,
    appearance,
    cleanable,
    block,
    disabled,
    countable
  } = props;

  return classNames(
    className,
    prefix(name),
    prefix(appearance),
    prefix('toggle-wrapper'),
    {
      [prefix(
        `placement-${_.kebabCase(placementPolyfill(placement))}`
      )]: placement,
      [prefix('block')]: block,
      [prefix('has-value')]: hasValue,
      [prefix('disabled')]: disabled,
      [prefix('cleanable')]: hasValue && cleanable,
      [prefix('countable')]: countable,
      ...classes
    }
  );
}

export default getToggleWrapperClassName;
