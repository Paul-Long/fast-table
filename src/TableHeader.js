import React from 'react';
import HeadCell from './HeadCell';

type Props = {
  columns: Array,
  orders: Object,
  onSort: Function,
  components: Object,
  prefixCls: string,
  headerRowHeight: number,
  onHeaderRow: Function,
};

function TableHeader(props: Props) {
  const {
    columns,
    orders,
    onSort,
    headerRowHeight,
    prefixCls,
    components,
    onHeaderRow,
  } = props;
  const HeaderWrapper = components.header.wrapper;
  const HeaderRow = components.header.row;
  return (
    <HeaderWrapper className='thead'>
      <HeaderRow className='tr'>
        {columns.map((column, index) => HeadCell({
          key: `HeadCol${index}`,
          column,
          components,
          prefixCls,
          headerRowHeight,
          orders,
          onSort,
          onHeaderRow,
        }))}
      </HeaderRow>
    </HeaderWrapper>
  );
}
export default TableHeader;
