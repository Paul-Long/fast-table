import React from 'react';
import isNumber from 'lodash/isNumber';

function renderCell(columns, components, rowHeight, isLast) {
  const HeaderCell = components.header.cell;
  return columns.map((column, index) => {
    const {rowSpan, colSpan, key, dataIndex, style, align, width} = column;
    let children = column.children || [];
    if (children.length > 0) {
      children = <HeaderCell>{renderCell(children)}</HeaderCell>;
    }
    let cellProps = {};
    cellProps.style = Object.assign({flex: 1}, style);
    align && (cellProps.style.textAlign = align);
    if (width) {
      cellProps.style.flex = `${isLast ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}`;
    }
    cellProps.style.height = rowHeight;
    return [
      <HeaderCell {...cellProps} className='tr'>{column.title}</HeaderCell>,
      children
    ];
  });
}

function TableHeadCell({columns, index, components, rowHeight, isLast}) {
  return (
    <HeaderCell>{renderCell(columns, components, rowHeight)}</HeaderCell>
  )
}

export default TableHeadCell;
