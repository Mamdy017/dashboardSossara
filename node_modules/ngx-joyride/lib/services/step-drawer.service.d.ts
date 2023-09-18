import { ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { JoyrideStep } from '../models';
import * as i0 from "@angular/core";
export declare class StepDrawerService {
    private readonly componentFactoryResolver;
    private appRef;
    private injector;
    private refMap;
    constructor(componentFactoryResolver: ComponentFactoryResolver, appRef: ApplicationRef, injector: Injector);
    draw(step: JoyrideStep): void;
    remove(step: JoyrideStep): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StepDrawerService>;
}
