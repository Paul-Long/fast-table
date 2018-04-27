import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';

type Props = {
  saveRef: Function,
  fixed: string
}

function HeadTable(props: Props, {table}) {
  const {
    fixedHeader,
    prefixCls,
    showHeader
  } = table.props;
  const {
    saveRef,
    fixed
  } = props;
  const {
    sizeManager,
    columnManager
  } = table;
  const headStyle = {};
  if (fixedHeader && showHeader) {
    const scrollbarWidth = sizeManager.scrollSizeX();
    if (scrollbarWidth > 0 && !fixed) {
      headStyle.marginBottom = `-${scrollbarWidth}px`;
      headStyle.paddingBottom = '0px';
    }
    if (!sizeManager._hasScrollX) {
      headStyle.overflowX = 'hidden';
    }
    headStyle.overflowY = sizeManager._hasScrollY ? 'scroll' : 'hidden';
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
          columns={columnManager.headColumns(fixed)}
        />
      </div>
    );
  }
  return null;
}

export default HeadTable;

HeadTable.contextTypes = {
  table: PropTypes.any
};
