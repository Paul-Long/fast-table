import React from 'react';
import TableHeaderCell from './TableHeaderCell';

type Props = {
  columns: Array,
  orders: Object,
  onSort: Function,
  fixed: string,
  components: Object,
  prefixCls: string,
  headerRowHeight: number
};

function TableHeader(props: Props) {
  const {
    columns,
    orders,
    onSort,
    fixed,
    headerRowHeight,
    prefixCls,
    components
  } = props;
  const HeaderWrapper = components.header.wrapper;
  const HeaderRow = components.header.row;
  return (
    <HeaderWrapper className='thead'>
      <HeaderRow className='tr'>
        {columns.map((column, index) => (
          <TableHeaderCell
            key={index}
            prefixCls={prefixCls}
            index={index}
            fixed={fixed}
            headerRowHeight={headerRowHeight}
            column={column}
            columns={columns}
            components={components}
            orders={orders}
            onSort={onSort}
          />
        ))}
      </HeaderRow>
    </HeaderWrapper>
  );
}
export default TableHeader;
