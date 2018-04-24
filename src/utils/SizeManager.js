import React from 'react';

class SizeManager {
  _cached = {};
  _dataWidth = 0;
  _dataHeight = 0;
  _wrapperWidth = 0;
  _wrapperHeight = 0;
  _leftWidth = 0;
  _rightWidth = 0;
  _headerWidth = 0;
  _headerHeight = 0;
  _scrollTop = 0;
  _scrollLeft = 0;
  _startIndex = 0;
  _stopIndex = 0;
  _scrollSizeY = 0;
  _scrollSizeX = 0;
  _showCount = 10;
  _hasScrollX = false;
  _dataEmpty = true;

  constructor({showHeader, footerHeight, rowHeight, footer, dataSource, useScrollY}) {
    this.showHeader = showHeader;
    this.footerHeight = footerHeight;
    this.rowHeight = rowHeight;
    this.footer = footer;
    this.useScrollY = useScrollY;
    dataSource = dataSource || [];
    this._dataEmpty = dataSource.length === 0;
  }

  update = (size = {}) => {
    for (let key in size) {
      this[key] = size[key];
    }
  };

  dataHeight = (dataHeight) => {
    this._dataHeight = dataHeight;
  };
  dataWidth = dataWidth => {
    this._dataWidth = dataWidth;
  };

  wrapperWidth = wrapperWidth => {
    this._wrapperWidth = wrapperWidth;
  };

  wrapperHeight = (wrapperHeight) => {
    this._wrapperHeight = wrapperHeight;
  };

  leftWidth = (leftWidth) => {
    this._leftWidth = leftWidth;
  };

  rightWidth = (rightWidth) => {
    this._rightWidth = rightWidth;
  };

  headerHeight = headerHeight => {
    this._headerHeight = headerHeight;
  };

  headerWidth = headerWidth => {
    this._headerWidth = headerWidth;
  };

  scrollTop = scrollTop => {
    this._scrollTop = scrollTop;
  };

  scrollLeft = scrollLeft => {
    this._scrollLeft = scrollLeft;
  };

  startIndex = startIndex => {
    this._startIndex = startIndex;
  };

  stopIndex = stopIndex => {
    this._stopIndex = stopIndex;
  };

  scrollSizeY = scrollSizeY => {
    this._scrollSizeY = scrollSizeY;
  };

  scrollSizeX = scrollSizeX => {
    this._scrollSizeX = scrollSizeX;
  };

  showCount = showCount => {
    this._showCount = showCount;
  };

  hasScrollX = hasScrollX => {
    this._hasScrollX = hasScrollX;
  };

  _hasScrollY = () => {
    return this._wrapperHeight > 0 && this._wrapperHeight < this._totalHeight();
  };

  dataEmpty = dataEmpty => {
    this._dataEmpty = dataEmpty;
  };

  _totalHeight = () => {
    return this._dataHeight
      + (this.showHeader ? this._headerHeight : 0)
      + (this.footer ? this.footerHeight : 0)
      + (this._dataEmpty ? this.rowHeight : 0)
      + (this._hasScrollX && this._scrollSizeY ? this._scrollSizeY : 0);
  };

  _cache(name, fn) {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  }
}

export default SizeManager;
