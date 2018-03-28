'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableHeaderCell = require('./TableHeaderCell');

var _TableHeaderCell2 = _interopRequireDefault(_TableHeaderCell);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
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
    columns.map(function (column, index) {
      return _react2.default.createElement(_TableHeaderCell2.default, {key: index, column: column});
    })
  );
}

exports.default = TableHeaderRow;
