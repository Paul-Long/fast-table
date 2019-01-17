import React from 'react';
import classNames from 'classnames';
import {rowEvents, DS} from './types';

type Props = {
  key: string,
  className: string,
  prefixCls: string,
  onClick: Function,
  hovered: boolean,
  cells: [React.Element<*>],
  style: Object,
  record: Object
};

function Row(props: Props) {
  const {key, className, prefixCls, hovered, cells, style, record} = props;
  const rowClass = classNames(className, {
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
  return <div {...newProps}>{cells}</div>;
}

export default Row;
