import { InjectionToken, Provider } from '@angular/core';
export declare function defaultOptionsFactory(): Options;
export declare function multiYearOptionsFactory(options: Options): {
    yearsPerRow: number;
    yearRows: number;
};
export interface Options {
    multiYear: {
        yearsPerRow: number;
        yearRows: number;
    };
}
export declare class DefaultOptions {
    static create(): Options;
}
export declare abstract class OptionsTokens {
    static all: InjectionToken<Options>;
    static multiYear: InjectionToken<{
        yearsPerRow: number;
        yearRows: number;
    }>;
}
export declare const optionsProviders: Provider[];
