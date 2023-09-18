import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class TemplatesService {
    setPrevButton(template) {
        this._prevButton = template;
    }
    getPrevButton() {
        return this._prevButton;
    }
    setNextButton(template) {
        this._nextButton = template;
    }
    getNextButton() {
        return this._nextButton;
    }
    setDoneButton(template) {
        this._doneButton = template;
    }
    getDoneButton() {
        return this._doneButton;
    }
    setCounter(template) {
        this._counter = template;
    }
    getCounter() {
        return this._counter;
    }
}
TemplatesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: TemplatesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TemplatesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: TemplatesService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: TemplatesService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtam95cmlkZS9zcmMvbGliL3NlcnZpY2VzL3RlbXBsYXRlcy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQWUsTUFBTSxlQUFlLENBQUM7O0FBR3hELE1BQU0sT0FBTyxnQkFBZ0I7SUFNekIsYUFBYSxDQUFDLFFBQTBCO1FBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7SUFFRCxhQUFhLENBQUMsUUFBMEI7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7SUFDaEMsQ0FBQztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELGFBQWEsQ0FBQyxRQUEwQjtRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBRUQsYUFBYTtRQUNULE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM1QixDQUFDO0lBQ0QsVUFBVSxDQUFDLFFBQTBCO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7OzZHQW5DUSxnQkFBZ0I7aUhBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlc1NlcnZpY2Uge1xuICAgIHByaXZhdGUgX3ByZXZCdXR0b246IFRlbXBsYXRlUmVmPGFueT47XG4gICAgcHJpdmF0ZSBfbmV4dEJ1dHRvbjogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBwcml2YXRlIF9kb25lQnV0dG9uOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIHByaXZhdGUgX2NvdW50ZXI6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBzZXRQcmV2QnV0dG9uKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX3ByZXZCdXR0b24gPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBnZXRQcmV2QnV0dG9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJldkJ1dHRvbjtcbiAgICB9XG5cbiAgICBzZXROZXh0QnV0dG9uKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX25leHRCdXR0b24gPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBnZXROZXh0QnV0dG9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmV4dEJ1dHRvbjtcbiAgICB9XG5cbiAgICBzZXREb25lQnV0dG9uKHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gICAgICAgIHRoaXMuX2RvbmVCdXR0b24gPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBnZXREb25lQnV0dG9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZG9uZUJ1dHRvbjtcbiAgICB9XG4gICAgc2V0Q291bnRlcih0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge1xuICAgICAgICB0aGlzLl9jb3VudGVyID0gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgZ2V0Q291bnRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXI7XG4gICAgfVxufVxuIl19