import React from 'react';
import classNames from 'classnames';
import Icon from './Icon';

type SelectProps = {
  prefixCls: string,
  selected: boolean,
  type: string
};

export default function Select(props: SelectProps) {
  const {prefixCls, selected, onClick, type} = props;
  const cls = classNames(`${prefixCls}-select`, `${prefixCls}-select-${type}`, {
    selected
  });
  let children = null;
  if (selected) {
    children = <Icon type={type} />;
  }
  function click(event) {
    event.stopPropagation();
    onClick(event);
  }
  return (
    <div
      style={{
        display: 'inline-block',
        textAlign: 'left',
        verticalAlign: 'middle'
      }}
      onClick={click}
    >
      <span className={cls}>{children}</span>
    </div>
  );
}
