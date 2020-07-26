import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement, DragList, DragGroup } from '../core';

export class DragListDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance = new DragList(el, vnode.context, binding.value);
  }
  inserted(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const instance = el.instance;
    instance.collect();
    instance.noticeDirty(DragGroup);
    instance.init();
  }
  unbind(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance.destory;
    el.instance = null;
  }
}
