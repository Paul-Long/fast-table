import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {connect} from './mini-store';
import {measureScrollbar} from './Utils';

function BodyTable(props, {table}) {
  const {saveRef} = table;
  const {prefixCls, fixedHeader, showHeader, footer, footerHeight, dataSource} = table.props;
  const columnManager = table.columnManager;
  const {
    fixed,
    columns,
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
    />
  );
  let height = 0;
  if (dataSource && dataSource.length > 0) {
    const hHeight = fixedHeader ? headHeight : 0;
    const fHeight = footer && !fixed ? footerHeight : 0;
    height = showHeader
      ? `calc(100% - ${hHeight + 1 + fHeight}px)`
      : '100%';
  }
  const style = {
    height,
    overflowY: hasScroll ? 'scroll' : 'auto'
  };
  if (!columnManager.overflowX()) {
    style.overflowX = 'hidden';
  }
  const scrollbarWidth = measureScrollbar();
  if (scrollbarWidth > 0 && fixed) {
    style.marginBottom = `-${scrollbarWidth}px`;
    style.paddingBottom = '0px';
  }
  let scrollRef = 'bodyTable';
  if (fixed === 'left' || fixed === true) {
    scrollRef = 'fixedColumnsBodyLeft';
  } else if (fixed === 'right') {
    scrollRef = 'fixedColumnsBodyRight';
  }

  if (fixed) {
    delete style.overflowX;
    delete style.overflowY;
    (fixed === 'left') && (style.width = columnManager.getWidth(fixed));
    return (
      <div key='bodyTable' className={`${prefixCls}-body-outer`} style={{...style}}>
        <div
          className={`${prefixCls}-body-inner`}
          ref={saveRef(scrollRef)}
          style={{
            height: `calc(100% - ${columnManager.overflowX() ? scrollbarWidth : 0}px)`,
            overflowY: hasScroll ? 'scroll' : 'hidden'
          }}
          onScroll={handleBodyScroll}
        >
          {baseTable}
        </div>
      </div>
    );
  }
  return (
    <div
      key='bodyTable'
      className={`${prefixCls}-body`}
      ref={saveRef(scrollRef)}
      style={style}
      onScroll={handleBodyScroll}
    >
      {baseTable}
    </div>
  );
}

export default connect((state) => {
  const {hasScroll, headHeight} = state;
  return {
    hasScroll,
    headHeight
  };
})(BodyTable);
BodyTable.contextTypes = {
  table: PropTypes.any
};
