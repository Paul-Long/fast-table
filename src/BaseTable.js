import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import Row from './TableRow';
import {connect} from './mini-store';
import renderExpandedIcon from './ExpandedIcon';
import Cell from './TableCell';
import {CS, DS} from './types';
import {cellAlignStyle, isInvalidRenderCellText} from './utils';

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

  static contextTypes = {
    table: PropTypes.any,
    expandChange: PropTypes.func
  };

  componentWillMount() {
    const {registerForce, fixed} = this.props;
    const {sizeManager} = this.context.table;
    if (registerForce) {
      registerForce(fixed, this.recomputeBody);
    }
    this._startIndex = sizeManager._startIndex;
    this._stopIndex = sizeManager._stopIndex;
    this.renderRows(this.props);
  }

  componentWillUpdate(nextProps) {
    this.renderRows(nextProps);
  }

  handleExpanded = (event) => {
    event.stopPropagation();
    const {expandChange} = this.context;
    expandChange(event.currentTarget.getAttribute('data-key'));
  };

  handleSort = (key, order) => {
    const {sortManager, props} = this.context.table;
    const onSort = props.onSort;
    sortManager.setOrder(key, order, (orders) => {
      this.props.store.setState({orders});
      if (typeof onSort === 'function') {
        onSort(orders);
      }
    });
  };

  getRowData = (event) => {
    const key = event.currentTarget.getAttribute('data-key');
    const {dataManager} = this.context.table;
    return dataManager.getByKey(key);
  };

  handleRowClick = (event) => {
    const {table, expandChange} = this.context;
    const record = this.getRowData(event);
    const {expandedRowByClick, onRow} = table.props;
    const {onClick} = onRow(record);
    if (expandedRowByClick && record[DS._expandedEnable]) {
      expandChange(record[DS._key]);
    }
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  handleRowMouseEnter = (event) => {
    const record = this.getRowData(event);
    const {onRow} = this.context.table.props;
    const {onMouseEnter} = onRow(record);
    this.handleRowHover(true, record[DS._key]);
    if (typeof onMouseEnter === 'function') {
      onMouseEnter(event);
    }
  };

  handleRowMouseLeave = (event) => {
    const record = this.getRowData(event);
    const {onRow} = this.context.table.props;
    const {onMouseLeave} = onRow(record);
    this.handleRowHover(false, record[DS._key]);
    if (typeof onMouseLeave === 'function') {
      onMouseLeave(event);
    }
  };

  handleRowHover = (isHover, key) => {
    const table = this.context.table;
    const {hoverEnable} = table.props;
    if (hoverEnable) {
      this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    }
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
      text = render(text, record);
    }
    if (isInvalidRenderCellText(text)) {
      text = null;
    }
    return text;
  };

  recomputeBody = ({startIndex, stopIndex}) => {
    this._startIndex = startIndex;
    this._stopIndex = stopIndex;
    this.forceUpdate();
  };

  getRowStyle = (record, key) => {
    const table = this.context.table;
    const {sizeManager, cacheManager, dataManager} = table;

    let rowStyle = cacheManager.getRowStyle(key);
    if (!rowStyle || dataManager.isFixed(record)) {
      rowStyle = {
        position: 'absolute',
        top: record[DS._top],
        height: record[DS._height]
      };
      if (record[DS._isFixed] === true || record[DS._isFixed] === 'top') {
        rowStyle.top += sizeManager._scrollTop;
        rowStyle.zIndex = 1;
      } else if (record[DS._isFixed] === 'bottom') {
        rowStyle.top -=
          sizeManager._dataHeight +
          sizeManager.scrollSizeX() -
          sizeManager._scrollTop -
          sizeManager._clientBodyHeight;
        rowStyle.zIndex = 1;
      }
      if (!record[DS._isFixed]) {
        cacheManager.setRowStyle(key, rowStyle);
      }
    }
    return rowStyle;
  };

  renderCells = (props, record) => {
    const {fixed} = props;
    const table = this.context.table;
    const {prefixCls, indentSize} = table.props;
    const {dataManager, cacheManager, columnManager} = table;
    const columns = columnManager.bodyColumns(fixed);
    const hasExpanded = dataManager._hasExpanded;
    const cells = [];
    for (let i = 0; i < columns.length; i++) {
      const cellKey = `Row${record[DS._path]}-Col${i}_${fixed}`;
      let cell = cacheManager.getCell(cellKey);
      if (!cell || record[DS._isFixed]) {
        const cellProps = {
          key: cellKey,
          className: columns[i].className,
          style: this.getCellStyle(columns[i], record),
          children: this.getCellText(columns[i], record)
        };
        if (hasExpanded && fixed !== 'right' && i === 0) {
          cellProps.ExpandedIcon = renderExpandedIcon({
            prefixCls,
            indentSize,
            record,
            handleExpanded: this.handleExpanded
          });
        }
        cacheManager.setCell(cellKey, Cell(cellProps));
        cell = cacheManager.getCell(cellKey);
      }
      cells.push(cell);
    }
    return cells;
  };

  renderRowChildren = (props, record) => {
    const table = this.context.table;
    const {expandedRowRender} = table.props;
    if (expandedRowRender && record[DS._expandedLevel] > 0) {
      return expandedRowRender(record, props.fixed, record[DS._expandedLevel]);
    } else {
      return this.renderCells(props, record);
    }
  };

  renderRows = (props) => {
    const rows = [];
    const {fixed, currentHoverKey} = props;
    const table = this.context.table;
    const {prefixCls, onRow} = table.props;
    const {dataManager} = table;
    const showData = dataManager.showData();
    const dataSource = showData.filter(
      (d, index) =>
        (index >= this._startIndex && index <= this._stopIndex) ||
        dataManager.isFixed(d)
    );
    for (let index = 0; index < dataSource.length; index++) {
      const record = dataSource[index];
      const cells = this.renderRowChildren(props, record);
      const key = `Row_${fixed}_${record[DS._path]}`;
      const {onMouseEnter, onMouseLeave, onClick, ...other} =
        onRow(record) || {};
      const rowProps = {
        key,
        prefixCls,
        cells,
        record,
        className: record[DS._rowClassName],
        hovered: currentHoverKey === record[DS._key],
        style: this.getRowStyle(record, key),
        onClick: this.handleRowClick,
        onMouseEnter: this.handleRowMouseEnter,
        onMouseLeave: this.handleRowMouseLeave,
        ...other
      };
      rows.push(Row(rowProps));
    }
    this._children = rows;
    return this._children;
  };

  render() {
    const {hasHead, hasBody, fixed, orders, columns} = this.props;
    const table = this.context.table;
    const {props, columnManager, sizeManager} = table;
    const {prefixCls, headerRowHeight, rowHeight, onHeaderRow} = props;
    let body;
    if (hasBody) {
      body = (
        <div
          className='tbody'
          style={{height: sizeManager._dataHeight, minHeight: rowHeight}}
        >
          {this._children}
        </div>
      );
    }

    const width = columnManager.getWidth(fixed) || '100%';
    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    const header =
      hasHead &&
      TableHeader({
        columns,
        fixed,
        onSort: this.handleSort,
        orders,
        prefixCls,
        headerRowHeight,
        onHeaderRow
      });
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
    currentHoverKey,
    orders
  };
})(BaseTable);
