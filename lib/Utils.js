'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.measureScrollbar = measureScrollbar;
exports.debounce = debounce;
exports.remove = remove;
exports.addEventListener = addEventListener;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _addDomEventListener = require('add-dom-event-listener');

var _addDomEventListener2 = _interopRequireDefault(_addDomEventListener);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

var scrollbarSize = void 0;

// Measure scrollbar width for padding body during modal show/hide
var scrollbarMeasure = {
    position: 'absolute',
    top: '-9999px',
    width: '50px',
    height: '50px',
    overflow: 'scroll'
};

function measureScrollbar() {
    var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'vertical';

    if (typeof document === 'undefined' || typeof window === 'undefined') {
        return 0;
    }
    if (scrollbarSize) {
        return scrollbarSize;
    }
    var scrollDiv = document.createElement('div');
    for (var scrollProp in scrollbarMeasure) {
        if (scrollbarMeasure.hasOwnProperty(scrollProp)) {
            scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
        }
    }
    document.body.appendChild(scrollDiv);
    var size = 0;
    if (direction === 'vertical') {
        size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    } else if (direction === 'horizontal') {
        size = scrollDiv.offsetHeight - scrollDiv.clientHeight;
    }

    document.body.removeChild(scrollDiv);
    scrollbarSize = size;
    return scrollbarSize;
}

function debounce(func, wait, immediate) {
    var timeout = void 0;

    function debounceFunc() {
        var context = this;
        var args = arguments;
        // https://fb.me/react-event-pooling
        if (args[0] && args[0].persist) {
            args[0].persist();
        }
        var later = function later() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    }

    debounceFunc.cancel = function cancel() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return debounceFunc;
}

function remove(array, item) {
    var index = array.indexOf(item);
    var front = array.slice(0, index);
    var last = array.slice(index + 1, array.length);
    return front.concat(last);
}

function addEventListener(target, eventType, cb) {
    var callback = _reactDom2.default.unstable_batchedUpdates ? function run(e) {
        _reactDom2.default.unstable_batchedUpdates(cb, e);
    } : cb;
    return (0, _addDomEventListener2.default)(target, eventType, callback);
}