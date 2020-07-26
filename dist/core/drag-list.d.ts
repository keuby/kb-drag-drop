import { Vue } from 'vue/types/vue';
import { DragItem } from './drag-item';
import { DragCollection, DragHTMLElement } from './shared';
export declare class DragList extends DragCollection<DragItem> {
    private subscriptions;
    constructor(el: DragHTMLElement<DragList>, vm: Vue, data: any);
    collect(): void;
    init(): void;
    destory(): void;
}
