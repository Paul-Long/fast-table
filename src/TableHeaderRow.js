import React from 'react';
import isNumber from 'lodash/isNumber';

function TableHeaderRow({row, index, height, components, columns}) {
    const HeaderRow = components.header.row;
    const HeaderCell = components.header.cell;
    const columnSize = columns.length;
    return (
        <HeaderRow className='tr'>
            {row.map((cell, i) => {
                const {column, ...cellProps} = cell;
                cellProps.style = Object.assign({}, cellProps.style);
                if (column.align) {
                    cellProps.style = {textAlign: column.dataIndex || i};
                }
                if (column.width) {
                    let style = cellProps.style || {};
                    style.flex = `${i + 1 === columnSize ? 1 : 0} 1 ${isNumber(column.width) ? column.width + 'px' : column.width}`;
                    cellProps.style = style;
                } else {
                    cellProps.style.flex = 1;
                }
                return (
                    <HeaderCell
                        key={column.key || column.dataIndex || i}
                        {...cellProps}
                        className='th'
                    />
                )
            })}
        </HeaderRow>
    )
}

export default TableHeaderRow;
