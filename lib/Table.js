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

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _sum = require('lodash/sum');

var _sum2 = _interopRequireDefault(_sum);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _HeadTable = require('./HeadTable');

var _HeadTable2 = _interopRequireDefault(_HeadTable);

var _BodyTable = require('./BodyTable');

var _BodyTable2 = _interopRequireDefault(_BodyTable);

var _ColumnManager = require('./ColumnManager');

var _ColumnManager2 = _interopRequireDefault(_ColumnManager);

var _Utils = require('./Utils');

var _miniStore = require('./mini-store');

require('../theme/table.css');

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

var Table = function (_React$PureComponent) {
  _inherits(Table, _React$PureComponent);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.handleWindowResize = function () {
      setTimeout(function () {
        _this.syncFixedTableRowHeight();
      });
    };

    _this.syncFixedTableRowHeight = function () {
      var tableRect = _this['tableNode'].getBoundingClientRect();
      if (tableRect.height !== undefined && tableRect.height <= 0) {
        return;
      }
      var headRows = _this['headTable'] ? _this['headTable'].querySelectorAll('.thead') : _this['bodyTable'].querySelectorAll('.thead');
      var fixedColumnsHeadRowsHeight = [].map.call(headRows, function (row) {
        return row.getBoundingClientRect().height || 'auto';
      });

      var _this$resetBodyHeight = _this.resetBodyHeight(),
        fixedColumnsBodyRowsHeight = _this$resetBodyHeight.fixedColumnsBodyRowsHeight,
        tops = _this$resetBodyHeight.tops,
        bodyHeight = _this$resetBodyHeight.bodyHeight;

      var state = _this.store.getState();
      if ((0, _shallowequal2.default)(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) && (0, _shallowequal2.default)(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
        return;
      }
      var hasScroll = _this['bodyTable'].getBoundingClientRect().height < bodyHeight;
      _this.store.setState(_extends({
        hasScroll: hasScroll,
        fixedColumnsHeadRowsHeight: fixedColumnsHeadRowsHeight,
        tops: tops,
        bodyHeight: bodyHeight
      }, _this.resetRenderInterval(0, _this['bodyTable'].clientHeight, bodyHeight, fixedColumnsBodyRowsHeight)));
    };

    _this.handleBodyScroll = function (e) {
      var target = e.target;
      if (_this.lastScrollTop !== target.scrollTop && target !== _this['headTabl']) {
        var result = _this.resetRenderInterval(target.scrollTop, target.clientHeight, target.scrollHeight);
        _this.store.setState(result);
      }
      _this.lastScrollTop = target.scrollTop;
    };

    _this.resetBodyHeight = function () {
      var _this$props = _this.props,
        dataSource = _this$props.dataSource,
        getRowHeight = _this$props.getRowHeight,
        rowHeight = _this$props.rowHeight;

      var tops = [],
        top = 0;
      var fixedColumnsBodyRowsHeight = dataSource.map(function (record, index) {
        var height = getRowHeight(record, index) * rowHeight;
        tops.push(top);
        top += height;
        return height;
      });
      return {
        fixedColumnsBodyRowsHeight: fixedColumnsBodyRowsHeight,
        tops: tops,
        bodyHeight: (0, _sum2.default)(fixedColumnsBodyRowsHeight)
      };
    };

    _this.resetRenderInterval = function (scrollTop, clientHeight, scrollHeight, fixedColumnsBodyRowsHeight) {
      var rowHeight = _this.props.rowHeight;

      if (!fixedColumnsBodyRowsHeight) {
        var state = _this.store.getState();
        fixedColumnsBodyRowsHeight = state.fixedColumnsBodyRowsHeight;
      }
      var start = 0,
        end = 0,
        top = 0,
        isStart = false,
        isEnd = false;
      for (var index = 0; index < fixedColumnsBodyRowsHeight.length; index++) {
        var height = fixedColumnsBodyRowsHeight[index];
        if (top + height >= scrollTop && !isStart) {
          start = index;
          isStart = true;
        } else if (top > scrollTop + clientHeight && !isEnd) {
          end = index;
          isEnd = true;
          break;
        }
        top += height;
      }
      if (scrollTop <= rowHeight) {
        start = 0;
      }
      if (scrollTop + clientHeight >= scrollHeight - rowHeight) {
        end = fixedColumnsBodyRowsHeight.length - 1;
      }
      return {
        renderStart: start,
        renderEnd: end
      };
    };

    _this.saveRef = function (name) {
      return function (node) {
        _this[name] = node;
      };
    };

    _this.getClassName = function () {
      var _classNames;

      var _this$props2 = _this.props,
        prefixCls = _this$props2.prefixCls,
        className = _this$props2.className,
        fixedHeader = _this$props2.fixedHeader,
        bordered = _this$props2.bordered;

      return (0, _classnames2.default)(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-fixed-header', fixedHeader), _defineProperty(_classNames, 'bordered', bordered), _classNames));
    };

    _this.getStyle = function () {
      var _this$props3 = _this.props,
        width = _this$props3.width,
        height = _this$props3.height,
        style = _this$props3.style;

      var baseStyle = Object.assign({}, style);
      width && (baseStyle.width = width);
      height && (baseStyle.height = height);
      return baseStyle;
    };

    _this.getRowKey = function (record, index) {
      var rowKey = _this.props.rowKey;
      if (typeof rowKey === 'function') {
        return rowKey(record, index);
      } else if (typeof rowKey === 'string') {
        return record[rowKey];
      }
      return index;
    };

    _this.renderTable = function (options) {
      var columns = options.columns,
        fixed = options.fixed;

      var headTable = _react2.default.createElement(_HeadTable2.default, {
        key: 'head',
        columns: columns,
        fixed: fixed
      });
      var bodyTable = _react2.default.createElement(_BodyTable2.default, {
        key: 'body',
        columns: columns,
        fixed: fixed,
        getRowKey: _this.getRowKey,
        handleBodyScroll: _this.handleBodyScroll
      });
      return [headTable, bodyTable];
    };

    _this.renderMainTable = function () {
      return _this.renderTable({
        columns: _this.columnManager.groupedColumns()
      });
    };

    _this.columnManager = new _ColumnManager2.default(props.columns);
    _this.lastScrollTop = 0;
    _this.store = (0, _miniStore.create)(_extends({
      currentHoverKey: null,
      hasScroll: false,
      fixedColumnsHeadRowsHeight: []
    }, _this.resetBodyHeight()));
    _this.debouncedWindowResize = (0, _Utils.debounce)(_this.handleWindowResize, 150);
    return _this;
  }

  _createClass(Table, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        table: {
          props: this.props,
          saveRef: this.saveRef,
          columnManager: this.columnManager,
          components: (0, _merge2.default)({
            table: 'div',
            header: {
              wrapper: 'div',
              row: 'div',
              cell: 'div'
            },
            body: {
              wrapper: 'div',
              row: 'div',
              cell: 'div'
            }
          }, this.props.components)
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleWindowResize();
      this.resizeEvent = (0, _Utils.addEventListener)(window, 'resize', this.debouncedWindowResize);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _shallowequal2.default)(nextProps.dataSource, this.props.dataSource)) {
        this.store.setState({
          fixedColumnsBodyRowsHeight: this.resetBodyHeight()
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _miniStore.Provider,
        {store: this.store},
        _react2.default.createElement(
          'div',
          {
            className: this.getClassName(),
            ref: this.saveRef('tableNode'),
            style: this.getStyle()
          },
          this.renderMainTable()
        )
      );
    }
  }]);

  return Table;
}(_react2.default.PureComponent);

exports.default = Table;


Table.propTypes = {
  prefixCls: _propTypes2.default.string,
  columns: _propTypes2.default.array,
  dataSource: _propTypes2.default.array,

  className: _propTypes2.default.string,

  showHeader: _propTypes2.default.bool,
  bordered: _propTypes2.default.bool,
  fixedHeader: _propTypes2.default.bool,

  rowRef: _propTypes2.default.func,
  getRowHeight: _propTypes2.default.func,

  rowHeight: _propTypes2.default.number,
  headerRowHeight: _propTypes2.default.number
};

Table.defaultProps = {
  prefixCls: 'vt',
  columns: [],
  dataSource: [],

  showHeader: true,
  bordered: false,
  fixedHeader: true,

  rowRef: function rowRef() {
    return null;
  },
  getRowHeight: function getRowHeight() {
    return 1;
  },

  rowHeight: 30,
  headerRowHeight: 35
};

Table.childContextTypes = {
  table: _propTypes2.default.any
};
