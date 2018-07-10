import React from 'react';

class CacheManager {
  _rowCache = {};
  _cellCache = {};
  _styleCache = {};

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

  resetCell = () => {
    this._cellCache = {};
  };

  setStyle = (key, style) => {
    this._styleCache[key] = style;
  };

  getStyle = (key) => {
    return this._styleCache[key];
  };

  _cache = (name, fn) => {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  };
}

export default CacheManager;
