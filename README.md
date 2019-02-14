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
| [columns](#columnprops)               | set table header      | Array[]   | -             |
| [dataSource](#dataSource)            | data                  | Array[]   |               |
| [defaultShowCount](#defaultshowcount)      | default show rows     | Number    | 30            |
| [emptyText](#emptytext)             | empty show            | Function  | () => '暂无数据' |
| expandedRowByClick    | on click row expanded | Boolean   | true          |
| expandedRowKeys       | expanded rows         | String[]  |               |
| expandedRowRender     | expanded render       | Function  |               |
| fixedHeader           | fixed header          | Boolean   | true          |
| footerHeight          | Footer height         | Number    | 30            |
| getRowHeight          | span row              | Function(record, index):Number | () => 1 |
| headerRowHeight       | header row height     | Number    | 35            |
| headerSortable        | header sortable       | Boolean   | false         |
| indentSize            | expanded indent size  | Number    | 17            |
| onExpandedRowsChange  | on expanded change    | Function  |               |
| onHeaderSortable      | on header sort end    | Function  |               |
| onHeaderRow           | header row event listener    | Function  |               |
| onScrollEnd           | scroll to bottom      | Function  |               |
| onSort                | on sort               | Function  |               |
| onRow                 | row events listener   | Function  |               |
| refreshEnable         | use scroll end        | Boolean   | true          |
| rowClassName          | row className         | Function  |  () => ''     |
| rowHeight             | default row height    | Number    | 30            |
| scrollEndPosition     | scroll to bottom px to refresh    | Number | 60   |
| scrollSize            | set scroll default size    | Object | {x: 8, y: 8}   |
| showHeader            | show header           | Boolean   | true          |
| sortMulti             | multi sort enable     | Boolean   | false         |
| style                 | table style           | Object    | {}            |
| useScrollY            | use y Scroll          | Boolean   | true          |


# Column Props

| props | describe | type | default value |
|---------------|-----------------------|-------------------------------------------|--------|
| align         | alignment             | String(`left` or `center` or `right`)     | `left` |
| className     | set className         | String`or`Function(`column`, `record`, `index`):String |  |
| children      | child columns         | Object:Column                             |        |
| dataIndex     | data key,use `a.b.c`  | String | - |
| fixed         | fixed column          | String(`left` or `right`)                 |        |
| key           | unique identifier <br> (can ignore) | String | - |
| onCell        | cell style            | Function(column, record):Object           |        |
| onHeaderCell  | header cell style     | Function(column):Object                   |        |
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
show border , `true` or `false`

## bodyMaxHeight
set table body max height

## className
set className

## colMinWidth
header cell min width

## dataSource
table data 

## defaultShowCount
show count, default `30`

## emptyText
empty show content

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
