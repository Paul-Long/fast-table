import React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { cellAlignStyle } from './utils';
import { CS, DS } from './types';

type Props = {
  key: string,
  className: string,
  components: Object,
  ExpandedIcon: React.Element<*>,
  style: Object,
  children: any,
};

function Cell(props: Props) {
  const {
    key,
    className,
    components,
    ExpandedIcon,
    style,
    children,
  } = props;

  const newProps = {
    key,
    className: classNames('td', className),
    style
  };
  const Td = components.body.cell;
  return (
    <Td {...newProps}>
      {ExpandedIcon}
      {children}
    </Td>
  );
}

export default Cell;
