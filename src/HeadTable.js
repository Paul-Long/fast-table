import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';

type Props = {
  saveRef: Function,
  fixed: string
};

function HeadTable(props: Props, {manager, props: baseProps}) {
  const {fixedHeader, prefixCls, showHeader} = baseProps;
  const {saveRef, fixed, registerForce} = props;
  const {sizeManager, columnManager} = manager;
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
          registerForce={registerForce}
          columns={columnManager.headColumns(fixed)}
        />
      </div>
    );
  }
  return null;
}

export default HeadTable;

HeadTable.contextTypes = {
  props: PropTypes.object,
  manager: PropTypes.object
};
