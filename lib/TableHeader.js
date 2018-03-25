'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TableHeader;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TableHeaderRow = require('./TableHeaderRow');

var _TableHeaderRow2 = _interopRequireDefault(_TableHeaderRow);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function getHeaderRows(columns) {
  var currentRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var rows = arguments[2];

  rows = rows || [];
  rows[currentRow] = rows[currentRow] || [];
  columns.forEach(function (column) {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    var cell = {
      key: column.key,
      className: column.className || '',
      children: column.title,
      column: column
    };
    if (column.children) {
      getHeaderRows(column.children, currentRow + 1, rows);
    }
    if ('colSpan' in column) {
      cell.colSpan = column.colSpan;
    }
    if ('rowSpan' in column) {
      cell.rowSpan = column.rowSpan;
    }
    if (cell.colSpan !== 0) {
      rows[currentRow].push(cell);
    }
  });
  return rows.filter(function (row) {
    return row.length > 0;
  });
}

function TableHeader(props, _ref) {
  var table = _ref.table;
  var columns = props.columns,
    fixed = props.fixed;
  var _table$props = table.props,
    headerRowHeight = _table$props.headerRowHeight,
    bordered = _table$props.bordered;

  var components = table.components;
  var HeaderWrapper = components.header.wrapper;
  var rows = getHeaderRows(columns);
  var columnSize = columns.length;
  return _react2.default.createElement(
    HeaderWrapper,
    {className: 'thead'},
    rows.map(function (row, index) {
      return _react2.default.createElement(_TableHeaderRow2.default, {
        key: index,
        index: index,
        fixed: fixed,
        columns: columns,
        rows: rows,
        row: row,
        rowHeight: headerRowHeight - (bordered ? 1 : 0),
        components: components,
        isLast: index + 1 === columnSize,
        saveColumnRef: table.saveColumnRef
      });
    })
  );
}

TableHeader.propTypes = {
  fixed: _propTypes2.default.string,
  columns: _propTypes2.default.array.isRequired
};

TableHeader.contextTypes = {
  table: _propTypes2.default.any
};
