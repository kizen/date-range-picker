import "./style.css";
import "./stylemods.css";
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable no-unused-expressions */
import * as React from "react";
import PropTypes from "prop-types";
import { addMonths } from "date-fns";
import Calendar from "./Calendar";

class DatePicker extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    hoverValue: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    calendarDate: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    index: PropTypes.number,
    format: PropTypes.string,
    isoWeek: PropTypes.bool,
    limitEndYear: PropTypes.number,
    classPrefix: PropTypes.string,
    disabledDate: PropTypes.func,
    onSelect: PropTypes.func,
    onMouseMove: PropTypes.func,
    onChangeCalendarDate: PropTypes.func
  };

  static defaultProps = {
    value: [],
    calendarDate: [new Date(), addMonths(new Date(), 1)],
    format: "mm-dd-yyyy",
    index: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      calendarState: undefined
    };
  }

  onMoveForword = nextPageDate => {
    const { onChangeCalendarDate, index } = this.props;
    onChangeCalendarDate && onChangeCalendarDate(index, nextPageDate);
  };

  onMoveBackward = nextPageDate => {
    const { onChangeCalendarDate, index } = this.props;
    onChangeCalendarDate && onChangeCalendarDate(index, nextPageDate);
  };

  handleChangePageDate = nextPageDate => {
    const { onChangeCalendarDate, index } = this.props;
    onChangeCalendarDate && onChangeCalendarDate(index, nextPageDate);
    this.setState({
      calendarState: undefined
    });
  };

  toggleMonthDropdown = () => {
    const { calendarState } = this.state;
    if (calendarState === "DROP_MONTH") {
      this.setState({ calendarState: undefined });
    } else {
      this.setState({ calendarState: "DROP_MONTH" });
    }
  };

  render() {
    const {
      format,
      value,
      hoverValue,
      index,
      calendarDate,
      onSelect,
      onMouseMove,
      disabledDate,
      isoWeek,
      limitEndYear,
      classPrefix,
      showWeekNumbers
    } = this.props;

    const { calendarState } = this.state;

    return (
      <Calendar
        classPrefix={classPrefix}
        disabledDate={disabledDate}
        format={format}
        value={value}
        isoWeek={isoWeek}
        hoverValue={hoverValue}
        calendarState={calendarState}
        calendarDate={calendarDate}
        index={index}
        onMoveForword={this.onMoveForword}
        onMoveBackward={this.onMoveBackward}
        onSelect={onSelect}
        onMouseMove={onMouseMove}
        onToggleMonthDropdown={this.toggleMonthDropdown}
        onChangePageDate={this.handleChangePageDate}
        limitEndYear={limitEndYear}
        showWeekNumbers={showWeekNumbers}
      />
    );
  }
}

export default DatePicker;
