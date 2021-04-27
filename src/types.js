import React from 'react';

function defaultFunction() {
  return {};
}

type RowSelection = {
  selectedRowKeys: Array<string>,
  type: string,
  onSelect: Function,
  useSelectAll: boolean,
  disabled: Array<string>
};

export type TableParams = {
  prefixCls: string,
  columns: Array<Object>,
  dataSource: Array<Object>,
  expandedRowKeys: Array<string>,

  className: string,
  rowKey: string | Function,
  rowSelection: RowSelection,

  showHeader: boolean,
  bordered: boolean,
  fixedHeader: boolean,
  sortMulti: boolean,
  refreshEnable: boolean,
  expandedRowByClick: boolean,
  useScrollY: boolean,
  hoverEnable: boolean,
  headerSortable: boolean,
  pullDown: boolean,

  rowClassName: Function,
  rowProps: Function,
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
  onHeaderSortable: Function,
  onWheel: Function,

  rowHeight: number,
  headerRowHeight: number,
  footerHeight: number,
  defaultShowCount: number,
  showStartIndex: number,
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
  headerSortable: false,
  pullDown: false,

  roProps: () => ({}),
  getRowHeight: () => 1,
  rowClassName: () => '',
  emptyText: () => '暂无数据',
  onScrollEnd: () => null,
  onExpandedRowsChange: () => null,
  getScrollSize: () => ({x: 8, y: 8}),
  onRow: defaultFunction,
  onHeaderRow: defaultFunction,
  onHeaderSortable: defaultFunction,

  rowHeight: 30,
  headerRowHeight: 35,
  footerHeight: 30,
  defaultShowCount: 20,
  showStartIndex: 0,
  colMinWidth: 100,
  scrollEndPosition: 60,
  indentSize: 17,

  scrollSize: {x: 8, y: 8},
  style: {}
};

export const CS = {
  _path: String('_path'),
  _pathKey: String('_pathKey'),
  _currentRow: String('_currentRow'),
  _width: String('_width'),
  _minWidth: String('_minWidth'),
  path: String('path'),
  rowSpan: String('rowSpan'),
  colSpan: String('colSpan')
};

export const DS = {
  _index: String('_index'),
  _showIndex: String('_showIndex'),
  _path: String('_path'),
  _expandedLevel: String('_expandedLevel'),
  _height: String('_height'),
  key: String('key'),
  _expandedEnable: String('_expandedEnable'),
  _isFixed: String('_isFixed'),
  _top: String('_top'),
  _expanded: String('_expanded'),
  _key: String('_key'),
  _rowClassName: String('_rowClassName')
};

// export const CS = {
//   _path: Symbol('_path'),
//   _pathKey: Symbol('_pathKey'),
//   _currentRow: Symbol('_currentRow'),
//   _width: Symbol('_width'),
//   _minWidth: Symbol('_minWidth'),
//   path: Symbol('path'),
//   rowSpan: Symbol('rowSpan'),
//   colSpan: Symbol('colSpan')
// };
//
// export const DS = {
//   _index: Symbol('_index'),
//   _showIndex: Symbol('_showIndex'),
//   _path: Symbol('_path'),
//   _expandedLevel: Symbol('_expandedLevel'),
//   _height: Symbol('_height'),
//   key: Symbol('key'),
//   _expandedEnable: Symbol('_expandedEnable'),
//   _isFixed: Symbol('_isFixed'),
//   _top: Symbol('_top'),
//   _expanded: Symbol('_expanded'),
//   _key: Symbol('_key'),
//   _rowClassName: Symbol('_rowClassName')
// };

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
  click: 'onClick',
  dblclick: 'onDoubleClick',
  blur: 'onBlur',
  focus: 'onFocus',
  animationstart: 'onAnimationStart',
  animationend: 'onAnimationEnd',
  transitionend: 'onTransitionEnd',
  dragstart: 'onDragStart',
  drag: 'onDrag',
  dragend: 'onDragEnd'
};
