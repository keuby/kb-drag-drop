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
  _dragListGroup: DragGroup;

  get dragListGroup() {
    if (this._dragListGroup == null) {
      this._dragListGroup = this.search(DragGroup);
    }
    return this._dragListGroup;
  }

  get group() {
    if (this.groupName != null) {
      return this.groupName;
    } else if (this.dragListGroup != null) {
      return this.dragListGroup.name;
    }
    return null;
  }

  constructor(el: DragHTMLElement<DragList>) {
    super(el);
    this.selectable = false;
    this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_ITEM_ATTR_NAME}]`);
  }

  @Listen('dragenter') handleDragEnter(event: HammerInput) {
    this.el.classList.add(DRAG_ENTERED_CLS);
  }

  @Listen('dragleave') handleDragLeave(event: HammerInput) {
    this.el.classList.remove(DRAG_ENTERED_CLS);
  }
}
