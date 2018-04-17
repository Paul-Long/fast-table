import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import merge from 'lodash/merge';
import floor from 'lodash/floor';
import ceil from 'lodash/ceil';
import shallowEqual from 'shallowequal';
import classes from 'component-classes';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './ColumnManager';
import DataManager from './DataManager';
import SortManager from './SortManager';
import {measureScrollbar} from './Utils';
import AutoSizer from './AutoSizer';
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
    this._headHeight = this.columnManager.maxRowSpan() * props.headerRowHeight;
    this._hasScroll = this.hasScroll();
    this.store = create({
      currentHoverKey: null,
      hasScroll: this._hasScroll,
      headHeight: this._headHeight,
      minWidths: {},
      orders: this.sortManager.enabled(),
      ...this.dataManager.getRowsHeight(),
      newColumns: this.columnManager.groupedColumns()
    });
  }

  getChildContext() {
    return {
      table: {
        props: this.props,
        saveRef: this.saveRef,
        tableSize: this.tableSize,
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
    const scrollSize = measureScrollbar();
    this._scrollSize = scrollSize;
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.dataManager.reset(nextProps.dataSource);
      this.hasScroll();
      this.resetData();
    }
    if (!shallowEqual(nextProps.columns, this.props.columns)) {
      this.columnManager.reset(nextProps.columns, this.props.colMinWidth);
      this.onResize({width: this._width || 0, height: this._height || 0});
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  getShowCount = () => {
    const dataSource = this.dataManager.showData();
    const _height = this._height || 0;
    let showCount = 5 + (_height / this.props.rowHeight);
    showCount = showCount > dataSource.length ? dataSource.length : showCount;
    showCount = Math.max(showCount, this.props.defaultShowCount);
    return ceil(showCount) + 2;
  };

  tableSize = () => {
    const {footer, footerHeight} = this.props;
    return {
      width: this._width || 0,
      height: this._height || 0,
      headHeight: this._headHeight,
      footerHeight: footer ? footerHeight : 0
    };
  };

  hasScroll = () => {
    const fullHeight = this.fullSize();
    this._hasScroll = this._height > 0 && fullHeight > this._height;
    return this._hasScroll;
  };

  fullSize = () => {
    const {bodyHeight} = this.dataManager.getRowsHeight();
    const {showHeader, footerHeight, footer, rowHeight} = this.props;
    return bodyHeight
      + (showHeader ? this._headHeight : 0)
      + (footer ? footerHeight : 0)
      + (this.dataManager.isEmpty() ? rowHeight : 0)
      + (this.columnManager.overflowX() ? this._scrollSize : 0);
  };

  onResize = ({width, height}) => {
    this._width = width;
    this._height = height;
    this.showCount = this.getShowCount();
    this.resetData();
    this.setScrollPositionClassName();
  };

  updateColumn = () => {
    this.hasScroll();
    if (this._width > 0) {
      const width = this._width - (this._hasScroll ? this._scrollSize : 0);
      this.columnManager.updateWidth(width);
    }
  };

  resetData = () => {
    const result = this.resetRenderInterval(this['bodyTable']);
    this.store.setState({
      ...this.dataManager.getRowsHeight(),
      ...result,
      newColumns: this.columnManager.groupedColumns()
    });
  };

  setScrollPosition(position) {
    this.scrollPosition = position;
    const {tableNode} = this;
    if (tableNode) {
      const {prefixCls} = this.props;
      if (position === 'both') {
        classes(tableNode)
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-left`)
          .add(`${prefixCls}-scroll-position-right`);
      } else {
        classes(tableNode)
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
      if (this.props.refreshEnable) {
        this.scrollRefresh(target);
      }
    }
    this.lastScrollTop = target.scrollTop;
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
    let scrollTop = 0;
    if (target) {
      scrollTop = target.scrollTop;
    }
    const {rowHeight} = this.props;
    const dataSource = this.dataManager.showData() || [];
    const hasScroll = this.hasScroll();
    if (!hasScroll) {
      return {hasScroll, showData: dataSource};
    }
    let startIndex = floor(scrollTop / rowHeight) - 1;
    startIndex = startIndex < 0 ? 0 : startIndex;
    let endIndex = startIndex + this.showCount;
    const showData = dataSource.slice(startIndex, endIndex);
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
    const {fixed} = options;
    const headTable = (
      <HeadTable
        key='head'
        fixed={fixed}
      />
    );
    const bodyTable = (
      <BodyTable
        key='body'
        fixed={fixed}
        handleBodyScroll={this.handleBodyScroll}
      />
    );
    return [headTable, bodyTable];
  };

  fixedClassName = fixed => `${this.props.prefixCls}-fixed-${fixed}`;

  renderMainTable = () => {
    const table = this.renderTable({});
    return [table, this.renderEmptyText(), this.renderFooter()];
  };

  renderLeftFixedTable = () => {
    const table = this.renderTable({fixed: 'left'});
    return (<div className={this.fixedClassName('left')}>{table}</div>);
  };

  renderRightFixedTable = () => {
    const table = this.renderTable({fixed: 'right'});
    return (<div className={this.fixedClassName('right')}>{table}</div>);
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
    const {emptyText, dataSource, rowHeight, prefixCls, fixedHeader, showHeader} = this.props;
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
    if (scrollbarWidth > 0 && (fixedHeader && showHeader) && this.columnManager.overflowX()) {
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
    const {style} = this.props;
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    return (
      <Provider store={this.store}>
        <AutoSizer onResize={this.onResize}>
          {({width, height}) => {
            this._width = width;
            let fullHeight = this.fullSize();
            if (fullHeight < height) {
              height = fullHeight;
            }
            this._height = height;
            this.updateColumn();
            return (
              <div
                className={this.getClassName()}
                ref={this.saveRef('tableNode')}
                style={{...style, width, height}}
              >
                {this.renderMainTable()}
                {hasLeftFixed && this.renderLeftFixedTable()}
                {hasRightFixed && this.renderRightFixedTable()}
              </div>
            );
          }}
        </AutoSizer>
      </Provider>
    );
  }
}

export default Table;

Table.childContextTypes = {
  table: PropTypes.any
};
