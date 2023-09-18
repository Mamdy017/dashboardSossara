import { JoyrideOptions, ICustomTexts } from '../models/joyride-options.class';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare const DEFAULT_THEME_COLOR = "#3b5560";
export declare const STEP_DEFAULT_POSITION = "bottom";
export declare const DEFAULT_TIMEOUT_BETWEEN_STEPS = 1;
export declare class ObservableCustomTexts implements ICustomTexts {
    prev: Observable<string>;
    next: Observable<string>;
    done: Observable<string>;
    close: Observable<string>;
}
export declare const DEFAULT_TEXTS: ObservableCustomTexts;
export interface IJoyrideOptionsService {
    setOptions(options: JoyrideOptions): void;
    getBackdropColor(): string;
    getThemeColor(): string;
    getStepDefaultPosition(): any;
    getStepsOrder(): string[];
    getFirstStep(): string;
    getWaitingTime(): number;
    areLogsEnabled(): boolean;
    isCounterVisible(): boolean;
    isPrevButtonVisible(): boolean;
    getCustomTexts(): ObservableCustomTexts;
}
export declare class JoyrideOptionsService implements IJoyrideOptionsService {
    private themeColor;
    private stepDefaultPosition;
    private logsEnabled;
    private showCounter;
    private showPrevButton;
    private stepsOrder;
    private firstStep;
    private waitingTime;
    private customTexts;
    setOptions(options: JoyrideOptions): void;
    getBackdropColor(): string;
    getThemeColor(): string;
    getStepDefaultPosition(): string;
    getStepsOrder(): string[];
    getFirstStep(): string;
    getWaitingTime(): number;
    areLogsEnabled(): boolean;
    isCounterVisible(): boolean;
    isPrevButtonVisible(): boolean;
    getCustomTexts(): ObservableCustomTexts;
    private setCustomText;
    private toObservable;
    private hexToRgb;
    static ɵfac: i0.ɵɵFactoryDeclaration<JoyrideOptionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JoyrideOptionsService>;
}
