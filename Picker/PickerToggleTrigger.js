import React from 'react';
import _ from 'lodash';
import OverlayTrigger from 'rsuite-utils/lib/Overlay/OverlayTrigger';
import { placementPolyfill } from '../utils';
import IntlContext from '../IntlProvider/IntlContext';

const PickerToggleTriggerProps = [
  'onEntered',
  'onExited',
  'open',
  'defaultOpen',
  'disabled',
  'onEnter',
  'onEntering',
  'onExit',
  'onExiting',
  'onHide',
  'container',
  'containerPadding',
  'preventOverflow'
];

const PickerToggleTrigger = React.forwardRef((props, ref) => {
  const { pickerProps, speaker, trigger = 'click', open, ...rest } = props;
  const { placement } = pickerProps;

  return (
    <IntlContext.Consumer>
      {(context) => (
        <OverlayTrigger
          trigger={trigger}
          ref={ref}
          open={open}
          placement={placementPolyfill(placement, context && context.rtl)}
          speaker={speaker}
          {..._.pick(pickerProps, PickerToggleTriggerProps)}
          {...rest}
        />
      )}
    </IntlContext.Consumer>
  );
});
PickerToggleTrigger.displayName = 'PickerToggleTrigger';

export default PickerToggleTrigger;
