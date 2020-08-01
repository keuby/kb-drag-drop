import { Vue } from 'vue/types/vue';
import { DRAG_ITEM_ATTR_NAME, DRAG_CLASS_PREFIX } from 'shared/constants';
import { DragList } from './drag-list';
import { buildDropEvent } from '../events/drag-event';
import { DragElement } from '../drag-element';
import { Subscription } from 'rxjs';
import { DragHTMLElement } from 'shared/types';

const SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';
const DRAGGING_CLASS = DRAG_CLASS_PREFIX + '-item-dragging';

export interface DragItemOptions {
  selectable?: boolean;
  data?: any;
}

export class DragItem extends DragElement {
  private selectable: boolean;
  private subscriptions: Subscription[] = [];
  private draggingNodes: DragItem[] = [];
  private startPoint: [number, number];

  private _dragList: DragList;

  get selected() {
    return this.el.classList.contains(SELECTED_CLASS);
  }

  set selected(value: boolean) {
    if (value) {
      this.el.classList.add(SELECTED_CLASS);
    } else {
      this.el.classList.remove(SELECTED_CLASS);
    }
  }

  get dragList() {
    if (this._dragList == null) {
      this._dragList = this.search<DragList>(DragList);
    }
    return this._dragList;
  }

  constructor(el: DragHTMLElement<DragItem>, vm: Vue, options?: DragItemOptions) {
    super(el, vm, options?.data);
    this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');
    this.selectable = !!options?.selectable;
  }

  addDraggingNodes(node: DragItem) {
    this.draggingNodes.push(node);
    node.selected = true;
    node.el.style.zIndex = '1000';
  }

  clearDraggingNodes() {
    this.draggingNodes.forEach((node) => {
      node.selected = false;
      node.el.style.transform = '';
      node.el.style.zIndex = '';
    });
    this.draggingNodes = [];
  }

  init() {
    const eventManager = this.eventManater;

    if (this.selectable) {
      const clickSub = eventManager.onClick(this.el, (event: MouseEvent) => {
        this.handleSelect(event);
      });
      this.subscriptions.push(clickSub);
    }

    const dragDropSub = eventManager.onDragDrop(this.el, {
      dragStart: (event: MouseEvent) => {
        if (this.selectable) {
          this.dragList.items.filter((item) => item.selected).forEach((item: DragItem) => this.addDraggingNodes(item));
          if (!this.selected) {
            this.addDraggingNodes(this);
          }
        } else {
          this.addDraggingNodes(this);
        }
        this.startPoint = [event.clientX, event.clientY];
      },
      dragMove: (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const currentPoint: [number, number] = [clientX, clientY];
        this.draggingNodes.forEach((node) => {
          this.transformDragItem(this.startPoint, currentPoint, node);
        });
      },
      dragEnd: (event: MouseEvent) => {
        if (this.eventManater.enteredObserver != null) {
          const toDragHTMLElement = this.eventManater.enteredObserver.el;
          const fromList = this.dragList;
          const toList = toDragHTMLElement.instance;

          const itemData = this.selectable ? this.draggingNodes.map((node) => node.data) : this.draggingNodes[0].data;

          const dropEvent = buildDropEvent(event, {
            item: itemData,
            from: this.dragList.data,
            to: toList.data,
          });
          fromList.el.dispatchEvent(dropEvent);
        }

        this.clearDraggingNodes();
      },
    });

    this.subscriptions.push(dragDropSub);
  }

  handleSelect(event: MouseEvent) {
    if (!this.selectable) return;

    if (event.metaKey || event.ctrlKey) {
      this.selected = true;
    } else {
      this.dragList.items.forEach((node) => {
        node.selected = false;
      });
      this.selected = true;
    }
    console.log('click');
  }

  destory() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  transformDragItem(start: [number, number], current: [number, number], item: DragItem) {
    const deltaX = current[0] - start[0];
    const deltaY = current[1] - start[1];
    item.el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }
}
