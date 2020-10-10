import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  ExpandedIcon: React.Element<*>,
  SelectIcon: React.Element<*>,
  style: Object,
  children: any
};

function Cell(props: Props) {
  const {className, ExpandedIcon, SelectIcon, style, children} = props;

  const newProps = {
    className: classNames('td', className),
    style
  };
  return (
    <div {...newProps}>
      {SelectIcon}
      {ExpandedIcon}
      <div style={{display: 'inline-block', overflow: 'hidden'}}>{children}</div>
    </div>
  );
}

export default Cell;
