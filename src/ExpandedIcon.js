import React from 'react';
import classNames from 'classnames';

type Props = {
  prefixCls: string,
  record: Object,
  onClick: Function
}

function ExpandedIcon(props: Props) {
  const {
    prefixCls,
    record,
    onClick
  } = props;
  const newProps = {
    className: classNames(`${prefixCls}-expanded-icon`, {expanded: record._expanded}),
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
  indentSize: number,
  handleExpanded: Function
}

export default function renderExpandedIcon(props: ExpandedIconProps) {
  const {
    record,
    columnIndex,
    prefixCls,
    fixed,
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
