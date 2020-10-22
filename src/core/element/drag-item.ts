import { DragList } from './drag-list';
import { DragElement } from '../drag-element';
import { DragHTMLElement } from 'shared/types';
import { DRAG_ITEM_ATTR_NAME, DRAG_CLASS_PREFIX } from 'shared/constants';
import { EventListener, Listen, Manager, EventManager } from 'core/event';

export const SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';
export const DRAGGING_CLASS = DRAG_CLASS_PREFIX + '-item-dragging';
export const INSERTED_CLASS = DRAG_CLASS_PREFIX + '-item-inserted';

@EventListener
export class DragItem extends DragElement {
  _dragList: DragList;

  startPoint: HammerPoint;
  wrapperEl: HTMLElement;
  draggingNodes: DragHTMLElement<DragItem>[];

  @Manager manager: EventManager;

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

  set selected(value: boolean) {
    if (value) {
      this.el.classList.add(SELECTED_CLASS);
    } else {
      this.el.classList.remove(SELECTED_CLASS);
    }
    this.manager.emitElementSelect(this, value);
  }

  constructor(el: DragHTMLElement<DragItem>) {
    super(el);
    this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');
  }

  toggleSelected() {
    this.el.classList.toggle(SELECTED_CLASS);
    this.manager.emitElementSelect(this, this.selected);
  }

  @Listen('click') handleClick({ srcEvent }: HammerInput) {
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

  @Listen('dragstart') handleDragStart(event: HammerInput) {
    if (this.group == null) return;

    if (this.selectable) {
      if (!this.selected) this.selected = true;
      const selectedItems = Array.from(this.manager.selectedItems);
      this.draggingNodes = selectedItems.map((item) => this.genDraggingNode(item));
    } else {
      this.draggingNodes = [this.genDraggingNode(this)];
    }

    this.startPoint = event.center;
    this.manager.emitDragStart(this);
    this.renderDraggingNodes();
    event.preventDefault();
  }

  @Listen('dragmove') handleDragMove(event: HammerInput) {
    if (this.startPoint == null) return;

    const currentPoint = event.center;
    const deltaX = currentPoint.x - this.startPoint.x;
    const deltaY = currentPoint.y - this.startPoint.y;
    this.draggingNodes.forEach((node) => {
      node.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    });
    this.manager.emitDragMove(event);
    event.preventDefault();
  }

  @Listen('dragend') handleDragEnd(event: HammerInput) {
    event.preventDefault();
    this.startPoint = null;
    this.manager.emitDragEnd(event);
    this.disposeDraggingNodes();
  }

  private genDraggingNode(item: DragItem) {
    const origin = item.el;
    const rect = origin.getBoundingClientRect();

    const cloned = item.el.cloneNode(true) as DragHTMLElement<DragItem>;
    cloned.__instance__ = item;
    cloned.classList.add(INSERTED_CLASS);
    cloned.style.left = `${rect.left}px`;
    cloned.style.top = `${rect.top}px`;
    return cloned;
  }

  private renderDraggingNodes() {
    this.draggingNodes.forEach((node) => {
      node.__instance__.el.classList.add(DRAGGING_CLASS);
    });
    const fragment = document.createDocumentFragment();
    fragment.append(...this.draggingNodes);
    document.body.append(fragment);
  }

  private disposeDraggingNodes() {
    if (this.draggingNodes == null) return;

    this.draggingNodes.forEach((node) => {
      node.__instance__.el.classList.remove(DRAGGING_CLASS);
      node.remove();
    });
    this.draggingNodes = null;
  }
}
