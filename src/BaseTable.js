import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';
import sum from 'lodash/sum';
import isEmpty from 'lodash/isEmpty';

class BaseTable extends React.PureComponent {
  handleRowHover = (isHover, key) => {
    this.props.store.setState({
      currentHoverKey: isHover ? key : null
    });
  };
  handleSort = (key, order) => {
    const {sortManager, props} = this.context.table;
    const onSort = props.onSort;
    sortManager.setOrder(key, order, (orders) => {
      this.props.store.setState({orders});
      if (typeof onSort === 'function') {
        onSort(orders);
      }
    })
  };
  renderRows = () => {
    const rows = [];
    const {
      getRowKey,
      fixed,
      showData,
      tops,
      colWidth
    } = this.props;
    const table = this.context.table;
    const {
      prefixCls,
      rowRef,
      getRowHeight,
      rowHeight,
      rowClassName
    } = table.props;
    const columnManager = table.columnManager;
    (showData || []).forEach((record, i) => {
      let leafColumns;
      if (fixed === 'left') {
        leafColumns = columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = columnManager.rightLeafColumns();
      } else {
        leafColumns = columnManager.leafColumns();
      }
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record.index)
        : rowClassName;
      const key = getRowKey(record, record.index);
      const props = {
        key,
        record,
        fixed,
        prefixCls,
        className,
        colWidth,
        rowKey: key,
        index: record.index,
        top: tops[record.index],
        columns: leafColumns,
        ref: rowRef(record, record.index),
        components: table.components,
        height: getRowHeight(record, record.index) * rowHeight,
        onHover: this.handleRowHover
      };
      rows.push(<TableRow {...props} />);
    });
    return rows;
  };
  
  render() {
    const {hasHead, hasBody, columns, fixed, bodyHeight, colWidth, orders} = this.props;
    const width = isEmpty(colWidth) ? '100%' : sum(Object.values(colWidth));
    const table = this.context.table;
    const components = table.components;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight}}>
          {this.renderRows()}
        </BodyWrapper>
      )
    }
    return (
      <Table className='table' style={{width, minWidth: '100%'}}>
        {hasHead && (
          <TableHeader
            columns={columns}
            fixed={fixed}
            colWidth={colWidth}
            onSort={this.handleSort}
            orders={orders || {}}
          />
        )}
        {body}
      </Table>
    )
  }
}

export default connect((state) => {
  const {
    hasScroll,
    bodyHeight,
    colWidth,
    tops,
    showData,
    orders
  } = state;
  return {
    hasScroll,
    bodyHeight,
    colWidth,
    tops,
    showData: showData || [],
    orders
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
