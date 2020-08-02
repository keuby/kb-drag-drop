import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragGroup } from 'core';
export declare class DragGroupDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    inserted(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    unbind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
}
