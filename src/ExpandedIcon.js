import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function ExpandedIcon(props, {table}) {
  const {expanded} = props;
  const {prefixCls} = table.props;
  const className = classNames(`${prefixCls}-expanded-icon`, {
    expanded: expanded
  });
  const onClick = (e) => {
    e.stopPropagation();
    (typeof props.onClick === 'function') && props.onClick();
  };
  return (
    <span className={className} onClick={onClick} />
  );
}

ExpandedIcon.propTypes = {
  expanded: PropTypes.bool
};
ExpandedIcon.defaultProps = {
  expanded: false
};
ExpandedIcon.contextTypes = {
  table: PropTypes.any
};
