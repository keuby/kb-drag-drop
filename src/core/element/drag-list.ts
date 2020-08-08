import { DragItem } from './drag-item';
import { DRAG_CLASS_PREFIX, DRAG_LIST_ATTR_NAME, DRAG_ITEM_ATTR_NAME } from 'shared/constants';
import { DragCollection } from 'core/drag-element';
import { DragHTMLElement } from 'shared/types';
import { DragGroup } from './drag-group';
import { EventListener, Listen } from 'core/event/decorator';

export const DRAG_ENTERED_CLS = DRAG_CLASS_PREFIX + '-entered';

@EventListener
export class DragList extends DragCollection<DragItem> {
  groupName: string;
  selectable: boolean;
  dragListGroup: DragGroup;

  get group() {
    if (this.groupName != null) {
      return this.groupName;
    } else if (this.dragListGroup != null) {
      return this.dragListGroup.name;
    }
  }

  constructor(el: DragHTMLElement<DragList>) {
    super(el);
    this.selectable = false;
    this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');
  }

  setGroupInstance(ins: DragGroup) {
    this.dragListGroup = ins;
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_ITEM_ATTR_NAME}]`);
    this.initItems();
  }

  @Listen('dragenter') handleDragEnter(event: HammerInput) {
    this.el.classList.add(DRAG_ENTERED_CLS);
  }

  @Listen('dragleave') handleDragLeave(event: HammerInput) {
    this.el.classList.remove(DRAG_ENTERED_CLS);
  }

  protected initItems() {
    super.initItems();
    for (const item of this.items) {
      item.setDragList(this);
    }
  }
}
