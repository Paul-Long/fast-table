import React from 'react';

export default class SortManager {
  _cached = {};

  constructor({columns, sortMulti}) {
    this.columns = columns;
    this.sortMulti = sortMulti;
    this.enable = this._enable(columns);
  }

  enabled() {
    return this._cache('enabled', () => this.enable);
  }

  update = ({columns, sortMulti}) => {
    this.columns = columns;
    this.sortMulti = sortMulti;
    this.enable = {};
    this.enable = this._enable(columns);
  };

  setOrder(key, order, fn) {
    if (!this.sortMulti) {
      this.enable = {[`${key}`]: order};
    }
    this.enable[key] = order;
    if (typeof fn === 'function') {
      fn(this.enable);
    }
  }

  _cache(name, fn) {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  }

  _enable = (columns, order = {}) => {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i] || {};
      const children = column.children || [];
      if (children.length > 0) {
        order = this._enable(children, order);
      } else {
        if (column.sortEnable) {
          order[column.dataIndex] = column.order;
        }
      }
    }
    return order;
  };
}
