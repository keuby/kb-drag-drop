import { DirectiveOptions } from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DragHTMLElement } from 'shared/types';
import { DragGroup } from 'core';
export declare class DragGroupDirective implements DirectiveOptions {
    bind(el: DragHTMLElement<DragGroup>, binding: DirectiveBinding): void;
    inserted(el: DragHTMLElement<DragGroup>): void;
    unbind(el: DragHTMLElement<DragGroup>): void;
}
