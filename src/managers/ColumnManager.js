import React from 'react';
import flattenDeep from 'lodash/flattenDeep';
import max from 'lodash/max';
import sum from 'lodash/sum';
import multiply from 'lodash/multiply';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import divide from 'lodash/divide';
import floor from 'lodash/floor';
import sumBy from 'lodash/sumBy';
import isNaN from 'lodash/isNaN';

const percentReg = /^\d+\.?\d{0,2}%$/;

export default class ColumnManager {
  _cached = {};
  _maxRowSpan = 1;
  
  constructor({columns, minWidth, headerRowHeight}) {
    this.columns = columns;
    this.minWidth = minWidth;
    this.headerRowHeight = headerRowHeight;
    this.wrapperWidth = 0;
    this.hasOverflowX = false;
    this.init();
  }
  
  init() {
    this.width = 0;
    this.leftWidth = 0;
    this.rightWidth = 0;
    this._maxRowSpan = 1;
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
  
  headColumns(fixed) {
    if (fixed === 'left') {
      return this.leftColumns();
    } else if (fixed === 'right') {
      return this.rightColumns();
    }
    return this.groupedColumns();
  }
  
  bodyColumns(fixed) {
    if (fixed === 'left') {
      return this.leftLeafColumns();
    } else if (fixed === 'right') {
      return this.rightLeafColumns();
    }
    return this.leafColumns();
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
  
  groupedColumns() {
    return this._cache('groupedColumns', () =>
      this._updateWidth(this._groupColumns(this.columns))
    );
  }
  
  headerSize = () => {
    return {
      _leftWidth: this.leftWidth,
      _rightWidth: this.rightWidth,
      _headerWidth: this.width,
      _hasScrollX: this.hasOverflowX,
      _headerHeight: this._maxRowSpan * this.headerRowHeight
    };
  };
  
  updateWidth(wrapperWidth) {
    if (this.wrapperWidth !== wrapperWidth) {
      this.wrapperWidth = wrapperWidth;
      this._cached = {};
      this.init();
      this.groupedColumns();
    }
    return this.headerSize();
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
    this.init();
    this.groupedColumns();
    return this.headerSize();
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
      
      let widths = newColumn.widths || [];
      widths = this._calcWidth(widths, this.wrapperWidth);
      let width = newColumn.width;
      if (widths.length > 0) {
        width = sum(widths);
      }
      newColumn._width = width;
      if (isNaN(width) || width < this.minWidth) {
        column._width = this.minWidth;
      }
      newColumn._minWidth = newColumn._width;
      for (let i = 0; i < rows[currentRow].length - 1; ++i) {
        setRowSpan(rows[currentRow][i]);
      }
      if (index + 1 === columns.length) {
        setRowSpan(newColumn);
      }
      if (this._maxRowSpan < currentRow + 1) {
        this._maxRowSpan = currentRow + 1;
      }
      grouped.push(newColumn);
    }
    this.hasOverflowX = this.width > this.wrapperWidth && this.wrapperWidth !== 0;
    return grouped;
  };
  
  _updateWidth(columns) {
    const wrapperWidth = this.wrapperWidth || 0;
    const leafColumns = this._leafColumns(columns);
    const len = leafColumns.length;
    const last = leafColumns[len - 1];
    const baseWidth = sumBy(columns, column => column._width);
    this.width = 0;
    this.leftWidth = 0;
    this.rightWidth = 0;
    const average = floor((wrapperWidth - baseWidth) / len);
    const update = (columns) => {
      return columns.map(column => {
        const width = column._width;
        if (column._pathKey === last._pathKey) {
          column._width = wrapperWidth - this.width;
        } else {
          column._width = width + average;
        }
        const children = column.children || [];
        if (children.length > 0) {
          column.children = update(children);
          column._width = sumBy(column.children, '_width');
        } else {
          if (column._width < column._minWidth) {
            column._width = column._minWidth;
          }
        }
        if (column._currentRow === 0) {
          this.width += column._width;
          if (column.fixed === 'left' || column.fixed === true) {
            this.leftWidth += column._width;
          } else if (column.fixed === 'right') {
            this.rightWidth += column._width;
          }
        }
        return column;
      });
    };
    const result = update(columns);
    this.hasOverflowX = this.width > wrapperWidth;
    return result;
  }
}
