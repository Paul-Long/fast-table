import React from 'react';

class CacheManager {
  _rowCache = {};
  _cellCache = {};
  _styleCache = {};
  _rowStyleCache = {};

  setRow = (key, element) => {
    this._rowCache[key] = element;
  };

  getRow = (key) => {
    return this._rowCache[key];
  };

  setCell = (key, element) => {
    this._cellCache[key] = element;
  };

  getCell = (key) => {
    return this._cellCache[key];
  };

  reset = () => {
    this._cellCache = {};
    this._rowStyleCache = {};
  };

  setStyle = (key, style) => {
    this._styleCache[key] = style;
  };

  getStyle = (key) => {
    return this._styleCache[key];
  };

  getRowStyle = (key) => {
    return this._rowStyleCache[key];
  };

  setRowStyle = (key, style) => {
    this._rowStyleCache[key] = style;
  };
}

export default CacheManager;
