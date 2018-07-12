import React from 'react';
import classNames from 'classnames';
import { DS } from './types';

type Props = {
  prefixCls: string,
  onClick: Function,
  expanded: boolean,
}

function ExpandedIcon(props: Props) {
  const {
    prefixCls,
    onClick,
    expanded,
  } = props;
  const newProps = {
    className: classNames(`${prefixCls}-expanded-icon`, {expanded}),
    onClick
  };
  return (
    <span {...newProps} />
  );
}

type ExpandedIconProps = {
  prefixCls: string,
  indentSize: number,
  handleExpanded: Function,
  expanded: boolean,
  expandedEnable: boolean,
  expandedLevel: number,
}

export default function renderExpandedIcon(props: ExpandedIconProps) {
  const {
    prefixCls,
    indentSize,
    handleExpanded,
    expandedEnable,
    expanded,
    expandedLevel,
  } = props;
  let icon;
  if (expandedEnable) {
    icon = ExpandedIcon({
      prefixCls,
      onClick: handleExpanded,
      expanded,
    });
  }

  return (
    <div style={{display: 'inline-flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
      <span style={{width: expandedLevel * indentSize, display: 'inline-block'}} />
      {icon || <span style={{width: indentSize, display: 'inline-block'}} />}
    </div>
  );
}
