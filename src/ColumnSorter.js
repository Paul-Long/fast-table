import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Order = {
  desc: 'desc',
  asc: 'asc'
};

class ColumnSorter extends React.PureComponent {
  constructor(props) {
    super(props);
    let order = props.order;
    if (order === true) {
      order = 'desc';
    }
    this.state = {
      order: order || Order.desc
    };
  }

  onClick = () => {
    const {onSort} = this.context.table.props;
    let order = this.state.order;
    order = order === Order.desc ? Order.asc : Order.desc;
    const {column} = this.props;
    if (typeof onSort === 'function') {
      onSort(column, order);
    }
    this.setState({order});
  };

  render() {
    const {prefixCls} = this.context.table.props;
    const {order} = this.state;
    const wrapperCls = `${prefixCls}-sorter`;
    const sortClass = classNames(`${wrapperCls}-${order}`);
    return (
      <div className={wrapperCls}
           onClick={this.onClick}
      >
        <div className={sortClass} />
      </div>
    )
  }
}

export default ColumnSorter;
ColumnSorter.propTypes = {
  order: PropTypes.oneOf([true, Order.desc, Order.asc]),
  column: PropTypes.object
};
ColumnSorter.contextTypes = {
  table: PropTypes.any
};
