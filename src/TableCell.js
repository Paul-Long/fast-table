import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import {cellAlignStyle} from './Utils';
import ExpandedIcon from './ExpandedIcon';

class TableCell extends React.PureComponent {
  isInvalidRenderCellText = (text) => {
    return text
      && !React.isValidElement(text)
      && Object.prototype.toString.call(text) === '[object Object]';
  };

  getStyle = () => {
    const {
      column,
      record,
      index,
      colIndex
    } = this.props;
    const {bodyStyle, align} = column;
    let style = {};
    if (typeof bodyStyle === 'function') {
      style = bodyStyle(record, index, colIndex) || {};
    } else {
      style = {...bodyStyle};
    }
    style = {...style, ...cellAlignStyle(align)};
    const {_width, _minWidth} = column || {};
    if (_width) {
      style.width = _width;
      style.minWidth = _width;
    } else {
      style.flex = 1;
    }
    // if (_minWidth) {
    //   style.minWidth = _minWidth;
    // }
    return style;
  };

  getText = () => {
    const {
      record,
      index,
      column,
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
    if (typeof render === 'function') {
      text = render(text, record, index);
    }
    return text;
  };

  onExpandedIconClick = (key, expanded) => {
    const {onExpandedRowsChange} = this.props;
    if (typeof onExpandedRowsChange === 'function') {
      onExpandedRowsChange(key, expanded);
    }
  };

  getExpandedIcon = () => {
    const {
      colIndex,
      record,
      prefixCls,
      expanded,
      indentSize,
      fixed
    } = this.props;
    const children = record.children || [];
    if (children.length > 0 && colIndex === 0 && fixed !== 'right') {
      return (
        <ExpandedIcon
          prefixCls={prefixCls}
          expanded={expanded}
          onClick={this.onExpandedIconClick.bind(this, record.key, !expanded)}
        />
      );
    }
    if (colIndex === 0) {
      return (<span style={{width: record._expandedLevel * indentSize}} />);
    }
  };

  render() {
    const {
      column,
      component: BodyCell
    } = this.props;
    const {render} = column;
    let text = this.getText();
    let tdProps = {}, colSpan, rowSpan;
    if (render) {
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
        className={classNames('td', column.className)}
        {...tdProps}
      >
        {this.getExpandedIcon()}
        <div>
          {text}
        </div>
      </BodyCell>
    );
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
  isLast: PropTypes.bool,
  onExpandedRowsChange: PropTypes.func
};

TableCell.defaultProps = {
  isLast: false
};
