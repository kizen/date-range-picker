/**
 * placementPolyfill('bottomLeft');
 * output 'bottomStart'
 */

function placementPolyfill(placement, rtl = false) {
  if (typeof placement === 'string') {
    if (rtl) {
      placement = placement.replace(/left|right/, (m) =>
        m === 'left' ? 'right' : 'left'
      );
    }
    return placement
      .replace(/Left|Top/, 'Start')
      .replace(/Right|Bottom/, 'End');
  }
  return placement;
}

export default placementPolyfill;
