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
| bordered | 是否显示边框 | Boolean | false |
| className | 自定义class | String | 
| colMinWidth | 列最小宽度 | Number | 100 |
| columns | 表格列的配置描述，具体项见下表 | Array[] | - ||
| dataSource | 数据数组 | Array[] | |
| defaultShowCount | 默认显示行数 | Number | 30 |
| emptyText | 空数据展示文字 | Function | () => '暂无数据' |
| expandedRowByClick | 是否可以点击行展开 | Boolean | true |
| expandedRowKeys | 展开行集合 | String[] | |
| fixedHeader | 是否固定表头 | Boolean | true |
| footerHeight | Footer高度 | Number | 30 |
| getRowHeight | 设置当前行占几行, 默认占1行 | Function(record, index):Number | () => 1 |
| headerRowHeight | 表头默认行高 | Number | 35 |
| indentSize | 展开行首个但单元格缩进 | Number | 17 |
| onExpandedRowsChange | 展开行行为触发 | Function | |
| onScrollEnd | 滚动至页面底部触发 | Function | |
| refreshEnable | 是否可滚动最底部刷新 | Boolean | true |
| rowClassName | 获取行class | Function |  () => '' |
| rowHeight | 默认行高 | Number | 30 |
| scrollEndPosition | 滚动至底部多少px触发onScrollEnd | Number | 60 |
| showHeader | 是否显示表头 | Boolean | true |
| sortMulti | 是否多表头排序 | Boolean | false |
| style | table自定义样式 | Object | {} |
| useScrollY | 使用Y轴 Scroll | Boolean | true |


**Column Props:**

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
]
const otherProps = {};
ReactDOM.render(<Table columns={columns} dataSource={dataSource} {...otherProps} />, mountNode);
```

