import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

class TableCell extends React.PureComponent {
  isInvalidRenderCellText = (text) => {
    return text
      && !React.isValidElement(text)
      && Object.prototype.toString.call(text) === '[object Object]';
  };

  getStyle = () => {
    const {
      column,
      height,
      isLast
    } = this.props;
    let style = Object.assign({}, column.bodyStyle);
    if (column.align) {
      style.textAlign = column.align;
    }
    if (column.width) {
      style.flex = `${isLast ? 1 : 0} 1 ${isNumber(column.width) ? column.width + 'px' : column.width}`;
    } else {
      style.flex = 1;
    }
    style.height = height;
    style.lineHeight = `${height}px`;
    return style;
  };

  getClassName = () => {
    const {record, index, column} = this.props;
    const {tdClassName} = column;
    let cls = '';
    if (typeof tdClassName === 'function') {
      cls = tdClassName(column, record, index);
    } else if (tdClassName === 'string') {
      cls = tdClassName;
    }
    return classNames('td', cls);
  };

  render() {
    const {
      record,
      index,
      column,
      component: BodyCell
    } = this.props;
    const {dataIndex, render} = column;
    let text;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    let tdProps = {}, colSpan, rowSpan;
    if (render) {
      text = render(text, record, index);
      if (this.isInvalidRenderCellText(text)) {
        tdProps = text.props || tdProps;
        colSpan = tdProps.colSpan;
        rowSpan = tdProps.rowSpan;
        text = text.children;
      }
    }
    if (this.isInvalidRenderCellText(text)) {
      text = null;
    }
    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    tdProps.style = this.getStyle();
    return (
      <BodyCell
        className={this.getClassName()}
        {...tdProps}
      >
        {text}
      </BodyCell>
    )
  }
}

export default TableCell;

TableCell.propTypes = {
  record: PropTypes.object,
  prefixCls: PropTypes.string,
  index: PropTypes.number,
  indent: PropTypes.number,
  indentSize: PropTypes.number,
  column: PropTypes.object,
  component: PropTypes.any,
  isLast: PropTypes.bool
};

TableCell.defaultProps = {
  isLast: false
};
