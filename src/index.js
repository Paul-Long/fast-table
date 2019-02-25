import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import floor from 'lodash/floor';
import ceil from 'lodash/ceil';
import shallowEqual from 'shallowequal';
import classes from 'component-classes';

import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ColumnManager from './managers/ColumnManager';
import DataManager from './managers/DataManager';
import SortManager from './managers/SortManager';
import SizeManager from './managers/SizeManager';
import CacheManager from './managers/CacheManager';
import AutoSizer from './AutoSizer';
import {create, Provider} from './mini-store';
import {DS, TableDefaultParams, TableParams} from './types';
import {measureScrollbar} from './utils';

import '../theme/table.css';

export default class Table extends React.PureComponent<TableParams> {
  static defaultProps = TableDefaultParams;

  static childContextTypes = {
    props: PropTypes.object,
    manager: PropTypes.object,
    expandChange: PropTypes.func,
    updateScrollLeft: PropTypes.func,
    update: PropTypes.func
  };

  _forceTable = {};
  _renderEnable = false;

  constructor(props) {
    super(props);
    this.lastScrollTop = 0;
    this.lastScrollLeft = 0;
    this.refreshAble = true;
    this.showCount = props.defaultShowCount || 20;
    this.columnManager = new ColumnManager(props);
    this.dataManager = new DataManager(props);
    this.sortManager = new SortManager({
      columns: this.columnManager.groupedColumns(),
      sortMulti: props.sortMulti
    });
    this.sizeManager = new SizeManager(props);
    this.cacheManager = new CacheManager();

    this.sizeManager.update({
      _dataHeight: this.dataManager._bodyHeight,
      _dataEmpty: this.dataManager.isEmpty(),
      _scrollSizeX: props.scrollSize.x,
      _scrollSizeY: props.scrollSize.y,
      ...this.columnManager.headerSize()
    });

    this.store = create({
      currentHoverKey: null,
      orders: this.sortManager.enabled()
    });
  }

  state = {
    width: 0,
    height: 0
  };

  getChildContext() {
    return {
      props: this.props,
      manager: {
        columnManager: this.columnManager,
        dataManager: this.dataManager,
        sortManager: this.sortManager,
        sizeManager: this.sizeManager,
        cacheManager: this.cacheManager
      },
      expandChange: this.handleExpandChange,
      updateScrollLeft: this.updateScrollLeft,
      update: this.updateAll
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.dataManager.reset(nextProps.dataSource);
      this.sizeManager.update({
        _dataHeight: this.dataManager._bodyHeight,
        _dataEmpty: this.dataManager.isEmpty()
      });
      this.cacheManager.reset();
      this.getShowCount();
      this.resetShowData();
    }
    if (!shallowEqual(nextProps.columns, this.props.columns)) {
      this.sizeManager.update(this.columnManager.reset(nextProps));
      this.sortManager.update({
        columns: this.columnManager.groupedColumns(),
        sortMulti: nextProps.sortMulti
      });
      this.store.setState({orders: this.sortManager.enable});
      this.cacheManager.reset();
      this.updateColumn();
    }
    if (!shallowEqual(nextProps.expandedRowKeys, this.props.expandedRowKeys)) {
      this.dataManager.resetExpandedRowKeys(nextProps.expandedRowKeys);
      this.sizeManager.update({
        _dataHeight: this.dataManager._bodyHeight,
        _dataEmpty: this.dataManager.isEmpty()
      });
      this.cacheManager.reset();
      this.getShowCount();
      this.resetShowData();
    }
  }

  componentDidUpdate() {
    this.setScrollPositionClassName();
  }

  updateAll = () => {
    this.resetShowData();
  };

  getShowCount = () => {
    const {showHeader} = this.props;
    const dataSource = this.dataManager.showData();
    let _height = this._height || 0;
    if (showHeader) {
      _height -= this.sizeManager._headerHeight;
      _height = Math.max(_height, 0);
    }
    this.showCount = Math.min(
      ceil(_height / this.props.rowHeight),
      dataSource.length
    );
  };

  onResize = ({width, height}) => {
    if (this._width !== width || this._height !== height) {
      this._renderEnable = true;
      this._width = width;
      this._height = height;
      this.cacheManager.reset();
      this.sizeManager.update({
        _wrapperWidth: width,
        _wrapperHeight: height,
        _scrollSizeX: measureScrollbar('horizontal'),
        _scrollSizeY: measureScrollbar()
      });
      this.getShowCount();
      this.updateColumn();
      this.resetShowData();
    }
  };

  updateColumn = () => {
    if (this.sizeManager._wrapperWidth > 0) {
      const cWidth =
        this.sizeManager._wrapperWidth - this.sizeManager.scrollSizeY();
      this.sizeManager.update(this.columnManager.updateWidth(cWidth));
    }
  };

  setScrollPosition(position) {
    this.scrollPosition = position;
    const {tableNode} = this;
    if (tableNode) {
      const {prefixCls} = this.props;
      if (position === 'clear') {
        classes(tableNode).remove(
          new RegExp(`^${prefixCls}-scroll-position-.+$`)
        );
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
    const scrollToRight =
      node.scrollLeft + 1 >=
      node.children[0].getBoundingClientRect().width -
        node.getBoundingClientRect().width;
    if (!this.sizeManager._hasScrollX) {
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
    const {onScroll} = this.props;
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
    if (typeof onScroll === 'function') {
      onScroll(e);
    }
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
    this.sizeManager.update({_scrollLeft: this.lastScrollLeft});
  };

  updateScrollLeft = (scrollLeft) => {
    const {headTable, bodyTable} = this;
    if (!bodyTable || bodyTable.scrollHeight === 0) {
      return;
    }
    if (this.lastScrollLeft !== scrollLeft) {
      if (headTable) {
        headTable.scrollLeft = scrollLeft;
      }
      if (bodyTable) {
        bodyTable.scrollLeft = scrollLeft;
      }
      this.setScrollPositionClassName();
    }
    this.lastScrollLeft = scrollLeft;
    this.sizeManager.update({_scrollLeft: this.lastScrollLeft});
  };

  updateScrollTop = (target) => {
    ['bodyTable', 'fixedColumnsBodyLeft', 'fixedColumnsBodyRight'].forEach(
      (node) => {
        if (this[node] && target !== this[node]) {
          this[node].scrollTop = target.scrollTop;
        }
      }
    );
  };

  handleBodyScrollTop = (e) => {
    const target = e.target;
    if (target !== e.currentTarget) {
      return;
    }
    const {headTable} = this;
    if (this.lastScrollTop !== target.scrollTop && target !== headTable) {
      this.updateScrollTop(target);
      this.sizeManager.update({_scrollTop: target.scrollTop});
      this.resetShowData(target);
      if (this.props.refreshEnable) {
        this.scrollRefresh(target);
      }
    }
    this.lastScrollTop = target.scrollTop;
  };

  scrollRefresh = (target) => {
    const {scrollEndPosition, onScrollEnd} = this.props;
    if (
      target.scrollTop + target.clientHeight + scrollEndPosition >
        target.scrollHeight &&
      this.refreshAble
    ) {
      if (typeof onScrollEnd === 'function') {
        onScrollEnd();
        this.refreshAble = false;
      }
    } else {
      this.refreshAble = true;
    }
  };

  resetShowData = () => {
    let scrollTop = this.sizeManager._scrollTop;
    const {rowHeight} = this.props;
    const dataSource = this.dataManager.showData() || [];
    const state = {};
    if (!this.sizeManager._hasScrollY) {
      state.startIndex = 0;
      state.stopIndex = dataSource.length - 1;
    } else {
      let startIndex = floor(scrollTop / rowHeight) - 1;
      for (let i = 0; i < dataSource.length; i++) {
        if (scrollTop < dataSource[i][DS._top]) {
          startIndex = i - 1;
          break;
        }
      }
      state.startIndex = Math.max(0, startIndex - 2);
      state.stopIndex = Math.min(
        startIndex + this.showCount + 2,
        dataSource.length - 1
      );
    }
    this.sizeManager.update({
      _startIndex: state.startIndex,
      _stopIndex: state.stopIndex
    });
    for (let key in this._forceTable) {
      if (this._forceTable.hasOwnProperty(key) && this._forceTable[key]) {
        this._forceTable[key](state);
      }
    }
  };

  handleExpandChange = (key) => {
    const {onExpandedRowsChange} = this.props;
    const dataManager = this.dataManager;
    this.cacheManager.reset();
    const result = dataManager.expanded(key);
    if (typeof onExpandedRowsChange === 'function') {
      onExpandedRowsChange(result);
    }
    this.getShowCount();
    this.sizeManager.update({
      _dataHeight: this.dataManager._bodyHeight
    });
    this.resetShowData();
    this.forceUpdate();
  };

  saveRef = (name) => (node) => {
    this[name] = node;
  };

  registerForce = (name, fn) => {
    this._forceTable[name || 'body'] = fn;
  };

  getClassName = () => {
    const {prefixCls, className, fixedHeader, bordered} = this.props;
    return classNames(prefixCls, className, {
      [`${prefixCls}-fixed-header`]: fixedHeader,
      bordered: bordered,
      [`${prefixCls}-expanded`]: this.dataManager.isExpanded()
    });
  };

  renderTable = (options) => {
    const {fixed} = options;
    const headTable = (
      <HeadTable key='head' fixed={fixed} saveRef={this.saveRef} />
    );
    const bodyTable = (
      <BodyTable
        key='body'
        fixed={fixed}
        saveRef={this.saveRef}
        handleBodyScroll={this.handleBodyScroll}
        registerForce={this.registerForce}
      />
    );
    return [headTable, bodyTable];
  };

  fixedClassName = (fixed) => `${this.props.prefixCls}-fixed-${fixed}`;

  renderMainTable = () => {
    const table = this.renderTable({});
    return [table, this.renderEmptyText()];
  };

  renderLeftFixedTable = () => {
    const table = this.renderTable({fixed: 'left'});
    return <div className={this.fixedClassName('left')}>{table}</div>;
  };

  renderRightFixedTable = () => {
    const table = this.renderTable({fixed: 'right'});
    return <div className={this.fixedClassName('right')}>{table}</div>;
  };

  renderFooter = () => {
    const {footer, footerHeight, prefixCls} = this.props;
    return footer ? (
      <div
        key='table-footer'
        className={`${prefixCls}-footer`}
        style={{
          flex: `0 1 ${footerHeight}px`,
          height: footerHeight,
          color: 'inherit'
        }}
      >
        {footer(this.props.dataSource)}
      </div>
    ) : null;
  };

  renderEmptyText = () => {
    const {
      emptyText,
      dataSource,
      rowHeight,
      prefixCls,
      fixedHeader,
      showHeader
    } = this.props;
    if (dataSource && dataSource.length > 0) {
      return null;
    }
    const style = {
      height: rowHeight,
      lineHeight: rowHeight + 'px',
      flex: `0 1 ${rowHeight}px`,
      textAlign: 'center'
    };
    const scrollSizeX = this.sizeManager.scrollSizeX();
    if (scrollSizeX > 0 && (fixedHeader && showHeader)) {
      style.marginTop = `${scrollSizeX}px`;
    }
    return typeof emptyText === 'function' ? (
      <div
        key='table-empty-text'
        className={`${prefixCls}-empty-text`}
        style={style}
      >
        {emptyText()}
      </div>
    ) : (
      emptyText
    );
  };

  renderChild = (params) => {
    if (!this._renderEnable) {
      return null;
    }
    this.onResize(params);
    const {style, prefixCls} = this.props;
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    return (
      <div
        className={this.getClassName()}
        ref={this.saveRef('tableNode')}
        style={{
          ...style,
          width: this.sizeManager._wrapperWidth,
          height: this.sizeManager._wrapperHeight
        }}
      >
        <div className={`${prefixCls}-content`}>
          {this.renderMainTable()}
          {hasLeftFixed && this.renderLeftFixedTable()}
          {hasRightFixed && this.renderRightFixedTable()}
        </div>
        {this.renderFooter()}
      </div>
    );
  };

  render() {
    const {prefixCls} = this.props;
    const autoSizeProps = {
      ...this.props,
      onResize: this.onResize,
      className: `${prefixCls}-auto-size`
    };
    return (
      <Provider store={this.store}>
        <AutoSizer {...autoSizeProps}>{this.renderChild}</AutoSizer>
      </Provider>
    );
  }
}
