import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableHeader from './TableHeader';
import Row from './TableRow';
import {connect} from './mini-store';
import renderExpandedIcon from './ExpandedIcon';

type Props = {
  currentHoverKey: string,
  startIndex: number,
  stopIndex: number,
  orders: Object,
  fixed: string,
  hasHead: boolean,
  hasBody: boolean,
  indentSize: number,
  registerForce: Function,
  columns: Array
}

class BaseTable extends React.PureComponent<Props> {

  _children = [];
  _startIndex;
  _stopIndex;

  static contextTypes = {
    table: PropTypes.any
  };

  componentDidMount() {
    const {registerForce, fixed} = this.props;
    if (registerForce) {
      registerForce(fixed, this.recomputeBody);
    }
    this.renderRows(this.props);
  }

  componentWillUpdate(nextProps) {
    this.renderRows(nextProps);
  }

  handleRowHover = (isHover, key) => {
    this.props.store.setState({
      currentHoverKey: isHover ? key : null
    });
  };
  handleSort = (key, order) => {
    const {sortManager, props} = this.context.table;
    const onSort = props.onSort;
    sortManager.setOrder(key, order, (orders) => {
      this.props.store.setState({orders});
      if (typeof onSort === 'function') {
        onSort(orders);
      }
    });
  };

  handleExpanded = (record, key) => {
    const table = this.context.table;
    const dataManager = table.dataManager;
    table.resetExpandedRowKeys(key, !dataManager.rowIsExpanded(record));
  };

  recomputeBody = ({startIndex, stopIndex}) => {
    this._startIndex = startIndex;
    this._stopIndex = stopIndex;
    this.forceUpdate();
  };

  renderRows = (props) => {
    const rows = [];
    const {
      fixed,
      currentHoverKey,
      indentSize
    } = props;
    const table = this.context.table;
    const {
      prefixCls,
      rowClassName,
      expandedRowByClick
    } = table.props;
    const dataManager = table.dataManager;
    const columns = table.columnManager.bodyColumns(fixed);
    const hasExpanded = dataManager._hasExpanded;
    const showData = dataManager.showData();
    for (let index = this._startIndex; index <= this._stopIndex; index++) {
      const record = showData[index];
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record._index)
        : rowClassName;
      const props = {
        key: `Row${record._showIndex}`,
        className: classNames(className, {
          [`${prefixCls}-hover`]: currentHoverKey === record.key,
          [`${prefixCls}-expanded-row-${record._expandedLevel}`]: hasExpanded
        }),
        record,
        prefixCls,
        columns,
        fixed,
        expandedRowByClick,
        expanded: dataManager.rowIsExpanded(record),
        onHover: this.handleRowHover,
        components: table.components,
        handleExpanded: this.handleExpanded,
        indentSize
      };
      hasExpanded && (props.renderExpandedIcon = renderExpandedIcon);
      rows.push(Row(props));
    }
    this._children = rows;
    return this._children;
  };

  render() {
    const {
      hasHead,
      hasBody,
      fixed,
      orders,
      columns
    } = this.props;
    const table = this.context.table;
    const {
      props,
      components,
      columnManager,
      sizeManager
    } = table;
    const {
      prefixCls,
      headerRowHeight,
      rowHeight
    } = props;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      body = (
        <BodyWrapper className='tbody' style={{height: sizeManager._dataHeight, minHeight: rowHeight}}>
          {this._children}
        </BodyWrapper>
      );
    }

    const width = columnManager.getWidth(fixed) || '100%';
    const style = {width};
    if (!fixed) {
      style.minWidth = '100%';
    }
    const header = hasHead
      && TableHeader({
        columns,
        fixed,
        onSort: this.handleSort,
        orders,
        prefixCls,
        headerRowHeight,
        components
      });
    return (
      <Table className='table' style={style}>
        {header}
        {body}
      </Table>
    );
  }
}

export default connect((state) => {
  const {
    currentHoverKey,
    orders
  } = state;
  return {
    currentHoverKey,
    orders
  };
})(BaseTable);

