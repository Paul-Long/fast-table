import React from 'react';
import { measureScrollbar } from './utils';

export type TableParams = {
  prefixCls: string,
  columns: Array<Object>,
  dataSource: Array<Object>,
  expandedRowKeys: Array<string>,

  className: string,

  showHeader: boolean,
  bordered: boolean,
  fixedHeader: boolean,
  sortMulti: boolean,
  refreshEnable: boolean,
  expandedRowByClick: boolean,
  useScrollY: boolean,
  hoverEnable: boolean,

  getRowHeight: Function,
  rowClassName: Function,
  footer: Function,
  emptyText: Function | React.Node,
  onSort: Function,
  onScrollEnd: Function,
  onExpandedRowsChange: Function,
  getScrollSize: Function,

  rowHeight: number,
  headerRowHeight: number,
  footerHeight: number,
  defaultShowCount: number,
  colMinWidth: number,
  scrollEndPosition: number,
  indentSize: number,
  bodyMaxHeight: string | number,

  style: Object
}
export const TableDefaultParams = {
  prefixCls: 'vt',
  columns: [],
  dataSource: [],

  showHeader: true,
  bordered: false,
  fixedHeader: true,
  sortMulti: false,
  refreshEnable: true,
  expandedRowByClick: true,
  useScrollY: true,
  hoverEnable: true,

  getRowHeight: () => 1,
  rowClassName: () => '',
  emptyText: () => '暂无数据',
  onScrollEnd: () => null,
  onExpandedRowsChange: () => null,
  getScrollSize: measureScrollbar,

  rowHeight: 30,
  headerRowHeight: 35,
  footerHeight: 30,
  defaultShowCount: 20,
  colMinWidth: 100,
  scrollEndPosition: 60,
  indentSize: 17,

  style: {}
};

export const CS = {
  _path: Symbol('_path'),
  _pathKey: Symbol('_pathKey'),
  _currentRow: Symbol('_currentRow'),
  _width: Symbol('_width'),
  _minWidth: Symbol('_minWidth'),
  path: Symbol('path'),
  rowSpan: Symbol('rowSpan'),
  colSpan: Symbol('colSpan'),
};

export const DS = {
  _index: Symbol('_index'),
  _showIndex: Symbol('_showIndex'),
  _path: Symbol('_path'),
  _expandedLevel: Symbol('_expandedLevel'),
  _height: Symbol('_height'),
  key: Symbol('key'),
  _expandedEnable: Symbol('_expandedEnable'),
  _isFixed: Symbol('_isFixed'),
  _top: Symbol('_top'),
  _expanded: Symbol('_expanded'),
  _key: Symbol('_key'),
  _rowClassName: Symbol('_rowClassName'),
};

export const components = {
  table: 'div',
  header: {
    wrapper: 'div',
    row: 'div',
    cell: 'div'
  },
  body: {
    wrapper: 'div',
    row: 'div',
    cell: 'div'
  }
};
