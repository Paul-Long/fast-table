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
import ColumnManager from './managers/ColumnManager';
import DataManager from './managers/DataManager';
import SortManager from './managers/SortManager';
import SizeManager from './managers/SizeManager';
import AutoSizer from './AutoSizer';
import {create, Provider} from './mini-store';
import {TableDefaultParams, TableParams} from './types';

import '../theme/table.css';

export default class Table extends React.PureComponent<TableParams> {
  static defaultProps = TableDefaultParams;

  static childContextTypes = {
    table: PropTypes.any
  };

  _forceTable = {};

  constructor(props) {
    super(props);
    this.lastScrollTop = 0;
    this.lastScrollLeft = 0;
    this.refreshAble = true;
    this.showCount = props.defaultShowCount || 30;
    this.columnManager = new ColumnManager(props);
    this.dataManager = new DataManager(props);
    this.sortManager = new SortManager({columns: this.columnManager.groupedColumns(), sortMulti: props.sortMulti});
    this.sizeManager = new SizeManager(props);

    this.sizeManager.update({
      _dataHeight: this.dataManager._bodyHeight,
      _dataEmpty: this.dataManager.isEmpty(),
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
      table: {
        props: this.props,
        columnManager: this.columnManager,
        dataManager: this.dataManager,
        sortManager: this.sortManager,
        sizeManager: this.sizeManager,
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
    const {getScrollSize} = this.props;
    const scrollSize = getScrollSize();
    if (scrollSize) {
      this.sizeManager.update({
        _scrollSizeX: scrollSize.x,
        _scrollSizeY: scrollSize.y
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.dataSource, this.props.dataSource)) {
      this.dataManager.reset(nextProps.dataSource);
      this.sizeManager.update({
        _dataHeight: this.dataManager._bodyHeight,
        _dataEmpty: this.dataManager.isEmpty()
      });
      this.getShowCount();
      this.resetShowData();
    }
    if (!shallowEqual(nextProps.columns, this.props.columns)) {
      this.sizeManager.update(this.columnManager.reset(nextProps));
      this.sortManager.update({columns: this.columnManager.groupedColumns(), sortMulti: nextProps.sortMulti});
      this.store.setState({orders: this.sortManager.enable});
      this.updateColumn();
    }
    if (!shallowEqual(nextProps.expandedRowKeys, this.props.expandedRowKeys)) {
      this.dataManager.resetExpandedRowKeys(nextProps.expandedRowKeys);
      this.sizeManager.update({
        _dataHeight: this.dataManager._bodyHeight,
        _dataEmpty: this.dataManager.isEmpty()
      });
      this.getShowCount();
      this.resetShowData();
    }
  }

  componentDidUpdate() {
    this.setScrollPositionClassName();
  }

  getShowCount = () => {
    const dataSource = this.dataManager.showData();
    const _height = this._height || 0;
    let showCount = 5 + (_height / this.props.rowHeight);
    showCount = showCount > dataSource.length ? dataSource.length : showCount;
    showCount = Math.max(showCount, this.props.defaultShowCount);
    this.showCount = ceil(showCount) + 2;
  };

  onResize = ({width, height}) => {
    this._width = width;
    this._height = height;
    this.sizeManager.update({
      _wrapperWidth: width,
      _wrapperHeight: height
    });
    this.updateColumn();
    this.getShowCount();
    this.resetShowData();
    this.setState({width, height});
  };

  updateColumn = () => {
    if (this.sizeManager._wrapperWidth > 0) {
      const cWidth = this.sizeManager._wrapperWidth - this.sizeManager.scrollSizeY();
      this.sizeManager.update(this.columnManager.updateWidth(cWidth));
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
    const state = {};
    if (!this.sizeManager._hasScrollY) {
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
    for (let key in this._forceTable) {
      if (this._forceTable.hasOwnProperty(key) && this._forceTable[key]) {
        this._forceTable[key](state);
      }
    }
  };

  handleExpandChange = (record) => {
    const {onExpandedRowsChange} = this.props;
    const dataManager = this.dataManager;
    const result = dataManager.expanded(record.key);
    if (typeof onExpandedRowsChange === 'function') {
      onExpandedRowsChange(result);
    }
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

  renderTable = (options) => {
    const {fixed} = options;
    const headTable = (
      <HeadTable
        key='head'
        fixed={fixed}
        saveRef={this.saveRef}
      />
    );
    const bodyTable = (
      <BodyTable
        key='body'
        fixed={fixed}
        saveRef={this.saveRef}
        handleBodyScroll={this.handleBodyScroll}
        handleExpandChange={this.handleExpandChange}
        registerForce={this.registerForce}
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
    const scrollSizeX = this.sizeManager.scrollSizeX();
    if (scrollSizeX > 0 && (fixedHeader && showHeader)) {
      style.marginTop = `${scrollSizeX}px`;
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
    const {style, prefixCls} = this.props;
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    return (
      <Provider store={this.store}>
        <AutoSizer onResize={this.onResize} className={`${prefixCls}-auto-size`}>
          {() => (
            <div
              className={this.getClassName()}
              ref={this.saveRef('tableNode')}
              style={{...style, width: this.sizeManager._wrapperWidth, height: this.sizeManager._wrapperHeight}}
            >
              <div className={`${prefixCls}-content`}>
                {this.renderMainTable()}
                {hasLeftFixed && this.renderLeftFixedTable()}
                {hasRightFixed && this.renderRightFixedTable()}
              </div>
              {this.renderFooter()}
            </div>
          )}
        </AutoSizer>
      </Provider>
    );
  }
}
