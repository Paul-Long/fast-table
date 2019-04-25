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
  let path =
    'M810.666667 469.333333h-256V213.333333a42.666667 42.666667 0 0 0-85.333334 0v256H213.333333a42.666667 42.666667 0 0 0 0 85.333334h256v256a42.666667 42.666667 0 0 0 85.333334 0v-256h256a42.666667 42.666667 0 0 0 0-85.333334z';
  if (expanded) {
    path =
      'M810.666667 554.666667H213.333333a42.666667 42.666667 0 0 1 0-85.333334h597.333334a42.666667 42.666667 0 0 1 0 85.333334z';
  }
  return (
    <span {...newProps} data-key={record[DS._key]}>
      <svg
        viewBox='64 64 896 896'
        className=''
        data-icon='plus'
        width='1em'
        height='1em'
        fill='currentColor'
        aria-hidden='true'
        focusable='false'
        style={{display: 'inline-block'}}
      >
        <path d={path} />
      </svg>
    </span>
  );
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
        display: 'inline-block',
        textAlign: 'left',
        verticalAlign: 'middle'
      }}
    >
      <span
        style={{width: expandedLevel * indentSize, display: 'inline-block'}}
      />
      {icon || <span style={{width: indentSize, display: 'inline-block'}} />}
    </div>
  );
}
