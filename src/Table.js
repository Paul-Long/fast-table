import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import merge from 'lodash/merge';
import sum from 'lodash/sum';
import maxBy from 'lodash/maxBy';
import multiply from 'lodash/multiply';
import divide from 'lodash/divide';
import toNumber from 'lodash/toNumber';
import isNumber from 'lodash/isNumber';
import isNaN from 'lodash/isNaN';
import shallowEqual from 'shallowequal';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './ColumnManager';
import {addEventListener, debounce, measureScrollbar} from './Utils';
import {create, Provider} from './mini-store';

import '../theme/table.css';

const percentReg = /^\d+\.?\d{0,2}%$/;

class Table extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columnManager = new ColumnManager(props.columns);
    this.lastScrollTop = 0;
    this.showCount = props.defaultShowCount || 30;
    this.columns = this.columnManager.groupedColumns();
    let maxRowSpan = maxBy(this.columns, 'rowSpan');
    maxRowSpan = maxRowSpan ? maxRowSpan['rowSpan'] : 1;
    this.store = create({
      currentHoverKey: null,
      hasScroll: false,
      headHeight: maxRowSpan * props.headerRowHeight,
      fixedColumnsHeadRowsHeight: [],
      colWidth: {},
      ...this.resetBodyHeight(props.dataSource || [])
    });
    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  }

  getChildContext() {
    return {
      table: {
        props: this.props,
        saveRef: this.saveRef,
        columnManager: this.columnManager,
        components: merge({
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
        }, this.props.components)
      }
    }
  }

  componentDidMount() {
    this.handleWindowResize();
    this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.resetData(nextProps.dataSource);
    }
  }

  componentWillUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
  }

  componentDidUpdate() {
    this.bodyHeight = this['bodyTable'].getBoundingClientRect().height;
    this.showCount = 5 + (this.bodyHeight / this.props.rowHeight);
  }

  handleWindowResize = () => {
    this.resetData();
    this.updateColumn();
  };

  resetColumn = (columns, colWidth = {}, currentRow = 0) => {
    colWidth = colWidth || {};
    columns.forEach((column) => {
      let widths = column.widths || [];
      widths = this.reCalcWidth(widths);
      let width = column.width;
      if (widths.length > 0) {
        width = sum(widths);
      }
      const key = column.path.join('-');
      if (key in colWidth) {
        throw Error(`duplicate column title - ${key}`);
      }
      colWidth[key] = width;
      const children = column.children || [];
      if (children.length > 0) {
        colWidth = this.resetColumn(children, colWidth, currentRow + 1);
      }
    });
    return colWidth;
  };

  reCalcWidth = (widths) => {
    widths = widths.map(w => {
      if (typeof w === 'string' && percentReg.test(w)) {
        const i = w.replace('%', '');
        return multiply(this.headWidth, divide(i, 100));
      }
      let ww = toNumber(w);
      if (!isNaN(ww) && isNumber(ww)) {
        return ww;
      }
      return w;
    });
    return widths.filter(w => !!w);
  };

  updateColumn = () => {
    const headRows = this['headTable'] ?
      this['headTable'].querySelectorAll('.thead') :
      this['bodyTable'].querySelectorAll('.thead');
    const scrollSize = measureScrollbar();
    const state = this.store.getState();
    if (headRows && headRows.length > 0) {
      this.headWidth = headRows[0].getBoundingClientRect().width - (state.hasScroll ? scrollSize : 0);
      const colWidth = this.resetColumn(this.columns);
      console.log(colWidth);
      this.store.setState({
        colWidth
      })
    }
  };

  resetData = (dataSource = this.props.dataSource) => {
    const {fixedColumnsBodyRowsHeight, tops, bodyHeight} = this.resetBodyHeight(dataSource);
    const hasScroll = this['bodyTable'].getBoundingClientRect().height < bodyHeight;
    this.store.setState({
      hasScroll,
      tops,
      bodyHeight,
      fixedColumnsBodyRowsHeight,
      ...this.resetRenderInterval(this.lastScrollTop || this['bodyTable'].scrollTop, this['bodyTable'].clientHeight, bodyHeight, fixedColumnsBodyRowsHeight)
    });
  };

  handleBodyScroll = (e) => {
    const target = e.target;
    if (this.lastScrollTop !== target.scrollTop && target !== this['headTable']) {
      const result = this.resetRenderInterval(target.scrollTop, target.clientHeight, target.scrollHeight);
      this.store.setState(result);
    }
    this.lastScrollTop = target.scrollTop;
  };

  resetBodyHeight = (dataSource) => {
    const {getRowHeight, rowHeight} = this.props;
    let tops = [], top = 0;
    dataSource = dataSource || [];
    const fixedColumnsBodyRowsHeight = dataSource.map((record, index) => {
      const height = getRowHeight(record, index) * rowHeight;
      tops.push(top);
      top += height;
      return height;
    });
    return {fixedColumnsBodyRowsHeight, tops, bodyHeight: sum(fixedColumnsBodyRowsHeight)};
  };

  resetRenderInterval = (scrollTop, clientHeight, scrollHeight, fixedColumnsBodyRowsHeight) => {
    const {rowHeight} = this.props;
    if (!fixedColumnsBodyRowsHeight) {
      const state = this.store.getState();
      fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
    }
    let start = 0, end = 0, top = 0, isStart = false, isEnd = false;
    for (let index = 0; index < fixedColumnsBodyRowsHeight.length; index++) {
      const height = fixedColumnsBodyRowsHeight[index];
      if (top + height >= scrollTop && !isStart) {
        start = index;
        isStart = true;
      } else if (top > scrollTop + clientHeight && !isEnd) {
        end = index;
        isEnd = true;
        break;
      }
      top += height;
    }
    if (scrollTop <= rowHeight) {
      start = 0;
    }
    if (scrollTop + clientHeight >= scrollHeight - rowHeight) {
      end = fixedColumnsBodyRowsHeight.length - 1;
    }
    if (end < start || end - start < this.showCount) {
      end = start + this.showCount;
    }
    return {
      renderStart: start,
      renderEnd: end
    };
  };

  saveRef = (name) => (node) => {
    this[name] = node;
  };

  getClassName = () => {
    const {prefixCls, className, fixedHeader, bordered} = this.props;
    return classNames(
      prefixCls,
      className,
      {
        [`${prefixCls}-fixed-header`]: fixedHeader,
        'bordered': bordered
      }
    );
  };

  getStyle = () => {
    const {width, height, style} = this.props;
    const baseStyle = Object.assign({}, style);
    width && (baseStyle.width = width);
    height && (baseStyle.height = height);
    return baseStyle;
  };

  getRowKey = (record, index) => {
    const rowKey = this.props.rowKey;
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    } else if (typeof rowKey === 'string') {
      return record[rowKey];
    }
    return index;
  };

  renderTable = (options) => {
    const {columns, fixed} = options;
    const headTable = (
      <HeadTable
        key='head'
        columns={columns}
        fixed={fixed}
      />
    );
    const bodyTable = (
      <BodyTable
        key='body'
        columns={columns}
        fixed={fixed}
        getRowKey={this.getRowKey}
        handleBodyScroll={this.handleBodyScroll}
      />
    );
    return [headTable, bodyTable];
  };

  renderMainTable = () => {
    console.log('render main table');
    return this.renderTable({
      columns: this.columns
    });
  };

  render() {
    return (
      <Provider store={this.store}>
        <div
          className={this.getClassName()}
          ref={this.saveRef('tableNode')}
          style={this.getStyle()}
        >
          {this.renderMainTable()}
        </div>
      </Provider>
    )
  }
}

export default Table;

Table.propTypes = {
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

  style: PropTypes.object
};

Table.defaultProps = {
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

  style: {}
};

Table.childContextTypes = {
  table: PropTypes.any
};
