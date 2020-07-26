import { DragList } from './drag-list';
import { Vue } from 'vue/types/vue';
import { DragCollection, DragHTMLElement } from './shared';
export declare class DragGroup extends DragCollection<DragList> {
    constructor(el: DragHTMLElement<DragGroup>, data: any, vm: Vue);
    collect(): void;
    destory(): void;
}
