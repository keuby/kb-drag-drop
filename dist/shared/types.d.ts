export interface DragHTMLElement<T> extends HTMLElement {
    instance: T;
}
export declare type EventListenType = 'dragstart' | 'dragmove' | 'dragend' | 'dragcancel' | 'click';
export declare type EventComputeType = 'dragenter' | 'dragleave';
export declare type EventType = EventListenType | EventComputeType;
export declare type EventOriginType = 'panstart' | 'panmove' | 'panend' | 'pancancel' | 'tap';
export declare type OriginRecord = {
    [type in EventOriginType]: string;
};
export declare type ComputeRecord = {
    [type in EventComputeType]: string;
};
export interface Disposable {
    dispose(): void;
}
