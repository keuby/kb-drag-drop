import { Vue } from 'vue/types/vue';
import { DragItem } from './drag-item';
import { DRAG_CLASS_PREFIX, DRAG_LIST_ATTR_NAME, DRAG_ITEM_ATTR_NAME } from 'shared/constants';
import { DragCollection } from 'core/drag-element';
import { DragHTMLElement } from 'shared/types';
import { DragGroup } from './drag-group';

const DRAG_ENTERED_CLS = DRAG_CLASS_PREFIX + '-entered';

export class DragList extends DragCollection<DragItem> {
  groupName: string;
  private dragListGroup: DragGroup;

  constructor(el: DragHTMLElement<DragList>) {
    super(el);
    this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');
  }

  get group() {
    if (this.groupName != null) {
      return this.groupName;
    } else if (this.dragListGroup != null) {
      return this.dragListGroup.name;
    }
  }

  setGroupInstance(ins: DragGroup) {
    this.dragListGroup = ins;
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_ITEM_ATTR_NAME}]`);
    this.initItems();
  }

  protected initItems() {
    super.initItems();
    for (const item of this.items) {
      item.setDragList(this);
    }
  }
}
