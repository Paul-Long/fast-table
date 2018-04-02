import React from 'react';

export default class DataManager {
  _cached = {};

  constructor(data, props) {
    this.data = data || [];
    this.tableProps = props || {};
    this.getRowHeight = props.getRowHeight;
    this.rowHeight = props.rowHeight;
  }

  getData = () => {
    return this._cache('getData', () => {
      for (let index = 0; index < this.data.length; index++) {
        this.data[index]['index'] = index;
      }
      return this.data;
    });
  };

  getRowsHeight = () => {
    return this._cache('getRowsHeight', () => {
      const bodyRowsHeight = [];
      const tops = [];
      let bodyHeight = 0;
      for (let index = 0; index < this.data.length; index++) {
        this.data[index]['index'] = index;
        const record = this.data[index];
        const height = this.getRowHeight(record, index) * this.rowHeight;
        tops.push(bodyHeight);
        bodyHeight += height;
        bodyRowsHeight.push(height);
      }
      return {
        bodyRowsHeight,
        tops,
        bodyHeight
      }
    });
  };

  reset = (data) => {
    this.data = data || [];
    this._cached = {};
  };

  _cache = (name, fn) => {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  }
}
