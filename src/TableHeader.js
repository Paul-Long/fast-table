import React from 'react';
import HeadCell from './HeadCell';

type Props = {
  columns: Array,
  orders: Object,
  onSort: Function,
  prefixCls: string,
  headerRowHeight: number,
  onHeaderRow: Function
};

function TableHeader(props: Props) {
  const {
    columns,
    orders,
    onSort,
    headerRowHeight,
    prefixCls,
    onHeaderRow
  } = props;
  return (
    <div className='thead'>
      <div className='tr'>
        {columns.map((column, index) =>
          HeadCell({
            key: `HeadCol${index}`,
            column,
            prefixCls,
            headerRowHeight,
            orders,
            onSort,
            onHeaderRow
          })
        )}
      </div>
    </div>
  );
}
export default TableHeader;
