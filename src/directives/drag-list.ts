import { DirectiveOptions } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement, EventDetail } from 'shared/types';
import { DragList, DragGroup, initListener, disposeListener } from 'core';

export class DragListDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragList>, binding: DirectiveBinding) {
    const options = binding.value || {};
    const instance = new DragList(el);
    instance.data = options.data;
    instance.selectable = Boolean(options.selectable);
    instance.groupName = options.group;
    el.instance = instance;
  }
  inserted(el: DragHTMLElement<DragList>) {
    const instance = el.instance;
    instance.collect();
    instance.noticeDirty(DragGroup);
    initListener(instance, (type: string, detail: EventDetail) => {
      const event = new CustomEvent(type, { detail });
      el.dispatchEvent(event);
    });
  }
  unbind(el: DragHTMLElement<DragList>) {
    disposeListener(el.instance);
  }
}
