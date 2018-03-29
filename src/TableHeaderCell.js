import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';

class TableHeaderCell extends React.PureComponent {
  renderChildren = (columns) => {
    columns = columns || [];
    const colWidth = this.props.colWidth;
    return columns.map((column, index) => {
      let children = column.children || [];
      children.length > 0 && this.renderChildren(children);
      const key = column.key || column.dataIndex || index;
      const arg = [column, key, columns, index];
      if (children.length > 0) {
        children = this.renderChildren(children);
        const style = {display: 'flex', flexDirection: 'column'};
        const width = colWidth[column.path.join('-')];
        if (width) {
          style.width = width;
        }
        return (
          <div key={column.path.join('-')} style={style}>
            {this.renderCell(...arg)}
            <div className='col-group' style={{display: 'flex', flexDirection: 'row'}}>
              {children}
            </div>
          </div>
        );
      }
      return this.renderCell(...arg, false);
    });
  };

  renderCell = (column, key, columns, index, isChild = true) => {
    const {colWidth} = this.props;
    columns = columns || [];
    const style = {};
    const columnSize = columns.length;
    const {children = [], rowSpan, dataIndex} = column;
    let width = colWidth[column.path.join('-')] || column.width;
    if (children.length === 0) {
      if (width) {
        style.flex = `${index + 1 === columnSize && isChild ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}`;
      } else {
        style.flex = 1;
      }
    } else {
      if (width) {
        style.width = width;
      }
    }
    style.height = (rowSpan || 1) * this.props.headerRowHeight;
    const cellClass = classNames('th', {'has-child': children.length > 0});
    return (
      <div key={key || column.key || dataIndex} className={cellClass} style={style}>
        {column.title}
      </div>
    )
  };

  render() {
    const {column, columns, index, colWidth} = this.props;
    const children = column.children || [];
    const key = column.key || column.dataIndex || index;
    if (children.length === 0) {
      return this.renderCell(column, key, columns, index);
    }
    let width = colWidth[column.path.join('-')] || column.width;
    const style = {};
    if (width) {
      style.flex = `${index + 1 === columns.length ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}`;
    }
    return (
      <div className='row-group' style={style}>
        {this.renderCell(column, key, columns, index)}
        <div className='col-group'>
          {this.renderChildren(children)}
        </div>
      </div>
    )
  }
}

export default TableHeaderCell;
TableHeaderCell.propTypes = {
  column: PropTypes.object,
  headerRowHeight: PropTypes.number,
  columns: PropTypes.array,
  index: PropTypes.number,
  colWidth: PropTypes.object
};
TableHeaderCell.defaultProps = {
  colWidth: {}
};
