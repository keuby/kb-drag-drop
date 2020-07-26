import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement, DragList } from '../core';
export declare class DragListDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    inserted(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    unbind(el: DragHTMLElement<DragList>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
}
