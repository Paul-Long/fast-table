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
  components: Object,
  renderExpandedIcon: Function,
  expandedRowByClick: boolean,
  handleExpanded: Function
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
    components,
    renderExpandedIcon,
    expandedRowByClick,
    handleExpanded
  } = props;
  const Tr = components.body.row;
  const rowClass = classNames(
    'tr',
    `${prefixCls}-row`,
    `${prefixCls}-row-${record._showIndex % 2}`,
    className);
  const newProps = {
    key,
    className: rowClass,
    style: {
      position: 'absolute',
      top: record._top,
      height: record._height
    },
    onMouseEnter: function (event) {
      event.stopPropagation();
      onHover && onHover(true, record.key);
    },
    onMouseLeave: function (event) {
      event.stopPropagation();
      onHover && onHover(false, record.key);
    },
    onClick: function (event) {
      event.stopPropagation();
      onClick && onClick(record, record.key, event);
      expandedRowByClick && handleExpanded && handleExpanded(record, record.key, event);
    }
  };
  const cells = [];
  for (let i = 0; i < columns.length; i++) {
    const cellProps = {
      key: `Row${record._showIndex}-Col${i}`,
      column: columns[i],
      record,
      components,
      ExpandedIcon: renderExpandedIcon({
        columnIndex: i,
        record
      })
    };
    if (renderExpandedIcon) {
      cellProps.ExpandedIcon = renderExpandedIcon({
        columnIndex: i,
        record,
        prefixCls,
        fixed,
        expanded,
        handleExpanded
      })
    }
    cells.push(Cell(cellProps));
  }
  return (
    <Tr {...newProps} >
      {cells}
    </Tr>
  )
}

export default Row;
