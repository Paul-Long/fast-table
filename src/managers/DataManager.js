import React from 'react';

export default class DataManager {
  _cached = {};
  _bodyHeight = 0;
  _hasExpanded = false;
  _data = [];

  constructor(props) {
    this.getRowHeight = props.getRowHeight;
    this.fixedHeader = props.fixedHeader;
    this.rowHeight = props.rowHeight;
    this.expandedRowKeys = props.expandedRowKeys || [];
    this.rowKey = props.rowKey;
    this.reset(props.dataSource);
  }

  getData = () => {
    return this._cache('getData', () =>
      this._getData(this._data)
    );
  };

  getFixedData = () => {
    return this._cache('getFixedData', () =>
      this._getFixedData(this.showData())
    );
  };

  showData = () => {
    return this._cache('showData', () =>
      this._showData(this.getData())
    );
  };

  fixedData = () => {
    return this._cache('fixedData', () =>
      this._getFixedData(this.showData())
    );
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
      return this.getData().some(d => d.children && d.children.length > 0);
    });
  };

  rowIsExpanded = (record) => {
    return this.expandedRowKeys.indexOf(record.key) > -1;
  };

  reset = (data) => {
    const _data = (data || []);
    if (!this.fixedHeader) {
      this._data = _data;
    } else {
      const dataBase = _data.filter(d => {
        const children = d.children || [];
        return children.length > 0 || !d.isFixed;
      });
      const dataFixed = _data.filter(d => {
        const children = d.children || [];
        return d.isFixed && children.length === 0;
      });
      this._data = [...dataFixed, ...dataBase];
    }
    this._bodyHeight = 0;
    this._cached = {};
    this.showData();
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
      keys = keys.filter(k => key !== k);
    }
    this.expandedRowKeys = Array.from(new Set(keys));
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

  _getData = (dataSource, level = 0, parentPath) => {
    dataSource = dataSource || [];
    for (let index = 0; index < dataSource.length; index++) {
      const height = this.getRowHeight(dataSource[index], index) * this.rowHeight;
      const path = `${parentPath === undefined ? index : `${parentPath}-${index}`}`;
      dataSource[index]['_index'] = index;
      dataSource[index]['_path'] = path;
      dataSource[index]['_expandedLevel'] = level;
      dataSource[index]['_height'] = height;
      if (!dataSource[index]['key']) {
        dataSource[index]['key'] = this._rowKey(dataSource[index], index);
      }
      const children = dataSource[index]['children'] || [];
      dataSource[index]['_expandedEnable'] = children.length > 0;
      this._hasExpanded = this._hasExpanded || children.length > 0;
      dataSource[index]['_isFixed'] = !!dataSource[index].isFixed && children.length === 0;
      if (children.length > 0) {
        dataSource[index]['children'] = this._getData(children, level + 1, path);
      }
    }
    return dataSource;
  };

  _getFixedData = (data) => {
    return data.filter(d => {
      return d.isFixed && ((d.children || []).length === 0);
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
      record._showIndex = data.length;
      record._top = this._bodyHeight;
      this._bodyHeight += record._height;
      const children = record.children || [];
      const _expanded = expandedKeys.length > 0 && expandedKeys.indexOf(record.key) > -1 && children.length > 0;
      record._expanded = _expanded;
      data.push(record);
      if (_expanded) {
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
  };
}
