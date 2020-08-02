import { DragList } from './drag-list';
import { DragElement } from '../drag-element';
import { DragHTMLElement } from 'shared/types';
import { DRAG_ITEM_ATTR_NAME, DRAG_CLASS_PREFIX } from 'shared/constants';
import { EventListener, Listen, Manager, EventManager } from 'core/event';

const SELECTED_CLASS = DRAG_CLASS_PREFIX + '-item-selected';
const DRAGGING_CLASS = DRAG_CLASS_PREFIX + '-item-dragging';
const INSERTED_CLASS = DRAG_CLASS_PREFIX + '-item-inserted';

@EventListener
export class DragItem extends DragElement {
  dragList: DragList;
  selectable: boolean;

  startPoint: HammerPoint;
  wrapperEl: HTMLElement;
  draggingNodes: DragHTMLElement<DragItem>[];

  @Manager manager: EventManager;

  get group() {
    if (this.dragList != null) {
      return this.dragList.group;
    }
    return null;
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
  }

  constructor(el: DragHTMLElement<DragItem>) {
    super(el);
    this.el.setAttribute(DRAG_ITEM_ATTR_NAME, '');
  }

  toggleSelected() {
    this.el.classList.toggle(SELECTED_CLASS);
  }

  setDragList(dragList: DragList) {
    this.dragList = dragList;
  }

  @Listen('click') handleClick({ srcEvent }: HammerInput) {
    if (!this.selectable) return;

    if (srcEvent.metaKey || srcEvent.ctrlKey) {
      this.toggleSelected();
    } else {
      const selectedItems = this.dragList.items.filter((node) => {
        return node.selected;
      });
      if (selectedItems.length > 0) {
        selectedItems.forEach((node) => (node.selected = false));
        this.selected = true;
      } else {
        this.toggleSelected();
      }
    }
  }

  @Listen('dragstart') handleDragStart(event: HammerInput) {
    if (this.selectable) {
      if (!this.selected) this.selected = true;
      this.draggingNodes = this.dragList.items
        .filter((item) => item.selected)
        .map((item) => this.genDraggingNode(item));
    } else {
      this.draggingNodes = [this.genDraggingNode(this)];
    }
    this.renderDraggingNodes();
    this.startPoint = event.center;
    event.preventDefault();
  }

  @Listen('dragmove') handleDragMove(event: HammerInput) {
    const currentPoint = event.center;
    const deltaX = currentPoint.x - this.startPoint.x;
    const deltaY = currentPoint.y - this.startPoint.y;
    this.draggingNodes.forEach((node) => {
      node.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    });
    event.preventDefault();
  }

  @Listen('dragend') handleDragEnd(event: HammerInput) {
    this.disposeDraggingNodes();
    event.preventDefault();
  }

  private genDraggingNode(item: DragItem) {
    const origin = item.el;
    const rect = origin.getBoundingClientRect();

    const cloned = item.el.cloneNode(true) as DragHTMLElement<DragItem>;
    cloned.instance = item;
    cloned.style.position = 'fixed';
    cloned.style.left = `${rect.left}px`;
    cloned.style.top = `${rect.top}px`;
    cloned.style.margin = '0';
    cloned.style.boxShadow =
      '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)';
    return cloned;
  }

  private renderDraggingNodes() {
    this.draggingNodes.forEach((node) => {
      node.instance.el.classList.add(DRAGGING_CLASS);
    });
    const fragment = document.createDocumentFragment();
    fragment.append(...this.draggingNodes);
    document.body.append(fragment);
  }

  private disposeDraggingNodes() {
    this.draggingNodes.forEach((node) => {
      node.instance.el.classList.remove(DRAGGING_CLASS);
      node.remove();
    });
    this.draggingNodes = null;
  }
}
