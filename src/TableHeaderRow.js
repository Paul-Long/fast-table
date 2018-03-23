import React from 'react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';

function TableHeaderRow({row, index, height, components, columns, rowHeight}) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const columnSize = columns.length;
  return (
    <HeaderRow>
      {row.map((cell, index) => {
        const {column, ...cellProps} = cell;
        const {key, dataIndex, style, align, width} = column;
        cellProps.style = Object.assign({flex: 1}, style);
        align && (cellProps.style.textAlign = align);
        if (width) {
          cellProps.style.flex = `${index + 1 === columnSize ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}`;
        }
        cellProps.style.height = rowHeight;
        const cellClass = classNames('th');
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
