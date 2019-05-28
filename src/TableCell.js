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
  const {className, ExpandedIcon, SelectIcon, style, children, key} = props;

  const newProps = {
    key,
    className: classNames('td', key, className),
    style
  };
  return (
    <div {...newProps}>
      {SelectIcon}
      {ExpandedIcon}
      {children}
    </div>
  );
}

export default Cell;
