import * as i0 from "@angular/core";
export declare class DomRefService {
    private platformId;
    private fakeDocument;
    private fakeWindow;
    constructor(platformId: Object);
    getNativeWindow(): Window;
    getNativeDocument(): Document;
    static ɵfac: i0.ɵɵFactoryDeclaration<DomRefService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DomRefService>;
}
