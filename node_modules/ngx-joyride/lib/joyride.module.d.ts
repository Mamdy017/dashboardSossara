import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./directives/joyride.directive";
import * as i2 from "./components/step/joyride-step.component";
import * as i3 from "./components/arrow/arrow.component";
import * as i4 from "./components/button/button.component";
import * as i5 from "./components/close-button/close-button.component";
import * as i6 from "@angular/common";
import * as i7 from "@angular/router";
export declare const routerModuleForChild: ModuleWithProviders<any>;
export declare class JoyrideModule {
    static forRoot(): ModuleWithProviders<JoyrideModule>;
    static forChild(): ModuleWithProviders<JoyrideModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JoyrideModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<JoyrideModule, [typeof i1.JoyrideDirective, typeof i2.JoyrideStepComponent, typeof i3.JoyrideArrowComponent, typeof i4.JoyrideButtonComponent, typeof i5.JoyrideCloseButtonComponent], [typeof i6.CommonModule, typeof i7.RouterModule], [typeof i1.JoyrideDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<JoyrideModule>;
}
