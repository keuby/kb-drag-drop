import { DragList } from './drag-list';
import { DragCollection } from '../drag-element';
export declare class DragGroup extends DragCollection<DragList> {
    name: string;
    collect(): void;
    protected initItems(): void;
    destory(): void;
}
