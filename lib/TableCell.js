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

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

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

var TableCell = function (_React$PureComponent) {
  _inherits(TableCell, _React$PureComponent);

  function TableCell() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TableCell);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TableCell.__proto__ || Object.getPrototypeOf(TableCell)).call.apply(_ref, [this].concat(args))), _this), _this.isInvalidRenderCellText = function (text) {
      return text && !_react2.default.isValidElement(text) && Object.prototype.toString.call(text) === '[object Object]';
    }, _this.getStyle = function () {
      var _this$props = _this.props,
        column = _this$props.column,
        height = _this$props.height,
        isLast = _this$props.isLast,
        record = _this$props.record,
        index = _this$props.index;
      var bodyStyle = column.bodyStyle,
        align = column.align,
        width = column.width;

      var style = {};
      if (typeof bodyStyle === 'function') {
        style = bodyStyle(record, index) || {};
      } else {
        style = Object.assign({}, bodyStyle);
      }
      align && (style.textAlign = column.align);
      if (width) {
        style.flex = (isLast ? 1 : 0) + ' 1 ' + ((0, _isNumber2.default)(width) ? width + 'px' : width);
      } else {
        style.flex = 1;
      }
      style.height = height;
      return style;
    }, _this.getClassName = function () {
      var _this$props2 = _this.props,
        record = _this$props2.record,
        index = _this$props2.index,
        column = _this$props2.column;
      var className = column.className;

      var cls = '';
      if (typeof className === 'function') {
        cls = className(column, record, index);
      } else if (className === 'string') {
        cls = className;
      }
      return (0, _classnames2.default)('td', cls);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TableCell, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
        record = _props.record,
        index = _props.index,
        column = _props.column,
        BodyCell = _props.component;
      var dataIndex = column.dataIndex,
        render = column.render;

      var text = void 0;
      if (typeof dataIndex === 'number') {
        text = (0, _get2.default)(record, dataIndex);
      } else if (!dataIndex || dataIndex.length === 0) {
        text = record;
      } else {
        text = (0, _get2.default)(record, dataIndex);
      }
      var tdProps = {},
        colSpan = void 0,
        rowSpan = void 0;
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
      return _react2.default.createElement(
        BodyCell,
        _extends({
          className: this.getClassName()
        }, tdProps),
        text
      );
    }
  }]);

  return TableCell;
}(_react2.default.PureComponent);

exports.default = TableCell;


TableCell.propTypes = {
  record: _propTypes2.default.object,
  prefixCls: _propTypes2.default.string,
  index: _propTypes2.default.number,
  indent: _propTypes2.default.number,
  indentSize: _propTypes2.default.number,
  column: _propTypes2.default.object,
  component: _propTypes2.default.any,
  isLast: _propTypes2.default.bool
};

TableCell.defaultProps = {
  isLast: false
};
