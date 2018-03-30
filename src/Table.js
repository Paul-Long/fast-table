import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import merge from 'lodash/merge';
import sum from 'lodash/sum';
import shallowEqual from 'shallowequal';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './ColumnManager';
import {addEventListener, debounce, measureScrollbar} from './Utils';
import {create, Provider} from './mini-store';
import TableProps from './TableProps';

import '../theme/table.css';

class Table extends TableProps {
  constructor(props) {
    super(props);
    this.columnManager = new ColumnManager(props.columns, props.colMinWidth);
    this.lastScrollTop = 0;
    this.showCount = props.defaultShowCount || 30;
    this.columns = this.columnManager.groupedColumns();
    const maxRowSpan = this.columnManager.maxRowSpan();
    let start = new Date().getTime();
    this.store = create({
      currentHoverKey: null,
      hasScroll: false,
      headHeight: maxRowSpan * props.headerRowHeight,
      fixedColumnsHeadRowsHeight: [],
      colWidth: {},
      ...this.resetBodyHeight(props.dataSource || [])
    });
    let timer = setTimeout(() => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      this.setState({...this.resetBodyHeight(props.dataSource || [])});
    });
    console.log('store.create -> ', new Date().getTime() - start);
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
    const showCount = this.getShowCount();
    if (this.showCount !== showCount) this.resetData(this.props.dataSource);
  }

  getShowCount = () => {
    const start = new Date().getTime();
    const dataSource = this.props.dataSource || [];
    this.bodyHeight = this['bodyTable'].getBoundingClientRect().height;
    let showCount = 5 + (this.bodyHeight / this.props.rowHeight);
    showCount = showCount > dataSource.length ? dataSource.length : showCount;
    showCount = Math.max(showCount, this.props.defaultShowCount);
    console.log('getShowCount -> ', new Date().getTime() - start);
    return showCount;
  };

  handleWindowResize = () => {
    const start = new Date().getTime();
    this.showCount = this.getShowCount();
    this.resetData(this.props.dataSource);
    this.updateColumn();
    const end = new Date().getTime();
    console.log('handleWindowResize -> ', end - start);
  };

  updateColumn = () => {
    const start = new Date().getTime();
    const headRows = this['headTable'] ?
      this['headTable'].querySelectorAll('.thead') :
      this['bodyTable'].querySelectorAll('.thead');
    const scrollSize = measureScrollbar();
    const state = this.store.getState();
    if (headRows && headRows.length > 0) {
      const width = headRows[0].getBoundingClientRect().width - (state.hasScroll ? scrollSize : 0);
      this.store.setState({
        colWidth: this.columnManager.getColWidth(width)
      })
    }
    console.log('updateColumn -> ', new Date().getTime() - start);
  };

  resetData = (dataSource = this.props.dataSource) => {
    const start = new Date().getTime();
    const {fixedColumnsBodyRowsHeight, tops, bodyHeight} = this.resetBodyHeight(dataSource);
    const hasScroll = this['bodyTable'].getBoundingClientRect().height < bodyHeight;
    dataSource = dataSource || [];
    let result = {
      renderStart: 0,
      renderEnd: dataSource.length - 1,
      showData: dataSource.map((data, index) => ({...data, index}))
    };
    if (hasScroll) {
      const scrollTop = this.lastScrollTop || this['bodyTable'].scrollTop;
      const clientHeight = this['bodyTable'].clientHeight;
      result = this.resetRenderInterval(scrollTop, clientHeight, bodyHeight, fixedColumnsBodyRowsHeight, dataSource);
    }
    this.store.setState({
      hasScroll,
      tops,
      bodyHeight,
      fixedColumnsBodyRowsHeight,
      ...result
    });
    console.log('resetData -> ', new Date().getTime() - start);
  };

  handleBodyScroll = (e) => {
    const start = new Date().getTime();
    const target = e.target;
    if (this.lastScrollTop !== target.scrollTop && target !== this['headTable']) {
      const state = this.store.getState();
      const result = this.resetRenderInterval(target.scrollTop, target.clientHeight, target.scrollHeight, state.fixedColumnsBodyRowsHeight, this.props.dataSource);
      this.store.setState(result);
    }
    this.lastScrollTop = target.scrollTop;
    console.log('handleBodyScroll -> ', new Date().getTime() - start);
  };

  resetBodyHeight = (dataSource) => {
    const start = new Date().getTime();
    const {getRowHeight, rowHeight} = this.props;
    let tops = [], top = 0;
    dataSource = dataSource || [];
    const fixedColumnsBodyRowsHeight = dataSource.map((record, index) => {
      const height = getRowHeight(record, index) * rowHeight;
      tops.push(top);
      top += height;
      return height;
    });
    console.log('resetBodyHeight -> ', new Date().getTime() - start);
    return {fixedColumnsBodyRowsHeight, tops, bodyHeight: sum(fixedColumnsBodyRowsHeight)};
  };

  resetRenderInterval = (scrollTop, clientHeight, scrollHeight, fixedColumnsBodyRowsHeight, dataSource) => {
    const startTime = new Date().getTime();
    const {rowHeight} = this.props;
    dataSource = dataSource || [];
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
    const showData = [];
    dataSource.forEach((data, index) => {
      if (index >= start && index <= end) {
        data = {...data, index};
        showData.push(data);
      }
    });
    console.log('resetRenderInterval -> ', new Date().getTime() - startTime);
    return {
      renderStart: start,
      renderEnd: end,
      showData
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

Table.childContextTypes = {
  table: PropTypes.any
};
