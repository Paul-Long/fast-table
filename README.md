# fast-table

**React表格组件，支持多数据首次快速渲染。**

# 在线Demo
https://paul-long.github.io/react-components/

# 安装

```bash
npm install fast-table
```

# 支持
- 多数据快速渲染，虚拟渲染
- 固定表头
- 固定列
- 表头排序
- 表头分组
- 树形数据展示
- 固定行至顶部或者底部

# API

**Table Props:**

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| bordered              | show bordered         | Boolean   | false |
| className             | custom class          | String    | 
| colMinWidth           | min column width      | Number    | 100 |
| columns               | set table header      | Array[]   | - ||
| dataSource            | data                  | Array[]   | |
| defaultShowCount      | default show rows     | Number    | 30 |
| emptyText             | empty show            | Function  | () => '暂无数据' |
| expandedRowByClick    | on click row expanded | Boolean   | true |
| expandedRowKeys       | expanded rows         | String[]  | |
| expandedRowRender     | expanded render       | Function  | |
| fixedHeader           | fixed header          | Boolean   | true |
| footerHeight          | Footer height         | Number    | 30 |
| getRowHeight          | span row              | Function(record, index):Number | () => 1 |
| headerRowHeight       | header row height     | Number    | 35 |
| indentSize            | expanded indent size  | Number    | 17 |
| onExpandedRowsChange  | on expanded change    | Function  | |
| onScrollEnd           | scroll to bottom      | Function  | |
| refreshEnable         | use scroll end        | Boolean   | true |
| rowClassName          | row className         | Function  |  () => '' |
| rowHeight             | default row height    | Number    | 30 |
| scrollEndPosition     | scroll to bottom px to refresh    | Number | 60 |
| showHeader            | show header           | Boolean   | true |
| sortMulti             | multi sort enable     | Boolean   | false |
| style                 | table style           | Object    | {} |
| useScrollY            | use y Scroll          | Boolean   | true |


## Column Props

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| align | 对齐方式 | String(`left` or `center` or `right`) | `left` |
| className | 设置列className | String `or` Function(`column`, `record`, `index`):String |  |
| children | 多行表头属性 | Object：Column |  |
| dataIndex | 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法 | String | - |
| fixed | 设置固定列 | String(`left` or `right`) |  |
| key | React 需要的 key，如果已经设置了唯一的 dataIndex，<br>可以忽略这个属性 | String | - |
| onCell | 设置Body单元格style | Function(column, record):Object |  |
| order | 默认排序规则 | String(`desc` or `asc`) |  |
| render | 生成复杂数据的渲染函数，<br>参数分别为当前行的值，当前行数据，行索引，<br>@return里面可以设置表格行/列合并 | Function(text, record, index) {} | - |
| sortEnable | 是否可排序 | Boolean |  |
| title | 列头显示文字 | String or ReactNode |  |
| width | 列宽度| String `or` Number | - |

**DataSource Props:**

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| isFixed | 数据行固定， 可以固定至顶部或固定至底部 | `true` or String(`top` or `bottom` ) | - |


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
