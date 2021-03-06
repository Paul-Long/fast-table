<p align="center">
  <a href="https://github.com/Paul-Long/fast-table">
    <img width="200" src="http://houym-1254119810.picsh.myqcloud.com/logo-200_150.png">
  </a>
</p>

<h1 align="center">Fast Table</h1>

<div align="center">

React 表格组件，支持多数据首次快速渲染

[![npm package](https://img.shields.io/npm/v/fast-table.svg?style=flat)](https://www.npmjs.com/package/fast-table)
[![NPM downloads](http://img.shields.io/npm/dm/fast-table.svg?style=flat-square)](http://npmjs.com/fast-table)
[![Dependencies](https://img.shields.io/david/paul-long/fast-table.svg?style=flat-square)](https://david-dm.org/paul-long/fast-table)
[![DevDependencies](https://img.shields.io/david/dev/paul-long/fast-table.svg?style=flat-square)](https://david-dm.org/paul-long/fast-table?type=dev)
[![Gitter](https://img.shields.io/gitter/room/paul-long/fast-table.svg?style=flat-square)](https://gitter.im/paul-long/paul-long?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Codecov](https://img.shields.io/coveralls/github/paul-long/fast-table.svg?style=flat-square)](https://codecov.io/gh/paul-long/fast-table/branch/master)
[![Issues need help](https://flat.badgen.net/github/label-issues/paul-long/fast-table/help%20wanted/open)](https://github.com/paul-long/fast-table/issues?q=label%3A%22help+wanted%22)

</div>

# 在线 Demo

https://paul-long.github.io/react-components/

# 安装

[![rc-select](https://nodei.co/npm/fast-table.png)](https://npmjs.org/package/fast-table)

```bash
npm install fast-table --save-dev
```

# 支持

- 多数据快速渲染，虚拟渲染
- 固定表头
- 固定列
- 表头排序
- 表头分组
- 树形数据展示
- 固定行至顶部或者底部
- 子表格订制
- 表头自由排序
- 表格数据选择

# API

## Table Props

| props                                         | describe                       | type                           | default value    |
| --------------------------------------------- | ------------------------------ | ------------------------------ | ---------------- |
| [bordered](#bordered)                         | show bordered                  | Boolean                        | false            |
| [bodyMaxHeight](#bodymaxheight)               | body max height                | Number or String               |                  |
| [className](#classname)                       | custom class                   | String                         |                  |
| [colMinWidth](#colminwidth)                   | min column width               | Number                         | 100              |
| [columns](#column-props)                      | set table header               | Array[]                        | -                |
| [dataSource](#datasource)                     | data                           | Array[]                        |                  |
| [defaultShowCount](#defaultshowcount)         | default show rows              | Number                         | 30               |
| [emptyText](#emptytext)                       | empty show                     | Function                       | () => '暂无数据' |
| [expandedRowByClick](#expandedrowbyclick)     | on click row expanded          | Boolean                        | true             |
| [expandedRowKeys](#expandedrowkeys)           | expanded rows                  | String[]                       |                  |
| [expandedRowRender](#expandedrowrender)       | expanded render                | Function                       |                  |
| [fixedHeader](#fixedheader)                   | fixed header                   | Boolean                        | true             |
| [footerHeight](#footerheight)                 | Footer height                  | Number                         | 30               |
| [getRowHeight](#getrowheight)                 | span row                       | Function(record, index):Number | () => 1          |
| [headerRowHeight](#headerrowheight)           | header row height              | Number                         | 35               |
| [headerSortable](#headersortable)             | header sortable                | Boolean                        | false            |
| [pullDown](#pulldown)                         | pull data                      | Boolean                        | false            |
| [indentSize](#indentsize)                     | expanded indent size           | Number                         | 17               |
| [onExpandedRowsChange](#onexpandedrowschange) | on expanded change             | Function                       |                  |
| [onHeaderSortable](#onheadersortable)         | on header sort end             | Function                       |                  |
| [onHeaderRow](#onheaderrow)                   | header row event listener      | Function                       |                  |
| [onScrollEnd](#onscrollend)                   | scroll to bottom               | Function                       |                  |
| [onSort](#onsort)                             | on sort                        | Function                       |                  |
| [onRow](#onrow)                               | row events listener            | Function                       |                  |
| [refreshEnable](#refreshenable)               | use scroll end                 | Boolean                        | true             |
| [rowClassName](#rowclassname)                 | row className                  | Function                       | () => ''         |
| [rowHeight](#rowheight)                       | default row height             | Number                         | 30               |
| [scrollEndPosition](#scrollendposition)       | scroll to bottom px to refresh | Number                         | 60               |
| [scrollSize](#scrollsize)                     | set scroll default size        | Object                         | {x: 8, y: 8}     |
| [showHeader](#showheader)                     | show header                    | Boolean                        | true             |
| [sortMulti](#sortmulti)                       | multi sort enable              | Boolean                        | false            |
| [style](#style)                               | table style                    | Object                         | {}               |
| [useScrollY](#usescrolly)                     | use y Scroll                   | Boolean                        | true             |
| [rowSelection](#rowselection)                 | Row selection, config          | Object                         | null             |

# Column Props

| props        | describe                            | type                                                   | default value |
| ------------ | ----------------------------------- | ------------------------------------------------------ | ------------- |
| align        | alignment                           | String(`left` or `center` or `right`)                  | `left`        |
| className    | set className                       | String`or`Function(`column`, `record`, `index`):String |               |
| children     | child columns                       | Object:Column                                          |               |
| dataIndex    | data key,use `a.b.c`                | String                                                 | -             |
| fixed        | fixed column                        | String(`left` or `right`)                              |               |
| key          | unique identifier <br> (can ignore) | String                                                 | -             |
| onCell       | custom cell style                   | Function(column, record):Object                        |               |
| onHeaderCell | custom header cell style            | Function(column):Object                                |               |
| order        | default order                       | String(`desc` or `asc`)                                |               |
| render       | render cell                         | Function(text, record, index) {}                       | -             |
| sortEnable   | sort enable                         | Boolean                                                |               |
| title        | header cell text                    | String or ReactNode                                    |               |
| width        | width                               | String `or` Number                                     | -             |

# DataSource Props

| props   | describe  | type                                 | default value |
| ------- | --------- | ------------------------------------ | ------------- |
| isFixed | fixed row | `true` or String(`top` or `bottom` ) | -             |

# Row Selection

| props        | describe                                                        | type                                      | default value |
| ------------ | --------------------------------------------------------------- | ----------------------------------------- | ------------- |
| selectedKeys | controlled selected row keys                                    | string[]                                  | []            |
| onSelect     | callback executed when select one row                           | Function(record, selected, selkectedKeys) |               |
| type         | select model, checkbox(`multi-select`) or radio(`radio-select`) | `checkbox` or `radio`                     | checkbox      |
| useSelectAll | select all enable                                               | `boolean`                                 | false         |

## bordered

show border , default `false`.

## bodyMaxHeight

set table body max height, not default.

## className

set className.

## colMinWidth

header cell min width, default `100`.

## dataSource

table data.

## defaultShowCount

show count, default `30`

## emptyText

empty show content.

## expandedRowByClick

whether expanded when click on a row, default `true`.

## expandedRowKeys

expanded keys.

## expandedRowRender

custom expanded row.

## fixedHeader

wherther fixed header. default `true`

## footerHeight

footer height, default `30`.

## getRowHeight

custom row height.

## headerRowHeight

header row height. default `35`.

## headerSortable

header sortable enabled, default `false`.

## pulldown

default `false`

是否向前添加数据

## indentSize

expanded indent size, default `17`.

## onExpandedRowsChange

expanded on row changed.

## onHeaderSortable

header on sortable end.

## onHeaderRow

listen on header row events.

## onScrollEnd

listen on scroll bottom.

## onSort

listen on sort header.

## onRow

listen on row events.

## refreshEnable

scroll to bottom for refresh.

## rowClassName

row className.

## rowHeight

row height, default `30`.

## scrollEndPosition

Scroll to the bottom how many pixels from the bottom trigger the refresh.

## scrollSize

setting scroll size, default `{x: 8, y: 8}`.

## showHeader

show header, default `true`.

## sortMulti

sort multi, default `false`.

## style

table style.

## useScrollY

use scroll Y.

## rowselection

Row selection

# 示例

```javascript
import Table from 'fast-table';
const columns = [
  {
    title: '第一列',
    align: 'left',
    dataIndex: 'key',
    sortEnable: true,
    order: true,
    fixed: 'left',
    width: 100,
    render: (text) => <span>{text}</span>,
    onCell: () => ({color: '#F9C152'})
  },
  {
    title: '第二列',
    dataIndex: 'key0',
    width: 100,
    fixed: 'left',
    sortEnable: true
  },
  {
    title: '第三列',
    dataIndex: 'key1',
    width: 100,
    bodyStyle: {background: '#122024', color: '#11A1FF'}
  },
  {
    title: '第四列',
    align: 'left',
    dataIndex: 'key2',
    width: 130
  },
  {
    title: '第五列',
    align: 'left',
    dataIndex: 'key3',
    width: 120
  },
  {
    title: '第六列',
    align: 'left',
    fixed: 'right',
    dataIndex: 'key4',
    width: 100
  }
];

const dataSource = [
  {key: 0, key0: 'a', key1: 'b', key2: 'c', key3: 'd', key4: 'e'}
];
const otherProps = {};
ReactDOM.render(
  <Table columns={columns} dataSource={dataSource} {...otherProps} />,
  mountNode
);
```

[查看更多实例](https://paul-long.github.io/react-components/)

# Version Log

- 1.4.8-beta.17
  - 添加向前添加数据滚动条位置设置
- 1.4.8-beta.16
  - fixed onClick bug
