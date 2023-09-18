import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TemplatesService {
    private _prevButton;
    private _nextButton;
    private _doneButton;
    private _counter;
    setPrevButton(template: TemplateRef<any>): void;
    getPrevButton(): TemplateRef<any>;
    setNextButton(template: TemplateRef<any>): void;
    getNextButton(): TemplateRef<any>;
    setDoneButton(template: TemplateRef<any>): void;
    getDoneButton(): TemplateRef<any>;
    setCounter(template: TemplateRef<any>): void;
    getCounter(): TemplateRef<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TemplatesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TemplatesService>;
}
