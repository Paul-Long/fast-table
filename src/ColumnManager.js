import React from 'react';
import flattenDeep from 'lodash/flattenDeep';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';
import multiply from 'lodash/multiply';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import divide from 'lodash/divide';
import floor from 'lodash/floor';

const percentReg = /^\d+\.?\d{0,2}%$/;

export default class ColumnManager {
  _cached = {};

  constructor(columns, minWidth) {
    this.columns = columns;
    this.minWidth = minWidth;
    this.wrapperWidth = 0;
    this.width = 0;
    this.leftWidth = 0;
    this.rightWidth = 0;
    this.hasOverflowX = false;
  }

  isAnyColumnsLeftFixed() {
    return this._cache('isAnyColumnsLeftFixed', () => {
      return this.groupedColumns().some(
        column => column.fixed === 'left' || column.fixed === true
      );
    });
  }

  isAnyColumnsRightFixed() {
    return this._cache('isAnyColumnsRightFixed', () => {
      return this.groupedColumns().some(
        column => column.fixed === 'right'
      );
    });
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
    return this._cache('groupedColumns', () =>
      this._groupColumns(this.columns)
    );
  }

  overflowX() {
    return this.hasOverflowX;
  }

  updateColWidth(wrapperWidth) {
    if (this.wrapperWidth !== wrapperWidth) {
      delete this._cached['getColWidth'];
      this.wrapperWidth = wrapperWidth;
      const columns = this.groupedColumns();
      const leafColumns = this.leafColumns();
      const minWidths = this._getColWidth(columns, wrapperWidth);
      const len = leafColumns.length;
      const last = leafColumns[len - 1];
      const baseWidth = sumBy(columns, column => minWidths[column._pathKey]);
      this.width = 0;
      this.leftWidth = 0;
      this.rightWidth = 0;
      const average = wrapperWidth < baseWidth ? 0 : floor((wrapperWidth - baseWidth) / len);
      const update = (columns) => {
        return columns.map(column => {
          const newColumn = {...column};
          const key = newColumn.path.join('-');
          const width = minWidths[key];
          if (newColumn._pathKey === last._pathKey) {
            newColumn._width = wrapperWidth - this.width;
          } else {
            newColumn._width = width + average;
          }
          newColumn._minWidth = width;
          const children = newColumn.children || [];
          if (children.length > 0) {
            newColumn.children = update(children);
            newColumn._width = sumBy(newColumn.children, '_width');
            newColumn._minWidth = sumBy(newColumn.children, '_minWidth');
          }
          if (newColumn._width < newColumn._minWidth) {
            newColumn._width = newColumn._minWidth;
          }
          if (newColumn._currentRow === 0) {
            this.width += newColumn._width;
            if (newColumn.fixed === 'left' || newColumn.fixed === true) {
              this.leftWidth += newColumn._width;
            } else if (newColumn.fixed === 'right') {
              this.rightWidth += newColumn._width;
            }
          }
          return newColumn;
        });
      };
      this._cached['groupedColumns'] = update(columns);
      this.hasOverflowX = this.width > wrapperWidth;
      delete this._cached['leafColumns'];
      delete this._cached['leftColumns'];
      delete this._cached['rightColumns'];
      delete this._cached['leftLeafColumns'];
      delete this._cached['rightLeafColumns'];
    }
  }

  getWidth(fixed) {
    if (fixed === 'left' || fixed === true) {
      return this.leftWidth;
    } else if (fixed === 'right') {
      return this.rightWidth;
    }
    return this.width;
  }

  reset(columns, elements) {
    this.columns = columns || this.normalize(elements);
    this._cached = {};
  }

  _calcWidth(widths, wrapperWidth) {
    widths = widths.map(w => {
      if (typeof w === 'string' && percentReg.test(w)) {
        const i = w.replace('%', '');
        return floor(this._minWidth(multiply(wrapperWidth, divide(i, 100))));
      }
      if (w && typeof w === 'string') {
        w = w.replace(/[^\d]/g, '');
      }
      let ww = toNumber(w);
      if (!isNaN(ww) && isNumber(ww)) {
        return floor(this._minWidth(ww));
      }
      return floor(this._minWidth(w));
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
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (!column.children) {
        leafColumns.push(column);
      } else {
        leafColumns.push(...this._leafColumns(column.children));
      }
    }
    return leafColumns;
  }

  _groupColumns = (columns, currentRow = 0, parentColumn = {}, rows = []) => {
    rows[currentRow] = rows[currentRow] || [];
    const grouped = [];
    const setRowSpan = column => {
      const rowSpan = rows.length - currentRow;
      if (column &&
        !column.children &&
        rowSpan > 1 &&
        (!column.rowSpan || column.rowSpan < rowSpan)
      ) {
        column.rowSpan = rowSpan;
      }
    };
    for (let index = 0; index < columns.length; index++) {
      const column = columns[index];
      const newColumn = {...column};
      rows[currentRow].push(newColumn);
      const path = parentColumn.path || [currentRow];
      newColumn.path = [...path, index];
      newColumn._pathKey = newColumn.path.join('-');
      newColumn._currentRow = currentRow;
      parentColumn.colSpan = parentColumn.colSpan || 0;
      if (newColumn.children && newColumn.children.length > 0) {
        newColumn.children = this._groupColumns(newColumn.children, currentRow + 1, newColumn, rows);
        parentColumn.colSpan = parentColumn.colSpan + newColumn.colSpan;
        newColumn.widths = newColumn.children.map(c => c.widths);
      } else {
        parentColumn.colSpan++;
        newColumn.widths = [newColumn.width];
      }
      newColumn.widths = flattenDeep(newColumn.widths);
      for (let i = 0; i < rows[currentRow].length - 1; ++i) {
        setRowSpan(rows[currentRow][i]);
      }
      if (index + 1 === columns.length) {
        setRowSpan(newColumn);
      }
      grouped.push(newColumn);
    }
    return grouped;
  };
  _getColWidth = (columns, wrapperWidth, colWidth = {}, currentRow = 0) => {
    colWidth = colWidth || {};
    for (let index = 0; index < columns.length; index++) {
      const column = columns[index];
      let key = column._pathKey;
      if (!key) key = column.path.join('-');
      let width = column._minWidth;
      if (width) {
        colWidth[key] = width;
      } else {
        let widths = column.widths || [];
        widths = this._calcWidth(widths, wrapperWidth);
        width = column.width;
        if (widths.length > 0) {
          width = sum(widths);
        }
        if (key in colWidth) {
          throw Error(`duplicate column title - ${key}`);
        }
        colWidth[key] = width;
      }
      const children = column.children || [];
      if (children.length > 0) {
        colWidth = this._getColWidth(children, wrapperWidth, colWidth, currentRow + 1);
      }
      const fixed = column.fixed;
      if (currentRow === 0) {
        if (fixed === 'left' || fixed === true) {
          this.leftWidth += width;
        } else if (fixed === 'right') {
          this.rightWidth += width;
        }
        this.width += width;
      }
    }
    return colWidth;
  };
}
