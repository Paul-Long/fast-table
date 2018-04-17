import React from 'react';
import PropTypes from 'prop-types';

export default class TableProps extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    prefixCls: PropTypes.string,
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    expandedRowKeys: PropTypes.array,

    className: PropTypes.string,

    showHeader: PropTypes.bool,
    bordered: PropTypes.bool,
    fixedHeader: PropTypes.bool,
    sortMulti: PropTypes.bool,
    refreshEnable: PropTypes.bool,
    expandedRowByClick: PropTypes.bool,

    rowRef: PropTypes.func,
    getRowHeight: PropTypes.func,
    rowClassName: PropTypes.func,
    footer: PropTypes.func,
    emptyText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onSort: PropTypes.func,
    onScrollEnd: PropTypes.func,
    onExpandedRowsChange: PropTypes.func,

    rowHeight: PropTypes.number,
    headerRowHeight: PropTypes.number,
    footerHeight: PropTypes.number,
    defaultShowCount: PropTypes.number,
    colMinWidth: PropTypes.number,
    scrollEndPosition: PropTypes.number,
    indentSize: PropTypes.number,
    bodyMaxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    style: PropTypes.object,

    pagination: PropTypes.oneOfType([
      PropTypes.shape({
        current: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number
      }),
      PropTypes.bool
    ])
  };
  static defaultProps = {
    prefixCls: 'vt',
    columns: [],
    dataSource: [],

    showHeader: true,
    bordered: false,
    fixedHeader: true,
    sortMulti: false,
    refreshEnable: true,
    expandedRowByClick: true,

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
    colMinWidth: 60,
    scrollEndPosition: 60,
    indentSize: 17,

    style: {},

    pagination: {
      current: 1,
      pageSize: 20,
      total: 0
    }
  };
}
