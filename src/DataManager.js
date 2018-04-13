import React from 'react';

export default class DataManager {
  _cached = {};

  constructor(props) {
    this.data = props.dataSource || [];
    this.getRowHeight = props.getRowHeight;
    this.rowHeight = props.rowHeight;
    this.expandedRowKeys = props.expandedRowKeys || [];
    this.rowKey = props.rowKey;
  }

  getData = () => {
    return this._cache('getData', () => {
      return this._getData(this.data);
    });
  };

  showData = () => {
    return this._cache('showData', () => {
      return this._showData(this.getData());
    });
  };

  getRowsHeight = () => {
    return this._cache('getRowsHeight', () => {
      return this._getRowsHeight(this.showData());
    });
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
    this._cached = {};
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
  };

  _cache = (name, fn) => {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  };
  _getRowsHeight = (dataSource) => {
    dataSource = dataSource || [];
    let bodyRowsHeight = [];
    let tops = [];
    let bodyHeight = 0;
    for (let index = 0; index < dataSource.length; index++) {
      const record = dataSource[index];
      const height = this.getRowHeight(record, index) * this.rowHeight;
      tops.push(bodyHeight);
      bodyHeight += height;
      bodyRowsHeight.push(height);
    }
    return {
      bodyRowsHeight,
      tops,
      bodyHeight
    };
  };
  _getData = (dataSource, level = 0) => {
    dataSource = dataSource || [];
    for (let index = 0; index < dataSource.length; index++) {
      dataSource[index]['index'] = index;
      dataSource[index]['_expandedLevel'] = level;
      if (!dataSource[index]['key']) {
        dataSource[index]['key'] = this.rowKey(dataSource[index], index);
      }
      const children = dataSource[index]['children'] || [];
      if (children.length > 0) {
        dataSource[index]['children'] = this._getData(children, level + 1);
      }
    }
    return dataSource;
  };
  _showData = (dataSource, data) => {
    dataSource = dataSource || [];
    data = data || [];
    const expandedKeys = this.expandedRowKeys || [];
    for (let index = 0; index < dataSource.length; index++) {
      const record = dataSource[index];
      record['_showIndex'] = data.length;
      const children = record.children || [];
      data.push(record);
      if (expandedKeys.length > 0 && expandedKeys.indexOf(record.key) > -1 && children.length > 0) {
        data = this._showData(children, data);
      }
    }
    return data;
  };
}
