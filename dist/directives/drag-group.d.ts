import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragGroup } from '../core/drag-group';
import { DragHTMLElement } from '../core/index';
export declare class DragGroupDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    inserted(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    unbind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
}
