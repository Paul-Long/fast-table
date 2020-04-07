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
import SelectManager from './managers/SelectManager';
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
    update: PropTypes.func,
    getProps: PropTypes.func
  };

  _forceTable = {};
  _renderEnable = false;

  constructor(props) {
    super(props);
    this.lastScrollTop = 0;
    this.lastScrollLeft = 0;
    this.refreshAble = true;
    this.position = [];
    this.showCount = props.defaultShowCount || 20;
    this.columnManager = new ColumnManager(props);
    this.dataManager = new DataManager({getProps: this.getProps});
    this.sortManager = new SortManager({
      columns: this.columnManager.groupedColumns(),
      sortMulti: props.sortMulti
    });
    this.sizeManager = new SizeManager(props);

    this.sizeManager.update({
      _dataHeight: this.dataManager._bodyHeight,
      _dataEmpty: this.dataManager.isEmpty(),
      _scrollSizeX: props.scrollSize.x,
      _scrollSizeY: props.scrollSize.y,
      ...this.columnManager.headerSize()
    });

    this.selectManager = new SelectManager({
      getProps: this.getProps,
      update: this.resetShowData
    });

    this.store = create({
      currentHoverKey: null,
      orders: this.sortManager.enabled()
    });
    this.scrollTo = this.scrollTo.bind(this);
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
        selectManager: this.selectManager
      },
      expandChange: this.handleExpandChange,
      updateScrollLeft: this.updateScrollLeft,
      update: this.resetShowData,
      getProps: this.getProps
    };
  }
  componentWillReceiveProps(nextProps) {
    const update = new Set();
    if (!shallowEqual(nextProps.showStartIndex, this.props.showStartIndex)) {
      this.sizeManager.update({
        _showStartIndex: nextProps.showStartIndex
      });
    }
    if (!shallowEqual(nextProps.rowSelection, this.props.rowSelection)) {
      this.selectManager.updateSelection(nextProps.rowSelection);
    }
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.dataManager.reset(nextProps.dataSource);
      const dh = this.sizeManager._dataHeight;
      this.selectManager.count = this.selectManager.getKeys(
        this.dataManager.getData()
      ).length;
      this.sizeManager.update({
        _dataHeight: this.dataManager._bodyHeight,
        _dataEmpty: this.dataManager.isEmpty()
      });
      if (dh !== 0 && this.sizeManager._dataHeight === 0) {
        this.sizeManager.update({_scrollTop: 0});
        this.updateScrollTop({scrollTop: 0});
      }
      if (
        nextProps.pullDown &&
        dh < this.sizeManager._dataHeight &&
        this.sizeManager._hasScrollY &&
        this.sizeManager._scrollTop < 5
      ) {
        const top = this.sizeManager._dataHeight - dh;
        this.sizeManager.update({
          _scrollTop: this.sizeManager._scrollTop + top
        });
        this.updateScrollTop({scrollTop: this.sizeManager._scrollTop});
      }
      update.add('updateColumn');
      update.add('getShowCount');
      update.add('resetShowData');
    }
    if (!shallowEqual(nextProps.columns, this.props.columns)) {
      this.sizeManager.update(this.columnManager.reset(nextProps));
      this.sortManager.update({
        columns: this.columnManager.groupedColumns(),
        sortMulti: nextProps.sortMulti
      });
      this.store.setState({orders: this.sortManager.enable});
      update.add('updateColumn');
    }
    if (!shallowEqual(nextProps.expandedRowKeys, this.props.expandedRowKeys)) {
      this.dataManager.resetExpandedRowKeys(nextProps.expandedRowKeys);
      this.sizeManager.update({
        _dataHeight: this.dataManager._bodyHeight,
        _dataEmpty: this.dataManager.isEmpty()
      });
      update.add('getShowCount');
      update.add('resetShowData');
    }
    update.forEach((f) => this[f]());
  }

  componentDidUpdate() {
    this.setPositionClass();
    this.skipIndex();
  }

  scrollTo(t) {
    const target = this['bodyTable'];
    if (!target) return;
    const clientHeight = target.clientHeight;
    const scrollHeight = target.scrollHeight;
    let scrollTop = Math.min(t, scrollHeight - clientHeight);
    this.updateScrollTop({scrollTop});
    this.sizeManager.update({_scrollTop: scrollTop});
    this.resetShowData();
  }

  getProps = (prop) => this.props[prop];

  getShowCount = () => {
    const {showHeader} = this.props;
    const dataSource = this.dataManager.showData();
    if (!this.sizeManager.useScrollY) {
      this.showCount = (dataSource || []).length;
      return;
    }
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

  setPositionClass = (tg) => {
    let target = tg;
    if (!target) {
      target = this['bodyTable'];
    }
    if (!target) return;
    const left = target.scrollLeft;
    const top = target.scrollTop;
    const clientWidth = target.clientWidth;
    const clientHeight = target.clientHeight;
    const scrollHeight = target.scrollHeight;
    const scrollWidth = target.scrollWidth;
    let position = {};
    let xp;
    if (!this.sizeManager._hasScrollX) {
      xp = 'clear';
    } else {
      if (left === 0) {
        xp = 'x-left';
      } else if (left + clientWidth < scrollWidth) {
        xp = 'x-middle';
      } else if (left + clientWidth === scrollWidth) {
        xp = 'x-right';
      }
    }
    if (xp) position.xp = xp;
    let yp;
    if (!this.sizeManager._hasScrollY) {
      yp = 'clear';
    } else {
      if (top === 0) {
        yp = 'y-top';
      } else if (top + clientHeight < scrollHeight) {
        yp = 'y-middle';
      } else if (top + clientHeight === scrollHeight) {
        yp = 'y-bottom';
      }
    }
    if (yp) position.yp = yp;
    if (this.position.xp !== position.xp || this.position.yp !== position.yp) {
      this.position = position;
      const {tableNode} = this;
      if (tableNode) {
        const {prefixCls} = this.props;
        let cs = classes(tableNode);
        if (position.xp) {
          cs.remove(new RegExp(`^${prefixCls}-scroll-position-x-.+$`));
          position.xp !== 'clear' &&
            cs.add(`${prefixCls}-scroll-position-${position.xp}`);
        }
        if (position.yp) {
          cs.remove(new RegExp(`^${prefixCls}-scroll-position-y-.+$`));
          position.yp !== 'clear' &&
            cs.add(`${prefixCls}-scroll-position-${position.yp}`);
        }
      }
    }
  };

  handleBodyScroll = (e) => {
    const {onScroll} = this.props;
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
    if (typeof onScroll === 'function') {
      onScroll(e);
    }

    if (e.target !== e.currentTarget) {
      return;
    }
    this.setPositionClass(e.target);
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
      // this.setScrollPositionClassName();
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
      // this.setScrollPositionClassName();
      this.setPositionClass();
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

  updateScrollTopEnable = (nextProps) => {};

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

  skipIndex = () => {
    const dataSource = this.dataManager.showData() || [];
    if (this.sizeManager._showStartIndex > 0 && dataSource.length > 0) {
      const state = {};
      state.startIndex = this.sizeManager._showStartIndex;
      state.stopIndex = state.startIndex + this.showCount + 2;
      if (state.stopIndex > dataSource.length - 1) {
        state.stopIndex = dataSource.length - 1;
        state.startIndex = state.stopIndex - this.showCount - 2;
      }
      this.lastScrollTop = dataSource[state.startIndex][DS._top];
      this.updateScrollTop({
        scrollTop: dataSource[state.startIndex][DS._top]
      });
      this.sizeManager.update({
        _startIndex: state.startIndex,
        _stopIndex: state.stopIndex,
        _showStartIndex: 0,
        _scrollTop: dataSource[state.startIndex][DS._top]
      });
      for (let key in this._forceTable) {
        if (this._forceTable.hasOwnProperty(key) && this._forceTable[key]) {
          this._forceTable[key](state);
        }
      }
    }
  };

  resetShowData = (target) => {
    if (target) {
      this.sizeManager.update({_scrollTop: target.scrollTop});
    }
    const scrollTop = this.sizeManager._scrollTop;
    const {rowHeight} = this.props;
    const dataSource = this.dataManager.showData() || [];
    const state = {};
    if (!this.sizeManager._hasScrollY || !this.sizeManager.useScrollY) {
      state.startIndex = 0;
      state.stopIndex = dataSource.length;
    } else {
      let startIndex = floor(scrollTop / rowHeight) - 1;
      for (let i = 0; i < dataSource.length; i++) {
        if (scrollTop < dataSource[i][DS._top]) {
          startIndex = i - 1;
          break;
        }
      }
      state.startIndex = Math.max(0, startIndex - 1);
      state.stopIndex = Math.min(
        state.startIndex + this.showCount + 2,
        dataSource.length
      );
    }
    this.sizeManager.update({
      _startIndex: state.startIndex,
      _stopIndex: state.stopIndex
    });
    for (let key in this._forceTable) {
      if (this._forceTable.hasOwnProperty(key) && this._forceTable[key]) {
        if (target) {
          if (key.endsWith('body')) {
            this._forceTable[key](state);
          }
        } else {
          this._forceTable[key](state);
        }
      }
    }
  };

  handleExpandChange = (key) => {
    const {onExpandedRowsChange} = this.props;
    const dataManager = this.dataManager;
    const result = dataManager.expanded(key);
    if (typeof onExpandedRowsChange === 'function') {
      onExpandedRowsChange(result);
    }
    this.getShowCount();
    this.sizeManager.update({
      _dataHeight: this.dataManager._bodyHeight
    });
    this.resetShowData();
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
      [`${prefixCls}-expanded`]: this.dataManager.isExpanded(),
      [`${prefixCls}-scroll-position-y-top`]:
        this.sizeManager._hasScrollY && this.sizeManager._scrollTop === 0
    });
  };

  renderTable = (options) => {
    const {fixed} = options;
    const headTable = (
      <HeadTable
        key='head'
        fixed={fixed}
        saveRef={this.saveRef}
        registerForce={this.registerForce}
      />
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
    if (scrollSizeX > 0 && fixedHeader && showHeader) {
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
    const {prefixCls, useScrollY} = this.props;
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    const style = {...this.props.style};
    style.width = this.sizeManager._wrapperWidth;
    if (useScrollY) {
      style.height = this.sizeManager._wrapperHeight;
    }
    return (
      <div
        className={this.getClassName()}
        ref={this.saveRef('tableNode')}
        style={style}
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
    const {prefixCls, useScrollY} = this.props;
    const autoSizeProps = {
      ...this.props,
      onResize: this.onResize,
      className: `${prefixCls}-auto-size`,
      disableHeight: !useScrollY
    };
    return (
      <Provider store={this.store}>
        <AutoSizer {...autoSizeProps}>{this.renderChild}</AutoSizer>
      </Provider>
    );
  }
}
