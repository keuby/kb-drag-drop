import { Vue } from 'vue/types/vue';
import { Subscription } from 'rxjs';
import { DragItem } from './drag-item';
import { DRAG_CLASS_PREFIX, DRAG_LIST_ATTR_NAME, DRAG_ITEM_ATTR_NAME } from 'shared/constants';
import { DragCollection } from 'core/drag-element';
import { DragHTMLElement } from 'shared/types';

const DRAG_ENTERED_CLS = DRAG_CLASS_PREFIX + '-entered';

export class DragList extends DragCollection<DragItem> {
  private subscriptions: Subscription[] = [];

  constructor(el: DragHTMLElement<DragList>, vm: Vue, data: any) {
    super(el, vm, data);
    this.el.setAttribute(DRAG_LIST_ATTR_NAME, '');
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_ITEM_ATTR_NAME}]`);
  }

  init() {
    const manager = this.eventManater;
    this.subscriptions.push(
      manager.onLeaveEnter(this.el, {
        dragEnter: () => {
          this.el.classList.add(DRAG_ENTERED_CLS);
        },
        dragLeave: () => {
          this.el.classList.remove(DRAG_ENTERED_CLS);
        },
      }),
    );
  }

  destory() {}
}
