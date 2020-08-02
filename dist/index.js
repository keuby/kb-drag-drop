(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('hammerjs')) :
  typeof define === 'function' && define.amd ? define(['hammerjs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KbDragDrop = factory(global.Hammer));
}(this, (function (Hammer) { 'use strict';

  Hammer = Hammer && Object.prototype.hasOwnProperty.call(Hammer, 'default') ? Hammer['default'] : Hammer;

  var DRAG_ITEM_ATTR_NAME = 'kb-drag-item';
  var DRAG_LIST_ATTR_NAME = 'kb-drag-list';
  var DRAG_CLASS_PREFIX = 'kb-drag';
  var EVENT_MAP = {
    click: 'tap',
    dragstart: 'panstart',
    dragmove: 'panmove',
    dragend: 'panend',
    dragcancel: 'pancancel'
  };

  var LeaveEnterRecord =
  /** @class */
  function () {
    function LeaveEnterRecord(ins, record) {
      this.instance = ins;
      this.record = record;
    }

    return LeaveEnterRecord;
  }();

  var EventManager =
  /** @class */
  function () {
    function EventManager() {
      this.dragging = false;
      this.observerRecords = [];
      this.enteredObserverRecord = null;
    }

    EventManager.getInstance = function () {
      return this.instance;
    };

    EventManager.prototype.emitDragStart = function (els, selectable) {};

    EventManager.prototype.emitDragMove = function (event) {};

    EventManager.prototype.emitDragEnd = function () {};

    EventManager.prototype.addObserver = function (ins, record) {
      var records = this.observerRecords;
      if (records.some(function (_a) {
        var instance = _a.instance;
        return instance === ins;
      })) return;
      var oberverRecord = new LeaveEnterRecord(ins, record);
      records.push(oberverRecord);
    };

    EventManager.instance = new EventManager();
    return EventManager;
  }();

  function mixinManagerInterface(constructor) {
    var record = constructor.__record__;
    var compute = constructor.__compute__;

    constructor.prototype.__init__ = function () {
      var _this = this;

      if (this.el == null) return;

      if (record != null) {
        this.__manager__ = new Hammer(this.el);
        var events = Object.keys(record).join(' ');

        this.__manager__.on(events, function (event) {
          var handler = record[event.type];

          _this[handler](event);
        });
      }

      if (compute != null) {
        var manager = EventManager.getInstance();
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
    var record = null;

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
    return function (target, prop) {
      var constructor = target.constructor;
      addListener(constructor, event, prop);
    };
  }
  function Manager(target, prop) {
    Object.defineProperty(target, prop, {
      get: function () {
        return EventManager.getInstance();
      }
    });
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
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  var DragElement =
  /** @class */
  function () {
    function DragElement(el) {
      this.el = el;
    }

    DragElement.prototype.noticeDirty = function (Clazz) {
      var instance = this.search(Clazz);
      instance && instance.makeDirty();
    };

    DragElement.prototype.search = function (Clazz) {
      var el = this.el.parentElement;

      while (el != null) {
        var instance = el.instance;

        if (instance != null && instance instanceof Clazz) {
          return instance;
        }
      }

      return null;
    };

    return DragElement;
  }();

  var DragCollection =
  /** @class */
  function (_super) {
    __extends(DragCollection, _super);

    function DragCollection() {
      var _this = _super !== null && _super.apply(this, arguments) || this;

      _this.dirty = true;
      return _this;
    }

    Object.defineProperty(DragCollection.prototype, "items", {
      get: function () {
        if (this.dirty) {
          this.initItems();
        }

        return this._items;
      },
      enumerable: false,
      configurable: true
    });

    DragCollection.prototype.makeDirty = function () {
      this.dirty = true;
    };

    DragCollection.prototype.initItems = function () {
      var itemList = [];

      for (var i = 0; i < this.collection.length; i++) {
        var item = this.collection[i];
        itemList.push(item.instance);
      }

      this._items = itemList;
      this.dirty = false;
    };

    return DragCollection;
  }(DragElement);

  var groupNameGenerator = {
    id: 0,
    getGroupId: function () {
      return "kb-drag-group-" + this.id++;
    }
  };

  var DragGroup =
  /** @class */
  function (_super) {
    __extends(DragGroup, _super);

    function DragGroup() {
      var _this = _super !== null && _super.apply(this, arguments) || this;

      _this.name = groupNameGenerator.getGroupId();
      return _this;
    }

    DragGroup.prototype.collect = function () {
      this.collection = this.el.querySelectorAll("[" + DRAG_LIST_ATTR_NAME + "]");
      this.initItems();
    };

    DragGroup.prototype.initItems = function () {
      _super.prototype.initItems.call(this);

      for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
        var item = _a[_i];
        item.setGroupInstance(this);
      }
    };

    DragGroup.prototype.destory = function () {};

    return DragGroup;
  }(DragCollection);

  var DragList =
  /** @class */
  function (_super) {
    __extends(DragList, _super);

    function DragList(el) {
      var _this = _super.call(this, el) || this;

      _this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');

      return _this;
    }

    Object.defineProperty(DragList.prototype, "group", {
      get: function () {
        if (this.groupName != null) {
          return this.groupName;
        } else if (this.dragListGroup != null) {
          return this.dragListGroup.name;
        }
      },
      enumerable: false,
      configurable: true
    });

    DragList.prototype.setGroupInstance = function (ins) {
      this.dragListGroup = ins;
    };

    DragList.prototype.collect = function () {
      this.collection = this.el.querySelectorAll("[" + DRAG_ITEM_ATTR_NAME + "]");
      this.initItems();
    };

    DragList.prototype.initItems = function () {
      _super.prototype.initItems.call(this);

      for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
        var item = _a[_i];
        item.setDragList(this);
      }
    };

    return DragList;
  }(DragCollection);

  var SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';
  var DRAGGING_CLASS = DRAG_CLASS_PREFIX + '-item-dragging';
  var INSERTED_CLASS = DRAG_CLASS_PREFIX + '-item-inserted';

  var DragItem =
  /** @class */
  function (_super) {
    __extends(DragItem, _super);

    function DragItem(el) {
      var _this = _super.call(this, el) || this;

      _this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');

      return _this;
    }

    Object.defineProperty(DragItem.prototype, "group", {
      get: function () {
        if (this.dragList != null) {
          return this.dragList.group;
        }

        return null;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(DragItem.prototype, "selected", {
      get: function () {
        return this.el.classList.contains(SELECTED_CLASS);
      },
      set: function (value) {
        if (value) {
          this.el.classList.add(SELECTED_CLASS);
        } else {
          this.el.classList.remove(SELECTED_CLASS);
        }
      },
      enumerable: false,
      configurable: true
    });

    DragItem.prototype.toggleSelected = function () {
      this.el.classList.toggle(SELECTED_CLASS);
    };

    DragItem.prototype.setDragList = function (dragList) {
      this.dragList = dragList;
    };

    DragItem.prototype.handleClick = function (_a) {
      var srcEvent = _a.srcEvent;
      if (!this.selectable) return;

      if (srcEvent.metaKey || srcEvent.ctrlKey) {
        this.toggleSelected();
      } else {
        var selectedItems = this.dragList.items.filter(function (node) {
          return node.selected;
        });

        if (selectedItems.length > 0) {
          selectedItems.forEach(function (node) {
            return node.selected = false;
          });
          this.selected = true;
        } else {
          this.toggleSelected();
        }
      }
    };

    DragItem.prototype.handleDragStart = function (event) {
      var _this = this;

      if (this.selectable) {
        if (!this.selected) this.selected = true;
        this.draggingItems = this.dragList.items.filter(function (item) {
          return item.selected;
        });
        this.draggingNodes = this.draggingItems.map(function (item) {
          return _this.genDraggingNode(item);
        });
      } else {
        this.draggingItems = [this];
        this.draggingNodes = [this.genDraggingNode(this)];
      }

      this.renderDraggingNodes();
      this.startPoint = event.center;
      event.preventDefault();
    };

    DragItem.prototype.handleDragMove = function (event) {
      var currentPoint = event.center;
      var deltaX = currentPoint.x - this.startPoint.x;
      var deltaY = currentPoint.y - this.startPoint.y;
      this.draggingNodes.forEach(function (node) {
        node.style.transform = "translate3d(" + deltaX + "px, " + deltaY + "px, 0)";
      });
      event.preventDefault();
    };

    DragItem.prototype.handleDragEnd = function (event) {
      this.disposeDraggingNodes();
      event.preventDefault();
    };

    DragItem.prototype.genDraggingNode = function (item) {
      var origin = item.el;
      var rect = origin.getBoundingClientRect();
      var cloned = item.el.cloneNode(true);
      cloned.instance = item;
      cloned.classList.add(INSERTED_CLASS);
      cloned.style.left = rect.left + "px";
      cloned.style.top = rect.top + "px";
      return cloned;
    };

    DragItem.prototype.renderDraggingNodes = function () {
      this.draggingNodes.forEach(function (node) {
        node.instance.el.classList.add(DRAGGING_CLASS);
      });
      var fragment = document.createDocumentFragment();
      fragment.append.apply(fragment, this.draggingNodes);
      document.body.append(fragment);
    };

    DragItem.prototype.disposeDraggingNodes = function () {
      this.draggingNodes.forEach(function (node) {
        node.instance.el.classList.remove(DRAGGING_CLASS);
        node.remove();
      });
      this.draggingNodes = null;
    };

    __decorate([Manager], DragItem.prototype, "manager", void 0);

    __decorate([Listen('click')], DragItem.prototype, "handleClick", null);

    __decorate([Listen('dragstart')], DragItem.prototype, "handleDragStart", null);

    __decorate([Listen('dragmove')], DragItem.prototype, "handleDragMove", null);

    __decorate([Listen('dragend')], DragItem.prototype, "handleDragEnd", null);

    DragItem = __decorate([EventListener], DragItem);
    return DragItem;
  }(DragElement);

  var DragGroupDirective =
  /** @class */
  function () {
    function DragGroupDirective() {}

    DragGroupDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
      var value = binding.value || {};
      el.instance = new DragGroup(el);
      el.instance.data = value.data;
    };

    DragGroupDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
      var instance = el.instance;
      instance.collect();
      initListener(instance);
    };

    DragGroupDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
      disposeListener(el.instance);
    };

    return DragGroupDirective;
  }();

  var DragItemDirective =
  /** @class */
  function () {
    function DragItemDirective() {}

    DragItemDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
      var options = binding.value || {};
      el.instance = new DragItem(el);
      el.instance.selectable = !!options.selectable;
      el.instance.data = options.data;
    };

    DragItemDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
      var instance = el.instance;
      instance.noticeDirty(DragList);
      initListener(instance);
    };

    DragItemDirective.prototype.unbind = function (el) {
      disposeListener(el.instance);
    };

    return DragItemDirective;
  }();

  var DragListDirective =
  /** @class */
  function () {
    function DragListDirective() {}

    DragListDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
      var options = binding.value || {};
      var instance = new DragList(el);
      instance.data = options.data;
      instance.groupName = options.group;
      el.instance = instance;
    };

    DragListDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
      var instance = el.instance;
      instance.collect();
      instance.noticeDirty(DragGroup);
      initListener(instance);
    };

    DragListDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
      disposeListener(el.instance);
    };

    return DragListDirective;
  }();

  function index (Vue) {
    Vue.directive('drag-group', new DragGroupDirective());
    Vue.directive('drag-item', new DragItemDirective());
    Vue.directive('drag-list', new DragListDirective());
    var sheet = document.createElement('style');
    sheet.innerHTML = "\n    ." + INSERTED_CLASS + " {\n      position: fixed;\n      margin: 0;\n      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n    }\n\n    ." + DRAGGING_CLASS + " {\n      opacity: 0;\n    }\n  ";
    document.head.appendChild(sheet);
  }

  return index;

})));
