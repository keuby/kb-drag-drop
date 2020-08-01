import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragGroup } from '../core/elements/drag-group';

export class DragGroupDirective implements DirectiveOptions {
  bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance = new DragGroup(el, vnode.context, binding.value);
  }
  inserted(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    const instance = el.instance;
    instance.collect();
  }
  unbind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode) {
    el.instance.destory();
    el.instance = null;
  }
}
