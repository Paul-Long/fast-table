import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sorter from './Sorter';
import {cellAlignStyle} from './Utils';

class TableHeaderCell extends React.PureComponent {
  renderChildren = (columns) => {
    columns = columns || [];
    return columns.map((column, index) => {
      let children = column.children || [];
      children.length > 0 && this.renderChildren(children);
      const key = column.key || column.dataIndex || index;
      const arg = [column, key, columns, index];
      if (children.length > 0) {
        children = this.renderChildren(children);
        const style = {display: 'flex', flexDirection: 'column'};
        const width = column._width;
        if (width) {
          style.width = width;
        }
        if (column._minWidth) {
          style.minWidth = column._minWidth;
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
    const {components, orders, onSort} = this.props;
    const HeadCell = isBase ? components.header.cell : 'div';
    const style = cellAlignStyle(column.align);
    const {children = [], rowSpan, dataIndex} = column;
    let width = column._width;
    if (width) {
      style.width = width;
      style.minWidth = width;
    } else {
      style.flex = 1;
    }
    // if (column._minWidth) {
    //   style.minWidth = column._minWidth;
    // }
    let sorter;
    const order = orders[column.dataIndex];
    if (column.sortEnable && children.length === 0 && order) {
      sorter = (<Sorter dataIndex={column.dataIndex} order={order} onSort={onSort} />);
    }
    style.height = (rowSpan || 1) * this.props.headerRowHeight;
    style.lineHeight = (rowSpan || 1) * (style.height / 20);

    const props = {
      key: key || column.key || dataIndex,
      className: classNames('th', {'has-child': children.length > 0}),
      style
    };
    if (column.sortEnable && !order) {
      props.onClick = () => {
        onSort(column.dataIndex, 'desc');
      };
    }
    return (
      <HeadCell {...props}>
        {column.title}
        {sorter}
      </HeadCell>
    );
  };

  render() {
    const {column, columns, index, components} = this.props;
    const children = column.children || [];
    const HeaderCell = components.header.cell;
    const key = column.key || column.dataIndex || index;
    if (children.length === 0) {
      return this.renderCell(column, key, columns, index, true, true);
    }
    let width = column._width;
    const style = {};
    if (width) {
      style.width = width;
      style.minWidth = width;
    } else {
      style.flex = 1;
    }
    return (
      <HeaderCell className='row-group' style={style}>
        {this.renderCell(column, key, columns, index)}
        <div className='col-group'>
          {this.renderChildren(children)}
        </div>
      </HeaderCell>
    );
  }
}

export default TableHeaderCell;
TableHeaderCell.propTypes = {
  column: PropTypes.object,
  headerRowHeight: PropTypes.number,
  columns: PropTypes.array,
  index: PropTypes.number
};
