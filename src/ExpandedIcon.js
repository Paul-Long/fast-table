import React from 'react';
import classNames from 'classnames';

type Props = {
  prefixCls: string,
  expanded: boolean,
  record: Object,
  onClick: Function
}

function ExpandedIcon(props: Props) {
  const {
    expanded,
    prefixCls,
    record,
    onClick
  } = props;
  const newProps = {
    className: classNames(`${prefixCls}-expanded-icon`, {expanded}),
    onClick: event => {
      event.stopPropagation();
      onClick && onClick(record, record.key, event);
    }
  };
  return (
    <span {...newProps} />
  );
}

type ExpandedIconProps = {
  record: Object,
  columnIndex: number,
  prefixCls: string,
  fixed: string,
  expanded: boolean,
  indentSize: number,
  handleExpanded: Function
}

export default function renderExpandedIcon(props: ExpandedIconProps) {
  const {
    record,
    columnIndex,
    prefixCls,
    fixed,
    expanded,
    indentSize,
    handleExpanded
  } = props;
  if (columnIndex !== 0 || fixed === 'right') {
    return null;
  }
  let icon;
  if (record._expandedEnable && columnIndex === 0 && fixed !== 'right') {
    icon = ExpandedIcon({
      prefixCls,
      record,
      rowKey: record.key,
      expanded,
      onClick: handleExpanded
    });
  }

  return (
    <div style={{display: 'inline-flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
      <span style={{width: record._expandedLevel * indentSize, display: 'inline-block'}} />
      {icon || <span style={{width: indentSize, display: 'inline-block'}} />}
    </div>
  );
}
