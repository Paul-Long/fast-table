import React from 'react';
import classNames from 'classnames';
import {DS} from './types';

type Props = {
  prefixCls: string,
  record: Object,
  expanded: boolean
};

function ExpandedIcon(props: Props) {
  const {prefixCls, record, expanded, ...other} = props;
  const newProps = {
    className: classNames(`${prefixCls}-expanded-icon`, {expanded}),
    ...other
  };
  return <span {...newProps} data-key={record[DS._key]} />;
}

type ExpandedIconProps = {
  prefixCls: string,
  indentSize: number,
  onClick: Function,
  expanded: boolean,
  expandedEnable: boolean,
  expandedLevel: number
};

export default function renderExpandedIcon(props: ExpandedIconProps) {
  const {prefixCls, indentSize, record, onClick} = props;
  const {} = record || [];
  const expanded = record[DS._expanded];
  const expandedEnable = record[DS._expandedEnable];
  const expandedLevel = record[DS._expandedLevel];
  let icon;
  if (expandedEnable) {
    icon = ExpandedIcon({
      prefixCls,
      onClick,
      expanded,
      record
    });
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
    >
      <span
        style={{width: expandedLevel * indentSize, display: 'inline-block'}}
      />
      {icon || <span style={{width: indentSize, display: 'inline-block'}} />}
    </div>
  );
}
