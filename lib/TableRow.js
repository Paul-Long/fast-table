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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _miniStore = require('./mini-store');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {value: value, enumerable: true, configurable: true, writable: true});
  } else {
    obj[key] = value;
  }
  return obj;
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

var TableRow = function (_React$PureComponent) {
  _inherits(TableRow, _React$PureComponent);

  function TableRow() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TableRow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call.apply(_ref, [this].concat(args))), _this), _this.onMouseEnter = function (event) {
      var _this$props = _this.props,
        record = _this$props.record,
        index = _this$props.index,
        onRowMouseEnter = _this$props.onRowMouseEnter,
        onHover = _this$props.onHover,
        rowKey = _this$props.rowKey;

      onHover(true, rowKey);
      if (onRowMouseEnter) {
        onRowMouseEnter(record, index, event);
      }
    }, _this.onMouseLeave = function (event) {
      var _this$props2 = _this.props,
        record = _this$props2.record,
        index = _this$props2.index,
        onRowMouseLeave = _this$props2.onRowMouseLeave,
        onHover = _this$props2.onHover,
        rowKey = _this$props2.rowKey;

      onHover(false, rowKey);
      if (onRowMouseLeave) {
        onRowMouseLeave(record, index, event);
      }
    }, _this.renderCells = function () {
      var _this$props3 = _this.props,
        columns = _this$props3.columns,
        prefixCls = _this$props3.prefixCls,
        record = _this$props3.record,
        index = _this$props3.index,
        components = _this$props3.components,
        height = _this$props3.height;

      var cells = [];
      var columnSize = columns.length;
      columns.forEach(function (column, i) {
        cells.push(_react2.default.createElement(_TableCell2.default, {
          prefixCls: prefixCls,
          record: record,
          index: index,
          column: column,
          key: column.key || column.dataIndex,
          component: components.body.cell,
          height: height,
          isLast: i + 1 === columnSize
        }));
      });
      return cells;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TableRow, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
        components = _props.components,
        prefixCls = _props.prefixCls,
        hovered = _props.hovered,
        top = _props.top,
        className = _props.className;

      var BodyRow = components.body.row;
      var rowClass = (0, _classnames2.default)('tr', prefixCls + '-row', className, _defineProperty({}, prefixCls + '-hover', hovered));
      var style = {
        position: 'absolute',
        top: top
      };
      return _react2.default.createElement(
        BodyRow,
        {
          className: rowClass,
          style: style,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave
        },
        this.renderCells()
      );
    }
  }]);

  return TableRow;
}(_react2.default.PureComponent);

exports.default = (0, _miniStore.connect)(function (state, props) {
  var currentHoverKey = state.currentHoverKey,
    tops = state.tops;
  var rowKey = props.rowKey,
    index = props.index;

  return {
    hovered: currentHoverKey === rowKey,
    top: tops[index]
  };
})(TableRow);


TableRow.propTypes = {
  record: _propTypes2.default.object,
  prefixCls: _propTypes2.default.string,
  columns: _propTypes2.default.array,
  height: _propTypes2.default.number,
  rowKey: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
  className: _propTypes2.default.string,
  fixed: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
};
