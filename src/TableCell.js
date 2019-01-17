import React from 'react';
import classNames from 'classnames';

type Props = {
  key: string,
  className: string,
  ExpandedIcon: React.Element<*>,
  style: Object,
  children: any
};

function Cell(props: Props) {
  const {key, className, ExpandedIcon, style, children} = props;

  const newProps = {
    key,
    className: classNames('td', className),
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
