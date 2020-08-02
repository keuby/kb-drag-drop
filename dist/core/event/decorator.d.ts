import { EventType } from 'shared/types';
export declare function EventListener(constructor: any): void;
export declare function Listen(event: EventType): (target: any, prop: string) => void;
export declare function Manager(target: any, prop: string): void;
