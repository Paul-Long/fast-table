'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function renderCell(columns, components, rowHeight, isLast) {
  var HeaderCell = components.header.cell;
  return columns.map(function (column, index) {
    var rowSpan = column.rowSpan,
      colSpan = column.colSpan,
      key = column.key,
      dataIndex = column.dataIndex,
      style = column.style,
      align = column.align,
      width = column.width;

    var children = column.children || [];
    if (children.length > 0) {
      children = _react2.default.createElement(
        HeaderCell,
        null,
        renderCell(children)
      );
    }
    var cellProps = {};
    cellProps.style = Object.assign({flex: 1}, style);
    align && (cellProps.style.textAlign = align);
    if (width) {
      cellProps.style.flex = (isLast ? 1 : 0) + ' 1 ' + ((0, _isNumber2.default)(width) ? width + 'px' : width);
    }
    cellProps.style.height = rowHeight;
    return [_react2.default.createElement(
      HeaderCell,
      _extends({}, cellProps, {className: 'tr'}),
      column.title
    ), children];
  });
}

function TableHeadCell(_ref) {
  var columns = _ref.columns,
    index = _ref.index,
    components = _ref.components,
    rowHeight = _ref.rowHeight,
    isLast = _ref.isLast;

  return _react2.default.createElement(
    HeaderCell,
    null,
    renderCell(columns, components, rowHeight)
  );
}

exports.default = TableHeadCell;
