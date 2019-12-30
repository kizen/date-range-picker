import './style.css';
import './stylemods.css';
/* eslint-disable no-else-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import compose from 'recompose/compose';
import _ from 'lodash';
import {
  format,
  addDays,
  subDays,
  isBefore,
  isAfter,
  isSameDay,
  isSameMonth,
  addMonths,
  startOfISOWeek,
  endOfISOWeek,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  setYear,
  compareAsc
} from 'date-fns';
import IntlProvider from './IntlProvider';
import DatePicker from './DatePicker';
import {
  defaultProps,
  prefix,
  createChainedFunction,
  withPickerMethods,
  setTimingMargin,
  TYPE
} from './utils';

import {
  PickerToggle,
  MenuWrapper,
  PickerToggleTrigger,
  getToggleWrapperClassName
} from './Picker';
import { PLACEMENT } from './constants';
import QuickSelection from './QuickSelection';

class DateRangePicker extends React.Component {
  static propTypes = {
    appearance: PropTypes.oneOf(['default', 'subtle']),
    value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    defaultValue: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    defaultCalendarValue: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    format: PropTypes.string,
    disabled: PropTypes.bool,
    locale: PropTypes.object,
    hoverRange: PropTypes.oneOfType([
      PropTypes.oneOf(['week', 'month']),
      PropTypes.func
    ]),
    isoWeek: PropTypes.bool,
    oneTap: PropTypes.bool,
    limitEndYear: PropTypes.number,
    className: PropTypes.string,
    menuClassName: PropTypes.string,
    classPrefix: PropTypes.string,
    container: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    containerPadding: PropTypes.number,
    block: PropTypes.bool,
    toggleComponentClass: PropTypes.elementType,
    style: PropTypes.object,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    placement: PropTypes.oneOf(PLACEMENT),
    preventOverflow: PropTypes.bool,
    showWeekNumbers: PropTypes.bool,
    onChange: PropTypes.func,
    onOk: PropTypes.func,
    disabledDate: PropTypes.func,
    onSelect: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onHide: PropTypes.func,
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func,
  };
  static defaultProps = {
    appearance: 'default',
    placement: 'bottomStart',
    limitEndYear: 1000,
    format: 'MM/dd/yy',
    locale: {
      sunday: 'Su',
      monday: 'Mo',
      tuesday: 'Tu',
      wednesday: 'We',
      thursday: 'Th',
      friday: 'Fr',
      saturday: 'Sa',
      ok: 'OK',
      today: 'Today',
      yesterday: 'Yesterday',
      last7Days: 'Last 7 Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      thisMonth: 'This Month',
      last30Days: 'Last 30 Days',
      thisYear: 'This Year',
      allTime: 'All Time'
    },
    ranges: [
      {
        label: 'today',
        value: [
          setTimingMargin(new Date()),
          setTimingMargin(new Date(), 'right')
        ],
        closeOverlay: false,
        customPlaceholderLabel: 'Today'
      },
      {
        label: 'yesterday',
        value: [
          setTimingMargin(addDays(new Date(), -1)),
          setTimingMargin(addDays(new Date(), -1), 'right')
        ],
        closeOverlay: false,
        customPlaceholderLabel: 'Yesterday'
      },
      {
        label: 'thisMonth',
        value: [
          setTimingMargin(startOfMonth(new Date())),
          setTimingMargin(new Date(), 'right')
        ],
        closeOverlay: false,
        customPlaceholderLabel: 'This Month'
      },
      {
        label: 'last7Days',
        value: [
          setTimingMargin(subDays(new Date(), 6)),
          setTimingMargin(new Date(), 'right')
        ],
        closeOverlay: false
      },
      {
        label: 'last30Days',
        value: [
          setTimingMargin(subDays(new Date(), 29)),
          setTimingMargin(new Date(), 'right')
        ],
        closeOverlay: false,
      },
      {
        label: 'thisYear',
        value: [
          setTimingMargin(startOfYear(new Date())),
          setTimingMargin(new Date(), 'right')
        ],
        closeOverlay: false,
        customPlaceholderLabel: 'This Year'
      },
      {
        label: 'allTime',
        value: [
          //hard coded to Jan 1, 2000... for now, potentially a prop to pass in

          setTimingMargin(setYear(startOfYear(new Date()), 2000)),
          setTimingMargin(new Date(), 'right')
        ],
        closeOverlay: false,
        default: true,
        isAllTime: true,
        customPlaceholderLabel: 'All Time'
      }
    ]
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps;

    if (typeof value === 'undefined') {
      return null;
    }

    if (
      (value[0] && !isSameDay(value[0], prevState.value[0])) ||
      (value[1] && !isSameDay(value[1], prevState.value[1]))
    ) {
      return {
        value,
        selectValue: value,
        calendarDate: this.getCalendarDate(value)
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    const { defaultValue, value, defaultCalendarValue, ranges } = props;
    const defaultRangeIndex = ranges.findIndex((element) => {
      return element.default
    });
    const defaultRange = defaultRangeIndex !== -1 ? ranges[defaultRangeIndex].value : null;
    const activeValue = value || defaultValue || defaultRange || [];
    const calendarDate = this.getCalendarDate(value || defaultCalendarValue);

    this.state = {
      value: activeValue,
      selectValue: activeValue,
      doneSelected: true,
      calendarDate,
      hoverValue: [],
      currentHoverDate: null,
      selectedIndex: defaultRangeIndex !== -1 ? defaultRangeIndex : null,
      tempSelectedIndex: null
    };

    // for test
    this.menuContainerRef = React.createRef();
    this.triggerRef = React.createRef();
  }

  getCalendarDate = (value = [], nextSelectedIndex = null) => {
    if (value[0] && value[1]) {
      if (this.isAllTime(nextSelectedIndex)) {
        console.log('IsAllTime');
        return [value[1], addMonths(value[1], 1)];
      }
      const sameMonth = isSameMonth(value[0], value[1]);
      return [value[0], sameMonth ? addMonths(value[1], 1) : value[1]];
    }
    return [new Date(), addMonths(new Date(), 1)];
  }

  isAllTime = (nextSelectedIndex = null) => {
    const { selectedIndex } = this.state;
    const { ranges } = this.props;

    const allTimeRangeIndex = ranges.findIndex(element => {
      return element.isAllTime;
    });

    return nextSelectedIndex !== null ?
      nextSelectedIndex === allTimeRangeIndex :
      selectedIndex === allTimeRangeIndex;
  }

  getValue = () => {
    const { value } = this.props;

    if (typeof value !== 'undefined') {
      return value;
    }

    return this.state.value || [];
  };

  getDateString() {
    const { format: formatType, ranges } = this.props;
    const nextValue = this.getValue();
    const startDate = nextValue && nextValue[0];
    const endDate = nextValue && nextValue[1];

    if (startDate && endDate) {
      const displayValue = [startDate, endDate].sort(compareAsc);

      const matchingRange = ranges.find((element) => {
        return isSameDay(element.value[0], displayValue[0]) && isSameDay(element.value[1], displayValue[1]);
      });
      
      if (matchingRange && matchingRange.customPlaceholderLabel) {
        return matchingRange.customPlaceholderLabel;
      }

      return `${format(displayValue[0], formatType)} - ${format(displayValue[1], formatType)}`;
    }

    return '';
  }

  // hover range presets
  getWeekHoverRange = (date) => {
    const { isoWeek } = this.props;

    if (isoWeek) {
      // set to the first day of this week according to ISO 8601, 12:00 am
      return [startOfISOWeek(date), endOfISOWeek(date)];
    }

    return [startOfWeek(date), endOfWeek(date)];
  };
  getMonthHoverRange = (date) => [startOfMonth(date), endOfMonth(date)];

  getHoverRange(date) {
    const { hoverRange } = this.props;
    if (!hoverRange) {
      return [];
    }

    let hoverRangeFunc = hoverRange;
    if (hoverRange === 'week') {
      hoverRangeFunc = this.getWeekHoverRange;
    }

    if (hoverRangeFunc === 'month') {
      hoverRangeFunc = this.getMonthHoverRange;
    }

    if (typeof hoverRangeFunc !== 'function') {
      return [];
    }

    const hoverValues = hoverRangeFunc(date);
    const isHoverRangeValid =
      hoverValues instanceof Array && hoverValues.length === 2;
    if (!isHoverRangeValid) {
      return [];
    }
    if (isAfter(hoverValues[0], hoverValues[1])) {
      hoverValues.reverse();
    }
    return hoverValues;
  }

  handleChangeCalendarDate = (index, date) => {
    const { calendarDate } = this.state;
    calendarDate[index] = date;

    this.setState({ calendarDate });
  };

  handleCloseDropdown = () => {
    if (this.triggerRef.current) {
      this.triggerRef.current.hide();
    }
  };

  handleOpenDropdown = () => {
    if (this.triggerRef.current) {
      this.triggerRef.current.show();
    }
  };

  handleClear = (value, closeOverlay, event) => {
    this.updateValue(event, value, closeOverlay, true);
  };

  handleQuickSelection = (value, selectedIndex) => {
    this.setState({
      selectValue: value,
      value: value,
      selectedIndex: selectedIndex,
      tempSelectedIndex: null
    });

    this.handleCloseDropdown();
  };

  updateValue(
    event,
    nextSelectValue,
    closeOverlay = true
  ) {
    const { value, selectValue } = this.state;
    const { onChange, ranges } = this.props;
    
    let nextValue = !_.isUndefined(nextSelectValue)
      ? nextSelectValue
      : selectValue;

    //Odd case where you can only select 1 value and right click out of selection to hit apply
    if (nextValue && nextValue[1] === undefined) {
      nextValue[1] = nextValue[0];
    }

    //Remove any extra dates caused by not selecting
    if (nextValue.length > 2) {
      nextValue = nextValue.slice(0, 2);
    }

    if (isAfter(nextValue[0], nextValue[1])) {
      nextValue.reverse();;
    }

    setTimingMargin(nextValue[1], 'right');

    //Find if the selected values are in our ranges
    const rangeExistsIndex = ranges.findIndex((element) => {
      const dates = element.value;
      return (
        isSameDay(dates[0], nextValue[0]) && isSameDay(dates[1], nextValue[1])
      );
    });

    this.setState({
      selectValue: nextValue || [],
      value: nextValue,
      selectedIndex: rangeExistsIndex !== -1 ? rangeExistsIndex : null,
      tempSelectedIndex: null
    });

    if (
      onChange &&
      (!isSameDay(nextValue[0], value[0]) || !isSameDay(nextValue[1], value[1]))
    ) {
      onChange(nextValue, event);
    }

    // `closeOverlay` default value is `true`
    if (closeOverlay !== false) {
      this.handleCloseDropdown();
    }
  }

  handleOK = (event) => {
    this.updateValue(event);
    this.props.onOk && this.props.onOk(this.state.selectValue, event);
  };

  handleChangeSelectValue = (date, event) => {
    //do some checking somewhere in here if it matches with a quick select option?
    const { selectValue, doneSelected, selectedIndex } = this.state;
    const { onSelect, oneTap, ranges } = this.props;
    let nextValue = [];
    let nextHoverValue = this.getHoverRange(date);

    if (doneSelected) {
      if (nextHoverValue.length) {
        nextValue = [nextHoverValue[0], nextHoverValue[1], date];
        nextHoverValue = [nextHoverValue[0], nextHoverValue[1], date];
      } else {
        nextValue = [date, undefined, date];
      }
    } else {
      if (nextHoverValue.length) {
        nextValue = [selectValue[0], selectValue[1]];
      } else {
        nextValue = [selectValue[0], date];
      }

      if (isAfter(nextValue[0], nextValue[1])) {
        nextValue.reverse();
      }

      nextValue[0] = setTimingMargin(nextValue[0]);
      nextValue[1] = setTimingMargin(nextValue[1], 'right');

      //Find if the selected values are in our ranges
      const rangeExistsIndex = ranges.findIndex((element) => {
        const dates = element.value;
        return (
          isSameDay(dates[0], nextValue[0]) && isSameDay(dates[1], nextValue[1])
        );
      });

      this.setState({
        selectedIndex,
        tempSelectedIndex: rangeExistsIndex,
        calendarDate: this.getCalendarDate(nextValue, rangeExistsIndex)
      });
    }

    const nextState = {
      doneSelected: !doneSelected,
      selectValue: nextValue,
      hoverValue: nextHoverValue
    };

    event.persist();

    this.setState(nextState, () => {
      // 如果是单击模式，并且是第一次点选，再触发一次点击
      if (oneTap && !this.state.doneSelected) {
        this.handleChangeSelectValue(date, event);
      }
      // 如果是单击模式，并且是第二次点选，更新值，并关闭面板
      if (oneTap && this.state.doneSelected) {
        this.updateValue(event);
      }

      onSelect && onSelect(date, event);
    });
  };

  handleMouseMoveSelectValue = (date) => {
    const {
      doneSelected,
      selectValue,
      hoverValue,
      currentHoverDate
    } = this.state;
    const { hoverRange } = this.props;

    if (currentHoverDate && isSameDay(date, currentHoverDate)) {
      return;
    }

    const nextHoverValue = this.getHoverRange(date);

    if (doneSelected && !_.isUndefined(hoverRange)) {
      this.setState({
        currentHoverDate: date,
        hoverValue: nextHoverValue
      });
      return;
    } else if (doneSelected) {
      return;
    }

    let nextValue = selectValue;

    if (!nextHoverValue.length) {
      nextValue[1] = date;
    } else if (hoverValue) {
      nextValue = [
        isBefore(nextHoverValue[0], hoverValue[0])
          ? nextHoverValue[0]
          : hoverValue[0],
        isAfter(nextHoverValue[1], hoverValue[1])
          ? nextHoverValue[1]
          : hoverValue[1],
        nextValue[2]
      ];
    }

    // If `nextValue[0]` is greater than `nextValue[1]` then reverse order
    if (isAfter(nextValue[0], nextValue[1])) {
      nextValue.reverse();
    }

    this.setState({
      currentHoverDate: date,
      selectValue: nextValue
    });
  };

  handleEnter = () => {
    const value = this.getValue();

    this.setState({
      selectValue: value,
      calendarDate: this.getCalendarDate(value),
      active: true
    });
  };

  handleEntered = () => {
    this.props.onOpen && this.props.onOpen();
  };

  handleExit = () => {
    this.setState({
      active: false,
      doneSelected: true,
      tempSelectedIndex: null
    });

    this.props.onClose && this.props.onClose();
  };

  disabledByBetween(start, end, type) {
    const { disabledDate } = this.props;
    const { selectValue, doneSelected } = this.state;
    const selectStartDate = selectValue[0];
    const selectEndDate = selectValue[1];
    const nextSelectValue = [selectStartDate, selectEndDate];

    // If the date is between the start and the end
    // the button is disabled
    while (isBefore(start, end) || isSameDay(start, end)) {
      if (
        disabledDate &&
        disabledDate(start, nextSelectValue, doneSelected, type)
      ) {
        return true;
      }
      start = addDays(start, 1);
    }

    return false;
  }

  disabledOkButton = () => {
    const { selectValue, doneSelected } = this.state;

    if (!selectValue[0] || !selectValue[1] || !doneSelected) {
      return true;
    }

    return this.disabledByBetween(
      selectValue[0],
      selectValue[1],
      TYPE.TOOLBAR_BUTTON_OK
    );
  };

  disabledShortcutButton = (value = []) => {
    if (!value[0] || !value[1]) {
      return true;
    }

    return this.disabledByBetween(value[0], value[1], TYPE.TOOLBAR_SHORTCUT);
  };

  handleDisabledDate = (date, values, type) => {
    const { disabledDate } = this.props;
    const { doneSelected } = this.state;
    if (disabledDate) {
      return disabledDate(date, values, doneSelected, type);
    }
    return false;
  };
  addPrefix = (name) => prefix(this.props.classPrefix)(name);

  renderDropdownMenu() {
    const {
      menuClassName,
      ranges,
      isoWeek,
      limitEndYear,
      showWeekNumbers
    } = this.props;
    const { calendarDate, selectValue, hoverValue, doneSelected } = this.state;
    const classes = classNames(this.addPrefix('daterange-menu'), menuClassName);

    const pickerProps = {
      isoWeek,
      doneSelected,
      hoverValue,
      calendarDate,
      limitEndYear,
      showWeekNumbers,
      value: selectValue,
      disabledDate: this.handleDisabledDate,
      onSelect: this.handleChangeSelectValue,
      onMouseMove: this.handleMouseMoveSelectValue,
      onChangeCalendarDate: this.handleChangeCalendarDate
    };

    return (
      <MenuWrapper className={classes} ref={this.menuContainerRef}>
        <div className={this.addPrefix('daterange-panel')}>
          <div
            className={classNames(
              this.addPrefix('daterange-content'),
              'kizen-daterange-content'
            )}
          >
            <div className="kizen-quick-selection-container">
              <div className="kizen-quick-selection-header">
                Quick Selection
              </div>
              <QuickSelection
                ranges={ranges}
                selectValue={selectValue}
                disabledShortcutButton={this.disabledShortcutButton}
                onShortcut={this.handleQuickSelection}
                selectedIndex={this.state.selectedIndex}
                tempSelectedIndex={this.state.tempSelectedIndex}
              />
            </div>
            <div className={this.addPrefix('daterange-calendar-group')}>
              <DatePicker index={0} {...pickerProps} />
              <DatePicker index={1} {...pickerProps} />
            </div>
          </div>
          <div className="kizen-daterangepicker-toolbar">
            <button
              className="applyButton"
              type="button"
              onClick={this.handleOK}
            >
              Apply
            </button>
          </div>
        </div>
      </MenuWrapper>
    );
  }
  render() {
    const {
      disabled,
      locale,
      toggleComponentClass,
      style,
      onEntered,
      onEnter,
      onExited
    } = this.props;

    const value = this.getValue();
    const hasValue = value && value.length > 1;
    const classes = getToggleWrapperClassName(
      'daterange',
      this.addPrefix,
      this.props,
      hasValue
    );

    return (
      <IntlProvider locale={locale}>
        <div className={classes} style={style}>
          <PickerToggleTrigger
            pickerProps={this.props}
            ref={this.triggerRef}
            onEnter={createChainedFunction(this.handleEnter, onEnter)}
            onEntered={createChainedFunction(this.handleEntered, onEntered)}
            onExit={createChainedFunction(this.handleExit, onExited)}
            speaker={this.renderDropdownMenu()}
          >
            <PickerToggle
              componentClass={toggleComponentClass}
              hasValue={hasValue}
              active={this.state.active}
            >
              {this.getDateString()}
            </PickerToggle>
          </PickerToggleTrigger>
        </div>
      </IntlProvider>
    );
  }
}

const enhance = compose(
  defaultProps({
    classPrefix: 'picker'
  }),
  withPickerMethods()
);

export default enhance(DateRangePicker);
