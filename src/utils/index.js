import React from 'react';

let scrollbarSize;

const scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px'
};

let scrollbarVerticalSize;
let scrollbarHorizontalSize;

export function measureScrollbar(direction = 'vertical') {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0;
  }
  const isVertical = direction === 'vertical';
  if (isVertical && scrollbarVerticalSize) {
    return scrollbarVerticalSize;
  } else if (!isVertical && scrollbarHorizontalSize) {
    return scrollbarHorizontalSize;
  }
  const scrollDiv = document.createElement('div');
  Object.keys(scrollbarMeasure).forEach((scrollProp) => {
    scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
  });
  // Append related overflow style
  if (isVertical) {
    scrollDiv.style.overflowY = 'scroll';
  } else {
    scrollDiv.style.overflowX = 'scroll';
  }
  document.body.appendChild(scrollDiv);
  let size = 0;
  if (isVertical) {
    size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    scrollbarVerticalSize = size;
  } else {
    size = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    scrollbarHorizontalSize = size;
  }

  document.body.removeChild(scrollDiv);
  return size;
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

export function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key);
}

export function keys(obj) {
  return Object.keys(obj || {}) || [];
}
