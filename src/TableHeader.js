import React from 'react';
import PropTypes from 'prop-types';
import TableHeaderCell from './TableHeaderCell';

function TableHeader(props, {table}) {
  const {columns, colWidth, orders, onSort, fixed} = props;
  const {headerRowHeight, bordered} = table.props;
  const components = table.components;
  const HeaderWrapper = components.header.wrapper;
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const rowHeight = headerRowHeight - (bordered ? 1 : 0);
  return (
    <HeaderWrapper className='thead'>
      <HeaderRow className='tr'>
        {columns.map((column, index) => (
          <TableHeaderCell
            key={index}
            index={index}
            fixed={fixed}
            colWidth={colWidth}
            headerRowHeight={rowHeight}
            column={column}
            columns={columns}
            components={components}
            orders={orders}
            onSort={onSort}
          />
        ))}
      </HeaderRow>
    </HeaderWrapper>
  )
}

export default TableHeader;

TableHeader.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired
};

TableHeader.contextTypes = {
  table: PropTypes.any
};

