import React from 'react';
import flattenDeep from 'lodash/flattenDeep';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import sum from 'lodash/sum';
import multiply from 'lodash/multiply';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import divide from 'lodash/divide';
import ceil from 'lodash/ceil';

const percentReg = /^\d+\.?\d{0,2}%$/;

export default class ColumnManager {
  _cached = {};

  constructor(columns, minWidth) {
    this.columns = columns;
    this.minWidth = minWidth;
  }

  leftColumns() {
    return this._cache('leftColumns', () => {
      return this.groupedColumns().filter(
        column => column.fixed === 'left' || column.fixed === true
      );
    });
  }

  rightColumns() {
    return this._cache('rightColumns', () => {
      return this.groupedColumns().filter(
        column => column.fixed === 'right'
      );
    });
  }

  leafColumns() {
    return this._cache('leafColumns', () =>
      this._leafColumns(this.groupedColumns())
    );
  }

  leftLeafColumns() {
    return this._cache('leftLeafColumns', () =>
      this._leafColumns(this.leftColumns())
    );
  }

  rightLeafColumns() {
    return this._cache('rightLeafColumns', () =>
      this._leafColumns(this.rightColumns())
    );
  }

  maxRowSpan() {
    return this._cache('maxRowSpan', () => {
      let max = maxBy(this.groupedColumns(), 'rowSpan');
      return max ? max['rowSpan'] : 1;
    });
  }

  groupedColumns() {
    return this._cache('groupedColumns', () => {
      const _groupColumns = (columns, currentRow = 0, parentColumn = {}, rows = []) => {
        // track how many rows we got
        rows[currentRow] = rows[currentRow] || [];
        const grouped = [];
        const setRowSpan = column => {
          const rowSpan = rows.length - currentRow;
          if (column &&
            !column.children && // parent columns are supposed to be one row
            rowSpan > 1 &&
            (!column.rowSpan || column.rowSpan < rowSpan)
          ) {
            column.rowSpan = rowSpan;
          }
        };
        columns.forEach((column, index) => {
          const newColumn = {...column};
          rows[currentRow].push(newColumn);
          const path = parentColumn.path || [currentRow];
          newColumn.path = [...path, index];
          parentColumn.colSpan = parentColumn.colSpan || 0;
          if (newColumn.children && newColumn.children.length > 0) {
            newColumn.children = _groupColumns(newColumn.children, currentRow + 1, newColumn, rows);
            parentColumn.colSpan = parentColumn.colSpan + newColumn.colSpan;
            newColumn.widths = newColumn.children.map(c => c.widths);
          } else {
            parentColumn.colSpan++;
            newColumn.widths = [newColumn.width];
          }
          newColumn.widths = flattenDeep(newColumn.widths);
          // update rowspan to all same row columns
          for (let i = 0; i < rows[currentRow].length - 1; ++i) {
            setRowSpan(rows[currentRow][i]);
          }
          // last column, update rowspan immediately
          if (index + 1 === columns.length) {
            setRowSpan(newColumn);
          }
          grouped.push(newColumn);
        });
        return grouped;
      };
      return _groupColumns(this.columns);
    });
  }

  getColWidth(wrapperWidth) {
    const _getColWidth = (columns, colWidth = {}, currentRow = 0) => {
      colWidth = colWidth || {};
      columns.forEach((column) => {
        let widths = column.widths || [];
        widths = this._calcWidth(widths, wrapperWidth);
        let width = column.width;
        if (widths.length > 0) {
          width = sum(widths);
        }
        const key = column.path.join('-');
        if (key in colWidth) {
          throw Error(`duplicate column title - ${key}`);
        }
        colWidth[key] = width;
        const children = column.children || [];
        if (children.length > 0) {
          colWidth = _getColWidth(children, colWidth, currentRow + 1);
        }
      });
      return colWidth;
    };
    return _getColWidth(this.groupedColumns());
  }

  reset(columns, elements) {
    this.columns = columns || this.normalize(elements);
    this._cached = {};
  }

  _calcWidth(widths, wrapperWidth) {
    widths = widths.map(w => {
      if (typeof w === 'string' && percentReg.test(w)) {
        const i = w.replace('%', '');
        let width = this._minWidth(multiply(wrapperWidth, divide(i, 100)));
        return ceil(width);
      }
      if (w && typeof w === 'string') {
        w = w.replace(/[^\d]/g, '');
      }
      let ww = toNumber(w);
      if (!isNaN(ww) && isNumber(ww)) {
        return ceil(this._minWidth(ww));
      }
      return this._minWidth(w);
    });
    return widths.filter(w => !!w);
  }

  _minWidth(width) {
    return !width ? width : max([this.minWidth, width]);
  }

  _cache(name, fn) {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  }

  _leafColumns(columns) {
    const leafColumns = [];
    columns.forEach(column => {
      if (!column.children) {
        leafColumns.push(column);
      } else {
        leafColumns.push(...this._leafColumns(column.children));
      }
    });
    return leafColumns;
  }
}
