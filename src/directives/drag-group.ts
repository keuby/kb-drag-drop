import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragGroup, initListener, disposeListener } from 'core';

export class DragGroupDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding) {
    const value = binding.value || {};

    el.__instance__ = new DragGroup(el);
    el.__instance__.data = value.data;
    if (value.groupName != null && value.groupName !== '') {
      el.__instance__.name = value.groupName;
    }
  }
  inserted(el: DragHTMLElement<DragGroup>) {
    const instance = el.__instance__;
    instance.collect();
    initListener(instance);
  }
  unbind(el: DragHTMLElement<DragGroup>) {
    disposeListener(el.__instance__);
  }
}
