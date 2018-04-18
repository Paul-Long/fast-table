import React from 'react';
import classNames from 'classnames';
import TableCell from './TableCell';
import {connect} from './mini-store';
import {TableRowParams} from './types';

class TableRow extends React.PureComponent<TableRowParams> {
  static defaultProps = {
    hasExpanded: false
  };
  onMouseEnter = (event) => {
    const {record, onRowMouseEnter, onHover, rowKey} = this.props;
    onHover(true, rowKey);
    if (onRowMouseEnter) {
      onRowMouseEnter(record, record._index, event);
    }
  };

  onMouseLeave = (event) => {
    const {record, onRowMouseLeave, onHover, rowKey} = this.props;
    onHover(false, rowKey);
    if (onRowMouseLeave) {
      onRowMouseLeave(record, record._index, event);
    }
  };

  onExpandedRowsChange = (key, expanded) => {
    const {onExpandedRowsChange} = this.props;
    if (typeof onExpandedRowsChange === 'function') {
      onExpandedRowsChange(key, expanded);
    }
  };

  onClick = (e) => {
    e.stopPropagation();
    const {record, expanded, expandedRowByClick} = this.props;
    if (expandedRowByClick) {
      this.onExpandedRowsChange(record.key, !expanded);
    }
  };

  renderCells = () => {
    const {
      columns, prefixCls, record, components, hasExpanded,
      expanded, indentSize, onExpandedRowsChange, fixed
    } = this.props;
    const cells = [];
    columns.forEach((column, i) => {
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          fixed={fixed}
          index={record._index}
          colIndex={i}
          column={column}
          key={column.key || column.dataIndex}
          component={components.body.cell}
          height={record._height}
          expanded={expanded}
          hasExpanded={hasExpanded}
          indentSize={indentSize}
          onExpandedRowsChange={onExpandedRowsChange}
        />
      );
    });
    return cells;
  };

  render() {
    const {
      components,
      prefixCls,
      hovered,
      className,
      record,
      hasExpanded
    } = this.props;
    const BodyRow = components.body.row;
    const rowClass = classNames(
      'tr',
      `${prefixCls}-row`,
      `${prefixCls}-row-${record._showIndex % 2}`,
      className,
      {
        [`${prefixCls}-hover`]: hovered,
        [`${prefixCls}-expanded-row-${record._expandedLevel}`]: hasExpanded
      });
    const style = {
      position: 'absolute',
      top: record._top,
      height: record._height
    };
    return (
      <BodyRow
        className={rowClass}
        style={style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
      >
        {this.renderCells()}
      </BodyRow>
    );
  }
}

export default connect((state, props) => {
  const {currentHoverKey} = state;
  const {rowKey} = props;
  return {
    hovered: currentHoverKey === rowKey
  };
})(TableRow);
