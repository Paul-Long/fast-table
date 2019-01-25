import React from 'react';
import createDetectElementResize from './utils/detectElementResize';

type Size = {
  width: number,
  height: number
};
type Props = {
  children: (Size) => React.Element<*>,
  className?: string,
  defaultHeight?: number,
  defaultWidth?: number,
  disableHeight: boolean,
  disableWidth: boolean,
  nonce?: string,
  onResize: (Size) => void,
  style: ?Object
};
type State = {
  height: number,
  width: number
};
type ResizeHandler = (element: HTMLElement, onResize: () => void) => void;

type DetectElementResize = {
  addResizeListener: ResizeHandler,
  removeResizeListener: ResizeHandler
};

export default class AutoSizer extends React.PureComponent<Props, State> {
  static defaultProps = {
    onResize: () => {},
    disableHeight: false,
    disableWidth: false,
    style: {}
  };
  state = {
    height: this.props.defaultHeight || 0,
    width: this.props.defaultWidth || 0
  };

  _parentNode: ?HTMLElement;
  _autoSizer: ?HTMLElement;
  _detectElementResize: DetectElementResize;

  componentDidMount() {
    const {nonce} = this.props;
    if (
      this._autoSizer &&
      this._autoSizer.parentNode &&
      this._autoSizer.parentNode.ownerDocument &&
      this._autoSizer.parentNode.ownerDocument.defaultView &&
      this._autoSizer.parentNode instanceof
        this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      this._parentNode = this._autoSizer.parentNode;

      this._detectElementResize = createDetectElementResize(nonce);
      this._detectElementResize.addResizeListener(
        this._parentNode,
        this._onResize
      );

      this._onResize();
    }
  }

  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(
        this._parentNode,
        this._onResize
      );
    }
  }

  render() {
    const {
      children,
      className,
      disableHeight,
      disableWidth,
      style
    } = this.props;
    const {height, width} = this.state;

    const outerStyle: Object = {overflow: 'visible'};
    const childParams: Object = {};

    if (!disableHeight) {
      outerStyle.height = 0;
      childParams.height = height;
    }

    if (!disableWidth) {
      outerStyle.width = 0;
      childParams.width = width;
    }

    return (
      <div
        className={className}
        ref={this._setRef}
        style={{
          ...outerStyle,
          ...style,
          height: '100%'
        }}
      >
        {children(childParams)}
      </div>
    );
  }

  _onResize = () => {
    const {disableHeight, disableWidth, onResize} = this.props;

    if (this._parentNode) {
      const height = this._parentNode.offsetHeight || 0;
      const width = this._parentNode.offsetWidth || 0;

      const style = window.getComputedStyle(this._parentNode) || {};
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;
      const borderLeftWidth = parseInt(style.borderLeftWidth, 10) || 0;
      const borderTopWidth = parseInt(style.borderTopWidth, 10) || 0;
      const borderRightWidth = parseInt(style.borderRightWidth, 10) || 0;
      const borderBottomWidth = parseInt(style.borderBottomWidth, 10) || 0;

      let newHeight = height - paddingTop - paddingBottom;
      let newWidth = width - paddingLeft - paddingRight;
      if (style.boxSizing === 'border-box') {
        newHeight = newHeight - borderTopWidth - borderBottomWidth;
        newWidth = newWidth - borderLeftWidth - borderRightWidth;
      }

      if (
        (!disableHeight && this.state.height !== newHeight) ||
        (!disableWidth && this.state.width !== newWidth)
      ) {
        const state = {
          height: newHeight,
          width: newWidth
        };
        this.setState(state);

        onResize(state);
      }
    }
  };

  _setRef = (autoSizer: ?HTMLElement) => {
    this._autoSizer = autoSizer;
  };
}
