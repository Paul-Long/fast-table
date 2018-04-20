import React from 'react';

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

  rowRef: Function,
  getRowHeight: Function,
  rowClassName: Function,
  footer: Function,
  emptyText: Function | React.Node,
  onSort: Function,
  onScrollEnd: Function,
  onExpandedRowsChange: Function,

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

  rowRef: () => null,
  getRowHeight: () => 1,
  rowClassName: () => '',
  emptyText: () => '暂无数据',
  onScrollEnd: () => null,
  onExpandedRowsChange: () => null,

  rowHeight: 30,
  headerRowHeight: 35,
  footerHeight: 30,
  defaultShowCount: 30,
  colMinWidth: 100,
  scrollEndPosition: 60,
  indentSize: 17,

  style: {}
};

export type TableRowParams = {
  record: Object,
  prefixCls: string,
  columns: Array,
  indentSize: number,
  rowKey: string | number,
  className: string,
  fixed: string,
  onExpandedRowsChange: Function,
  expanded: boolean,
  hasExpanded: boolean,
  hovered: boolean
}

export type TableCellParams = {
  record: Object,
  prefixCls: string,
  index: number,
  indent: number,
  indentSize: number
}

export type TableHeaderCellParams = {
  column: Object,
  prefixCls: string,
  headerRowHeight: number,
  columns: Array,
  index: number
}
