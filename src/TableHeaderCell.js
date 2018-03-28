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

  render() {
    const {title} = this.props.column;
    const rows = this.renderChildren(this.props.column.children);
    console.log(rows);
    const style = {
      display: 'inline-block'
    };
    const props = {
      className: 'th',
      style
    };
    return (
      <div>
        <div {...props}>{title}</div>
        <div>
          {
            rows.map((row, i) => {
              return (
                <div key={i}>
                  {row.map((r, ri) => {
                    return (<div {...props} key={`${i}-${ri}`}>{r.title}</div>)
                  })}
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
