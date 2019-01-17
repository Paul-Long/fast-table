import React from 'react';
import classNames from 'classnames';
import {cellAlignStyle} from './utils';
import Sorter from './Sorter';
import {CS} from './types';

type HeadCellProps = {
  key: string,
  column: Object,
  index: number,
  prefixCls: string,
  fixed: string,
  headerRowHeight: number,
  orders: Object,
  onSort: Function,
  onHeaderRow: Function
};

function HeadCell(props: HeadCellProps) {
  const {
    key,
    column,
    current = 0,
    prefixCls,
    headerRowHeight,
    orders,
    onSort,
    onHeaderRow
  } = props;
  const children = column.children || [];
  const {dataIndex, align, title, sortEnable, onHeaderCell} = column;
  const rowSpan = column[CS.rowSpan];
  const width = column[CS._width];
  const order = orders[dataIndex];
  let style = cellAlignStyle(align);
  if (width) {
    style.width = width;
    style.minWidth = width;
  } else {
    style.flex = 1;
  }
  style.height = (rowSpan || 1) * headerRowHeight;
  if (onHeaderCell) {
    style = {...style, ...onHeaderCell(column)};
  }
  let cellProps = {
    className: classNames('th', {'has-child': children.length > 0}),
    style
  };
  if (onHeaderRow) {
    cellProps = {...cellProps, ...onHeaderRow(column)};
  }
  if (children.length === 0) {
    cellProps.key = key;
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
    cellProps.onClick = () =>
      onSort(
        column.dataIndex,
        order === 'desc' || order === true ? 'asc' : 'desc'
      );
  }

  const cell = (
    <div {...cellProps}>
      {text}
      {sorter}
    </div>
  );

  if (children.length > 0) {
    return (
      <div className={current === 0 ? 'row-group' : ''} key={key}>
        {cell}
        <div className='col-group'>
          {children.map((child, i) =>
            HeadCell({
              key: `${key}-${current}-${i}`,
              column: child,
              headerRowHeight,
              current: current + 1,
              orders,
              prefixCls,
              onSort
            })
          )}
        </div>
      </div>
    );
  }
  return cell;
}

export default HeadCell;
