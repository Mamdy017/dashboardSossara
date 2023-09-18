import { Observable } from 'rxjs';
export declare class JoyrideOptions {
    steps: string[];
    startWith?: string;
    waitingTime?: number;
    stepDefaultPosition?: string;
    themeColor?: string;
    showCounter?: boolean;
    showPrevButton?: boolean;
    customTexts?: CustomTexts;
    logsEnabled?: boolean;
}
export declare class ICustomTexts {
    prev?: any;
    next?: any;
    done?: any;
    close?: any;
}
export declare class CustomTexts implements ICustomTexts {
    prev?: string | Observable<string>;
    next?: string | Observable<string>;
    done?: string | Observable<string>;
    close?: string | Observable<string>;
}
