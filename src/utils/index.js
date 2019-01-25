import React from 'react';

let scrollbarSize;

const scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll'
};

export function measureScrollbar() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0;
  }
  if (scrollbarSize) {
    return scrollbarSize;
  }
  const scrollDiv = document.createElement('div');
  for (const scrollProp in scrollbarMeasure) {
    if (scrollbarMeasure.hasOwnProperty(scrollProp)) {
      scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
    }
  }
  document.body.appendChild(scrollDiv);
  const size = {
    y: scrollDiv.offsetWidth - scrollDiv.clientWidth,
    x: scrollDiv.offsetHeight - scrollDiv.clientHeight
  };
  document.body.removeChild(scrollDiv);
  scrollbarSize = size;
  return scrollbarSize;
}

export function cellAlignStyle(align) {
  let style = {};
  if (align) {
    switch (align) {
      case 'center':
        style.justifyContent = 'center';
        break;
      case 'left':
        style.justifyContent = 'flex-start';
        break;
      case 'right':
        style.justifyContent = 'flex-end';
        break;
    }
  }
  return style;
}

export function isInvalidRenderCellText(text) {
  return (
    text &&
    !React.isValidElement(text) &&
    Object.prototype.toString.call(text) === '[object Object]'
  );
}
