import { RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { DomRefService } from './dom.service';
import * as i0 from "@angular/core";
export declare class Scroll {
    scrollX: number;
    scrollY: number;
}
export declare class EventListenerService {
    private readonly rendererFactory;
    private readonly DOMService;
    private renderer;
    private scrollUnlisten;
    private resizeUnlisten;
    scrollEvent: Subject<Scroll>;
    resizeEvent: Subject<number>;
    constructor(rendererFactory: RendererFactory2, DOMService: DomRefService);
    startListeningScrollEvents(): void;
    startListeningResizeEvents(): void;
    stopListeningScrollEvents(): void;
    stopListeningResizeEvents(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EventListenerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EventListenerService>;
}
