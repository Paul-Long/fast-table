import React from 'react';
import HeadCell from './HeadCell';
import Sortable from './Sortable';

type Props = {
  columns: Array,
  orders: Object,
  fixed: string,
  onSort: Function,
  prefixCls: string,
  headerRowHeight: number,
  onHeaderRow: Function,
  onDrag: Function
};

function TableHeader(props: Props) {
  const {
    columns,
    orders,
    onSort,
    fixed,
    headerRowHeight,
    prefixCls,
    onHeaderRow,
    onDrag
  } = props;
  const children = columns.map((column, index) =>
    HeadCell({
      key: `HeadCol${index}`,
      column,
      prefixCls,
      headerRowHeight,
      orders,
      onSort,
      fixed: column.fixed,
      onHeaderRow,
      onDrag
    })
  );
  return (
    <div className='thead'>
      <div className='tr'>
        {fixed ? (
          children
        ) : (
          <Sortable columns={columns} onDrag={onDrag}>
            {children}
          </Sortable>
        )}
      </div>
    </div>
  );
}
export default TableHeader;
