import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {connect} from './mini-store';

type Props = {
  saveRef: Function,
  fixed: string,
  hasScroll: boolean,
  handleBodyScroll: Function
}

function BodyTable(props: Props, {table}) {
  const {saveRef} = table;
  const {
    prefixCls,
    fixedHeader,
    showHeader,
    dataSource,
    bodyMaxHeight,
    indentSize
  } = table.props;
  const columnManager = table.columnManager;
  const tableSize = table.tableSize();
  const {
    fixed,
    hasScroll,
    handleBodyScroll
  } = props;
  const baseTable = (
    <BaseTable
      hasHead={!fixedHeader}
      hasBody
      fixed={fixed}
      indentSize={indentSize}
    />
  );
  let height = 0;
  if (dataSource && dataSource.length > 0) {
    height = showHeader && fixedHeader
      ? tableSize.height - tableSize.footerHeight - tableSize.headHeight
      : tableSize.height - tableSize.footerHeight;
  }

  const scrollSize = tableSize.scrollSizeY;
  const style = {
    height,
    overflowY: hasScroll ? 'scroll' : 'auto'
  };
  if (bodyMaxHeight) {
    style.maxHeight = bodyMaxHeight;
  }
  if (scrollSize > 0 && fixed && columnManager.overflowX()) {
    style.marginBottom = `-${scrollSize}px`;
    style.paddingBottom = '0px';
  }
  let scrollRef = 'bodyTable';
  if (fixed === 'left') {
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
            height: '100%',
            overflowY: hasScroll ? 'scroll' : 'hidden',
            overflowX: columnManager.overflowX() ? 'scroll' : 'hidden'
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
  const {hasScroll} = state;
  return {
    hasScroll
  };
})(BodyTable);
BodyTable.contextTypes = {
  table: PropTypes.any
};
