import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';

type Props = {
  fixed: string
}

function HeadTable(props: Props, {table}) {
  const {prefixCls, showHeader} = table.props;
  const {fixed} = props;
  const {saveRef, sizeManager, columnManager} = table;
  let {fixedHeader} = table.props;
  const headStyle = {};
  if (fixedHeader && showHeader) {
    const scrollbarWidth = sizeManager._scrollSizeX;
    if (scrollbarWidth > 0 && !fixed && sizeManager._hasScrollX) {
      headStyle.marginBottom = `-${scrollbarWidth}px`;
      headStyle.paddingBottom = '0px';
    }
    if (!sizeManager._hasScrollX) {
      headStyle.overflowX = 'hidden';
    }
    headStyle.overflowY = sizeManager._hasScrollY() ? 'scroll' : 'hidden';
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
