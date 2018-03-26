'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _miniStore = require('./mini-store');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BaseTable = function (_React$PureComponent) {
  _inherits(BaseTable, _React$PureComponent);

  function BaseTable() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BaseTable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BaseTable.__proto__ || Object.getPrototypeOf(BaseTable)).call.apply(_ref, [this].concat(args))), _this), _this.handleRowHover = function (isHover, key) {
      _this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    }, _this.renderRows = function (datas) {
      var rows = [];
      var _this$props = _this.props,
        getRowKey = _this$props.getRowKey,
        fixed = _this$props.fixed,
        renderStart = _this$props.renderStart,
        renderEnd = _this$props.renderEnd;

      var table = _this.context.table;
      var _table$props = table.props,
        prefixCls = _table$props.prefixCls,
        rowRef = _table$props.rowRef,
        getRowHeight = _table$props.getRowHeight,
        rowHeight = _table$props.rowHeight,
        rowClassName = _table$props.rowClassName;

      var columnManager = table.columnManager;
      datas.forEach(function (record, i) {
        if (i >= renderStart && i <= renderEnd) {
          var leafColumns = void 0;
          if (fixed === 'left') {
            leafColumns = columnManager.leftLeafColumns();
          } else if (fixed === 'right') {
            leafColumns = columnManager.rightLeafColumns();
          } else {
            leafColumns = columnManager.leafColumns();
          }
          var className = typeof rowClassName === 'function' ? rowClassName(record, i) : rowClassName;
          var key = getRowKey(record, i);
          var props = {
            key: key,
            record: record,
            fixed: fixed,
            prefixCls: prefixCls,
            className: className,
            rowKey: key,
            index: i,
            columns: leafColumns,
            ref: rowRef(record, i),
            components: table.components,
            height: getRowHeight(record, i) * rowHeight,
            onHover: _this.handleRowHover
          };
          rows.push(_react2.default.createElement(_TableRow2.default, props));
        }
      });
      return rows;
    }, _this.renderFooter = function () {
      var table = _this.context.table;
      var components = table.components;
      var _table$props2 = table.props,
        footer = _table$props2.footer,
        footerHeight = _table$props2.footerHeight;

      if (!footer) {
        return null;
      }
      var TableRow = components.body.row;
      return _react2.default.createElement(
        TableRow,
        {style: {position: 'absolute', bottom: 0, left: 0, height: footerHeight}},
        footer
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BaseTable, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
        hasHead = _props.hasHead,
        hasBody = _props.hasBody,
        columns = _props.columns,
        fixed = _props.fixed,
        bodyHeight = _props.bodyHeight;

      var table = this.context.table;
      var components = table.components;
      var _table$props3 = table.props,
        footer = _table$props3.footer,
        footerHeight = _table$props3.footerHeight;

      var body = void 0;
      var Table = components.table;
      var BodyWrapper = components.body.wrapper;
      if (hasBody) {
        body = _react2.default.createElement(
          BodyWrapper,
          {className: 'tbody', style: {height: bodyHeight + (footer ? footerHeight : 0)}},
          this.renderRows(table.props.dataSource),
          this.renderFooter()
        );
      }
      return _react2.default.createElement(
        Table,
        {className: 'table'},
        hasHead && _react2.default.createElement(_TableHeader2.default, {columns: columns, fixed: fixed}),
        body
      );
    }
  }]);

  return BaseTable;
}(_react2.default.PureComponent);

exports.default = (0, _miniStore.connect)(function (state) {
  var hasScroll = state.hasScroll,
    fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight,
    renderStart = state.renderStart,
    renderEnd = state.renderEnd,
    bodyHeight = state.bodyHeight;

  return {
    hasScroll: hasScroll,
    bodyHeight: bodyHeight,
    fixedColumnsBodyRowsHeight: fixedColumnsBodyRowsHeight,
    renderStart: renderStart,
    renderEnd: renderEnd
  };
})(BaseTable);


BaseTable.contextTypes = {
  table: _propTypes2.default.any
};
