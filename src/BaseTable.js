import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableHeader from './TableHeader';
import Row from './TableRow';
import {connect} from './mini-store';
import renderExpandedIcon from './ExpandedIcon';

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

  handleExpanded = (record, key) => {
    const table = this.context.table;
    const dataManager = table.dataManager;
    table.resetExpandedRowKeys(key, !dataManager.rowIsExpanded(record));
  };

  renderRows = () => {
    const rows = [];
    const {
      fixed,
      showData,
      currentHoverKey
    } = this.props;
    const table = this.context.table;
    const {
      prefixCls,
      rowClassName,
      expandedRowByClick
    } = table.props;
    const dataManager = table.dataManager;
    const columns = table.columnManager.bodyColumns(fixed);
    const hasExpanded = dataManager._hasExpanded;
    (showData || []).forEach(record => {
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record._index)
        : rowClassName;
      const hovered = currentHoverKey === record.key;
      const props = {
        key: `Row${record._showIndex}`,
        className: classNames(className, {
          [`${prefixCls}-hover`]: hovered,
          [`${prefixCls}-expanded-row-${record._expandedLevel}`]: hasExpanded
        }),
        record,
        prefixCls,
        columns,
        fixed,
        expandedRowByClick,
        expanded: dataManager.rowIsExpanded(record),
        onHover: this.handleRowHover,
        components: table.components,
        handleExpanded: this.handleExpanded
      };
      hasExpanded && (props.renderExpandedIcon = renderExpandedIcon);
      rows.push(Row(props));
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
    currentHoverKey,
    hasScroll,
    bodyHeight,
    showData,
    orders,
    bodyWidth
  } = state;
  return {
    currentHoverKey,
    hasScroll,
    bodyHeight,
    showData,
    orders,
    bodyWidth
  };
})(BaseTable);

