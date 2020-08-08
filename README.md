# Kb Drag Drop

基于 Vue 的拖拽组件，兼容手机端和 PC 端，支持多个元素同时拖拽

## 安装

```bash
npm install --save kb-drag-drop

# or yarn

yarn add kb-drag-drop
```

```js
import Vue from 'vue';
import KbDragDrop from 'kb-drag-drop';

Vue.use(KbDragDrop);
```

## 基本使用

该组件包含如下三个指令：

- `v-drag-group` 拖拽分组，相同分组的 drag list 可以之间相互拖拽
- `v-drag-list` 拖拽元素列表
- `v-drag-item` 拖拽元素

```html
<div id="app" v-drag-group>
  <div v-drag-list="{ data: 'list1' }" @drop="handleDrop">
    <p v-for="i in count" v-drag-item="{ data: { id: i } }"></p>
  </div>
  <div v-drag-list="{ data: 'list2' }">
    <p v-for="i in count" v-drag-item="{ data: { id: i } }"></p>
  </div>
</div>
```

```ts
import { DropDetail } from 'kb-drag-drop';

export default {
  methods: {
    handleDrop({ detail }: CustomEvent<DropDetail>) {
      const { from, data, to } = detail;
      // from: 'list1'
      // to: 'list2'
      // data: { id: 0 }
    },
  },
};
```

支持的事件

- dragstart 拖拽开始时触发
- dragmove 拖拽进行中时触发，此事件会频繁触发，使用时请慎重以防出现性能问题
- dragend 拖拽结束时触发
- dragenter 拖拽进入该 drag list 元素区域时触发
- dragleave 拖拽离开该 drag list 元素区域时触发
- dragover 拖拽经过该 drag list 元素区域时触发，此事件会频繁触发，使用时请慎重以防出现性能问题
- select 当 selectable 值为 true 时，选中元素会触发该事件，按住 ctrl 可以多选
- drop 拖拽元素放下时触发

> notice: dragenter、dragleave、dragover 只有 `v-drag-list` 标记的元素才会抛出该事件，事件在 `v-drag-list` 和 `v-drag-item` 标记的元素上都会触发，`v-drag-group` 不会触发事件
