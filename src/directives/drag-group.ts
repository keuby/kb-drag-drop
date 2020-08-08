import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragGroup, initListener, disposeListener } from 'core';

export class DragGroupDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding) {
    const value = binding.value || {};

    el.instance = new DragGroup(el);
    el.instance.data = value.data;
    if (value.groupName != null && value.groupName !== '') {
      el.instance.name = value.groupName;
    }
  }
  inserted(el: DragHTMLElement<DragGroup>) {
    const instance = el.instance;
    instance.collect();
    initListener(instance);
  }
  unbind(el: DragHTMLElement<DragGroup>) {
    disposeListener(el.instance);
  }
}
