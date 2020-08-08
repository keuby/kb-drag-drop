export interface DragHTMLElement<T> extends HTMLElement {
    instance: T;
}
export declare type EventComputeType = 'dragenter' | 'dragleave' | 'dragover' | 'drop' | 'select';
export declare type EventOriginType = 'panstart' | 'panmove' | 'panend' | 'pancancel' | 'tap';
export declare type EventListenType = 'dragstart' | 'dragmove' | 'dragend' | 'dragcancel' | 'click';
export declare type EventType = EventListenType | EventComputeType;
export declare type OriginRecord = {
    [type in EventOriginType]: string;
};
export declare type ComputeRecord = {
    [type in EventComputeType]: string;
};
export declare type EventListenRecord = {
    [type in EventType]: Function;
};
export interface Disposable {
    dispose(): void;
}
export interface DropDetail {
    from: any;
    data: any | any[];
    to: any;
}
export interface DragDetail {
    from: any;
    data: any | any[];
    current?: any;
}
export interface SelectDetail {
    selected: boolean;
}
export interface MultipleSelectDetail {
    selectedItems: any[];
}
export declare type EventDetail = DropDetail | DragDetail | SelectDetail | MultipleSelectDetail;
