/* eslint-disable react/sort-comp */
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { format } from 'date-fns';
import { prefix, defaultProps } from '../utils';
import IntlContext from '../IntlProvider/IntlContext';
import LeftIcon from '../Icons/LeftIcon';
import RightIcon from '../Icons/RightIcon';

class Header extends React.PureComponent {
  static contextType = IntlContext;

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    disabledBackward: PropTypes.bool,
    disabledForword: PropTypes.bool,
    onMoveForword: PropTypes.func,
    onMoveBackward: PropTypes.func,
    onToggleMonthDropdown: PropTypes.func,
    onToggleTimeDropdown: PropTypes.func,
    showMonth: PropTypes.bool,
    showDate: PropTypes.bool,
    showTime: PropTypes.bool,
    format: PropTypes.string,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.func,
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    renderTitle: PropTypes.func,
    renderToolbar: PropTypes.func
  };

  static defaultProps = {
    date: new Date()
  };

  getTimeFormat() {
    const { format } = this.props;
    const timeFormat = [];

    if (!format) {
      return '';
    }

    if (/(H|h)/.test(format)) {
      timeFormat.push('HH');
    }
    if (/m/.test(format)) {
      timeFormat.push('mm');
    }
    if (/s/.test(format)) {
      timeFormat.push('ss');
    }

    return timeFormat.join(':');
  }

  addPrefix = (name) => prefix(this.props.classPrefix)(name);

  renderTitle() {
    const { date, renderTitle } = this.props;

    if (renderTitle) {
      return renderTitle(date);
    }

    return date && format(date, 'MMMM yyyy');
  }

  render() {
    const {
      date,
      disabledBackward,
      disabledForword,
      onMoveForword,
      onMoveBackward,
      onToggleMonthDropdown,
      onToggleTimeDropdown,
      showTime,
      showDate,
      showMonth,
      classPrefix,
      className,
      disabledDate,
      disabledTime,
      renderToolbar
    } = this.props;

    const dateTitleClasses = classNames(
      this.addPrefix('title'),
      this.addPrefix('title-date'),
      {
        [this.addPrefix('error')]: disabledDate && disabledDate(date)
      }
    );

    const timeTitleClasses = classNames(
      this.addPrefix('title'),
      this.addPrefix('title-time'),
      {
        [this.addPrefix('error')]: disabledTime && disabledTime(date)
      }
    );

    const backwardClass = classNames({ disabled: disabledBackward });
    const forwardClass = classNames({ disabled: disabledForword });

    const monthToolbar = (
      <div className={this.addPrefix('month-toolbar')}>
        <button
          disabled={disabledBackward}
          onClick={disabledBackward ? undefined : onMoveBackward}
        >
          <LeftIcon className={backwardClass}/>
        </button>
        <span
          role="button"
          tabIndex={-1}
          className={dateTitleClasses}
          onClick={onToggleMonthDropdown}
        >
          {this.renderTitle()}
        </span>
        <button
          disabled={disabledForword}
          onClick={disabledForword ? undefined : onMoveForword}
        >
          <RightIcon className={forwardClass}/>
        </button>
      </div>
    );

    const hasMonth = showDate || showMonth;
    const classes = classNames(classPrefix, className, {
      [this.addPrefix('has-month')]: hasMonth,
      [this.addPrefix('has-time')]: showTime
    });

    return (
      <div className={classes}>
        {hasMonth && monthToolbar}
        {showTime && (
          <div className={this.addPrefix('time-toolbar')}>
            <span
              role="button"
              tabIndex={-1}
              className={timeTitleClasses}
              onClick={onToggleTimeDropdown}
            >
              {date && format(date, this.getTimeFormat())}
            </span>
          </div>
        )}

        {renderToolbar && renderToolbar(date)}
      </div>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'calendar-header'
});
export default enhance(Header);
