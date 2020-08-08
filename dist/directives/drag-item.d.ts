import { DirectiveOptions } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragItem } from 'core';
export declare class DragItemDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragItem>, binding: DirectiveBinding): void;
    inserted(el: DragHTMLElement<DragItem>): void;
    unbind(el: DragHTMLElement<DragItem>): void;
}
