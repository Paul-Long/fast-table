import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';

class BaseTable extends React.PureComponent {
  handleRowHover = (isHover, key) => {
    setTimeout(() => {
      this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    });
  };
  renderRows = (datas) => {
    const rows = [];
    const {
      getRowKey,
      fixed,
      renderStart,
      renderEnd
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
    datas.forEach((record, i) => {
      if (i >= renderStart && i <= renderEnd) {
        let leafColumns;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = columnManager.leafColumns();
        }
        const className = typeof rowClassName === 'function'
          ? rowClassName(record, i)
          : rowClassName;
        const key = getRowKey(record, i);
        const props = {
          key,
          record,
          fixed,
          prefixCls,
          className,
          rowKey: key,
          index: i,
          columns: leafColumns,
          ref: rowRef(record, i),
          components: table.components,
          height: getRowHeight(record, i) * rowHeight,
          onHover: this.handleRowHover
        };
        rows.push(<TableRow {...props} />);
      }
    });
    return rows;
  };

  renderFooter = () => {
    const {footer, footerHeight} = this.context.table.props;
    return footer ? (
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: footerHeight, color: 'inherit'}}>
        {footer(this.props.dataSource)}
      </div>
    ) : null;
  };

  renderEmptyText = () => {
    const {emptyText, dataSource, rowHeight} = this.context.table.props;
    if (dataSource && dataSource.length > 0) {
      return null;
    }
    return typeof emptyText === 'function' ? (
      <div style={{position: 'absolute', bottom: 0, height: rowHeight, textAlign: 'center', color: 'inherit'}}>
        {emptyText(this.props.dataSource)}
      </div>
    ) : emptyText;
  };

  render() {
    const {hasHead, hasBody, columns, fixed, bodyHeight, colWidth} = this.props;
    const table = this.context.table;
    const components = table.components;
    const {footer, footerHeight} = table.props;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight + (footer ? footerHeight : 0)}}>
          {this.renderRows(table.props.dataSource)}
          {this.renderEmptyText()}
          {this.renderFooter()}
        </BodyWrapper>
      )
    }
    return (
      <Table className='table'>
        {hasHead && <TableHeader columns={columns} fixed={fixed} colWidth={colWidth} />}
        {body}
      </Table>
    )
  }
}

export default connect((state) => {
  const {hasScroll, fixedColumnsBodyRowsHeight, renderStart, renderEnd, bodyHeight, colWidth} = state;
  return {
    hasScroll,
    bodyHeight,
    fixedColumnsBodyRowsHeight,
    renderStart,
    renderEnd,
    colWidth
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
