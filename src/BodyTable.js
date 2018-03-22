import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {connect} from './mini-store';

function BodyTable(props, {table}) {
    const {saveRef} = table;
    const {prefixCls, fixedHeader, showHeader} = table.props;
    const {
        fixed,
        columns,
        getRowKey,
        hasScroll,
        handleBodyScroll
    } = props;
    const baseTable = (
        <BaseTable
            hasHead={!fixedHeader}
            hasBody
            fixed={fixed}
            columns={columns}
            getRowKey={getRowKey}
        />
    );
    const style = {
        height: showHeader ? 'calc(100% - 32px)' : 'calc(100% - 1px)',
        overflowY: hasScroll ? 'scroll' : 'auto'
    };
    if (!fixedHeader) {
        style.height = 'auto';
        style.overflowY = 'hidden';
    }
    return (
        <div
            key='bodyTable'
            className={`${prefixCls}-body`}
            ref={saveRef('bodyTable')}
            style={style}
            onScroll={handleBodyScroll}
        >
            {baseTable}
        </div>
    )
}

export default connect((state, props) => {
    const {hasScroll} = state;
    return {
        hasScroll
    }
})(BodyTable)
BodyTable.contextTypes = {
    table: PropTypes.any
};
