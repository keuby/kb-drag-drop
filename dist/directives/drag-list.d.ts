import { DirectiveOptions } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragList } from 'core';
export declare class DragListDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragList>, binding: DirectiveBinding): void;
    inserted(el: DragHTMLElement<DragList>): void;
    unbind(el: DragHTMLElement<DragList>): void;
}
