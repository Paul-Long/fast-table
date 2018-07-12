import React from 'react';
import classNames from 'classnames';

type Props = {
  key: string,
  className: string,
  prefixCls: string,
  onClick: Function,
  components: Object,
  hovered: boolean,
  cells: [React.Element<*>],
  style: Object,
}

function Row(props: Props) {
  const {
    key,
    className,
    prefixCls,
    components,
    hovered,
    cells,
    style,
  } = props;
  const Tr = components.body.row;
  const rowClass = classNames(
    className,
    {
      [`${prefixCls}-hover`]: hovered,
    }
  );
  const newProps = {
    key,
    className: rowClass,
    style,
  };
  ['onClick', 'onMouseEnter', 'onMouseLeave'].forEach(event => {
    if (typeof props[event] === 'function') {
      newProps[event] = props[event];
    }
  });
  return (
    <Tr {...newProps} >
      {cells}
    </Tr>
  );
}

export default Row;
