import React from 'react';
import PropTypes from 'prop-types';

class TableHeaderCell extends React.PureComponent {
  renderChildren = (columns, currentRow = 0, rows) => {
    rows = rows || [];
    rows[currentRow] = rows[currentRow] || [];
    columns = columns || [];
    columns.map(child => {
      rows[currentRow].push(child);
      let children = child.children || [];
      children.length > 0 && this.renderChildren(children, currentRow + 1, rows);
    });
    return rows;
  };

  renderCell = (column, key) => {
    const style = {};
    const children = column.children || [];
    if (column.width && children.length === 0) {
      style.width = column.width;
    }
    return (
      <div key={key || column.key || column.dataIndex} className='th' style={style}>
        {column.title}
      </div>
    )
  };

  render() {
    const column = this.props.column;
    const children = column.children || [];
    const rows = this.renderChildren(children);
    if (children.length === 0) {
      return this.renderCell(column);
    }
    return (
      <div className='row-group'>
        {this.renderCell(column)}
        <div className='col-group'>
          {
            rows.map((row, i) => {
              return (
                <div key={i} className='col-group'>
                  {row.map((r, ri) => this.renderCell(r, `${i}-${ri}`))}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default TableHeaderCell;
TableHeaderCell.propTypes = {
  column: PropTypes.object
};
