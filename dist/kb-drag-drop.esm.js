/**
 * kb-drag-drop v1.0.0
 * release at 2020/10/22
 * by Knight Chen
 * github https://github.com/keuby/kb-drag-drop#readme
 */

import Hammer from 'hammerjs';

const DRAG_ITEM_ATTR_NAME = 'kb-drag-item';
const DRAG_GROUP_ATTR_NAME = 'kb-drag-group';
const DRAG_LIST_ATTR_NAME = 'kb-drag-list';
const DRAG_CLASS_PREFIX = 'kb-drag';
const EVENT_MAP = {
  click: 'tap',
  dragstart: 'panstart',
  dragmove: 'panmove',
  dragend: 'panend',
  dragcancel: 'pancancel'
};

class LeaveEnterRecord {
  constructor(ins, record) {
    this.instance = ins;
    this.record = record;
  }

  isEntered({
    x,
    y
  }) {
    const boundingRect = this.instance.el.getBoundingClientRect();
    const {
      left,
      right,
      top,
      bottom
    } = boundingRect;
    return x > left && x < right && y > top && y < bottom;
  }

}
class EventManager {
  constructor() {
    this.dragging = false;
    this.observerRecords = [];
    this.selectedItems = new Set();
    this.selectEmitRecord = new Map();
    this.enteredObserverRecord = null;
  }

  static getInstance() {
    return this.instance;
  }

  get dragData() {
    const data = {
      data: this.selectable ? Array.from(this.selectedItems || []).map(item => item.data) : this.draggingItem && this.draggingItem.data,
      from: this.draggingItem.dragList.data
    };

    if (this.enteredObserverRecord != null) {
      data.current = this.enteredObserverRecord.instance.data;
    }

    return data;
  }

  get dropData() {
    return {
      data: this.selectable ? Array.from(this.selectedItems || []).map(item => item.data) : this.draggingItem && this.draggingItem.data,
      from: this.draggingItem.dragList.data,
      to: this.enteredObserverRecord.instance.data
    };
  }

  emitElementSelect(el, selected) {
    if (this.selectedGroup == null) {
      this.selectedGroup = el.group;
    } else if (this.selectedGroup !== el.group) {
      this.cleanSelectedItems();
    }

    if (selected) {
      this.selectedItems.add(el);
    } else {
      this.selectedItems.delete(el);
    }

    this.emitSelectEvent(el, {
      selected
    });
    this.emitSelectEvent(el.dragList, {
      selectedItems: Array.from(this.selectedItems).map(({
        data
      }) => data)
    });
  }

  emitDragStart(instance) {
    if (instance == null) return;
    const selectable = instance.selectable;
    const group = this.selectable ? this.selectedGroup : instance.group;
    this.dragging = true;
    this.selectable = selectable;
    this.draggingItem = instance;
    this.draggingObserverRecords = this.observerRecords.filter(record => {
      const recordGroup = record.instance.group;
      return recordGroup != null && recordGroup === group;
    });
    this.emitDragEvent('dragstart', this.dragData);
  }

  emitDragMove(event) {
    var _a;

    if (((_a = this.draggingObserverRecords) === null || _a === void 0 ? void 0 : _a.length) === 0) return;
    const enteredRecord = this.draggingObserverRecords.find(record => {
      return record.isEntered(event.center);
    });

    if (enteredRecord != null) {
      if (this.enteredObserverRecord === enteredRecord) {
        return this.dispatchEvent(enteredRecord.instance, 'dragover', this.dragData);
      }

      if (this.enteredObserverRecord != null) {
        this.callHandler(this.enteredObserverRecord, 'dragleave', event);
      }

      this.enteredObserverRecord = enteredRecord;
      this.callHandler(enteredRecord, 'dragenter', event);
    } else if (this.enteredObserverRecord != null) {
      this.callHandler(this.enteredObserverRecord, 'dragleave', event);
      this.enteredObserverRecord = null;
    }
  }

  emitDragEnd(event) {
    if (!this.dragging) return;
    this.emitDragEvent('dragend', this.dragData);

    if (this.enteredObserverRecord != null) {
      this.emitDragEvent('drop', this.dropData);
      this.callHandler(this.enteredObserverRecord, 'dragleave', event);
    }

    this.dragging = false;
    this.draggingItem = null;
    this.draggingObserverRecords = null;
    this.enteredObserverRecord = null;
    this.cleanSelectedItems();
  }

  addObserver(ins, record) {
    const records = this.observerRecords;
    if (records.some(({
      instance
    }) => instance === ins)) return;
    const oberverRecord = new LeaveEnterRecord(ins, record);
    records.push(oberverRecord);
  }

  cleanSelectedItems() {
    this.selectable = null;
    this.selectedGroup = null;
    this.selectedItems.forEach(item => item.selected = false);
  }

  callHandler({
    record,
    instance
  }, event, data) {
    const handler = record[event];

    if (handler != null && typeof instance[handler] === 'function') {
      instance[handler](data);
    }

    this.dispatchEvent(instance, event, this.dragData);
  }

  emitDragEvent(event, detail) {
    this.emitDragItemEvent(event, detail);
    this.emitDragListEvent(event, detail);
  }

  emitSelectEvent(el, detail) {
    const emitted = this.selectEmitRecord.has(el);

    if (!emitted) {
      setTimeout(() => {
        const latestDetail = this.selectEmitRecord.get(el);
        this.dispatchEvent(el, 'select', latestDetail);
        this.selectEmitRecord.delete(el);
      }, 30);
    }

    this.selectEmitRecord.set(el, detail);
  }

  emitDragItemEvent(event, detail) {
    if (!this.selectable) {
      this.dispatchEvent(this.draggingItem, event, detail);
    } else {
      this.broadcastEvent(this.selectedItems, event, detail);
    }
  }

  emitDragListEvent(event, detail) {
    this.dispatchEvent(this.draggingItem.dragList, event, detail);
  }

  dispatchEvent(el, event, detail) {
    el.dispatchEvent(event, detail);
  }

  broadcastEvent(els, event, detail) {
    els.forEach(item => item.dispatchEvent(event, detail));
  }

}
EventManager.instance = new EventManager();

function mixinManagerInterface(constructor) {
  const record = constructor.__record__;
  const compute = constructor.__compute__;

  constructor.prototype.__init__ = function () {
    if (this.el == null) return;

    if (record != null) {
      this.__manager__ = new Hammer(this.el);
      const events = Object.keys(record).join(' ');

      this.__manager__.on(events, event => {
        const handler = record[event.type];
        this[handler](event);
      });
    }

    if (compute != null) {
      const manager = EventManager.getInstance();
      manager.addObserver(this, compute);
    }
  };

  constructor.prototype.__dispose__ = function () {
    if (this.__manager__ != null) {
      this.__manager__.destroy();

      this.__manager__ = null;
    }
  };
}
function addListener(constructor, event, handler) {
  let record = null;

  if (event in EVENT_MAP) {
    event = EVENT_MAP[event];
    record = constructor.__record__ || (constructor.__record__ = {});
    record[event] = handler;
  } else {
    record = constructor.__compute__ || (constructor.__compute__ = {});
    record[event] = handler;
  }
}
function initListener(instance, listener) {
  if (typeof instance.__init__ === 'function') {
    instance.__init__();
  }

  if (listener != null && typeof instance.on === 'function') {
    instance.on(listener);
  }
}
function disposeListener(instance) {
  if (typeof instance.__dispose__ === 'function') {
    instance.__dispose__();
  }

  if (typeof instance.off === 'function') {
    instance.off();
  }
}

function EventListener(constructor) {
  mixinManagerInterface(constructor);
}
function Listen(event) {
  return (target, prop) => {
    const constructor = target.constructor;
    addListener(constructor, event, prop);
  };
}
function Manager(target, prop) {
  Object.defineProperty(target, prop, {
    get: () => EventManager.getInstance()
  });
}

class DragElement {
  constructor(el) {
    this.el = el;
    this.eventRecord = Object.create(null);
  }

  noticeDirty(Clazz) {
    const instance = this.search(Clazz);
    instance && instance.makeDirty();
  }

  search(Clazz, el = null) {
    const currentElement = el || this.el.parentElement;
    if (currentElement == null) return null;
    let currentInstance = currentElement.__instance__ || currentElement.__instance_ref__;

    if (currentInstance != null && currentInstance instanceof Clazz) {
      return currentInstance;
    }

    const parentElement = el.parentElement;
    if (parentElement == null) return null;
    const parentInstance = this.search(Clazz, parentElement);
    if (parentInstance != null) currentElement.__instance_ref__ = parentInstance;
    return parentInstance;
  }

  on(event, callback) {
    if (typeof event === 'function') {
      this.eventRecord['default'] = event;
    } else {
      this.eventRecord[event] = callback;
    }
  }

  off(type) {
    if (type == null) type = 'default';
    this.eventRecord[type] = null;
  }

  dispatchEvent(event, detail) {
    let callback, params;

    if (typeof this.eventRecord[event] === 'function') {
      callback = this.eventRecord[event];
      params = [detail];
    } else if (typeof this.eventRecord['default'] === 'function') {
      callback = this.eventRecord['default'];
      params = [event, detail];
    }

    if (callback != null) {
      callback.apply(this, params);
    }
  }

}
class DragCollection extends DragElement {
  constructor() {
    super(...arguments);
    this.dirty = true;
  }

  get items() {
    if (this.dirty) {
      const itemList = [];

      for (let i = 0; i < this.collection.length; i++) {
        const item = this.collection[i];
        itemList.push(item.__instance__);
      }

      this._items = itemList;
      this.dirty = false;
    }

    return this._items;
  }

  makeDirty() {
    this.dirty = true;
  }

}

const groupNameGenerator = {
  id: 0,

  getGroupId() {
    return `kb-drag-group-${this.id++}`;
  }

};
class DragGroup extends DragCollection {
  constructor() {
    super(...arguments);
    this.name = groupNameGenerator.getGroupId();
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_LIST_ATTR_NAME}]`);
  }

}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const DRAG_ENTERED_CLS = DRAG_CLASS_PREFIX + '-entered';
let DragList = class DragList extends DragCollection {
  constructor(el) {
    super(el);
    this.selectable = false;
    this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');
  }

  get group() {
    if (this.groupName != null) {
      return this.groupName;
    } else if (this.dragListGroup != null) {
      return this.dragListGroup.name;
    }

    this.dragListGroup = this.search(DragGroup);
    return this.dragListGroup && this.dragListGroup.name;
  }

  setGroupInstance(ins) {
    this.dragListGroup = ins;
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_ITEM_ATTR_NAME}]`);
  }

  handleDragEnter(event) {
    this.el.classList.add(DRAG_ENTERED_CLS);
  }

  handleDragLeave(event) {
    this.el.classList.remove(DRAG_ENTERED_CLS);
  }

};

__decorate([Listen('dragenter')], DragList.prototype, "handleDragEnter", null);

__decorate([Listen('dragleave')], DragList.prototype, "handleDragLeave", null);

DragList = __decorate([EventListener], DragList);

const SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';
const DRAGGING_CLASS = DRAG_CLASS_PREFIX + '-item-dragging';
const INSERTED_CLASS = DRAG_CLASS_PREFIX + '-item-inserted';
let DragItem = class DragItem extends DragElement {
  constructor(el) {
    super(el);
    this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');
  }

  get dragList() {
    if (this._dragList == null) {
      this._dragList = this.search(DragList);
    }

    return this._dragList;
  }

  get group() {
    return this.dragList && this.dragList.group;
  }

  get selectable() {
    return this.dragList != null ? this.dragList.selectable : false;
  }

  get selected() {
    return this.el.classList.contains(SELECTED_CLASS);
  }

  set selected(value) {
    if (value) {
      this.el.classList.add(SELECTED_CLASS);
    } else {
      this.el.classList.remove(SELECTED_CLASS);
    }

    this.manager.emitElementSelect(this, value);
  }

  toggleSelected() {
    this.el.classList.toggle(SELECTED_CLASS);
    this.manager.emitElementSelect(this, this.selected);
  }

  handleClick({
    srcEvent
  }) {
    if (!this.selectable) return;

    if (srcEvent.metaKey || srcEvent.ctrlKey) {
      this.toggleSelected();
    } else {
      const selectedItems = this.manager.selectedItems;

      if (selectedItems.size === 1 && selectedItems.has(this)) {
        this.toggleSelected();
      } else {
        this.manager.cleanSelectedItems();
        this.selected = true;
      }
    }
  }

  handleDragStart(event) {
    if (this.group == null) return;

    if (this.selectable) {
      if (!this.selected) this.selected = true;
      const selectedItems = Array.from(this.manager.selectedItems);
      this.draggingNodes = selectedItems.map(item => this.genDraggingNode(item));
    } else {
      this.draggingNodes = [this.genDraggingNode(this)];
    }

    this.startPoint = event.center;
    this.manager.emitDragStart(this);
    this.renderDraggingNodes();
    event.preventDefault();
  }

  handleDragMove(event) {
    if (this.startPoint == null) return;
    const currentPoint = event.center;
    const deltaX = currentPoint.x - this.startPoint.x;
    const deltaY = currentPoint.y - this.startPoint.y;
    this.draggingNodes.forEach(node => {
      node.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    });
    this.manager.emitDragMove(event);
    event.preventDefault();
  }

  handleDragEnd(event) {
    event.preventDefault();
    this.startPoint = null;
    this.manager.emitDragEnd(event);
    this.disposeDraggingNodes();
  }

  genDraggingNode(item) {
    const origin = item.el;
    const rect = origin.getBoundingClientRect();
    const cloned = item.el.cloneNode(true);
    cloned.__instance__ = item;
    cloned.classList.add(INSERTED_CLASS);
    cloned.style.left = `${rect.left}px`;
    cloned.style.top = `${rect.top}px`;
    return cloned;
  }

  renderDraggingNodes() {
    this.draggingNodes.forEach(node => {
      node.__instance__.el.classList.add(DRAGGING_CLASS);
    });
    const fragment = document.createDocumentFragment();
    fragment.append(...this.draggingNodes);
    document.body.append(fragment);
  }

  disposeDraggingNodes() {
    if (this.draggingNodes == null) return;
    this.draggingNodes.forEach(node => {
      node.__instance__.el.classList.remove(DRAGGING_CLASS);

      node.remove();
    });
    this.draggingNodes = null;
  }

};

__decorate([Manager], DragItem.prototype, "manager", void 0);

__decorate([Listen('click')], DragItem.prototype, "handleClick", null);

__decorate([Listen('dragstart')], DragItem.prototype, "handleDragStart", null);

__decorate([Listen('dragmove')], DragItem.prototype, "handleDragMove", null);

__decorate([Listen('dragend')], DragItem.prototype, "handleDragEnd", null);

DragItem = __decorate([EventListener], DragItem);

class DragGroupDirective {
  bind(el, binding) {
    const value = binding.value || {};
    el.__instance__ = new DragGroup(el);
    el.__instance__.data = value.data;

    if (value.groupName != null && value.groupName !== '') {
      el.__instance__.name = value.groupName;
    }
  }

  inserted(el) {
    const instance = el.__instance__;
    instance.collect();
    initListener(instance);
  }

  unbind(el) {
    disposeListener(el.__instance__);
  }

}

class DragItemDirective {
  bind(el, binding) {
    const options = binding.value || {};
    el.__instance__ = new DragItem(el);
    el.__instance__.data = options.data;
  }

  inserted(el) {
    const instance = el.__instance__;
    instance.noticeDirty(DragList);
    initListener(instance, (type, detail) => {
      const event = new CustomEvent(type, {
        detail
      });
      el.dispatchEvent(event);
    });
  }

  unbind(el) {
    disposeListener(el.__instance__);
  }

}

class DragListDirective {
  bind(el, binding) {
    const options = binding.value || {};
    const instance = new DragList(el);
    instance.data = options.data;
    instance.selectable = Boolean(options.selectable);
    instance.groupName = options.group;
    el.__instance__ = instance;
  }

  inserted(el) {
    const instance = el.__instance__;
    instance.collect();
    instance.noticeDirty(DragGroup);
    initListener(instance, (type, detail) => {
      const event = new CustomEvent(type, {
        detail
      });
      el.dispatchEvent(event);
    });
  }

  unbind(el) {
    disposeListener(el.__instance__);
  }

}

function index (Vue) {
  Vue.directive('drag-group', new DragGroupDirective());
  Vue.directive('drag-item', new DragItemDirective());
  Vue.directive('drag-list', new DragListDirective());
  const sheet = document.createElement('style');
  sheet.innerHTML = `
    .${INSERTED_CLASS} {
      position: fixed;
      margin: 0;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    .${DRAGGING_CLASS} {
      opacity: 0;
    }
  `;
  document.head.appendChild(sheet);
}

export default index;
export { DRAG_CLASS_PREFIX, DRAG_GROUP_ATTR_NAME, DRAG_ITEM_ATTR_NAME, DRAG_LIST_ATTR_NAME, EVENT_MAP };
