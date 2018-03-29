import React from 'react';
import PropTypes from 'prop-types';

export default class TableProps extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    prefixCls: PropTypes.string,
    columns: PropTypes.array,
    dataSource: PropTypes.array,

    className: PropTypes.string,

    showHeader: PropTypes.bool,
    bordered: PropTypes.bool,
    fixedHeader: PropTypes.bool,

    rowRef: PropTypes.func,
    getRowHeight: PropTypes.func,
    rowClassName: PropTypes.func,
    footer: PropTypes.func,
    emptyText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    rowHeight: PropTypes.number,
    headerRowHeight: PropTypes.number,
    footerHeight: PropTypes.number,
    defaultShowCount: PropTypes.number,
    colMinWidth: PropTypes.number,

    style: PropTypes.object
  };
  static defaultProps = {
    prefixCls: 'vt',
    columns: [],
    dataSource: [],

    showHeader: true,
    bordered: false,
    fixedHeader: true,

    rowRef: () => null,
    getRowHeight: () => 1,
    rowClassName: () => '',
    emptyText: () => '暂无数据',

    rowHeight: 30,
    headerRowHeight: 35,
    footerHeight: 30,
    defaultShowCount: 30,
    colMinWidth: 60,

    style: {}
  };
}
