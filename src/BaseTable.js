import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';
import isEmpty from 'lodash/isEmpty';

class BaseTable extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.columns = [];
    const columnManager = context.table.columnManager;
    const fixed = props.fixed;
    if (fixed === 'left') {
      this.columns = columnManager.leftColumns();
    } else if (fixed === 'right') {
      this.columns = columnManager.rightColumns();
    } else {
      this.columns = columnManager.leafColumns();
    }
  }

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
      tops,
      colWidth
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
        colWidth,
        indentSize,
        expandedRowByClick,
        rowKey: key,
        index: record.index,
        top: tops[record._showIndex],
        columns: this.columns,
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
    const {hasHead, hasBody, columns, fixed, bodyHeight, colWidth, orders} = this.props;
    const table = this.context.table;
    const components = table.components;
    let width = '100%';
    if (!isEmpty(colWidth)) {
      width = table.columnManager.getWidth(fixed);
    }
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
            colWidth={colWidth}
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
  };
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
