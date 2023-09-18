import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { JoyrideStepInfo } from '../models/joyride-step-info.class';
import { isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./joyride-step.service";
import * as i2 from "./joyride-options.service";
export class JoyrideService {
    constructor(platformId, stepService, optionsService) {
        this.platformId = platformId;
        this.stepService = stepService;
        this.optionsService = optionsService;
        this.tourInProgress = false;
    }
    startTour(options) {
        if (!isPlatformBrowser(this.platformId)) {
            return of(new JoyrideStepInfo());
        }
        if (!this.tourInProgress) {
            this.tourInProgress = true;
            if (options) {
                this.optionsService.setOptions(options);
            }
            this.tour$ = this.stepService.startTour().pipe(finalize(() => (this.tourInProgress = false)));
            this.tour$.subscribe();
        }
        return this.tour$;
    }
    closeTour() {
        if (this.isTourInProgress())
            this.stepService.close();
    }
    isTourInProgress() {
        return this.tourInProgress;
    }
}
JoyrideService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideService, deps: [{ token: PLATFORM_ID }, { token: i1.JoyrideStepService }, { token: i2.JoyrideOptionsService }], target: i0.ɵɵFactoryTarget.Injectable });
JoyrideService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.JoyrideStepService }, { type: i2.JoyrideOptionsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam95cmlkZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWpveXJpZGUvc3JjL2xpYi9zZXJ2aWNlcy9qb3lyaWRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSWhFLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUdwRCxNQUFNLE9BQU8sY0FBYztJQUl2QixZQUNpQyxVQUFrQixFQUM5QixXQUErQixFQUMvQixjQUFxQztRQUZ6QixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFObEQsbUJBQWMsR0FBWSxLQUFLLENBQUM7SUFPckMsQ0FBQztJQUVKLFNBQVMsQ0FBQyxPQUF3QjtRQUM5QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sRUFBRSxDQUFDLElBQUksZUFBZSxFQUFFLENBQUMsQ0FBQztTQUNwQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksT0FBTyxFQUFFO2dCQUNULElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFELENBQUM7SUFFRCxnQkFBZ0I7UUFDWixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQzs7MkdBL0JRLGNBQWMsa0JBS1gsV0FBVzsrR0FMZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFVBQVU7MERBTXNDLE1BQU07MEJBQTlDLE1BQU07MkJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpveXJpZGVTdGVwU2VydmljZSB9IGZyb20gJy4vam95cmlkZS1zdGVwLnNlcnZpY2UnO1xuaW1wb3J0IHsgSm95cmlkZU9wdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi9qb3lyaWRlLW9wdGlvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBKb3lyaWRlT3B0aW9ucyB9IGZyb20gJy4uL21vZGVscy9qb3lyaWRlLW9wdGlvbnMuY2xhc3MnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbmFsaXplIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSm95cmlkZVN0ZXBJbmZvIH0gZnJvbSAnLi4vbW9kZWxzL2pveXJpZGUtc3RlcC1pbmZvLmNsYXNzJztcbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEpveXJpZGVTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHRvdXJJblByb2dyZXNzOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB0b3VyJDogT2JzZXJ2YWJsZTxKb3lyaWRlU3RlcEluZm8+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0ZXBTZXJ2aWNlOiBKb3lyaWRlU3RlcFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uc1NlcnZpY2U6IEpveXJpZGVPcHRpb25zU2VydmljZVxuICAgICkge31cblxuICAgIHN0YXJ0VG91cihvcHRpb25zPzogSm95cmlkZU9wdGlvbnMpOiBPYnNlcnZhYmxlPEpveXJpZGVTdGVwSW5mbz4ge1xuICAgICAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvZihuZXcgSm95cmlkZVN0ZXBJbmZvKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy50b3VySW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgdGhpcy50b3VySW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc1NlcnZpY2Uuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudG91ciQgPSB0aGlzLnN0ZXBTZXJ2aWNlLnN0YXJ0VG91cigpLnBpcGUoZmluYWxpemUoKCkgPT4gKHRoaXMudG91ckluUHJvZ3Jlc3MgPSBmYWxzZSkpKTtcbiAgICAgICAgICAgIHRoaXMudG91ciQuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudG91ciQ7XG4gICAgfVxuXG4gICAgY2xvc2VUb3VyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc1RvdXJJblByb2dyZXNzKCkpIHRoaXMuc3RlcFNlcnZpY2UuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBpc1RvdXJJblByb2dyZXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b3VySW5Qcm9ncmVzcztcbiAgICB9XG59XG4iXX0=