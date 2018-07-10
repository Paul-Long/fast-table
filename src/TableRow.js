import React from 'react';
import classNames from 'classnames';

type Props = {
  key: string,
  className: string,
  record: Object,
  prefixCls: string,
  onHover: Function,
  onClick: Function,
  components: Object,
  expandedRowByClick: boolean,
  hoverEnable: boolean,
  handleExpanded: Function,
  scrollTop: number,
  hovered: boolean,
  hasExpanded: boolean,
  cells: [React.Element<*>],
}

function Row(props: Props) {
  const {
    key,
    className,
    record,
    prefixCls,
    onHover,
    onClick,
    components,
    expandedRowByClick,
    hoverEnable,
    handleExpanded,
    scrollTop,
    hovered,
    hasExpanded,
    cells,
  } = props;
  const Tr = components.body.row;
  const rowClass = classNames(
    'tr',
    `${prefixCls}-row`,
    `${prefixCls}-row-${record._showIndex % 2}`,
    className,
    {
      [`${prefixCls}-hover`]: hovered,
      [`${prefixCls}-expanded-row-${record._expandedLevel}`]: hasExpanded,
      [`${prefixCls}-row-fixed`]: record._isFixed,
    }
  );
  const newProps = {
    key,
    className: rowClass,
    style: {
      position: 'absolute',
      top: record._top + (record._isFixed ? scrollTop : 0),
      height: record._height
    },
    onClick: function (event) {
      onClick && onClick(record, record.key, event);
      expandedRowByClick && handleExpanded && handleExpanded(record, record.key, event);
    }
  };
  if (record._isFixed) {
    newProps.style.zIndex = 1;
  }
  if (hoverEnable) {
    newProps.onMouseEnter = function () {
      onHover && onHover(true, record.key);
    };
    newProps.onMouseLeave = function () {
      onHover && onHover(false, record.key);
    };
  }
  return (
    <Tr {...newProps} >
      {cells}
    </Tr>
  );
}

export default Row;
