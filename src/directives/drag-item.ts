import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragItem, DragList, initListener, disposeListener } from 'core';

export class DragItemDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const options = binding.value || {};
    el.instance = new DragItem(el);
    el.instance.data = options.data;
  }
  inserted(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const instance = el.instance;
    instance.noticeDirty(DragList);
    initListener(instance);
  }
  unbind(el: DragHTMLElement<DragItem>) {
    disposeListener(el.instance);
  }
}
