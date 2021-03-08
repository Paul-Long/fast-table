import {DS} from '../types';

export default class SelectManager {
  _selectedKeys = [];
  _type = 'checkbox';
  _useSelectAll = false;
  _enable = false;
  _selectedAll = false;
  _disabled = [];
  _count = 0;
  constructor(props) {
    this.getProps = props.getProps;
    this.update = props.update;
    const rowSelection = props.getProps('rowSelection');
    this.getSelection(rowSelection);
  }

  get enable() {
    return this._enable;
  }

  get type() {
    return this._type;
  }

  get selectedKeys() {
    return this._selectedKeys || [];
  }

  get useSelectAll() {
    return this._useSelectAll;
  }

  get selectedAll() {
    return this._selectedAll;
  }

  set count(c) {
    this._count = c;
  }
  getKeys = (arr, keys) => {
    arr = arr || [];
    keys = keys || [];
    for (let i = 0; i < arr.length; i++) {
      keys.push(arr[i][DS._key]);
      const children = arr[i].children || [];
      if (children.length > 0) {
        this.getKeys(children, keys);
      }
    }
    return keys;
  };

  selectAll = (keys) => {
    const {onSelect, type} = this.getProps('rowSelection');
    this._selectedAll = !this._selectedAll;
    if (this._selectedAll) {
      this._selectedKeys = keys;
    } else {
      this._selectedKeys = [];
    }
    if (typeof onSelect === 'function') {
      onSelect(null, this._selectedAll, this._selectedKeys);
    }
    this.update();
  };

  disabled = (record) => {
    return this._disabled.includes(record[DS._key]);
  };

  select = (record, selected) => {
    const {onSelect, type} = this.getProps('rowSelection');
    const t = type || this._type;
    if (t === 'checkbox') {
      const keys = this.getKeys([record]);
      if (selected) {
        for (let i = 0; i < keys.length; i++) {
          if (!this._selectedKeys.includes(keys[i])) {
            this._selectedKeys.push(keys[i]);
          }
        }
      } else {
        this._selectedKeys = this._selectedKeys.filter((k) => !keys.includes(k));
      }
    } else if (t === 'radio') {
      if (this._selectedKeys.includes(record[DS._key])) {
        return false;
      } else {
        this._selectedKeys = [record[DS._key]];
      }
    }
    if (typeof onSelect === 'function') {
      onSelect(record, selected, this._selectedKeys);
    }
    this._selectedAll = this._selectedKeys.length === this._count;
    this.update();
  };
  updateSelection = (rowSelection) => {
    this.getSelection(rowSelection);
    this.update();
  };
  getSelection = (rowSelection) => {
    this._enable = !!rowSelection;
    if (this._enable) {
      ['selectedKeys', 'type', 'useSelectAll', 'disabled'].forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(rowSelection, k)) {
          this[`_${k}`] = rowSelection[k];
        }
      });
      this._selectedKeys = this._selectedKeys || [];
      this._disabled = (this._disabled || []).map((d) => d + '');
      this._type = this._type || 'checkbox';
      if (this._type === 'radio' && this._selectedKeys.length > 1) {
        this._selectedKeys = [];
      }
      this._useSelectAll = !!this._useSelectAll;
    }
  };
}
