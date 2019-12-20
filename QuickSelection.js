/* eslint-disable react/static-property-placement */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FormattedMessage from './IntlProvider/FormattedMessage';
import { prefix, defaultProps } from './utils';

class QuickSelection extends React.PureComponent {
  static propTypes = {
    ranges: PropTypes.array,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    pageDate: PropTypes.array,
    onShortcut: PropTypes.func,
    disabledShortcutButton: PropTypes.func,
    selectedIndex: PropTypes.number,
    tempSelectedIndex: PropTypes.number
  };

  hasLocaleKey = (key) => {
    return this.props.ranges.some((item) => item.label === key);
  };

  addPrefix = (name) => prefix(this.props.classPrefix)(name);

  getSelectedIndex = () => {
    const { selectedIndex, tempSelectedIndex } = this.props;
    if (tempSelectedIndex === null) {
      return selectedIndex;
    }
    if (selectedIndex !== tempSelectedIndex) {
      return tempSelectedIndex;
    }
    return selectedIndex;
  };

  render() {
    const { ranges, onShortcut, disabledShortcutButton, pageDate } = this.props;

    return (
      <div
        className={classNames(
          this.addPrefix('ranges'),
          'kizen-quick-selection'
        )}
      >
        {ranges.map((item, index) => {
          const currSelectedIndex = this.getSelectedIndex();
          const value =
            typeof item.value === 'function'
              ? item.value(pageDate)
              : item.value;
          const disabled =
            disabledShortcutButton && disabledShortcutButton(value);
          const itemClassName = classNames(this.addPrefix('option'), {
            [this.addPrefix('option-disabled')]: disabled,
            selected: currSelectedIndex === index
          });
          return (
            <button
              key={index}
              type="button"
              tabIndex={-1}
              className={itemClassName}
              onClick={() => {
                !disabled && onShortcut(value, index);
              }}
            >
              {this.hasLocaleKey(item.label) ? (
                <FormattedMessage id={item.label} />
              ) : (
                item.label
              )}
            </button>
          );
        })}
      </div>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'picker-quickSelection'
});

export default enhance(QuickSelection);
