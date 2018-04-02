import React from 'react';
import TableHeaderCell from './TableHeaderCell';

function TableHeaderRow({row, index, height, colWidth, components, columns, rowHeight}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  return (
    <HeaderRow className='tr'>
      {columns.map((column, index) => (
        <TableHeaderCell
          key={index}
          index={index}
          colWidth={colWidth}
          headerRowHeight={rowHeight}
          column={column}
          columns={columns}
          components={components}
        />
      ))}
    </HeaderRow>
  )
}

export default TableHeaderRow;
