/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { setYear, setMonth } from 'date-fns';
import { prefix, defaultProps } from '../utils';
import composeFunctions from '../utils/composeFunctions';

class MonthDropdownItem extends React.PureComponent {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    month: PropTypes.number,
    year: PropTypes.number,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    month: 0
  };

  handleClick = (event) => {
    const { onSelect, month, year, date, disabled } = this.props;

    if (disabled) {
      return;
    }

    if (year && month && date) {
      const nextMonth = composeFunctions(
        (d) => setYear(d, year),
        (d) => setMonth(d, month - 1)
      )(date);
      onSelect && onSelect(nextMonth, event);
    }
  };

  render() {
    const { className, classPrefix, month, active, disabled } = this.props;

    const addPrefix = prefix(classPrefix);
    const classes = classNames(classPrefix, className, {
      [addPrefix('active')]: active,
      disabled
    });

    return (
      <div
        className={classes}
        onClick={this.handleClick}
        key={month}
        role="button"
        tabIndex="-1"
      >
        <span className={addPrefix('content')}>{month}</span>
      </div>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'calendar-month-dropdown-cell'
});
export default enhance(MonthDropdownItem);
