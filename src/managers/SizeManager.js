import React from 'react';

class SizeManager {
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
  _hasScrollY = false;
  _dataEmpty = true;

  constructor({showHeader, footerHeight, rowHeight, footer, dataSource, useScrollY}) {
    this.showHeader = showHeader;
    this.footerHeight = footer
      ? footerHeight
      : 0;
    this.rowHeight = rowHeight;
    this.useScrollY = useScrollY;
    dataSource = dataSource || [];
    this._dataEmpty = dataSource.length === 0;
    this._emptyTextHeight = this._dataEmpty ? rowHeight : 0;
    this._hasScrollY = this._wrapperHeight > 0 && this._wrapperHeight < this._totalHeight();
  }

  update = (size = {}) => {
    for (let key in size) {
      if (size.hasOwnProperty(key)) {
        this[key] = size[key];
      }
    }
    this._emptyTextHeight = this._dataEmpty ? 0 : this.rowHeight;
    this._hasScrollY = this._wrapperHeight > 0 && this._wrapperHeight < this._totalHeight();
  };
  
  scrollSizeX = () => {
    return this._hasScrollX ? this._scrollSizeX : 0;
  };
  
  scrollSizeY = () => {
    return this._hasScrollY ? this._scrollSizeY : 0;
  };

  _totalHeight = () => {
    return this._dataHeight
      + (this.showHeader ? this._headerHeight : 0)
      + this.footerHeight
      + this._emptyTextHeight
      + (this._hasScrollX && this._scrollSizeY ? this._scrollSizeY : 0);
  };
}

export default SizeManager;
