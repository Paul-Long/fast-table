import React from 'react';
import classNames from 'classnames';
import {rowEvents, DS} from './types';

type Props = {
  prefixCls: string,
  hovered: boolean,
  children: [React.Element<*>],
  style: Object,
  record: Object
};

function Row(props: Props) {
  const {prefixCls, hovered, children, style, record, key} = props;
  const rowClass = classNames(record[DS._rowClassName], {
    [`${prefixCls}-hover`]: hovered
  });
  const newProps = {
    key,
    className: rowClass,
    style,
    'data-key': record[DS._key]
  };
  rowEvents.forEach((event) => {
    if (typeof props[event] === 'function') {
      newProps[event] = props[event];
    }
  });
  return <div {...newProps}>{children}</div>;
}

export default Row;
