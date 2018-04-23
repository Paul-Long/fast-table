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
import {TableDefaultParams, TableParams} from './types';

import '../theme/table.css';

export default class Table extends React.PureComponent<TableParams> {
  static defaultProps = TableDefaultParams;

  static childContextTypes = {
    table: PropTypes.any
  };

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
      orders: this.sortManager.enabled(),
      bodyHeight: this.dataManager._bodyHeight
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

  componentWillMount() {
    const scrollSize = measureScrollbar();
    if (scrollSize) {
      this._scrollSizeY = scrollSize.y;
      this._scrollSizeX = scrollSize.x;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.dataManager.reset(nextProps.dataSource);
      this.hasScroll();
      this.resetShowData();
    }
    if (!shallowEqual(nextProps.columns, this.props.columns)) {
      this.columnManager.reset(nextProps.columns, this.props.colMinWidth);
      this.onResize({width: this._width || 0, height: this._height || 0});
    }
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
      footerHeight: footer ? footerHeight : 0,
      scrollSizeY: this._scrollSizeY,
      scrollSizeX: this._scrollSizeX
    };
  };

  hasScroll = () => {
    const fullHeight = this.fullSize();
    this._hasScroll = this._height > 0 && fullHeight > this._height;
    return this._hasScroll;
  };

  fullSize = () => {
    const bodyHeight = this.dataManager._bodyHeight;
    const {showHeader, footerHeight, footer, rowHeight} = this.props;
    return bodyHeight
      + (showHeader ? this._headHeight : 0)
      + (footer ? footerHeight : 0)
      + (this.dataManager.isEmpty() ? rowHeight : 0)
      + (this.columnManager.overflowX() && this._scrollSizeY ? this._scrollSizeY : 0);
  };

  onResize = ({width, height}) => {
    this.updateColumn({width, height});
    this.showCount = this.getShowCount();
    this.resetShowData();
    this.setScrollPositionClassName();
  };

  updateColumn = ({width, height}) => {
    this._width = width;
    let fullHeight = this.fullSize();
    if (fullHeight < height || !this.props.useScrollY) {
      height = fullHeight;
    }
    this._height = height;
    this.hasScroll();
    if (this._width > 0) {
      const width = this._width - (this._hasScroll ? this._scrollSizeY : 0);
      this.columnManager.updateWidth(width);
    }
  };

  setScrollPosition(position) {
    this.scrollPosition = position;
    const {tableNode} = this;
    if (tableNode) {
      const {prefixCls} = this.props;
      if (position === 'clear') {
        classes(tableNode)
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`));
      } else if (position === 'both') {
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
    if (!this.columnManager.overflowX()) {
      this.setScrollPosition('clear');
    } else if (scrollToLeft && scrollToRight) {
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
      if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = target.scrollTop;
      }
      if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = target.scrollTop;
      }
      if (bodyTable && target !== bodyTable) {
        bodyTable.scrollTop = target.scrollTop;
      }
      this.resetShowData(target);
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

  resetShowData = (target) => {
    let scrollTop = 0;
    if (!target) {
      target = this['bodyTable'];
    }
    if (target) {
      scrollTop = target.scrollTop;
    } else {
      return;
    }
    const {rowHeight} = this.props;
    const dataSource = this.dataManager.showData() || [];
    const hasScroll = this.hasScroll();
    const state = {
      hasScroll,
      bodyHeight: this.dataManager._bodyHeight,
      bodyWidth: this._width
    };
    if (!hasScroll) {
      state.startIndex = 0;
      state.stopIndex = dataSource.length - 1;
    } else {
      let startIndex = floor(scrollTop / rowHeight) - 1;
      let stopIndex = startIndex + this.showCount;
      if (this.lastScrollTop > scrollTop) {
        startIndex -= 5;
      } else {
        stopIndex += 5;
      }
      startIndex = Math.max(0, startIndex);
      stopIndex = Math.min(stopIndex, dataSource.length - 1);
      state.startIndex = startIndex;
      state.stopIndex = stopIndex;
    }
    this.store.setState(state);
  };

  handleExpandedRowKeysChange = (key, expanded) => {
    const {onExpandedRowsChange} = this.props;
    const result = this.dataManager.resetExpandedRowKeys(key, expanded);
    if (typeof onExpandedRowsChange === 'function') {
      onExpandedRowsChange(result);
    }
    this.resetShowData();
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
    return [table, this.renderEmptyText()];
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
    const style = {
      height: rowHeight,
      lineHeight: rowHeight + 'px',
      flex: `0 1 ${rowHeight}px`,
      textAlign: 'center'
    };
    if (this._scrollSizeY > 0 && (fixedHeader && showHeader) && this.columnManager.overflowX()) {
      style.marginTop = `${this._scrollSizeY}px`;
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
    const {style, prefixCls, useScrollY} = this.props;
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    return (
      <Provider store={this.store}>
        <AutoSizer onResize={this.onResize} className={`${prefixCls}-auto-size`}>
          {({width, height}) => {
            this.updateColumn({width, height});
            return (
              <div
                className={this.getClassName()}
                ref={this.saveRef('tableNode')}
                style={{...style, width: this._width, height: this._height}}
              >
                <div className={`${prefixCls}-content`}>
                  {this.renderMainTable()}
                  {hasLeftFixed && this.renderLeftFixedTable()}
                  {hasRightFixed && this.renderRightFixedTable()}
                </div>
                {this.renderFooter()}
              </div>
            );
          }}
        </AutoSizer>
      </Provider>
    );
  }
}
