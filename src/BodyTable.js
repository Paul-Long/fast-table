import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {connect} from './mini-store';

function BodyTable(props, {table}) {
  const {saveRef} = table;
  const {prefixCls, fixedHeader, showHeader, footer, footerHeight, dataSource} = table.props;
  const {
    fixed,
    columns,
    getRowKey,
    hasScroll,
    handleBodyScroll,
    headHeight
  } = props;
  const baseTable = (
    <BaseTable
      hasHead={!fixedHeader}
      hasBody
      fixed={fixed}
      columns={columns}
      getRowKey={getRowKey}
    />
  );
  let height = 0;
  if (dataSource && dataSource.length > 0) {
    height = showHeader ? `calc(100% - ${headHeight + 1 + (footer ? footerHeight : 0)}px)` : '100%';
  }
  const style = {
    height,
    overflowY: hasScroll ? 'scroll' : 'auto'
  };
  if (!fixedHeader) {
    style.height = 'auto';
    style.overflowY = 'hidden';
  }
  return (
    <div
      key='bodyTable'
      className={`${prefixCls}-body`}
      ref={saveRef('bodyTable')}
      style={style}
      onScroll={handleBodyScroll}
    >
      {baseTable}
    </div>
  )
}

export default connect((state) => {
  const {hasScroll, headHeight} = state;
  return {
    hasScroll,
    headHeight
  }
})(BodyTable)
BodyTable.contextTypes = {
  table: PropTypes.any
};
