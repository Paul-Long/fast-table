import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import merge from 'lodash/merge';
import shallowEqual from 'shallowequal';
import classes from 'component-classes';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './ColumnManager';
import DataManager from './DataManager';
import SortManager from './SortManager';
import {addEventListener, debounce, measureScrollbar} from './Utils';
import {create, Provider} from './mini-store';
import TableProps from './TableProps';

import '../theme/table.css';

class Table extends TableProps {
  constructor(props) {
    super(props);
    this.lastScrollTop = 0;
    this.lastScrollLeft = 0;
    this.refreshAble = true;
    this.showCount = props.defaultShowCount || 30;
    this.columnManager = new ColumnManager(props.columns, props.colMinWidth);
    this.dataManager = new DataManager({...props, rowKey: this.getRowKey});
    this.sortManager = new SortManager(this.columnManager.groupedColumns(), props.sortMulti);
    this.store = create({
      currentHoverKey: null,
      hasScroll: false,
      headHeight: this.columnManager.maxRowSpan() * props.headerRowHeight,
      colWidth: {},
      orders: this.sortManager.enabled(),
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
        dataManager: this.dataManager,
        sortManager: this.sortManager,
        rowKey: this.getRowKey,
        resetExpandedRowKeys: this.handleExpandedRowKeysChange,
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
    };
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
    if (!shallowEqual(nextProps.columns, this.props.columns)) {
      this.columnManager.reset(nextProps.columns, this.props.colMinWidth);
      this.handleWindowResize();
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
    const dataSource = this.dataManager.showData();
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
    const scrollSize = measureScrollbar();
    const state = this.store.getState();
    if (this['tableNode']) {
      const width = findDOMNode(this['tableNode']).getBoundingClientRect().width - (state.hasScroll ? scrollSize : 0) - 2;
      this.store.setState({
        colWidth: this.columnManager.getColWidth(width)
      });
    }
  };

  resetData = () => {
    const result = this.resetRenderInterval(this['bodyTable']);
    this.store.setState({
      ...this.dataManager.getRowsHeight(),
      ...result
    });
  };

  setScrollPosition(position) {
    this.scrollPosition = position;
    if (this.tableNode) {
      const {prefixCls} = this.props;
      if (position === 'both') {
        classes(this.tableNode)
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-left`)
          .add(`${prefixCls}-scroll-position-right`);
      } else {
        classes(this.tableNode)
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-${position}`);
      }
    }
  }

  setScrollPositionClassName() {
    const node = this['bodyTable'];
    const scrollToLeft = node.scrollLeft === 0;
    const scrollToRight = node.scrollLeft + 1 >=
      node.children[0].getBoundingClientRect().width -
      node.getBoundingClientRect().width;
    if (scrollToLeft && scrollToRight) {
      this.setScrollPosition('both');
    } else if (scrollToLeft) {
      this.setScrollPosition('left');
    } else if (scrollToRight) {
      this.setScrollPosition('right');
    } else if (this.scrollPosition !== 'middle') {
      this.setScrollPosition('middle');
    }
  }

  handleBodyScroll = (e) => {
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
  };

  handleBodyScrollLeft = (e) => {
    if (e.currentTarget !== e.target) {
      return;
    }
    const target = e.target;
    const {headTable, bodyTable} = this;
    if (target.scrollLeft !== this.lastScrollLeft) {
      if (target === bodyTable && headTable) {
        headTable.scrollLeft = target.scrollLeft;
      }
      this.setScrollPositionClassName();
    }
    this.lastScrollLeft = target.scrollLeft;
  };

  handleBodyScrollTop = (e) => {
    const target = e.target;
    if (target !== e.currentTarget) {
      return;
    }
    const {headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight} = this;
    if (this.lastScrollTop !== target.scrollTop && target !== headTable) {
      const result = this.resetRenderInterval(target);
      if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = target.scrollTop;
      }
      if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = target.scrollTop;
      }
      if (bodyTable && target !== bodyTable) {
        bodyTable.scrollTop = target.scrollTop;
      }
      this.store.setState(result);
    }
    this.lastScrollTop = target.scrollTop;
    if (this.props.refreshEnable) {
      this.scrollRefresh(target);
    }
  };

  scrollRefresh = (target) => {
    const {scrollEndPosition, onScrollEnd} = this.props;
    if (target.scrollTop + target.clientHeight + scrollEndPosition > target.scrollHeight && this.refreshAble) {
      if (typeof onScrollEnd === 'function') {
        onScrollEnd();
        this.refreshAble = false;
      }
    } else {
      this.refreshAble = true;
    }
  };

  resetRenderInterval = (target) => {
    const scrollTop = target.scrollTop;
    const clientHeight = target.clientHeight;
    const {rowHeight} = this.props;
    const dataSource = this.dataManager.showData() || [];
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

  handleExpandedRowKeysChange = (key, expanded) => {
    this.dataManager.resetExpandedRowKeys(key, expanded);
    this.resetData();
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
        'bordered': bordered,
        [`${prefixCls}-expanded`]: this.dataManager.isExpanded()
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
    } else if (record['key']) {
      return record['key'];
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
        handleBodyScroll={this.handleBodyScroll}
      />
    );
    return [headTable, bodyTable];
  };

  getFixedProps = (fixed) => {
    const {prefixCls, footerHeight, rowHeight, footer} = this.props;
    const height = (footer ? footerHeight : 0) + (this.dataManager.isEmpty() ? rowHeight : 0);
    return {
      className: `${prefixCls}-fixed-${fixed}`,
      style: {height: `calc(100% - ${height}px)`}
    };
  };

  renderMainTable = () => {
    const table = this.renderTable({
      columns: this.columnManager.groupedColumns()
    });
    return [table, this.renderEmptyText(), this.renderFooter()];
  };

  renderLeftFixedTable = () => {
    const table = this.renderTable({
      columns: this.columnManager.leftColumns(),
      fixed: 'left'
    });
    return (<div {...this.getFixedProps('left')}>{table}</div>);
  };

  renderRightFixedTable = () => {
    const table = this.renderTable({
      columns: this.columnManager.rightColumns(),
      fixed: 'right'
    });
    return (<div {...this.getFixedProps('right')}>{table}</div>);
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
    const scrollbarWidth = measureScrollbar();
    const style = {
      height: rowHeight,
      lineHeight: rowHeight + 'px',
      flex: `0 1 ${rowHeight}px`,
      textAlign: 'center'
    };
    if (scrollbarWidth > 0) {
      style.marginTop = `${scrollbarWidth}px`;
    }
    return typeof emptyText === 'function' ? (
      <div
        key='table-empty-text'
        className={`${prefixCls}-empty-text`}
        style={style}>
        {emptyText()}
      </div>
    ) : emptyText;
  };


  render() {
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    return (
      <Provider store={this.store}>
        <div
          className={this.getClassName()}
          ref={this.saveRef('tableNode')}
          style={this.getStyle()}
        >
          {this.renderMainTable()}
          {hasLeftFixed && this.renderLeftFixedTable()}
          {hasRightFixed && this.renderRightFixedTable()}
        </div>
      </Provider>
    );
  }
}

export default Table;

Table.childContextTypes = {
  table: PropTypes.any
};
