import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragList, DragGroup, initListener, disposeListener } from 'core';

export class DragListDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const options = binding.value || {};
    const instance = new DragList(el);
    instance.data = options.data;
    instance.selectable = Boolean(options.selectable);
    instance.groupName = options.group;
    el.instance = instance;
  }
  inserted(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const instance = el.instance;
    instance.collect();
    instance.noticeDirty(DragGroup);
    initListener(instance);
  }
  unbind(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    disposeListener(el.instance);
  }
}
