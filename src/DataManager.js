import React from 'react';

export default class DataManager {
  _cached = {};
  _bodyHeight = 0;
  _hasExpanded = false;

  constructor(props) {
    this.data = props.dataSource || [];
    this.getRowHeight = props.getRowHeight;
    this.rowHeight = props.rowHeight;
    this.expandedRowKeys = props.expandedRowKeys || [];
    this.rowKey = props.rowKey;
    this.showData();
  }

  getData = () => {
    return this._cache('getData', () => {
      return this._getData(this.data);
    });
  };

  showData = () => {
    return this._cache('showData', () =>
      this._showData(this.getData())
    );
  };

  isEmpty() {
    return this.getData().length === 0;
  }

  isExpanded = () => {
    return this._cache('isExpanded', () => {
      return this.getData().some(d => d.children && d.children.length > 0);
    });
  };

  rowIsExpanded = (record) => {
    return this.expandedRowKeys.indexOf(record.key) > -1;
  };
  reset = (data) => {
    this.data = data || [];
    this._bodyHeight = 0;
    this._cached = {};
    this.showData();
  };

  resetExpandedRowKeys = (key, expanded) => {
    let keys = this.expandedRowKeys || [];
    if (expanded) {
      keys.push(key);
      keys = Array.from(new Set(keys));
    } else {
      keys = keys.filter(k => key !== k);
    }
    this.expandedRowKeys = keys;
    delete this._cached['getRowsHeight'];
    delete this._cached['showData'];
    return this.expandedRowKeys;
  };

  _cache = (name, fn) => {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  };

  _getData = (dataSource, level = 0) => {
    dataSource = dataSource || [];
    for (let index = 0; index < dataSource.length; index++) {
      const height = this.getRowHeight(dataSource[index], index) * this.rowHeight;
      dataSource[index]['_index'] = index;
      dataSource[index]['_expandedLevel'] = level;
      dataSource[index]['_height'] = height;
      if (!dataSource[index]['key']) {
        dataSource[index]['key'] = this._rowKey(dataSource[index], index);
      }
      const children = dataSource[index]['children'] || [];
      dataSource[index]['_expandedEnable'] = children.length > 0;
      this._hasExpanded = this._hasExpanded || children.length > 0;
      if (children.length > 0) {
        dataSource[index]['children'] = this._getData(children, level + 1);
      }
    }
    return dataSource;
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
      record._showIndex = data.length;
      record._top = this._bodyHeight;
      this._bodyHeight += record._height;
      const children = record.children || [];
      data.push(record);
      if (expandedKeys.length > 0 && expandedKeys.indexOf(record.key) > -1 && children.length > 0) {
        data = this._showData(children, data);
      }
    }
    return data;
  };
  _rowKey = (record, index) => {
    const rowKey = this.rowKey;
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    } else if (typeof rowKey === 'string') {
      return record[rowKey];
    } else if (record['key']) {
      return record['key'];
    }
    return index;
  }
}
