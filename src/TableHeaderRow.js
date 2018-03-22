import React from 'react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';

function TableHeaderRow({row, index, height, components, columns, rowHeight}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const columnSize = columns.length;
  return (
    <HeaderRow className='tr'>
      {row.map((cell, i) => {
        const {column, className, ...cellProps} = cell;
        cellProps.style = Object.assign({}, column.style);
        if (column.align) {
          cellProps.style.textAlign = column.align;
        }
        if (column.width) {
          let style = cellProps.style || {};
          style.flex = `${i + 1 === columnSize ? 1 : 0} 1 ${isNumber(column.width) ? column.width + 'px' : column.width}`;
          cellProps.style = style;
        } else {
          cellProps.style.flex = 1;
        }
        cellProps.style.height = rowHeight;
        const cellClass = classNames('th', className);
        return (
          <HeaderCell
            key={column.key || column.dataIndex || i}
            {...cellProps}
            className={cellClass}
          />
        )
      })}
    </HeaderRow>
  )
}

export default TableHeaderRow;
