import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  ExpandedIcon: React.Element<*>,
  style: Object,
  children: any
};

function Cell(props: Props) {
  const {className, ExpandedIcon, style, children, key} = props;

  const newProps = {
    key,
    className: classNames('td', key, className),
    style
  };
  return (
    <div {...newProps}>
      {ExpandedIcon}
      {children}
    </div>
  );
}

export default Cell;
