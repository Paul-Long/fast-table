import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {connect} from './mini-store';
import {measureScrollbar} from './Utils';

function HeadTable(props, {table}) {
  const {prefixCls, showHeader} = table.props;
  const {fixed, hasScroll} = props;
  const {saveRef} = table;
  let {fixedHeader} = table.props;
  const headStyle = {};
  if (!fixedHeader || !showHeader) {
    return null;
  }
  const scrollbarWidth = measureScrollbar('horizontal');
  if (scrollbarWidth > 0 && !fixed && table.columnManager.overflowX()) {
    headStyle.marginBottom = `-${scrollbarWidth}px`;
    headStyle.paddingBottom = '0px';
  }
  if (!table.columnManager.overflowX()) {
    headStyle.overflowX = 'hidden';
  }
  headStyle.overflowY = hasScroll ? 'scroll' : 'auto';
  return (
    <div
      key='headTable'
      className={`${prefixCls}-header`}
      style={headStyle}
      ref={fixed ? null : saveRef('headTable')}
    >
      <BaseTable
        hasHead
        hasBody={false}
        fixed={fixed}
      />
    </div>
  )
}

export default connect((state, props) => {
  const {hasScroll} = state;
  return {
    hasScroll
  }
})(HeadTable);

HeadTable.propTypes = {
  fixed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onSort: PropTypes.func
};

HeadTable.contextTypes = {
  table: PropTypes.any
};
