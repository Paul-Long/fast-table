import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';

class BaseTable extends React.PureComponent {
  static contextTypes = {
    table: PropTypes.any
  };
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
      showData
    } = this.props;
    const table = this.context.table;
    const rowKey = table.rowKey;
    const {
      prefixCls,
      rowRef,
      rowClassName,
      indentSize,
      expandedRowByClick
    } = table.props;
    const dataManager = table.dataManager;
    const columns = table.columnManager.bodyColumns(fixed);
    (showData || []).forEach((record, i) => {
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record._index)
        : rowClassName;
      const key = rowKey(record, record._index);
      const props = {
        key: i,
        record,
        fixed,
        prefixCls,
        className,
        indentSize,
        expandedRowByClick,
        columns,
        rowKey: key,
        index: record._index,
        ref: rowRef(record, record._index),
        hasExpanded: dataManager._hasExpanded,
        components: table.components,
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

    const width = columnManager.getWidth(fixed) || '100%';
    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    return (
      <Table className='table' style={style}>
        {hasHead && (
          <TableHeader
            columns={columnManager.headColumns(fixed)}
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
    showData,
    orders
  } = state;
  return {
    hasScroll,
    bodyHeight,
    showData,
    orders
  };
})(BaseTable);

