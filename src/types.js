import React from 'react';
import {measureScrollbar} from './utils';

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
  defaultShowCount: 30,
  colMinWidth: 100,
  scrollEndPosition: 60,
  indentSize: 17,

  style: {}
};
