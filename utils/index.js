/* eslint-disable func-names */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-shadow */
import { startOfDay, endOfDay, addMonths, isSameMonth } from 'date-fns';

export { default as prefix } from './prefix';
export { default as defaultProps } from './defaultProps';
export { default as createContext } from './createContext';
export { default as createChainedFunction } from './createChainedFunction';
export { default as withPickerMethods } from './withPickerMethods';
export { default as placementPolyfill } from './placementPolyfill';
export { default as getMonthView } from './getMonthView';

export const setTimingMargin = (date, way = 'left') =>
  way === 'right' ? endOfDay(date) : startOfDay(date);

export function getCalendarDate(value = []) {
  // Update calendarDate if the value is not null
  if (value[0] && value[1]) {
    const sameMonth = isSameMonth(value[0], value[1]);
    return [value[0], sameMonth ? addMonths(value[1], 1) : value[1]];
  }
  return [new Date(), addMonths(new Date(), 1)];
}

export let TYPE = {};
(function(TYPE) {
  TYPE.CALENDAR = 'CALENDAR';
  TYPE.TOOLBAR_BUTTON_OK = 'TOOLBAR_BUTTON_OK';
  TYPE.TOOLBAR_SHORTCUT = 'TOOLBAR_SHORTCUT';
})(TYPE || (TYPE = {}));
