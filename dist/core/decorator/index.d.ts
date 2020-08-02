/// <reference types="hammerjs" />
import { EventType } from 'shared/types';
export declare function EventListener<T extends {
    new (...args: any[]): {};
}>(constructor: T): {
    new (...args: any[]): {
        el: HTMLElement;
        __manager__: HammerManager;
        dispose(): void;
    };
    __add__(event: EventType, handler: string): void;
} & T;
export declare function Listen(event: EventType): (listener: any, prop: string, a: any) => void;
