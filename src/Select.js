import React from 'react';
import classNames from 'classnames';
import Icon from './Icon';

type SelectProps = {
  prefixCls: string,
  selected: boolean,
  type: string
};

export default function Select(props: SelectProps) {
  const {prefixCls, selected, onClick, type, disabled} = props;
  const cls = classNames(`${prefixCls}-select`, `${prefixCls}-select-${type}`, {
    selected,
    [`${prefixCls}-select-disabled`]: disabled
  });
  let children = null;
  if (selected) {
    children = <Icon type={type} />;
  }
  function click(event) {
    event.stopPropagation();
    if (!disabled) {
      onClick(event);
    }
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
