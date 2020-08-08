import { EventType } from 'shared/types';
export declare function mixinManagerInterface(constructor: any): void;
export declare function addListener(constructor: any, event: EventType, handler: string): void;
export declare function initListener(instance: any, listener?: Function): void;
export declare function disposeListener(instance: any): void;
