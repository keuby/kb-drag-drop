import { DragList } from './drag-list';
import { Vue } from 'vue/types/vue';
import { DragCollection } from '../drag-element';
import { DragHTMLElement } from '../../shared/types';
import { DRAG_GROUP_ATTR_NAME, DRAG_LIST_ATTR_NAME } from 'shared/constants';

export class DragGroup extends DragCollection<DragList> {
  constructor(el: DragHTMLElement<DragGroup>, data: any, vm: Vue) {
    super(el, vm, data);
    this.el.setAttribute(DRAG_GROUP_ATTR_NAME, '');
  }

  collect() {
    this.collection = this.el.querySelectorAll(`[${DRAG_LIST_ATTR_NAME}]`);
  }

  destory() {}
}
