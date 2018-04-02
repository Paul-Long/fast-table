import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import merge from 'lodash/merge';
import shallowEqual from 'shallowequal';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './ColumnManager';
import DataManager from './DataManager';
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
    this.dataManager = new DataManager(props.dataSource, props);
    this.store = create({
      currentHoverKey: null,
      hasScroll: false,
      headHeight: maxRowSpan * props.headerRowHeight,
      colWidth: {},
      ...this.dataManager.getRowsHeight()
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
          table: 'table',
          header: {
            wrapper: 'thead',
            row: 'tr',
            cell: 'th'
          },
          body: {
            wrapper: 'tbody',
            row: 'tr',
            cell: 'td'
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
      this.dataManager.reset(nextProps.dataSource);
      this.resetData();
    }
  }

  componentWillUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
  }

  componentDidUpdate() {
    const showCount = this.getShowCount();
    if (this.showCount !== showCount) this.resetData();
  }

  getShowCount = () => {
    const dataSource = this.dataManager.getData();
    this.bodyHeight = this['bodyTable'].getBoundingClientRect().height;
    let showCount = 5 + (this.bodyHeight / this.props.rowHeight);
    showCount = showCount > dataSource.length ? dataSource.length : showCount;
    showCount = Math.max(showCount, this.props.defaultShowCount);
    return showCount;
  };

  handleWindowResize = () => {
    this.showCount = this.getShowCount();
    this.resetData();
    this.updateColumn();
  };

  updateColumn = () => {
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
  };

  resetData = () => {
    const result = this.resetRenderInterval(this['bodyTable']);
    this.store.setState({
      ...this.dataManager.getRowsHeight(),
      ...result
    });
  };

  handleBodyScroll = (e) => {
    const target = e.target;
    if (this.lastScrollTop !== target.scrollTop && target !== this['headTable']) {
      const result = this.resetRenderInterval(target);
      this.store.setState(result);
    }
    this.lastScrollTop = target.scrollTop;
  };

  resetRenderInterval = (target) => {
    const scrollTop = target.scrollTop;
    const clientHeight = target.clientHeight;
    const {rowHeight} = this.props;
    const dataSource = this.dataManager.getData() || [];
    const {bodyRowsHeight, tops, bodyHeight} = this.dataManager.getRowsHeight();
    const hasScroll = this['bodyTable'].getBoundingClientRect().height < bodyHeight;

    if (!hasScroll) {
      return {hasScroll, showData: dataSource};
    }

    let start = 0, end = 0, isStart = false, isEnd = false;
    for (let index = 0; index < dataSource.length; index++) {
      const top = tops[index];
      const height = bodyRowsHeight[index];
      if (top + height >= scrollTop && !isStart) {
        start = index;
        isStart = true;
      } else if (top > scrollTop + clientHeight && !isEnd) {
        end = index;
        isEnd = true;
        break;
      }
    }
    if (scrollTop <= rowHeight) {
      start = 0;
    }
    if (scrollTop + clientHeight >= bodyHeight - rowHeight) {
      end = bodyRowsHeight.length - 1;
    }
    if (end < start || end - start < this.showCount) {
      end = start + this.showCount;
    }
    const showData = [];
    for (let i = 0; i < dataSource.length; i++) {
      if (i >= start && i <= end) {
        showData.push(dataSource[i]);
      }
    }
    return {
      hasScroll,
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
    const table = this.renderTable({
      columns: this.columns
    });
    return [table, this.renderEmptyText(), this.renderFooter()]
  };

  renderFooter = () => {
    const {footer, footerHeight, prefixCls} = this.props;
    return footer ? (
      <div
        key='table-footer'
        className={`${prefixCls}-footer`}
        style={{flex: `0 1 ${footerHeight}px`, height: footerHeight, color: 'inherit'}}>
        {footer(this.props.dataSource)}
      </div>
    ) : null;
  };

  renderEmptyText = () => {
    const {emptyText, dataSource, rowHeight, prefixCls} = this.props;
    if (dataSource && dataSource.length > 0) {
      return null;
    }
    return typeof emptyText === 'function' ? (
      <div
        key='table-empty-text'
        className={`${prefixCls}-empty-text`}
        style={{
          height: rowHeight,
          lineHeight: rowHeight + 'px',
          textAlign: 'center',
          color: 'inherit'
        }}>
        {emptyText()}
      </div>
    ) : emptyText;
  };

  render() {
    const {prefixCls} = this.props;
    return (
      <Provider store={this.store}>
        <div
          className={this.getClassName()}
          ref={this.saveRef('tableNode')}
          style={this.getStyle()}
        >
          <div className={`${prefixCls}-content`}>
            {this.renderMainTable()}
          </div>
        </div>
      </Provider>
    )
  }
}

export default Table;

Table.childContextTypes = {
  table: PropTypes.any
};
