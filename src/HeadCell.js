import React from 'react';
import classNames from 'classnames';
import {cellAlignStyle} from './utils';
import Sorter from './Sorter';
import {CS} from './types';
import Sortable from './Sortable';

type HeadCellProps = {
  key: string,
  column: Object,
  index: number,
  prefixCls: string,
  fixed: string,
  headerRowHeight: number,
  orders: Object,
  SelectIcon: React.Element<*>,
  onSort: Function,
  onHeaderRow: Function,
  onDrag: Function
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
    fixed,
    onHeaderRow,
    onDrag,
    SelectIcon
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
  style.lineHeight = `${style.height - 1}px`;
  if (onHeaderCell) {
    style = {...style, ...onHeaderCell(column)};
  }
  let cellProps = {
    className: classNames('th', {'has-child': children.length > 0}),
    style,
    fixed
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
      {SelectIcon}
      {text}
      {sorter}
    </div>
  );

  if (children.length > 0) {
    let style = {};
    if (current !== 0) {
      style.display = 'inline-block';
      style.float = 'left';
    }
    return (
      <div
        className={current === 0 ? 'row-group' : ''}
        key={key}
        style={style}
        fixed={fixed}
      >
        {cell}
        <div className='col-group'>
          <Sortable parent={column} columns={children} onDrag={onDrag}>
            {children.map((child, i) =>
              HeadCell({
                key: `${key}-${current}-${i}`,
                column: child,
                headerRowHeight,
                current: current + 1,
                orders,
                prefixCls,
                onSort,
                fixed,
                onDrag
              })
            )}
          </Sortable>
        </div>
      </div>
    );
  }
  return cell;
}

export default HeadCell;
