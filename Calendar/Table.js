/* eslint-disable react/static-property-placement */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps } from '../utils';
import TableRow from './TableRow';
import TableHeaderRow from './TableHeaderRow';

class Table extends React.Component {
  static propTypes = {
    rows: PropTypes.array,
    isoWeek: PropTypes.bool,
    selected: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    hoverValue: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    onSelect: PropTypes.func,
    onMouseMove: PropTypes.func,
    disabledDate: PropTypes.func,
    inSameMonth: PropTypes.func
  };

  static defaultProps = {
    rows: []
  };

  render() {
    const {
      rows,
      selected,
      hoverValue,
      onSelect,
      onMouseMove,
      disabledDate,
      inSameMonth,
      className,
      classPrefix,
      isoWeek,
      showWeekNumbers,
      ...rest
    } = this.props;

    const classes = classNames(classPrefix, className);

    return (
      <div {...rest} className={classes}>
        <TableHeaderRow isoWeek={isoWeek} showWeekNumbers={showWeekNumbers} />
        {rows.map((week, index) => (
          <TableRow
            /* eslint-disable */
            key={index}
            weekendDate={week}
            selected={selected}
            hoverValue={hoverValue}
            onSelect={onSelect}
            onMouseMove={onMouseMove}
            inSameMonth={inSameMonth}
            disabledDate={disabledDate}
            showWeekNumbers={showWeekNumbers}
          />
        ))}
      </div>
    );
  }
}

const enhance = defaultProps({
  classPrefix: 'calendar-table'
});

export default enhance(Table);
