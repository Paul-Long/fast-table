import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';
import sum from 'lodash/sum';
import isEmpty from 'lodash/isEmpty';

class BaseTable extends React.PureComponent {
  handleRowHover = (isHover, key) => {
    setTimeout(() => {
      this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    });
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
    const {hasHead, hasBody, columns, fixed, bodyHeight, colWidth} = this.props;
    let width = isEmpty(colWidth) ? '100%' : sum(Object.values(colWidth));
    const table = this.context.table;
    const components = table.components;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      const rows = this.renderRows();
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight}}>
          {rows}
        </BodyWrapper>
      )
    }
    return (
      <Table className='table' style={{width, minWidth: '100%'}}>
        {hasHead && <TableHeader columns={columns} fixed={fixed} colWidth={colWidth} />}
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
    showData
  } = state;
  return {
    hasScroll,
    bodyHeight,
    colWidth,
    tops,
    showData: showData || []
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
