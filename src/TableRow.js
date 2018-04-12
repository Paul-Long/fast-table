import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from './TableCell';
import {connect} from './mini-store';

class TableRow extends React.PureComponent {
  onMouseEnter = (event) => {
    const {record, index, onRowMouseEnter, onHover, rowKey} = this.props;
    onHover(true, rowKey);
    if (onRowMouseEnter) {
      onRowMouseEnter(record, index, event);
    }
  };

  onMouseLeave = (event) => {
    const {record, index, onRowMouseLeave, onHover, rowKey} = this.props;
    onHover(false, rowKey);
    if (onRowMouseLeave) {
      onRowMouseLeave(record, index, event);
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
    const {columns, prefixCls, record, index, components, height, colWidth, expanded, indentSize, onExpandedRowsChange} = this.props;
    const cells = [];
    const columnSize = columns.length;
    columns.forEach((column, i) => {
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          index={index}
          colIndex={i}
          column={column}
          key={column.key || column.dataIndex}
          component={components.body.cell}
          width={colWidth[column.path.join('-')] || column.width}
          height={height}
          isLast={i + 1 === columnSize}
          expanded={expanded}
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
      top,
      className,
      height
    } = this.props;
    const BodyRow = components.body.row;
    const rowClass = classNames(
      'tr',
      `${prefixCls}-row`,
      className,
      {
        [`${prefixCls}-hover`]: hovered
      });
    const style = {
      position: 'absolute',
      top,
      height
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

TableRow.propTypes = {
  record: PropTypes.object,
  prefixCls: PropTypes.string,
  columns: PropTypes.array,
  height: PropTypes.number,
  indentSize: PropTypes.number,
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  className: PropTypes.string,
  fixed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onExpandedRowsChange: PropTypes.func,
  expanded: PropTypes.bool
};

