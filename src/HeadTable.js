import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import {connect} from './mini-store';

function HeadTable(props, {table}) {
    const {prefixCls, showHeader} = table.props;
    const {columns, fixed, hasScroll} = props;
    const {saveRef} = table;
    let {fixedHeader} = table.props;
    const headStyle = {};
    if (!fixedHeader || !showHeader) {
        return null;
    }
    headStyle.overflowY = hasScroll ? 'scroll' : 'auto';
    return (
        <div
            key='headTable'
            className={`${prefixCls}-header`}
            style={headStyle}
            ref={fixed ? null : saveRef('headTable')}
        >
            <BaseTable
                hasHead
                hasBody={false}
                fixed={fixed}
                columns={columns}
            />
        </div>
    )
}

export default connect((state, props) => {
    const {hasScroll} = state;
    return {
        hasScroll
    }
})(HeadTable);

HeadTable.propTypes = {
    fixed: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    columns: PropTypes.array.isRequired
};

HeadTable.contextTypes = {
    table: PropTypes.any
};
