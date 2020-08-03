(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('hammerjs')) :
  typeof define === 'function' && define.amd ? define(['hammerjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KbDragDrop = factory(global.Hammer));
}(this, (function (Hammer) { 'use strict';

  Hammer = Hammer && Object.prototype.hasOwnProperty.call(Hammer, 'default') ? Hammer['default'] : Hammer;

  const DRAG_ITEM_ATTR_NAME = 'kb-drag-item';
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
      this.enteredObserverRecord = null;
    }

    static getInstance() {
      return this.instance;
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
    }

    emitDragStart(instance) {
      const selectable = instance.selectable;
      const group = this.selectable ? this.selectedGroup : instance.group;
      this.dragging = true;
      this.selectable = selectable;
      this.draggingItem = instance;
      this.draggingObserverRecords = this.observerRecords.filter(record => {
        const recordGroup = record.instance.group;
        return recordGroup != null && recordGroup === group;
      });
      this.emitDragEvent('dragstart', {});
    }

    emitDragMove(event) {
      if (this.draggingObserverRecords.length === 0) return;
      const enteredRecord = this.draggingObserverRecords.find(record => {
        return record.isEntered(event.center);
      });

      if (enteredRecord != null) {
        if (this.enteredObserverRecord === enteredRecord) {
          return this.dispatchEvent(enteredRecord.instance, 'dragover', {});
        }

        if (this.enteredObserverRecord != null) {
          this.callHandler(this.enteredObserverRecord, 'dragleave', event);
        }

        this.callHandler(enteredRecord, 'dragenter', event);
        this.enteredObserverRecord = enteredRecord;
      } else if (this.enteredObserverRecord != null) {
        this.callHandler(this.enteredObserverRecord, 'dragleave', event);
        this.enteredObserverRecord = null;
      }
    }

    emitDragEnd() {
      if (!this.dragging) return;
      this.emitDragEvent('dragend', {});

      if (this.enteredObserverRecord != null) {
        this.emitDragEvent('drop', {});
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

      this.dispatchEvent(instance, event, {});
    }

    emitDragEvent(event, detail) {
      this.emitDragItemEvent(event, detail);
      this.emitDragListEvent(event, detail);
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
      el.dispatchEvent(event, {});
    }

    broadcastEvent(els, event, detail) {
      els.forEach(item => item.dispatchEvent(event, {}));
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
  function initListener(instance) {
    if (typeof instance.__init__ === 'function') {
      instance.__init__();
    }
  }
  function disposeListener(instance) {
    if (typeof instance.__dispose__ === 'function') {
      instance.__dispose__();
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
    }

    noticeDirty(Clazz) {
      const instance = this.search(Clazz);
      instance && instance.makeDirty();
    }

    search(Clazz) {
      let el = this.el.parentElement;

      while (el != null) {
        const instance = el.instance;

        if (instance != null && instance instanceof Clazz) {
          return instance;
        }
      }

      return null;
    }

    dispatchEvent(event, detail) {}

  }
  class DragCollection extends DragElement {
    constructor() {
      super(...arguments);
      this.dirty = true;
    }

    get items() {
      if (this.dirty) {
        this.initItems();
      }

      return this._items;
    }

    makeDirty() {
      this.dirty = true;
    }

    initItems() {
      const itemList = [];

      for (let i = 0; i < this.collection.length; i++) {
        const item = this.collection[i];
        itemList.push(item.instance);
      }

      this._items = itemList;
      this.dirty = false;
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
      this.initItems();
    }

    initItems() {
      super.initItems();

      for (const item of this.items) {
        item.setGroupInstance(this);
      }
    }

    destory() {}

  }

  class DragList extends DragCollection {
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
    }

    setGroupInstance(ins) {
      this.dragListGroup = ins;
    }

    collect() {
      this.collection = this.el.querySelectorAll(`[${DRAG_ITEM_ATTR_NAME}]`);
      this.initItems();
    }

    initItems() {
      super.initItems();

      for (const item of this.items) {
        item.setDragList(this);
      }
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

  const SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';
  const DRAGGING_CLASS = DRAG_CLASS_PREFIX + '-item-dragging';
  const INSERTED_CLASS = DRAG_CLASS_PREFIX + '-item-inserted';
  let DragItem = class DragItem extends DragElement {
    constructor(el) {
      super(el);
      this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');
    }

    get group() {
      return this.dragList && this.dragList.group;
    }

    get selectable() {
      return this.dragList == null ? this.dragList.selectable : false;
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

    setDragList(dragList) {
      this.dragList = dragList;
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
      this.manager.emitDragEnd();
      this.disposeDraggingNodes();
    }

    genDraggingNode(item) {
      const origin = item.el;
      const rect = origin.getBoundingClientRect();
      const cloned = item.el.cloneNode(true);
      cloned.instance = item;
      cloned.classList.add(INSERTED_CLASS);
      cloned.style.left = `${rect.left}px`;
      cloned.style.top = `${rect.top}px`;
      return cloned;
    }

    renderDraggingNodes() {
      this.draggingNodes.forEach(node => {
        node.instance.el.classList.add(DRAGGING_CLASS);
      });
      const fragment = document.createDocumentFragment();
      fragment.append(...this.draggingNodes);
      document.body.append(fragment);
    }

    disposeDraggingNodes() {
      this.draggingNodes.forEach(node => {
        node.instance.el.classList.remove(DRAGGING_CLASS);
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
    bind(el, binding, vnode, oldVnode) {
      const value = binding.value || {};
      el.instance = new DragGroup(el);
      el.instance.data = value.data;
    }

    inserted(el, binding, vnode, oldVnode) {
      const instance = el.instance;
      instance.collect();
      initListener(instance);
    }

    unbind(el, binding, vnode, oldVnode) {
      disposeListener(el.instance);
    }

  }

  class DragItemDirective {
    bind(el, binding, vnode, oldVnode) {
      const options = binding.value || {};
      el.instance = new DragItem(el);
      el.instance.data = options.data;
    }

    inserted(el, binding, vnode, oldVnode) {
      const instance = el.instance;
      instance.noticeDirty(DragList);
      initListener(instance);
    }

    unbind(el) {
      disposeListener(el.instance);
    }

  }

  class DragListDirective {
    bind(el, binding, vnode, oldVnode) {
      const options = binding.value || {};
      const instance = new DragList(el);
      instance.data = options.data;
      instance.selectable = Boolean(options.selectable);
      instance.groupName = options.group;
      el.instance = instance;
    }

    inserted(el, binding, vnode, oldVnode) {
      const instance = el.instance;
      instance.collect();
      instance.noticeDirty(DragGroup);
      initListener(instance);
    }

    unbind(el, binding, vnode, oldVnode) {
      disposeListener(el.instance);
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

  return index;

})));
