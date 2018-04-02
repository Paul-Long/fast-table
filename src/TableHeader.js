import React from 'react';
import PropTypes from 'prop-types';
import TableHeaderRow from './TableHeaderRow';

export default function TableHeader(props, {table}) {
  const {columns, fixed, colWidth} = props;
  const {headerRowHeight, bordered} = table.props;
  const components = table.components;
  const HeaderWrapper = components.header.wrapper;
  return (
    <HeaderWrapper className='thead'>
      <TableHeaderRow
        fixed={fixed}
        columns={columns}
        colWidth={colWidth}
        rowHeight={headerRowHeight - (bordered ? 1 : 0)}
        components={components}
      />
    </HeaderWrapper>
  )
}

TableHeader.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired
};

TableHeader.contextTypes = {
  table: PropTypes.any
};

