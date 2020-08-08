import { DirectiveOptions } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement, EventDetail } from 'shared/types';
import { DragItem, DragList, initListener, disposeListener } from 'core';

export class DragItemDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding) {
    const options = binding.value || {};
    el.instance = new DragItem(el);
    el.instance.data = options.data;
  }
  inserted(el: DragHTMLElement<DragItem>) {
    const instance = el.instance;
    instance.noticeDirty(DragList);
    initListener(instance, (type: string, detail: EventDetail) => {
      const event = new CustomEvent(type, { detail });
      el.dispatchEvent(event);
    });
  }
  unbind(el: DragHTMLElement<DragItem>) {
    disposeListener(el.instance);
  }
}
