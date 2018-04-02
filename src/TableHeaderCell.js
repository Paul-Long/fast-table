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

  renderCell = (column, key, columns, index, isChild = true, isBase) => {
    const {colWidth, components} = this.props;
    const HeadCell = isBase ? components.header.cell : 'div';
    columns = columns || [];
    const style = {};
    const columnSize = columns.length;
    const {children = [], rowSpan, dataIndex} = column;
    let width = colWidth[column.path.join('-')] || column.width;
    if (children.length === 0) {
      style.flex = width ? `${index + 1 === columnSize && isChild ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}` : 1;
    } else {
      width && (style.width = width);
    }
    if (column.align) {
      style.textAlign = column.align;
    }
    style.height = (rowSpan || 1) * this.props.headerRowHeight;
    style.lineHeight = (rowSpan || 1) * 1.5;
    const cellClass = classNames('th', {'has-child': children.length > 0});
    return (
      <HeadCell key={key || column.key || dataIndex} className={cellClass} style={style}>
        {column.title}
      </HeadCell>
    )
  };

  render() {
    const {column, columns, index, colWidth, components} = this.props;
    const children = column.children || [];
    const HeaderCell = components.header.cell;
    const key = column.key || column.dataIndex || index;
    if (children.length === 0) {
      return this.renderCell(column, key, columns, index, true, true);
    }
    let width = colWidth[column.path.join('-')] || column.width;
    const style = {};
    if (width) {
      style.flex = `${index + 1 === columns.length ? 1 : 0} 1 ${isNumber(width) ? width + 'px' : width}`;
    }
    return (
      <HeaderCell className='row-group' style={style}>
        {this.renderCell(column, key, columns, index)}
        <div className='col-group'>
          {this.renderChildren(children)}
        </div>
      </HeaderCell>
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
