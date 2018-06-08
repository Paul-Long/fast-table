import React from 'react';
import classNames from 'classnames';
import Cell from './TableCell';

type Props = {
  key: string,
  className: string,
  record: Object,
  prefixCls: string,
  columns: Array,
  onHover: Function,
  onClick: Function,
  expanded: boolean,
  fixed: string,
  indentSize: number,
  components: Object,
  renderExpandedIcon: Function,
  expandedRowByClick: boolean,
  hoverEnable: boolean,
  handleExpanded: Function,
  scrollTop: number,
}

function Row(props: Props) {
  const {
    key,
    className,
    record,
    prefixCls,
    columns,
    onHover,
    onClick,
    expanded,
    fixed,
    indentSize,
    components,
    renderExpandedIcon,
    expandedRowByClick,
    hoverEnable,
    handleExpanded,
    scrollTop,
  } = props;
  const Tr = components.body.row;
  const rowClass = classNames(
    'tr',
    `${prefixCls}-row`,
    `${prefixCls}-row-${record._showIndex % 2}`,
    className
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
  const cells = [];
  for (let i = 0; i < columns.length; i++) {
    const cellProps = {
      key: `Row${record._showIndex}-Col${i}`,
      column: columns[i],
      record,
      components
    };
    if (renderExpandedIcon) {
      cellProps.ExpandedIcon = renderExpandedIcon({
        columnIndex: i,
        record,
        prefixCls,
        fixed,
        expanded,
        indentSize,
        handleExpanded
      });
    }
    cells.push(Cell(cellProps));
  }
  return (
    <Tr {...newProps} >
      {cells}
    </Tr>
  );
}

export default Row;
