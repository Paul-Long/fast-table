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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

function TableHeaderRow(_ref) {
  var row = _ref.row,
    index = _ref.index,
    height = _ref.height,
    components = _ref.components,
    columns = _ref.columns,
    rowHeight = _ref.rowHeight;

  var HeaderRow = components.header.row;
  var HeaderCell = components.header.cell;
  var columnSize = columns.length;
  return _react2.default.createElement(
    HeaderRow,
    {className: 'tr'},
    row.map(function (cell, index) {
      var column = cell.column,
        cellProps = _objectWithoutProperties(cell, ['column']);

      var key = column.key,
        dataIndex = column.dataIndex,
        style = column.style,
        align = column.align,
        width = column.width;

      cellProps.style = Object.assign({flex: 1}, style);
      align && (cellProps.style.textAlign = align);
      if (width) {
        cellProps.style.flex = (index + 1 === columnSize ? 1 : 0) + ' 1 ' + ((0, _isNumber2.default)(width) ? width + 'px' : width);
      }
      cellProps.style.height = rowHeight;
      var cellClass = (0, _classnames2.default)('th');
      return _react2.default.createElement(HeaderCell, _extends({
        key: key || dataIndex || index
      }, cellProps, {
        className: cellClass
      }));
    })
  );
}

exports.default = TableHeaderRow;
