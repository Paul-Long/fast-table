import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from './TableCell';
import {connect} from './mini-store';

class TableRow extends React.PureComponent {
    onMouseEnter = (event) => {
        const {record, index, onRowMouseEnter, onHover, rowKey} = this.props;
        onHover(true, rowKey);
        if (onRowMouseEnter) {
            onRowMouseEnter(record, index, event);
        }
    };

    onMouseLeave = (event) => {
        const {record, index, onRowMouseLeave, onHover, rowKey} = this.props;
        onHover(false, rowKey);
        if (onRowMouseLeave) {
            onRowMouseLeave(record, index, event);
        }
    };
    renderCells = () => {
        const {columns, prefixCls, record, index, components, height} = this.props;
        const cells = [];
        const columnSize = columns.length;
        columns.forEach((column, i) => {
            cells.push(
                <TableCell
                    prefixCls={prefixCls}
                    record={record}
                    index={index}
                    column={column}
                    key={column.key || column.dataIndex}
                    component={components.body.cell}
                    height={height}
                    isLast={i + 1 === columnSize}
                />
            );
        });
        return cells;
    };

    render() {
        const {
            components,
            prefixCls,
            hovered,
            top
        } = this.props;
        const BodyRow = components.body.row;
        const cls = classNames('tr', `${prefixCls}-row`, {
            [`${prefixCls}-hover`]: hovered
        });
        const style = {
            position: 'absolute',
            top
        };
        return (
            <BodyRow className={cls} style={style}>
                {this.renderCells()}
            </BodyRow>
        )
    }
}

export default connect((state, props) => {
    const {currentHoverKey, tops} = state;
    const {rowKey, index} = props;
    return {
        hovered: currentHoverKey === rowKey,
        top: tops[index]
    }
})(TableRow);

TableRow.propTypes = {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    columns: PropTypes.array,
    height: PropTypes.number,
    rowKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    className: PropTypes.string,
    fixed: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

