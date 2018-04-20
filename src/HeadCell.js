import React from 'react'
import classNames from 'classnames';
import {cellAlignStyle} from './Utils';
import Sorter from './Sorter';

function renderChildren() {

}

type CellProps = {
  column: Object,
  components: Object,
  headerRowHeight: number,
  current: number,
  orders: Object,
  prefixCls: string
}

function renderCell(props: CellProps) {
  const {
    column,
    components,
    headerRowHeight,
    current = 0,
    orders,
    prefixCls
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
  const style = cellAlignStyle(column.align);
  _width ? (style.width = _width) : (style.flex = 1);
  style.height = (rowSpan || 1) * headerRowHeight;
  const cellProps = {
    className: classNames('th', {'has-child': children.length > 0}),
    style
  }
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
  columns: Array, 
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
    column,
    columns,
    index,
    components,
    prefixCls,
    fixed,
    headerRowHeight,
    orders,
    onSort
  } = props;
  return renderCell({
    column,
    components,
    headerRowHeight,
    current = 0,
    orders,
    prefixCls
  });
}

export default HeadCell;
