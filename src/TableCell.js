import React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import {cellAlignStyle} from './Utils';

type Props = {
  key: string,
  className: string,
  column: Object,
  record: Object,
  components: Object,
  ExpandedIcon: React.Element<*>
};

function isInvalidRenderCellText(text) {
  return text
    && !React.isValidElement(text)
    && Object.prototype.toString.call(text) === '[object Object]';
}

function Cell(props: Props) {
  const {
    key,
    column,
    record,
    components,
    ExpandedIcon
  } = props;
  const {render, dataIndex, onCell, _width, align = 'left'} = column;

  let style = {...cellAlignStyle(align)};
  _width && (style.width = _width);
  if (onCell) {
    style = {...style, ...onCell};
  }

  const newProps = {
    key,
    className: classNames('td', column.className),
    style
  };
  let text = get(record, dataIndex);
  if (typeof render === 'function') {
    text = render(text, record, record._index);
  }
  if (isInvalidRenderCellText(text)) {
    text = null;
  }
  const Td = components.body.cell;
  return (
    <Td {...newProps}>
      {ExpandedIcon}
      {text}
    </Td>
  )
}

export default Cell;
