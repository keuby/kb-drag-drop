import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragItem, DragHTMLElement } from '../core/index';
export declare class DragItemDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    inserted(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    unbind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
}
