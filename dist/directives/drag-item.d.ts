import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragItem } from 'core';
export declare class DragItemDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    inserted(el: DragHTMLElement<DragItem>, binding: DirectiveBinding, vnode: VNode, oldVnode: VNode): void;
    unbind(el: DragHTMLElement<DragItem>): void;
}
