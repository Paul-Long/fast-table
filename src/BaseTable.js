import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import Row from './TableRow';
import {connect} from './mini-store';
import renderExpandedIcon from './ExpandedIcon';
import Cell from './TableCell';
import Select from './Select';
import {CS, DS, eventsMap} from './types';
import {cellAlignStyle, isInvalidRenderCellText, has, keys} from './utils';

type Props = {
  currentHoverKey: string,
  startIndex: number,
  stopIndex: number,
  orders: Object,
  fixed: string,
  hasHead: boolean,
  hasBody: boolean,
  registerForce: Function,
  columns: Array
};

class BaseTable extends React.PureComponent<Props> {
  _children = [];
  _startIndex = 0;
  _stopIndex = 0;
  _forceCount = 0;

  static contextTypes = {
    props: PropTypes.object,
    manager: PropTypes.object,
    expandChange: PropTypes.func,
    update: PropTypes.func
  };

  componentWillMount() {
    this.start = new Date().getTime();
    this._forceCount = 0;
    const {registerForce, fixed, hasHead, hasBody} = this.props;
    const {sizeManager} = this.context.manager;
    if (registerForce) {
      let name = fixed;
      if (hasHead) {
        name += '-head';
      }
      if (hasBody) {
        name += '-body';
      }
      registerForce(name, this.recomputeBody);
    }
    this._startIndex = sizeManager._startIndex;
    this._stopIndex = sizeManager._stopIndex;
    this.renderRows(this.props);
  }
  componentWillUpdate(np) {
    if (np.hasBody) this.renderRows(np);
  }

  fExpanded = (event) => {
    event.stopPropagation();
    const {expandChange} = this.context;
    expandChange(event.currentTarget.getAttribute('data-key'));
  };

  fSort = (key, order) => {
    const {sortManager} = this.context.manager;
    const onSort = this.context.props.onSort;
    sortManager.setOrder(key, order, (orders) => {
      this.props.store.setState({orders});
      if (typeof onSort === 'function') {
        onSort(orders, key, order);
      }
    });
  };

  getRowData = (event) => {
    const key = event.currentTarget.getAttribute('data-key');
    const {dataManager} = this.context.manager;
    return dataManager.getByKey(key) || {};
  };

  fEvents = (event) => {
    const record = this.getRowData(event);
    const {expandChange} = this.context;
    const {expandedRowByClick, onRow} = this.context.props;
    const events = onRow(record) || {};
    const func = eventsMap[event.type];
    if (has(events, func) && typeof events[func] === 'function') {
      events[func](event);
    }
    if (event.type === 'click') {
      expandedRowByClick && record[DS._expandedEnable] && expandChange(record[DS._key]);
    } else if (event.type === 'mouseenter') {
      this.fHover(true, record[DS._key]);
    } else if (event.type === 'mouseleave') {
      this.fHover(false, record[DS._key]);
    }
  };

  fHover = (isHover, key) => {
    const {hoverEnable} = this.context.props;
    if (hoverEnable) {
      this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    }
  };

  fDrag = (parent, columns) => {
    const {update} = this.context;
    const {onHeaderSortable} = this.context.props;
    const {columnManager} = this.context.manager;
    columnManager.updateGroupedColumns(this.updateColumn(columnManager.groupedColumns(), parent, columns));
    this._forceCount += 1;
    if (typeof update === 'function') {
      update();
    }
    if (typeof onHeaderSortable === 'function') {
      onHeaderSortable(columnManager.groupedColumns());
    }
    this.forceUpdate();
  };

  updateColumn = (columns, parent, newColumns) => {
    columns = columns || [];
    if (!parent) {
      return newColumns;
    }
    return columns.map((column) => {
      if (column[CS._pathKey] === parent[CS._pathKey]) {
        column = {...column, children: newColumns};
      } else {
        if (column.children && column.children.length > 0) {
          return {
            ...column,
            children: this.updateColumn(column.children, parent, newColumns)
          };
        }
      }
      return column;
    });
  };

  getCellStyle = (column, record) => {
    const {onCell} = column;
    const align = column.align || 'left';
    const width = column[CS._width];
    let style = {...cellAlignStyle(align)};
    if (width) {
      style.width = width;
      style.minWidth = width;
    }
    if (onCell) {
      style = {...style, ...onCell(column, record)};
    }
    return style;
  };

  getCellText = (column, record) => {
    const {render, dataIndex} = column;
    let text = (record || {})[dataIndex];
    if (typeof render === 'function') {
      text = render(text, record, record[DS._index]);
    }
    if (isInvalidRenderCellText(text)) {
      text = null;
    }
    return text;
  };

  recomputeBody = ({startIndex, stopIndex}) => {
    const {hasBody} = this.props;
    if (hasBody) {
      this._startIndex = startIndex;
      this._stopIndex = stopIndex;
    }
    if (hasBody) {
      this.renderRows(this.props);
    }
    this.forceUpdate();
  };

  getRowStyle = (record, key) => {
    const {sizeManager} = this.context.manager;
    let rowStyle = {
      position: 'absolute',
      top: record[DS._top],
      height: record[DS._height],
      lineHeight: `${record[DS._height] - 1}px`
    };
    if (record[DS._isFixed] === true || record[DS._isFixed] === 'top') {
      rowStyle.top += sizeManager._scrollTop;
      rowStyle.zIndex = 1;
    } else if (record[DS._isFixed] === 'bottom') {
      if (sizeManager._hasScrollY) {
        rowStyle.top -=
          sizeManager._dataHeight + sizeManager.scrollSizeX() - sizeManager._scrollTop - sizeManager._clientBodyHeight;
      }
      rowStyle.zIndex = 1;
    }
    return rowStyle;
  };

  h_selectAll = () => {
    const {selectManager, dataManager} = this.context.manager;
    const keys = selectManager.getKeys(dataManager.getData());
    selectManager.selectAll(keys);
  };

  r_selectAll = () => {
    const {prefixCls} = this.context.props;
    const {selectManager, dataManager} = this.context.manager;
    const keys = selectManager.getKeys(dataManager.getData());
    selectManager.count = keys.length;
    return Select({
      prefixCls,
      selected: selectManager.selectedAll,
      type: 'checkbox',
      onClick: this.h_selectAll
    });
  };

  r_select = (record) => {
    const {prefixCls} = this.context.props;
    const {selectManager} = this.context.manager;
    const selected = selectManager.selectedKeys.includes(record[DS._key]);
    return Select({
      prefixCls,
      selected,
      disabled: selectManager.disabled(record),
      type: selectManager.type,
      onClick: () => selectManager.select(record, !selected)
    });
  };

  renderCells = (props, record) => {
    const {fixed} = props;
    const {prefixCls, indentSize} = this.context.props;
    const {dataManager, columnManager, selectManager} = this.context.manager;
    const columns = columnManager.bodyColumns(fixed);
    const hasExpanded = dataManager._hasExpanded;
    const cells = [];
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const cellKey = `Row[${record[DS._path]}]-Col[${col[CS._pathKey]}]-${i}_${fixed || ''}-${
        this._forceCount
      }`;
      let cell;
      const cellProps = {
        key: cellKey,
        className: col.className,
        style: this.getCellStyle(col, record)
      };
      if (selectManager.enable && fixed !== 'right' && i === 0) {
        cellProps.SelectIcon = this.r_select(record, fixed);
      }
      if (typeof col.onColSpan === 'function') {
        let span = col.onColSpan(col, record);
        if (typeof span !== 'number' || isNaN(span)) {
          span = 1;
        }
        if (span > 1) {
          let spanWidth = 0;
          for (let j = 0; j < span; j += 1) {
            const {width} = this.getCellStyle(columns[i], record);
            if (typeof width === 'number') spanWidth += width;
            if (j < span - 1) {
              i += 1;
            }
          }
          cellProps.style.width = spanWidth;
        }
      }
      if (hasExpanded && fixed !== 'right' && i === 0) {
        cellProps.ExpandedIcon = renderExpandedIcon({
          prefixCls,
          indentSize,
          record,
          onClick: this.fExpanded
        });
      }
      cell = <Cell {...cellProps}>{this.getCellText(col, record)}</Cell>;
      cells.push(cell);
    }
    return cells;
  };

  renderRowChildren = (props, record) => {
    const {expandedRowRender} = this.context.props;
    if (expandedRowRender && record[DS._expandedLevel] > 0) {
      return expandedRowRender(record, props.fixed, record[DS._expandedLevel]);
    } else {
      return this.renderCells(props, record);
    }
  };

  renderRows = (props) => {
    const rows = [];
    const {fixed, currentHoverKey} = props;
    const {prefixCls, onRow, rowProps} = this.context.props;
    const {dataManager} = this.context.manager;
    const showData = dataManager.showData();
    let dataSource = showData.slice(this._startIndex, this._stopIndex);
    const fixedData = dataManager.getFixedData() || [];
    let top = undefined,
      bottom = undefined;
    fixedData.forEach((fd) => {
      if (fd[DS._isFixed] === true || fd[DS._isFixed] === 'top') top = fd;
      if (fd[DS._isFixed] === 'bottom' && bottom === undefined) bottom = fd;
    });
    dataSource = dataSource.filter((d) => !dataManager.isFixed(d)).concat(fixedData);
    for (let index = 0; index < dataSource.length; index++) {
      const record = dataSource[index];
      const cells = this.renderRowChildren(props, record);
      const key = `Row_${fixed || ''}_${record[DS._path]}_${this._forceCount}`;
      let defineProps = {};
      if (typeof rowProps === 'function') {
        defineProps = rowProps(record, index + this._startIndex);
      }
      const rowProps = {
        key,
        prefixCls,
        cells,
        record,
        hovered: currentHoverKey === record[DS._key],
        style: this.getRowStyle(record, key),
        ...(defineProps || {})
      };
      if (top === record) rowProps.isTop = true;
      if (bottom === record) rowProps.isBottom = true;
      keys(onRow(record) || {}, record[DS._index]).forEach((event) => (rowProps[event] = this.fEvents));
      ['onClick', 'onMouseEnter', 'onMouseLeave'].forEach((event) => {
        if (!has(onRow(record), event)) {
          rowProps[event] = this.fEvents;
        }
      });
      rows.push(<Row {...rowProps}>{cells}</Row>);
    }
    this._children = rows;
    return this._children;
  };

  r_header = () => {
    const {hasHead, fixed, orders} = this.props;
    const {columnManager, selectManager} = this.context.manager;
    const {prefixCls, headerRowHeight, onHeaderRow} = this.context.props;
    if (!hasHead) return null;
    const props = {
      columns: columnManager.headColumns(fixed),
      fixed,
      onSort: this.fSort,
      orders,
      prefixCls,
      headerRowHeight,
      onHeaderRow,
      onDrag: this.fDrag
    };
    if (selectManager.useSelectAll) {
      props.SelectIcon = this.r_selectAll();
      props.selectedAll = selectManager.selectedAll;
    }
    return TableHeader(props);
  };

  render() {
    const {hasBody, fixed} = this.props;
    const {columnManager, sizeManager} = this.context.manager;
    const {rowHeight} = this.context.props;
    let body;
    if (hasBody) {
      body = (
        <div className='tbody' style={{height: sizeManager._dataHeight, minHeight: rowHeight}}>
          {this._children}
        </div>
      );
    }

    const width = columnManager.getWidth(fixed) || '100%';
    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    const header = this.r_header();
    return (
      <div className='table' style={style}>
        {header}
        {body}
      </div>
    );
  }
}

export default connect((state) => {
  const {currentHoverKey, orders} = state;
  return {
    // currentHoverKey,
    orders
  };
})(BaseTable);
