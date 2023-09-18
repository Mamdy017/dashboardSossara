import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as i0 from "@angular/core";
export declare class EmojiFrequentlyService {
    private platformId;
    NAMESPACE: string;
    frequently: {
        [key: string]: number;
    } | null;
    defaults: {
        [key: string]: number;
    };
    initialized: boolean;
    DEFAULTS: string[];
    constructor(platformId: string);
    init(): void;
    add(emoji: EmojiData): void;
    get(perLine: number, totalLines: number): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<EmojiFrequentlyService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmojiFrequentlyService>;
}
