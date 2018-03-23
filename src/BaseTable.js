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
      bordered,
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

  render() {
    const {hasHead, hasBody, columns, fixed, bodyHeight} = this.props;
    const table = this.context.table;
    const components = table.components;
    let body;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight}}>
          {this.renderRows(table.props.dataSource)}
        </BodyWrapper>
      )
    }
    return (
      <div className='table'>
        {hasHead && <TableHeader columns={columns} fixed={fixed}/>}
        {body}
      </div>
    )
  }
}

export default connect((state) => {
  const {hasScroll, fixedColumnsBodyRowsHeight, renderStart, renderEnd, bodyHeight} = state;
  return {
    hasScroll,
    bodyHeight,
    fixedColumnsBodyRowsHeight,
    renderStart,
    renderEnd
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
