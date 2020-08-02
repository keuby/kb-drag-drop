import { DragList } from './drag-list';
import { DragCollection } from '../drag-element';
import { DRAG_LIST_ATTR_NAME } from 'shared/constants';

const groupNameGenerator = {
  id: 0,
  getGroupId() {
    return `kb-drag-group-${this.id++}`;
  },
};

export class DragGroup extends DragCollection<DragList> {
  name: string = groupNameGenerator.getGroupId();

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_LIST_ATTR_NAME}]`);
    this.initItems();
  }

  protected initItems() {
    super.initItems();
    for (const item of this.items) {
      item.setGroupInstance(this);
    }
  }

  destory() {}
}
