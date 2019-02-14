# fast-table

**React表格组件，支持多数据首次快速渲染。**

# 在线Demo
https://paul-long.github.io/react-components/

# 安装

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

# API

## Table Props

| props | describe | type | default value |
|-----------------------|-----------------------|-----------|---------------|
| [bordered](#bordered) | show bordered         | Boolean   | false         |
| [bodyMaxHeight](#bodymaxheight)         | body max height       | Number or String   |          |
| [className](#classname)             | custom class          | String    |               |
| [colMinWidth](#colminwidth)           | min column width      | Number    | 100           |
| [columns](#column-props)               | set table header      | Array[]   | -             |
| [dataSource](#datasource)            | data                  | Array[]   |               |
| [defaultShowCount](#defaultshowcount)      | default show rows     | Number    | 30            |
| [emptyText](#emptytext)             | empty show            | Function  | () => '暂无数据' |
| [expandedRowByClick](#expandedrowbyclick)    | on click row expanded | Boolean   | true          |
| [expandedRowKeys](#expandedrowkeys)       | expanded rows         | String[]  |               |
| [expandedRowRender](#expandedrowrender)     | expanded render       | Function  |               |
| [fixedHeader](#fixedheader)           | fixed header          | Boolean   | true          |
| [footerHeight](#footerheight)          | Footer height         | Number    | 30            |
| [getRowHeight](#getrowheight)          | span row              | Function(record, index):Number | () => 1 |
| [headerRowHeight](#headerrowheight)       | header row height     | Number    | 35            |
| [headerSortable](#headersortable)        | header sortable       | Boolean   | false         |
| [indentSize](#indentsize)            | expanded indent size  | Number    | 17            |
| [onExpandedRowsChange](#onexpandedrowschange)  | on expanded change    | Function  |               |
| [onHeaderSortable](#onheadersortable)      | on header sort end    | Function  |               |
| [onHeaderRow](#onheaderrow)           | header row event listener    | Function  |               |
| [onScrollEnd](#onscrollend)           | scroll to bottom      | Function  |               |
| [onSort](#onsort)                | on sort               | Function  |               |
| [onRow](#onrow)                 | row events listener   | Function  |               |
| [refreshEnable](#refreshenable)         | use scroll end        | Boolean   | true          |
| [rowClassName](#rowclassname)          | row className         | Function  |  () => ''     |
| [rowHeight](#rowheight)             | default row height    | Number    | 30            |
| [scrollEndPosition](#scrollendposition)     | scroll to bottom px to refresh    | Number | 60   |
| [scrollSize](#scrollsize)            | set scroll default size    | Object | {x: 8, y: 8}   |
| [showHeader](#showheader)            | show header           | Boolean   | true          |
| [sortMulti](#sortmulti)             | multi sort enable     | Boolean   | false         |
| [style](#style)                 | table style           | Object    | {}            |
| [useScrollY](#usescrolly)            | use y Scroll          | Boolean   | true          |


# Column Props

| props | describe | type | default value |
|---------------|-----------------------|-------------------------------------------|--------|
| align         | alignment             | String(`left` or `center` or `right`)     | `left` |
| className     | set className         | String`or`Function(`column`, `record`, `index`):String |  |
| children      | child columns         | Object:Column                             |        |
| dataIndex     | data key,use `a.b.c`  | String | - |
| fixed         | fixed column          | String(`left` or `right`)                 |        |
| key           | unique identifier <br> (can ignore) | String | - |
| onCell        | custom cell style            | Function(column, record):Object           |        |
| onHeaderCell  | custom header cell style     | Function(column):Object                   |        |
| order         | default order         | String(`desc` or `asc`)                   |        |
| render        | render cell           | Function(text, record, index) {}          | -      |
| sortEnable    | sort enable           | Boolean                                   |        |
| title         | header cell text      | String or ReactNode                       |        |
| width         | width                 | String `or` Number                        | -      |

# DataSource Props

| props | describe | type | default value |
|---------|-----------|--------------------------------------|---|
| isFixed | fixed row | `true` or String(`top` or `bottom` ) | - |

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
    render: (text) => (<span>{text}</span>),
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
    width: 100,
  }
];

const dataSource = [
  {key: 0, key0: 'a', key1: 'b', key2: 'c', key3: 'd', key4: 'e'}
];
const otherProps = {};
ReactDOM.render(<Table columns={columns} dataSource={dataSource} {...otherProps} />, mountNode);
```

[查看更多实例](https://paul-long.github.io/react-components/)
