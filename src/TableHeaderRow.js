import React from 'react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';

function TableHeaderRow({row, index, height, components, columns, rowHeight, saveColumnRef}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const columnSize = columns.length;
  return (
    <HeaderRow className='tr'>
      {row.map((cell, index) => {
        const {column, ...cellProps} = cell;
        const {key, dataIndex, style, align, width} = column;
        const children = column.children || [];
        cellProps.style = Object.assign({flex: 1}, style);
        align && (cellProps.style.textAlign = align);
        if (width) {
          cellProps.style.flex = `${index + 1 === columnSize ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}`;
        }
        cellProps.style.height = rowHeight;
        const cellClass = classNames('th', {
          'no-children': children.length === 0
        });
        if (children.length === 0) {
          cellProps.ref = saveColumnRef(dataIndex);
        }
        return (
          <HeaderCell
            key={key || dataIndex || index}
            {...cellProps}
            className={cellClass}
          />
        )
      })}
    </HeaderRow>
  )
}

export default TableHeaderRow;
