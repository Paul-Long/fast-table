'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _BaseTable = require('./BaseTable');

var _BaseTable2 = _interopRequireDefault(_BaseTable);

var _miniStore = require('./mini-store');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function BodyTable(props, _ref) {
  var table = _ref.table;
  var saveRef = table.saveRef;
  var _table$props = table.props,
    prefixCls = _table$props.prefixCls,
    fixedHeader = _table$props.fixedHeader,
    showHeader = _table$props.showHeader;
  var fixed = props.fixed,
    columns = props.columns,
    getRowKey = props.getRowKey,
    hasScroll = props.hasScroll,
    handleBodyScroll = props.handleBodyScroll,
    headHeight = props.headHeight;

  var baseTable = _react2.default.createElement(_BaseTable2.default, {
    hasHead: !fixedHeader,
    hasBody: true,
    fixed: fixed,
    columns: columns,
    getRowKey: getRowKey
  });
  var style = {
    height: showHeader ? 'calc(100% - ' + (headHeight + 1) + 'px)' : '100%',
    overflowY: hasScroll ? 'scroll' : 'auto'
  };
  if (!fixedHeader) {
    style.height = 'auto';
    style.overflowY = 'hidden';
  }
  return _react2.default.createElement(
    'div',
    {
      key: 'bodyTable',
      className: prefixCls + '-body',
      ref: saveRef('bodyTable'),
      style: style,
      onScroll: handleBodyScroll
    },
    baseTable
  );
}

exports.default = (0, _miniStore.connect)(function (state, props) {
  var hasScroll = state.hasScroll,
    headHeight = state.headHeight;

  return {
    hasScroll: hasScroll,
    headHeight: headHeight
  };
})(BodyTable);

BodyTable.contextTypes = {
  table: _propTypes2.default.any
};
