import React from 'react';
import classNames from 'classnames';
import findIndex from 'lodash/findIndex';
import {DS} from '../types';

export default class DataManager {
  _cached = {};
  _bodyHeight = 0;
  _hasExpanded = false;
  _data = [];

  constructor({getProps}) {
    this.getProps = getProps;
    this.expandedRowKeys = getProps('expandedRowKeys') || [];
    this.reset(getProps('dataSource'));
  }

  getData = () => {
    return this._cache('getData', () => this._getData(this._data));
  };

  getFixedData = () => {
    return this._cache('getFixedData', () =>
      this._getFixedData(this.showData())
    );
  };

  showData = () => {
    return this._cache('showData', () => this._showData(this.getData()));
  };

  fixedData = () => {
    return this._cache('fixedData', () => this._getFixedData(this.showData()));
  };

  fixedDataLength = () => {
    return this._cache('fixedDataLength', () => {
      return this.fixedData().length;
    });
  };

  isEmpty() {
    return this.getData().length === 0;
  }

  isExpanded = () => {
    return this._cache('isExpanded', () => {
      return this.getData().some((d) => d.children && d.children.length > 0);
    });
  };

  rowIsExpanded = (record) => {
    return this.expandedRowKeys.indexOf(record[DS._key]) > -1;
  };

  isFixed = (record) => {
    if ((record.children || []).length > 0) {
      return false;
    }
    return (
      record['isFixed'] === true ||
      record['isFixed'] === 'top' ||
      record['isFixed'] === 'bottom'
    );
  };

  reset = (data) => {
    const _data = data || [];
    this._hasExpanded = _data.some(
      (d) => !this.isFixed(d) && (d.children || []).length > 0
    );
    if (!this.getProps('fixedHeader')) {
      this._data = _data;
    } else {
      const dataBase = _data.filter((d) => {
        const children = d.children || [];
        return children.length > 0 || !this.isFixed(d);
      });
      const topData = _data.filter((d) => {
        const children = d.children || [];
        return (
          (d['isFixed'] === true || d['isFixed'] === 'top') &&
          children.length === 0
        );
      });
      const bottomData = _data.filter((d) => {
        const children = d.children || [];
        return d['isFixed'] === 'bottom' && children.length === 0;
      });
      this._data = [...topData, ...dataBase, ...bottomData];
    }
    this._bodyHeight = 0;
    this._cached = {};
    this.showData();
  };

  getByKey = (key) => {
    const index = findIndex(this.showData(), (d) => d[DS._key] === key);
    if (index < 0) {
      return null;
    }
    return this.showData()[index];
  };

  resetExpandedRowKeys = (keys) => {
    this.expandedRowKeys = Array.from(new Set(keys));
    delete this._cached['getRowsHeight'];
    delete this._cached['showData'];
    this.showData();
    return this.expandedRowKeys;
  };

  expanded = (key) => {
    let keys = this.expandedRowKeys || [];
    if (keys.indexOf(key) < 0) {
      keys.push(key);
    } else {
      keys = keys.filter((k) => key !== k);
    }
    this.expandedRowKeys = Array.from(new Set(keys));
    delete this._cached['getRowsHeight'];
    delete this._cached['showData'];
    this.showData();
    return this.expandedRowKeys;
  };

  _cache = (name, fn) => {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  };

  _getData = (dataSource, level = 0, parentPath) => {
    dataSource = dataSource || [];
    const getRowHeight = this.getProps('getRowHeight');
    const rowHeight = this.getProps('rowHeight');
    for (let index = 0; index < dataSource.length; index++) {
      const height = getRowHeight(dataSource[index], index) * rowHeight;
      const path = `${
        parentPath === undefined ? index : `${parentPath}-${index}`
      }`;
      const record = dataSource[index];
      const children = record['children'] || [];
      record[DS._index] = index;
      record[DS._path] = path;
      record[DS._expandedLevel] = level;
      record[DS._height] = height;
      record[DS._key] = this._rowKey(record, index);
      record[DS._expandedEnable] = children.length > 0;
      if (this.isFixed(record)) {
        record[DS._isFixed] = record['isFixed'];
      }
      if (children.length > 0) {
        record['children'] = this._getData(children, level + 1, path);
      }
    }
    return dataSource;
  };

  _getFixedData = (data) => {
    return data.filter((d) => {
      return d['isFixed'] && (d.children || []).length === 0;
    });
  };

  _showData = (dataSource, data) => {
    dataSource = dataSource || [];
    data = data || [];
    if (data.length === 0) {
      this._bodyHeight = 0;
    }
    const expandedKeys = this.expandedRowKeys || [];
    for (let index = 0; index < dataSource.length; index++) {
      const record = dataSource[index];
      record[DS._showIndex] = data.length;
      record[DS._top] = this._bodyHeight;
      record[DS._rowClassName] = this._rowClassName(record, data.length);
      this._bodyHeight += record[DS._height];
      const children = record.children || [];
      const _expanded =
        expandedKeys.length > 0 &&
        expandedKeys.indexOf(record[DS._key]) > -1 &&
        children.length > 0;
      record[DS._expanded] = _expanded;
      data.push(record);
      if (_expanded) {
        data = this._showData(children, data);
      }
    }
    return data;
  };

  _rowKey = (record, index) => {
    const rowKey = this.getProps('rowKey');
    if (typeof rowKey === 'function') {
      return String(rowKey(record, index));
    } else if (typeof rowKey === 'string') {
      return String(record[rowKey]);
    } else if (record['key']) {
      return String(record['key']);
    }
    return String(record[DS._path]);
  };

  _rowClassName = (record, index, level) => {
    let className = '';
    const rowClassName = this.getProps('rowClassName');
    if (typeof rowClassName === 'function') {
      className = rowClassName(record, index);
    } else if (rowClassName === 'string') {
      className = rowClassName || '';
    }
    const prefixCls = this.getProps('prefixCls');
    return classNames('tr', `${prefixCls}-row`, className, {
      [`${prefixCls}-expanded-row-${level}`]: this._hasExpanded,
      [`${prefixCls}-row-fixed`]: record[DS._isFixed]
    });
  };
}
