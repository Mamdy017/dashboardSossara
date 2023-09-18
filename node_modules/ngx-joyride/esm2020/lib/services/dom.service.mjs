import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
export class DomRefService {
    constructor(platformId) {
        this.platformId = platformId;
        this.fakeDocument = { body: {}, documentElement: {} };
        this.fakeWindow = { document: this.fakeDocument, navigator: {} };
    }
    getNativeWindow() {
        if (isPlatformBrowser(this.platformId))
            return window;
        else
            return this.fakeWindow;
    }
    getNativeDocument() {
        if (isPlatformBrowser(this.platformId))
            return document;
        else
            return this.fakeDocument;
    }
}
DomRefService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: DomRefService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
DomRefService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: DomRefService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: DomRefService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtam95cmlkZS9zcmMvbGliL3NlcnZpY2VzL2RvbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFHcEQsTUFBTSxPQUFPLGFBQWE7SUFHdEIsWUFBeUMsVUFBa0I7UUFBbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUZuRCxpQkFBWSxHQUF1QixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3JFLGVBQVUsR0FBbUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUMvRCxlQUFlO1FBQ1gsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTyxNQUFNLENBQUM7O1lBQ2pELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTyxRQUFRLENBQUM7O1lBQ25ELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUNsQyxDQUFDOzswR0FaUSxhQUFhLGtCQUdGLFdBQVc7OEdBSHRCLGFBQWE7MkZBQWIsYUFBYTtrQkFEekIsVUFBVTswREFJOEMsTUFBTTswQkFBOUMsTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRG9tUmVmU2VydmljZSB7XG4gICAgcHJpdmF0ZSBmYWtlRG9jdW1lbnQ6IERvY3VtZW50ID0gPERvY3VtZW50PnsgYm9keToge30sIGRvY3VtZW50RWxlbWVudDoge30gfTtcbiAgICBwcml2YXRlIGZha2VXaW5kb3c6IFdpbmRvdyA9IDxXaW5kb3c+eyBkb2N1bWVudDogdGhpcy5mYWtlRG9jdW1lbnQsIG5hdmlnYXRvcjoge30gfTtcbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdCkge31cbiAgICBnZXROYXRpdmVXaW5kb3coKTogV2luZG93IHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHJldHVybiB3aW5kb3c7XG4gICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZmFrZVdpbmRvdztcbiAgICB9XG5cbiAgICBnZXROYXRpdmVEb2N1bWVudCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHJldHVybiBkb2N1bWVudDtcbiAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5mYWtlRG9jdW1lbnQ7XG4gICAgfVxufSJdfQ==