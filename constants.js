/* eslint-disable dot-notation */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable import/no-mutable-exports */
export const STATUS_ICON_NAMES = {
  info: 'info',
  success: 'check-circle',
  error: 'close-circle',
  warning: 'remind'
};
export let PAGINATION_ICON_NAMES;
(function(PAGINATION_ICON_NAMES) {
  PAGINATION_ICON_NAMES['more'] = 'more';
  PAGINATION_ICON_NAMES['prev'] = 'page-previous';
  PAGINATION_ICON_NAMES['next'] = 'page-next';
  PAGINATION_ICON_NAMES['first'] = 'page-top';
  PAGINATION_ICON_NAMES['last'] = 'page-end';
})(PAGINATION_ICON_NAMES || (PAGINATION_ICON_NAMES = {}));
export const SIZE = ['lg', 'md', 'sm', 'xs'];
export const STATUS = ['success', 'warning', 'error', 'info'];
export const COLOR = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'violet'
];
export const PLACEMENT_4 = ['top', 'bottom', 'right', 'left'];
export const PLACEMENT_8 = [
  'bottomStart',
  'bottomEnd',
  'topStart',
  'topEnd',
  'leftStart',
  'rightStart',
  'leftEnd',
  'rightEnd'
];
export const PLACEMENT_AUTO = [
  'auto',
  'autoVerticalStart',
  'autoVerticalEnd',
  'autoHorizontalStart',
  'autoHorizontalEnd'
];
export const PLACEMENT = [].concat(PLACEMENT_4, PLACEMENT_8, PLACEMENT_AUTO);
/**
 *  Check Tree Node State
 */
export let CHECK_STATE;
(function(CHECK_STATE) {
  CHECK_STATE[(CHECK_STATE['UNCHECK'] = 0)] = 'UNCHECK';
  CHECK_STATE[(CHECK_STATE['CHECK'] = 1)] = 'CHECK';
  CHECK_STATE[(CHECK_STATE['INDETERMINATE'] = 2)] = 'INDETERMINATE';
})(CHECK_STATE || (CHECK_STATE = {}));
export const TREE_NODE_PADDING = 16;
export const TREE_NODE_ROOT_PADDING = 12;
