import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';

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
    });
  };

  renderRows = () => {
    const rows = [];
    const {
      fixed,
      showData,
      tops
    } = this.props;
    const table = this.context.table;
    const rowKey = table.rowKey;
    const {
      prefixCls,
      rowRef,
      getRowHeight,
      rowHeight,
      rowClassName,
      indentSize,
      expandedRowByClick
    } = table.props;
    const dataManager = table.dataManager;
    const columnManager = table.columnManager;
    let columns = [];
    if (fixed === 'left') {
      columns = columnManager.leftLeafColumns();
    } else if (fixed === 'right') {
      columns = columnManager.rightLeafColumns();
    } else {
      columns = columnManager.leafColumns();
    }
    (showData || []).forEach((record, i) => {
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record.index)
        : rowClassName;
      const key = rowKey(record, record.index);
      const props = {
        key,
        record,
        fixed,
        prefixCls,
        className,
        indentSize,
        expandedRowByClick,
        columns,
        rowKey: key,
        index: record.index,
        top: tops[record._showIndex],
        ref: rowRef(record, record.index),
        components: table.components,
        height: getRowHeight(record, record.index) * rowHeight,
        onHover: this.handleRowHover,
        expanded: dataManager.rowIsExpanded(record),
        onExpandedRowsChange: table.resetExpandedRowKeys
      };
      rows.push(<TableRow {...props} />);
    });
    return rows;
  };

  render() {
    const {hasHead, hasBody, fixed, bodyHeight, orders} = this.props;
    const table = this.context.table;
    const components = table.components;
    const columnManager = table.columnManager;
    let width = table.columnManager.getWidth(fixed);
    width = width || '100%';
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight, minHeight: table.props.rowHeight}}>
          {this.renderRows()}
        </BodyWrapper>
      );
    }

    let columns = [];
    if (fixed === 'left') {
      columns = columnManager.leftColumns();
    } else if (fixed === 'right') {
      columns = columnManager.rightColumns();
    } else {
      columns = columnManager.groupedColumns();
    }

    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    return (
      <Table className='table' style={style}>
        {hasHead && (
          <TableHeader
            columns={columns}
            fixed={fixed}
            onSort={this.handleSort}
            orders={orders || {}}
          />
        )}
        {body}
      </Table>
    );
  }
}

export default connect((state) => {
  const {
    hasScroll,
    bodyHeight,
    tops,
    showData,
    orders
  } = state;
  return {
    hasScroll,
    bodyHeight,
    tops,
    showData: showData || [],
    orders
  };
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
