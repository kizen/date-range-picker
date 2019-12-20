/* eslint-disable no-unused-expressions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/require-default-props */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { addMonths, isAfter, setDate } from 'date-fns';

import { prefix, defaultProps } from '../utils';
import MonthDropdown from './MonthDropdown';
import Header from './Header';
import View from './View';

class Calendar extends React.Component {
  static propTypes = {
    calendarState: PropTypes.oneOf(['DROP_MONTH', 'DROP_TIME']),
    index: PropTypes.number,
    calendarDate: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    hoverValue: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    format: PropTypes.string,
    isoWeek: PropTypes.bool,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    limitEndYear: PropTypes.number,
    disabledDate: PropTypes.func,
    onMoveForword: PropTypes.func,
    onMoveBackward: PropTypes.func,
    onSelect: PropTypes.func,
    onMouseMove: PropTypes.func,
    onToggleMonthDropdown: PropTypes.func,
    onChangePageDate: PropTypes.func
  };

  static defaultProps = {
    calendarDate: [new Date(), addMonths(new Date(), 1)],
    index: 0
  };

  getPageDate() {
    const { calendarDate, index } = this.props;
    return calendarDate[index];
  }

  handleMoveForword = () => {
    this.props.onMoveForword &&
      this.props.onMoveForword(addMonths(this.getPageDate(), 1));
  };

  handleMoveBackward = () => {
    this.props.onMoveBackward &&
      this.props.onMoveBackward(addMonths(this.getPageDate(), -1));
  };

  disabledBackward = () => {
    const { calendarDate, index } = this.props;
    const after = isAfter(
      setDate(calendarDate[1], 1),
      setDate(addMonths(calendarDate[0], 1), 1)
    );

    if (index === 0) {
      return false;
    }

    if (!after) {
      return true;
    }

    return false;
  };

  disabledForword = () => {
    const { calendarDate, index } = this.props;
    const after = isAfter(
      setDate(calendarDate[1], 1),
      setDate(addMonths(calendarDate[0], 1), 1)
    );

    if (index === 1) {
      return false;
    }

    if (!after) {
      return true;
    }

    return false;
  };

  disabledMonth = (date) => {
    const { calendarDate, value, index, disabledDate } = this.props;
    let after = true;

    if (disabledDate && disabledDate(date, value, 'MONTH')) {
      return true;
    }

    if (index === 1) {
      after = isAfter(date, calendarDate[0]);

      return !after;
    }

    after = isAfter(calendarDate[1], date);

    return !after;
  };

  shouldMountDate(props) {
    const { format } = props || this.props;
    return /Y/.test(format) && /M/.test(format) && /D/.test(format);
  }

  render() {
    const {
      calendarState,
      onSelect,
      onMouseMove,
      onToggleMonthDropdown,
      onChangePageDate,
      disabledDate,
      className,
      value,
      hoverValue,
      isoWeek,
      limitEndYear,
      classPrefix,
      showWeekNumbers
    } = this.props;

    const pageDate = this.getPageDate();
    const dropMonth = calendarState === 'DROP_MONTH';
    const addPrefix = prefix(classPrefix);
    const calendarClasses = classNames(classPrefix, className, {
      [addPrefix('show-month-dropdown')]: dropMonth
    });

    return (
      <div className={calendarClasses}>
        <Header
          showMonth
          date={pageDate}
          disabledBackward={this.disabledBackward()}
          disabledForword={this.disabledForword()}
          onMoveForword={this.handleMoveForword}
          onMoveBackward={this.handleMoveBackward}
          onToggleMonthDropdown={onToggleMonthDropdown}
        />

        <View
          activeDate={pageDate}
          value={value}
          hoverValue={hoverValue}
          onSelect={onSelect}
          onMouseMove={onMouseMove}
          disabledDate={disabledDate}
          isoWeek={isoWeek}
          showWeekNumbers={showWeekNumbers}
        />

        <MonthDropdown
          date={pageDate}
          show={dropMonth}
          disabledMonth={this.disabledMonth}
          onSelect={onChangePageDate}
          limitEndYear={limitEndYear}
        />
      </div>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'calendar'
});

export default enhance(Calendar);
