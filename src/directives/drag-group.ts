import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragGroup, initListener, disposeListener } from 'core';

export class DragGroupDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const value = binding.value || {};

    el.instance = new DragGroup(el);
    el.instance.data = value.data;
  }
  inserted(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const instance = el.instance;
    instance.collect();
    initListener(instance);
  }
  unbind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    disposeListener(el.instance);
  }
}
