import React from 'react';
// import { measureScrollbar } from './utils';

function defaultFunction() {
  return {};
}

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

  rowClassName: Function,
  emptyText: Function | React.Node,
  expandedRowRender: Function,
  footer: Function,
  getRowHeight: Function,
  getScrollSize: Function,
  onExpandedRowsChange: Function,
  onHeaderRow: Function,
  onRow: Function,
  onScrollEnd: Function,
  onSort: Function,
  onScroll: Function,

  rowHeight: number,
  headerRowHeight: number,
  footerHeight: number,
  defaultShowCount: number,
  colMinWidth: number,
  scrollEndPosition: number,
  indentSize: number,
  bodyMaxHeight: string | number,

  scrollSize: Object,
  style: Object
};
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
  getScrollSize: () => ({x: 8, y: 8}),
  onRow: defaultFunction,
  onHeaderRow: defaultFunction,

  rowHeight: 30,
  headerRowHeight: 35,
  footerHeight: 30,
  defaultShowCount: 20,
  colMinWidth: 100,
  scrollEndPosition: 60,
  indentSize: 17,

  scrollSize: {x: 8, y: 8},
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
  colSpan: Symbol('colSpan')
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
  _rowClassName: Symbol('_rowClassName')
};

export const rowEvents = [
  'onMouseEnter',
  'onMouseLeave',
  'onClick',
  'onDoubleClick',
  'onBlur',
  'onFocus',
  'onAnimationStart',
  'onAnimationEnd',
  'onTransitionEnd'
];

export const eventsMap = {
  mouseenter: 'onMouseEnter',
  mouseleave: 'onMouseLeave',
  click: 'onClick'
};
