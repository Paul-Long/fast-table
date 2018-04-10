import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Order = {
  desc: 'desc',
  asc: 'asc'
};

function Sorter(props, {table}) {
  const {prefixCls} = table.props;
  const {onSort, dataIndex} = props;
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
Sorter.propTypes = {
  order: PropTypes.oneOf([true, Order.desc, Order.asc]),
  column: PropTypes.object
};
Sorter.contextTypes = {
  table: PropTypes.any
};
