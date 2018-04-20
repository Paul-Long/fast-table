import React from 'react';
import classNames from 'classnames';

const Order = {
  desc: 'desc',
  asc: 'asc'
};
type Props = {
  onSort: Function,
  dataIndex: string,
  order: boolean | string,
  prefixCls: string
};

function Sorter(props: Props) {
  const {onSort, dataIndex, prefixCls} = props;
  let order = props.order;
  if (order === true) {
    order = 'desc';
  }
  const onClick = () => {
    const o = order === Order.desc ? Order.asc : Order.desc;
    if (typeof onSort === 'function') {
      onSort(dataIndex, o);
    }
  };
  const wrapperCls = `${prefixCls}-sorter`;
  const sortClass = classNames(`${wrapperCls}-${order}`);
  return (
    <div className={wrapperCls}
         onClick={onClick}
    >
      <div className={sortClass} />
    </div>
  )
}

export default Sorter;
