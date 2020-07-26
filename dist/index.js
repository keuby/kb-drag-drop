(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.KbDragDrop = factory());
}(this, (function () { 'use strict';

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

    var DRAG_ITEM_ATTR_NAME = 'kb-drag-item';
    var DRAG_GROUP_ATTR_NAME = 'kb-drag-group';
    var DRAG_LIST_ATTR_NAME = 'kb-drag-list';
    var DRAG_CLASS_PREFIX = 'kb-drag';

    var DragElement =
    /** @class */
    function () {
      function DragElement(el, vm, data) {
        this.el = el;
        this.vm = vm;
        this.data = data;
      }

      DragElement.prototype.setData = function (data) {
        this.data = data;
      };

      DragElement.prototype.noticeDirty = function (Clazz) {
        var instance = this.search(Clazz);
        instance && instance.makeDirty();
      };

      Object.defineProperty(DragElement.prototype, "eventManater", {
        get: function () {
          return this.vm.$dragDropEventManager;
        },
        enumerable: false,
        configurable: true
      });

      DragElement.prototype.search = function (Clazz) {
        for (var el = this.el.parentElement; el != null; el = el.parentElement) {
          var instance = el.instance;

          if (instance instanceof Clazz) {
            return instance;
          }
        }
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
            var itemList = [];

            for (var i = 0; i < this.collection.length; i++) {
              var item = this.collection[i];
              itemList.push(item.instance);
            }

            this._items = itemList;
          }

          return this._items;
        },
        enumerable: false,
        configurable: true
      });

      DragCollection.prototype.makeDirty = function () {
        this.dirty = true;
      };

      return DragCollection;
    }(DragElement);

    var DragGroup =
    /** @class */
    function (_super) {
      __extends(DragGroup, _super);

      function DragGroup(el, data, vm) {
        var _this = _super.call(this, el, vm, data) || this;

        _this.el.setAttribute(DRAG_GROUP_ATTR_NAME, '');

        return _this;
      }

      DragGroup.prototype.collect = function () {
        this.collection = this.el.querySelectorAll("[" + DRAG_LIST_ATTR_NAME + "]");
      };

      DragGroup.prototype.destory = function () {};

      return DragGroup;
    }(DragCollection);

    var DragGroupDirective =
    /** @class */
    function () {
      function DragGroupDirective() {}

      DragGroupDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
        el.instance = new DragGroup(el, vnode.context, binding.value);
      };

      DragGroupDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
        var instance = el.instance;
        instance.collect();
      };

      DragGroupDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
        el.instance.destory();
        el.instance = null;
      };

      return DragGroupDirective;
    }();

    var DRAG_ENTERED_CLS = DRAG_CLASS_PREFIX + '-entered';

    var DragList =
    /** @class */
    function (_super) {
      __extends(DragList, _super);

      function DragList(el, vm, data) {
        var _this = _super.call(this, el, vm, data) || this;

        _this.subscriptions = [];

        _this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');

        return _this;
      }

      DragList.prototype.collect = function () {
        this.collection = this.el.querySelectorAll("[" + DRAG_ITEM_ATTR_NAME + "]");
      };

      DragList.prototype.init = function () {
        var _this = this;

        var manager = this.eventManater;
        this.subscriptions.push(manager.onLeaveEnter(this.el, {
          dragEnter: function () {
            console.log('entered');

            _this.el.classList.add(DRAG_ENTERED_CLS);
          },
          dragLeave: function () {
            console.log('leaved');

            _this.el.classList.remove(DRAG_ENTERED_CLS);
          }
        }));
      };

      DragList.prototype.destory = function () {};

      return DragList;
    }(DragCollection);

    function buildDropEvent(event, data) {
      var dropEvent = new MouseEvent('drop', event);
      dropEvent.data = data;
      return dropEvent;
    }

    var SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';

    var DragItem =
    /** @class */
    function (_super) {
      __extends(DragItem, _super);

      function DragItem(el, vm, options) {
        var _this = _super.call(this, el, vm, options === null || options === void 0 ? void 0 : options.data) || this;

        _this.subscriptions = [];
        _this.draggingNodes = [];

        _this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');

        _this.selectable = !!(options === null || options === void 0 ? void 0 : options.selectable);
        return _this;
      }

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
      Object.defineProperty(DragItem.prototype, "dragList", {
        get: function () {
          if (this._dragList == null) {
            this._dragList = this.search(DragList);
          }

          return this._dragList;
        },
        enumerable: false,
        configurable: true
      });

      DragItem.prototype.addDraggingNodes = function (node) {
        this.draggingNodes.push(node);
        node.selected = true;
        node.el.style.zIndex = '1000';
      };

      DragItem.prototype.clearDraggingNodes = function () {
        this.draggingNodes.forEach(function (node) {
          node.selected = false;
          node.el.style.transform = '';
          node.el.style.zIndex = '';
        });
        this.draggingNodes = [];
      };

      DragItem.prototype.init = function () {
        var _this = this;

        var eventManager = this.eventManater;

        if (this.selectable) {
          var clickSub = eventManager.onClick(this.el, function (event) {
            _this.handleSelect(event);
          });
          this.subscriptions.push(clickSub);
        }

        var dragDropSub = eventManager.onDragDrop(this.el, {
          dragStart: function (event) {
            if (_this.selectable) {
              _this.dragList.items.filter(function (item) {
                return item.selected;
              }).forEach(function (item) {
                return _this.addDraggingNodes(item);
              });

              if (!_this.selected) {
                _this.addDraggingNodes(_this);
              }
            } else {
              _this.addDraggingNodes(_this);
            }

            _this.startPoint = [event.clientX, event.clientY];
          },
          dragMove: function (event) {
            var clientX = event.clientX,
                clientY = event.clientY;
            var currentPoint = [clientX, clientY];

            _this.draggingNodes.forEach(function (node) {
              _this.transformDragItem(_this.startPoint, currentPoint, node);
            });
          },
          dragEnd: function (event) {
            if (_this.eventManater.enteredObserver != null) {
              var toDragHTMLElement = _this.eventManater.enteredObserver.el;
              var fromList = _this.dragList;
              var toList = toDragHTMLElement.instance;
              var itemData = _this.selectable ? _this.draggingNodes.map(function (node) {
                return node.data;
              }) : _this.draggingNodes[0].data;
              var dropEvent = buildDropEvent(event, {
                item: itemData,
                from: _this.dragList.data,
                to: toList.data
              });
              fromList.el.dispatchEvent(dropEvent);
            }

            _this.clearDraggingNodes();
          }
        });
        this.subscriptions.push(dragDropSub);
      };

      DragItem.prototype.handleSelect = function (event) {
        if (!this.selectable) return;

        if (event.metaKey || event.ctrlKey) {
          this.selected = true;
        } else {
          this.dragList.items.forEach(function (node) {
            node.selected = false;
          });
          this.selected = true;
        }

        console.log('click');
      };

      DragItem.prototype.destory = function () {
        if (this.subscriptions && this.subscriptions.length > 0) {
          this.subscriptions.forEach(function (sub) {
            return sub.unsubscribe();
          });
        }
      };

      DragItem.prototype.transformDragItem = function (start, current, item) {
        var deltaX = current[0] - start[0];
        var deltaY = current[1] - start[1];
        item.el.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";
      };

      return DragItem;
    }(DragElement);

    var DragItemDirective =
    /** @class */
    function () {
      function DragItemDirective() {}

      DragItemDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
        el.instance = new DragItem(el, vnode.context, binding.value);
      };

      DragItemDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
        var _a, _b;

        (_a = el.instance) === null || _a === void 0 ? void 0 : _a.noticeDirty(DragList);
        (_b = el.instance) === null || _b === void 0 ? void 0 : _b.init();
      };

      DragItemDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
        var _a;

        (_a = el.instance) === null || _a === void 0 ? void 0 : _a.destory();
        el.instance = null;
      };

      return DragItemDirective;
    }();

    var DragListDirective =
    /** @class */
    function () {
      function DragListDirective() {}

      DragListDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
        el.instance = new DragList(el, vnode.context, binding.value);
      };

      DragListDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
        var instance = el.instance;
        instance.collect();
        instance.noticeDirty(DragGroup);
        instance.init();
      };

      DragListDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
        el.instance.destory;
        el.instance = null;
      };

      return DragListDirective;
    }();

    var LeaveEnterObserver =
    /** @class */
    function () {
      function LeaveEnterObserver(el, enter, leave) {
        this.el = el;
        this.enter = enter;
        this.leave = leave;
      }

      LeaveEnterObserver.prototype.isEntered = function (event) {
        var clientX = event.clientX,
            clientY = event.clientY;

        var _a = this.el.getBoundingClientRect(),
            left = _a.left,
            right = _a.right,
            top = _a.top,
            bottom = _a.bottom;

        return left < clientX && right > clientX && top < clientY && bottom > clientY;
      };

      return LeaveEnterObserver;
    }();

    var EventManager =
    /** @class */
    function () {
      function EventManager() {
        this.dragging = false;
        this.observers = [];
      }

      EventManager.prototype.onClick = function (el, callback) {
        var touched = false;

        var handleMouseClick = function (event) {
          if (touched) {
            touched = false;
          } else {
            callback(event);
          }
        };

        var handleTouchClick = function (startEvent) {
          var timer = setTimeout(function () {
            el.removeEventListener('touchend', touchEndHandler);
          }, 300);

          var touchEndHandler = function (endEvent) {
            if (endEvent.timeStamp - startEvent.timeStamp < 300) {
              callback(event);
              touched = true;
            }

            el.removeEventListener('touchend', touchEndHandler);
            clearTimeout(timer);
          };

          el.addEventListener('touchend', touchEndHandler);
        };

        el.addEventListener('click', handleMouseClick);
        el.addEventListener('touchstart', handleTouchClick);
        return {
          unsubscribe: function () {
            el.removeEventListener('click', handleMouseClick);
            el.removeEventListener('touchstart', handleTouchClick);
            handleMouseClick = null;
            handleTouchClick = null;
          }
        };
      };

      EventManager.prototype.onDragDrop = function (el, callback) {
        var handleTouchDragStart = this.buildDragDropandler('touchmove', 'touchend', callback);
        var handleMouseDragStart = this.buildDragDropandler('mousemove', 'mouseup', callback);
        el.addEventListener('touchstart', handleTouchDragStart);
        el.addEventListener('mousedown', handleMouseDragStart);
        return {
          unsubscribe: function () {
            el.removeEventListener('touchstart', handleTouchDragStart);
            el.removeEventListener('mousedown', handleMouseDragStart);
            handleTouchDragStart = null;
            handleMouseDragStart = null;
          }
        };
      };

      EventManager.prototype.onLeaveEnter = function (el, callback) {
        var _this = this;

        var observer = new LeaveEnterObserver(el, callback.dragEnter, callback.dragLeave);
        this.observers.push(observer);
        return {
          unsubscribe: function () {
            for (var i = 0; i < _this.observers.length; i++) {
              var ob = _this.observers[i];

              if (ob === observer) {
                _this.observers.splice(i, 1);

                break;
              }
            }
          }
        };
      };

      EventManager.prototype.buildDragDropandler = function (move, end, callback) {
        var _this = this;

        return function (startEvent) {
          startEvent = _this.buildMouseEvent(startEvent);

          var startHandler = function (moveEvent) {
            moveEvent = _this.buildMouseEvent(moveEvent);

            if (Math.pow(moveEvent.clientX - startEvent.clientX, 2) + Math.pow(moveEvent.clientY - startEvent.clientY, 2) > 30) {
              callback.dragStart(startEvent);
              _this.dragging = true;
              document.removeEventListener(move, startHandler);
              document.addEventListener(move, moveHandler);
            }
          };

          var moveHandler = function (moveEvent) {
            if (_this.dragging) {
              moveEvent = _this.buildMouseEvent(moveEvent);
              callback.dragMove(moveEvent);

              _this.emitLeaveEnter(moveEvent);
            }
          };

          var endHandler = function (endEvent) {
            endEvent = _this.buildMouseEvent(endEvent);

            if (_this.dragging) {
              callback.dragEnd(endEvent);
              _this.dragging = false;
            } else {
              document.removeEventListener(move, startHandler);
            }

            if (_this.enteredObserver != null) {
              _this.enteredObserver.leave(endEvent);

              _this.enteredObserver = null;
            }

            document.removeEventListener(move, startHandler);
            document.removeEventListener(end, endHandler);
          };

          document.addEventListener(move, startHandler); // document.addEventListener(move, moveHandler);

          document.addEventListener(end, endHandler);
        };
      };

      EventManager.prototype.findEnteredObserver = function (event) {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
          var observer = _a[_i];

          if (observer.isEntered(event)) {
            return observer;
          }
        }

        return null;
      };

      EventManager.prototype.emitLeaveEnter = function (event) {
        var observer = this.findEnteredObserver(event);

        if (this.enteredObserver != null) {
          if (observer == null) {
            this.enteredObserver.leave(event);
            this.enteredObserver = null;
          } else if (observer !== this.enteredObserver) {
            this.enteredObserver.leave(event);
            this.enteredObserver = observer;
            this.enteredObserver.enter(event);
          }
        } else if (observer != null) {
          this.enteredObserver = observer;
          this.enteredObserver.enter(event);
        }
      };

      EventManager.prototype.buildMouseEvent = function (event) {
        if (event instanceof MouseEvent) {
          return event;
        }

        var touch = event.touches[0];
        return new MouseEvent(event.type, {
          screenX: touch === null || touch === void 0 ? void 0 : touch.screenX,
          screenY: touch === null || touch === void 0 ? void 0 : touch.screenY,
          clientX: touch === null || touch === void 0 ? void 0 : touch.clientX,
          clientY: touch === null || touch === void 0 ? void 0 : touch.clientY,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
          relatedTarget: event.target
        });
      };

      return EventManager;
    }();

    function index (Vue) {
      Vue.directive('drag-group', new DragGroupDirective());
      Vue.directive('drag-item', new DragItemDirective());
      Vue.directive('drag-list', new DragListDirective());
      Vue.prototype.$dragDropEventManager = new EventManager();
      window.manager = Vue.prototype.$dragDropEventManager;
    }

    return index;

})));
