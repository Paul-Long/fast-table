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

function HeadTable(props, _ref) {
    var table = _ref.table;
    var _table$props = table.props,
        prefixCls = _table$props.prefixCls,
        showHeader = _table$props.showHeader;
    var columns = props.columns,
        fixed = props.fixed,
        hasScroll = props.hasScroll;
    var saveRef = table.saveRef;
    var fixedHeader = table.props.fixedHeader;

    var headStyle = {};
    if (!fixedHeader || !showHeader) {
        return null;
    }
    headStyle.overflowY = hasScroll ? 'scroll' : 'auto';
    return _react2.default.createElement(
        'div',
        {
            key: 'headTable',
            className: prefixCls + '-header',
            style: headStyle,
            ref: fixed ? null : saveRef('headTable')
        },
        _react2.default.createElement(_BaseTable2.default, {
            hasHead: true,
            hasBody: false,
            fixed: fixed,
            columns: columns
        })
    );
}

exports.default = (0, _miniStore.connect)(function (state, props) {
    var hasScroll = state.hasScroll;

    return {
        hasScroll: hasScroll
    };
})(HeadTable);


HeadTable.propTypes = {
    fixed: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
    columns: _propTypes2.default.array.isRequired
};

HeadTable.contextTypes = {
    table: _propTypes2.default.any
};