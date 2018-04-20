import React from 'react'
import classNames from 'classnames';
import {cellAlignStyle} from './Utils';
import Sorter from './Sorter';

type CellProps = {
  key: string,
  column: Object,
  components: Object,
  headerRowHeight: number,
  current: number,
  orders: Object,
  prefixCls: string,
  onSort: Function
}

function renderCell(props: CellProps) {
  const {
    key,
    column,
    components,
    headerRowHeight,
    current = 0,
    orders,
    prefixCls,
    onSort
  } = props;
  const children = column.children || [];
  const Th = components.head.cell;
  const {
    rowSpan,
    dataIndex,
    align,
    _width,
    title,
    sortEnable
  } = column;
  const order = orders[dataIndex];
  const style = cellAlignStyle(align);
  _width ? (style.width = _width) : (style.flex = 1);
  style.height = (rowSpan || 1) * headerRowHeight;
  const cellProps = {
    className: classNames('th', {'has-child': children.length > 0}),
    style
  };
  let text = title;
  if (typeof title === 'function') {
    text = title(column);
  }
  let sorter;
  if (sortEnable && children.length === 0 && order) {
    sorter = Sorter({
      dataIndex,
      order,
      prefixCls,
      onSort
    });
  }
  if (sortEnable && children.length === 0) {
    cellProps.onClick = () => onSort(
      column.dataIndex,
      order === 'desc' || order === true ? 'asc' : 'desc'
    );
  }
  
  const cell = (
    <Th {...cellProps}>
      {text}
      {sorter}
    </Th>
  );
  
  if (children.length > 0) {
    return (
      <div className={current === 0 ? 'row-group' : ''}>
        {cell}
        <div className='col-group'>
          {children.map(child => renderCell({
            column: child,
            components,
            headerRowHeight,
            current: current + 1
          }))}
        </div>
      </div>
    );
  }
  return cell;
}

type HeadCellProps = {
  column: Object,
  index: number,
  components: Object,
  prefixCls: string,
  fixed: string,
  headerRowHeight: number,
  orders: Object,
  onSort: Function
}

function HeadCell(props: HeadCellProps) {
  const {
    key,
    column,
    components,
    prefixCls,
    headerRowHeight,
    orders,
    onSort
  } = props;
  return renderCell({
    key,
    column,
    components,
    headerRowHeight,
    orders,
    prefixCls,
    onSort
  });
}

export default HeadCell;
