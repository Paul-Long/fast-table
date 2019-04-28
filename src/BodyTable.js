import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';

type Props = {
  saveRef: Function,
  fixed: string,
  handleBodyScroll: Function,
  registerForce: Function
};

function BodyTable(props: Props, {manager, props: baseProps, getProps}) {
  const {columnManager, sizeManager} = manager;
  const {
    prefixCls,
    fixedHeader,
    showHeader,
    dataSource,
    bodyMaxHeight
  } = baseProps;
  const {saveRef, fixed, handleBodyScroll, registerForce} = props;
  const baseTable = (
    <BaseTable
      hasHead={!fixedHeader}
      hasBody
      fixed={fixed}
      registerForce={registerForce}
      columns={columnManager.headColumns(fixed)}
    />
  );
  let height = 0;
  if (dataSource && dataSource.length > 0) {
    height = sizeManager._wrapperHeight - sizeManager.footerHeight;
    height =
      height - (showHeader && fixedHeader ? sizeManager._headerHeight : 0);
  }
  let dataHeight = sizeManager._dataHeight;
  if (showHeader) {
    dataHeight += fixedHeader ? 0 : sizeManager._headerHeight;
  }
  const scrollSize = sizeManager.scrollSizeX();
  dataHeight = dataHeight + scrollSize;
  if (getProps('useScrollY')) {
    height = Math.min(height, dataHeight);
  } else {
    height = dataHeight;
  }
  const style = {
    height,
    overflowY: sizeManager._hasScrollY ? 'scroll' : 'hidden',
    overflowX: sizeManager._hasScrollX ? 'scroll' : 'hidden'
  };
  if (bodyMaxHeight) {
    style.maxHeight = bodyMaxHeight;
  }
  if (scrollSize > 0 && fixed) {
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
    fixed === 'left' && (style.width = columnManager.getWidth(fixed));
    if (fixed === 'right' && sizeManager._hasScrollY) {
      style.width = columnManager.getWidth(fixed) + sizeManager.scrollSizeY();
    }
    return (
      <div
        key='bodyTable'
        className={`${prefixCls}-body-outer`}
        style={{...style}}
      >
        <div
          className={`${prefixCls}-body-inner`}
          ref={saveRef(scrollRef)}
          style={{
            height: '100%',
            overflowY: sizeManager._hasScrollY ? 'scroll' : 'hidden',
            overflowX: sizeManager._hasScrollX ? 'scroll' : 'hidden'
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

export default BodyTable;
BodyTable.contextTypes = {
  props: PropTypes.object,
  manager: PropTypes.object,
  getProps: PropTypes.func
};
