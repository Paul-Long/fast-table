import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import TableHeader from './TableHeader';
import Row from './TableRow';
import { connect } from './mini-store';
import renderExpandedIcon from './ExpandedIcon';
import Cell from './TableCell';
import { CS, DS } from './types';
import { cellAlignStyle, isInvalidRenderCellText } from './utils';

type Props = {
  currentHoverKey: string,
  startIndex: number,
  stopIndex: number,
  orders: Object,
  fixed: string,
  hasHead: boolean,
  hasBody: boolean,
  indentSize: number,
  registerForce: Function,
  columns: Array,
  handleExpandChange: Function
}

class BaseTable extends React.PureComponent<Props> {

  _children = [];
  _startIndex;
  _stopIndex;

  static contextTypes = {
    table: PropTypes.any
  };

  componentDidMount() {
    const {registerForce, fixed} = this.props;
    if (registerForce) {
      registerForce(fixed, this.recomputeBody);
    }
    this.renderRows(this.props);
  }

  componentWillUpdate(nextProps) {
    this.renderRows(nextProps);
  }

  handleExpanded = (record) => {
    const {handleExpandChange} = this.props;
    handleExpandChange(record);
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

  handleRowClick = (record) => {
    const table = this.context.table;
    const {expandedRowByClick} = table.props;
    if (expandedRowByClick) {
      this.handleExpanded(record);
    }
  };

  handleRowMouseEnter = (record) => {
    this.handleRowHover(true, record[DS._key]);
  };

  handleRowMouseLeave = (record) => {
    this.handleRowHover(false, record[DS._key]);
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
    let text = get(record, dataIndex);
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
    const {
      sizeManager,
      cacheManager,
      dataManager,
    } = table;

    let rowStyle = cacheManager.getRowStyle(key);
    if (!rowStyle || dataManager.isFixed(record)) {
      rowStyle = {
        position: 'absolute',
        top: record[DS._top],
        height: record[DS._height],
      };
      if (record[DS._isFixed] === true || record[DS._isFixed] === 'top') {
        rowStyle.top += sizeManager._scrollTop;
        rowStyle.zIndex = 1;
      } else if (record[DS._isFixed] === 'bottom') {
        rowStyle.top -= ((sizeManager._dataHeight + sizeManager.scrollSizeX()) - sizeManager._scrollTop - sizeManager._clientBodyHeight);
        rowStyle.zIndex = 1;
      }
      if (!record[DS._isFixed]) {
        cacheManager.setRowStyle(key, rowStyle);
      }
    }
    return rowStyle;
  };

  renderCells = (props, record) => {
    const {fixed, indentSize} = props;
    const table = this.context.table;
    const {prefixCls} = table.props;
    const {dataManager, cacheManager, columnManager,} = table;
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
          components: table.components,
          style: this.getCellStyle(columns[i], record),
          children: this.getCellText(columns[i], record),
        };
        if (hasExpanded && fixed !== 'right' && i === 0) {
          cellProps.ExpandedIcon = renderExpandedIcon({
            prefixCls,
            indentSize,
            handleExpanded: this.handleExpanded.bind(this, record),
            expanded: record[DS._expanded],
            expandedEnable: record[DS._expandedEnable],
            expandedLevel: record[DS._expandedLevel],
          });
        }
        cacheManager.setCell(cellKey, Cell(cellProps));
        cell = cacheManager.getCell(cellKey);
      }
      cells.push(cell);
    }
    return cells;
  };

  renderRows = (props) => {
    const rows = [];
    const {
      fixed,
      currentHoverKey,
    } = props;
    const table = this.context.table;
    const {prefixCls} = table.props;
    const {dataManager} = table;
    const showData = dataManager.showData();
    const dataSource = showData.filter((d, index) =>
      (index >= this._startIndex && index <= this._stopIndex) || dataManager.isFixed(d)
    );
    for (let index = 0; index < dataSource.length; index++) {
      const record = dataSource[index];
      const cells = this.renderCells(props, record);
      const key = `Row_${fixed}_${record[DS._path]}`;
      const rowProps = {
        key,
        prefixCls,
        cells,
        className: record[DS._rowClassName],
        components: table.components,
        hovered: currentHoverKey === record[DS._key],
        style: this.getRowStyle(record, key),
        onClick: this.handleRowClick.bind(this, record),
        onMouseEnter: this.handleRowMouseEnter.bind(this, record),
        onMouseLeave: this.handleRowMouseLeave.bind(this, record),
      };
      rows.push(Row(rowProps));
    }
    this._children = rows;
    return this._children;
  };

  render() {
    const {
      hasHead,
      hasBody,
      fixed,
      orders,
      columns
    } = this.props;
    const table = this.context.table;
    const {
      props,
      components,
      columnManager,
      sizeManager
    } = table;
    const {
      prefixCls,
      headerRowHeight,
      rowHeight,
    } = props;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: sizeManager._dataHeight, minHeight: rowHeight}}>
          {this._children}
        </BodyWrapper>
      );
    }

    const width = columnManager.getWidth(fixed) || '100%';
    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    const header = hasHead
      && TableHeader({
        columns,
        fixed,
        onSort: this.handleSort,
        orders,
        prefixCls,
        headerRowHeight,
        components
      });
    return (
      <Table className='table' style={style}>
        {header}
        {body}
      </Table>
    );
  }
}

export default connect((state) => {
  const {currentHoverKey, orders} = state;
  return {
    currentHoverKey,
    orders,
  };
})(BaseTable);

