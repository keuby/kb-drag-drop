import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragItem, DragHTMLElement, DragList } from '../core/index';

export class DragItemDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance = new DragItem(el, vnode.context, binding.value);
  }
  inserted(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance?.noticeDirty(DragList);
    el.instance?.init();
  }
  unbind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance?.destory();
    el.instance = null;
  }
}
