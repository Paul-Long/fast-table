import React from 'react';
import TableHeaderCell from './TableHeaderCell';

function TableHeaderRow({row, index, height, components, columns, rowHeight}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const columnSize = columns.length;
  return (
    <HeaderRow className='tr'>
      {columns.map((column, index) => (<TableHeaderCell key={index} column={column}/>))}
    </HeaderRow>
  )
}

export default TableHeaderRow;
