# fast-table

**一个支持大数据渲染的table表格react组件**

# 安装

```bash
npm install fast-table
```

# API

**table props:**

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| columns | 表格列的配置描述，具体项见下表 | Array[] | - |
| dataSource | 数据数组 | Any[] | |
| width | table宽度 | Number or String | |
| height | table高度 | Number or String | |
| showHeader | 是否显示表头 | Boolean | true |
| bordered | 是否显示边框 | Boolean | false |
| fixedHeader | 是否固定表头 | Boolean | true |
| rowRef | 获取行元素 | Function | true |
| getRowHeight | 设置当前行占几行, 默认占1行 | Function(record, index):Number | () => 1 |
| rowHeight | 默认行高 | Number | 30 |
| headerRowHeight | 表头默认行高 | Number | 35 |
| style | table样式 | Object | {} |
| rowClassName | 表格行的类名 | String `or` Function(record, index):String | {} |


**column props:**

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|---|
| dataIndex | 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法 | String | - |
| key | React 需要的 key，如果已经设置了唯一的 dataIndex，<br>可以忽略这个属性 | String | - |
| render | 生成复杂数据的渲染函数，<br>参数分别为当前行的值，当前行数据，行索引，<br>@return里面可以设置表格行/列合并 | Function(text, record, index) {} | - |
| width | 列宽度| String `or` Number | - |
| align | 对齐方式 | String(`left` or `center` or `right`) | `left` |
| bodyStyle | body中列的样式 | Object `or` Function(`record`, `index`):Object | - |
| className | 设置列className | String `or` Function(`column`, `record`, `index`):String |  |


# 示例

```javascript
import Table from 'fast-table';
ReactDOM.render(<Table {...props} />, mountNode);
```

