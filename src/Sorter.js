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
  let path =
    'M556.8 876.8l134.4-134.4c25.6-25.6 25.6-64 0-89.6-25.6-25.6-64-25.6-89.6 0L576 678.4 576 192c0-38.4-25.6-64-64-64S448 153.6 448 192l0 486.4-25.6-25.6c-25.6-25.6-64-25.6-89.6 0-25.6 25.6-25.6 64 0 89.6l134.4 134.4C492.8 902.4 531.2 902.4 556.8 876.8z';
  if (order === 'asc') {
    path =
      'M467.2 147.2 332.8 281.6c-25.6 25.6-25.6 64 0 89.6 25.6 25.6 64 25.6 89.6 0L448 345.6 448 832c0 38.4 25.6 64 64 64s64-25.6 64-64L576 345.6l25.6 25.6c25.6 25.6 64 25.6 89.6 0 25.6-25.6 25.6-64 0-89.6L556.8 147.2C531.2 121.6 492.8 121.6 467.2 147.2z';
  }
  const onClick = () => {
    const o = order === Order.desc ? Order.asc : Order.desc;
    if (typeof onSort === 'function') {
      onSort(dataIndex, o);
    }
  };
  const wrapperCls = `${prefixCls}-sorter`;
  return (
    <div className={wrapperCls} onClick={onClick}>
      <svg
        viewBox='64 64 896 896'
        className=''
        data-icon='plus'
        width='1em'
        height='1em'
        fill='currentColor'
        aria-hidden='true'
        focusable='false'
        style={{display: 'inline-block'}}
      >
        <path d={path} />
      </svg>
    </div>
  );
}

export default Sorter;
