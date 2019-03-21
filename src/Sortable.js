import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

const {Children, PureComponent} = React;

type SortableProps = {
  columns: Array<Object>,
  parent?: Object,
  onDrag: Function
};

class Sortable extends PureComponent<SortableProps> {
  currentEl = null;
  cloneEl = null;
  parentEl = null;
  dragAble = false;
  offsetX = 0;
  currentElIndex = null;
  prevEl = null;
  nextEl = null;

  static contextTypes = {
    props: PropTypes.object,
    updateScrollLeft: PropTypes.func,
    getProps: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.fixedIndex = [];
    this.leftFixedIndex = [];
    this.rightFixedIndex = [];
    this.state = this.propsToState();
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setState(this.propsToState(nextProps));
    }
  }

  propsToState = (props = this.props) => {
    const showIndex = [];
    const children = Children.map(props.children, (child, index) => {
      showIndex.push(index);
      if (child.props.fixed === 'left') {
        this.fixedIndex.push(index);
        this.leftFixedIndex.push(index);
      }
      if (child.props.fixed === 'right') {
        this.fixedIndex.push(index);
        this.rightFixedIndex.push(index);
      }
      return React.cloneElement(child, {
        ref: this.saveRef(index),
        onMouseDown: this.handleMouseDown,
        'data-index': index
      });
    });
    this.backIndex = showIndex;
    return {showIndex, children};
  };

  saveRef = (index) => (node) => {
    this[`child-${index}`] = node;
  };

  handleMouseMove = (event) => {
    if (this.dragAble) {
      let left = event.pageX - this.offsetX;
      left = left < 0 ? 0 : left;
      this.cloneEl.style.left = `${left}px`;
      this._swap();
    } else {
      return event;
    }
  };

  handleMouseUp = (event) => {
    const {onDrag, parent, columns} = this.props;
    if (!this.dragAble) {
      return event;
    }
    this.dragAble = false;
    if (this.cloneEl && this.parentEl) {
      this.parentEl.removeChild(this.cloneEl);
      this.parentEl = null;
      this.cloneEl = null;
      this.currentEl.style.opacity = 1;
      this.currentEl.style.background = 'transparent';
      this.currentEl = null;
      this.currentElIndex = null;
      this.prevEl = null;
      this.nextEl = null;
      this.dataCurrentIndex = null;
      this.prevElIndex = null;
      this.nextElIndex = null;
    }
    document.body.style['user-select'] = 'text';
    document.body.style['-ms-user-select'] = 'text';
    document.body.style['-moz-user-select'] = 'text';
    document.body.style['-webkit-user-select'] = 'text';
    const dragChange = this.state.showIndex.some(
      (index, i) => this.backIndex[i] !== index
    );
    if (dragChange && typeof onDrag === 'function') {
      onDrag(parent, this.state.showIndex.map((index) => columns[index]));
    }
  };

  handleMouseDown = (event) => {
    const headerSortable = this.context.getProps('headerSortable');
    if (event.button !== 0) {
      return event;
    }
    if (!headerSortable) {
      return event;
    }
    this.backIndex = this.state.showIndex;
    document.body.style['user-select'] = 'none';
    document.body.style['-ms-user-select'] = 'none';
    document.body.style['-moz-user-select'] = 'none';
    document.body.style['-webkit-user-select'] = 'none';
    this.parentEl = event.currentTarget.parentNode;
    this.cloneEl = event.currentTarget.cloneNode(true);
    this.currentEl = event.currentTarget;
    this.currentEl.style.opacity = 0;

    // get current index
    const index = this.currentEl.getAttribute('data-index');
    this.dataCurrentIndex = Number(index);

    this._both();
    // clone current element
    const currentRect = this.currentEl.getBoundingClientRect();
    const parentRect = this.parentEl.getBoundingClientRect();
    this.cloneEl.style.position = 'absolute';
    this.cloneEl.style.zIndex = 9999;
    this.cloneEl.style.background = '#393939';
    this.cloneEl.style.opacity = 0.8;
    this.cloneEl.style.left = `${currentRect.left -
      (parentRect.left > 0 ? parentRect.left : 0)}px`;
    this.cloneEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, .4)';
    this.offsetX =
      event.pageX -
      currentRect.left +
      (parentRect.left > 0 ? parentRect.left : 0);

    // calc left max and min
    let left = 0;
    if (this.leftFixedIndex > 0) {
      this.leftFixedIndex.forEach((i) => {
        const ele = findDOMNode(this[`child-${i}`]).getBoundingClientRect();
        left = left > ele.left + ele.width ? left : ele.left + ele.width;
      });
    }

    this.parentEl.appendChild(this.cloneEl);
    this.dragAble = true;
    event.stopPropagation();
  };

  _swap = () => {
    const cloneRect = this.cloneEl.getBoundingClientRect();
    let nextRect, prevRect;
    if (this.nextEl) {
      nextRect = this.nextEl.getBoundingClientRect();
      if (
        cloneRect.left + cloneRect.width >
        nextRect.left + nextRect.width / 2
      ) {
        // next swap
        const showIndex = [...this.state.showIndex];
        const temp = showIndex[this.currentElIndex];
        showIndex[this.currentElIndex] = showIndex[this.nextElIndex];
        showIndex[this.nextElIndex] = temp;
        this.setState({showIndex}, this._both);
      }
    }
    if (this.prevEl) {
      prevRect = this.prevEl.getBoundingClientRect();
      if (cloneRect.left < prevRect.left + prevRect.width / 2) {
        // prev swap
        const showIndex = [...this.state.showIndex];
        const temp = showIndex[this.currentElIndex];
        showIndex[this.currentElIndex] = showIndex[this.prevElIndex];
        showIndex[this.prevElIndex] = temp;
        this.setState({showIndex}, this._both);
      }
    }
  };

  _both = () => {
    const {showIndex} = this.state;
    this.currentElIndex = showIndex.indexOf(this.dataCurrentIndex);
    this.prevElIndex = this.currentElIndex - 1;
    this.nextElIndex = this.currentElIndex + 1;
    this.prevEl = null;
    this.nextEl = null;
    if (
      this.prevElIndex >= 0 &&
      (this.fixedIndex.length === 0 ||
        !this.fixedIndex.some((i) => i === this.prevElIndex))
    ) {
      // enable drag prev
      this.prevEl = findDOMNode(this[`child-${showIndex[this.prevElIndex]}`]);
    }

    if (
      this.nextElIndex < showIndex.length &&
      (this.fixedIndex.length === 0 ||
        !this.fixedIndex.some((i) => i === this.nextElIndex))
    ) {
      //enable drag next
      this.nextEl = findDOMNode(this[`child-${showIndex[this.nextElIndex]}`]);
    }
  };

  render() {
    const {showIndex, children} = this.state;
    return showIndex.map((i) => children[i]);
  }
}

export default Sortable;
