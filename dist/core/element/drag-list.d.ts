import { DragItem } from './drag-item';
import { DragCollection } from 'core/drag-element';
import { DragHTMLElement } from 'shared/types';
import { DragGroup } from './drag-group';
export declare class DragList extends DragCollection<DragItem> {
    groupName: string;
    private dragListGroup;
    constructor(el: DragHTMLElement<DragList>);
    get group(): string;
    setGroupInstance(ins: DragGroup): void;
    collect(): void;
    protected initItems(): void;
}