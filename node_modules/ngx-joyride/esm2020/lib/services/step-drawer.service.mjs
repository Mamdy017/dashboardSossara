import { Injectable } from '@angular/core';
import { JoyrideStepComponent } from '../components';
import * as i0 from "@angular/core";
export class StepDrawerService {
    constructor(componentFactoryResolver, appRef, injector) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.injector = injector;
        this.refMap = {};
    }
    draw(step) {
        // 1. Create a component reference from the component
        const ref = this.componentFactoryResolver
            .resolveComponentFactory(JoyrideStepComponent)
            .create(this.injector);
        // 2. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(ref.hostView);
        // 3. Get DOM element from component
        const domElem = ref.hostView
            .rootNodes[0];
        // 4. Append DOM element to the body
        document.body.appendChild(domElem);
        const instance = ref.instance;
        instance.step = step;
        ref.changeDetectorRef.detectChanges();
        step.stepInstance = instance;
        this.refMap[step.name] = ref;
    }
    remove(step) {
        this.appRef.detachView(this.refMap[step.name].hostView);
        this.refMap[step.name].destroy();
    }
}
StepDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: StepDrawerService, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ApplicationRef }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
StepDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: StepDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: StepDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ApplicationRef }, { type: i0.Injector }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1qb3lyaWRlL3NyYy9saWIvc2VydmljZXMvc3RlcC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsVUFBVSxFQU1iLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJckQsTUFBTSxPQUFPLGlCQUFpQjtJQUcxQixZQUNxQix3QkFBa0QsRUFDM0QsTUFBc0IsRUFDdEIsUUFBa0I7UUFGVCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQzNELFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFMdEIsV0FBTSxHQUEwRCxFQUFFLENBQUM7SUFNeEUsQ0FBQztJQUVKLElBQUksQ0FBQyxJQUFpQjtRQUNsQixxREFBcUQ7UUFDckQsTUFBTSxHQUFHLEdBQXVDLElBQUksQ0FBQyx3QkFBd0I7YUFDeEUsdUJBQXVCLENBQUMsb0JBQW9CLENBQUM7YUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQiw4RUFBOEU7UUFDOUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJDLG9DQUFvQztRQUNwQyxNQUFNLE9BQU8sR0FBSSxHQUFHLENBQUMsUUFBaUM7YUFDakQsU0FBUyxDQUFDLENBQUMsQ0FBZ0IsQ0FBQztRQUVqQyxvQ0FBb0M7UUFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsTUFBTSxRQUFRLEdBQXlCLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDcEQsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1FBRTdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNqQyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQWlCO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JDLENBQUM7OzhHQXBDUSxpQkFBaUI7a0hBQWpCLGlCQUFpQjsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBJbmplY3RhYmxlLFxuICAgIENvbXBvbmVudFJlZixcbiAgICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQXBwbGljYXRpb25SZWYsXG4gICAgSW5qZWN0b3IsXG4gICAgRW1iZWRkZWRWaWV3UmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSm95cmlkZVN0ZXBDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzJztcbmltcG9ydCB7IEpveXJpZGVTdGVwIH0gZnJvbSAnLi4vbW9kZWxzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0ZXBEcmF3ZXJTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHJlZk1hcDogeyBba2V5OiBzdHJpbmddOiBDb21wb25lbnRSZWY8Sm95cmlkZVN0ZXBDb21wb25lbnQ+IH0gPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgICBwcml2YXRlIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yXG4gICAgKSB7fVxuXG4gICAgZHJhdyhzdGVwOiBKb3lyaWRlU3RlcCkge1xuICAgICAgICAvLyAxLiBDcmVhdGUgYSBjb21wb25lbnQgcmVmZXJlbmNlIGZyb20gdGhlIGNvbXBvbmVudFxuICAgICAgICBjb25zdCByZWY6IENvbXBvbmVudFJlZjxKb3lyaWRlU3RlcENvbXBvbmVudD4gPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxuICAgICAgICAgICAgLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KEpveXJpZGVTdGVwQ29tcG9uZW50KVxuICAgICAgICAgICAgLmNyZWF0ZSh0aGlzLmluamVjdG9yKTtcblxuICAgICAgICAvLyAyLiBBdHRhY2ggY29tcG9uZW50IHRvIHRoZSBhcHBSZWYgc28gdGhhdCBpdCdzIGluc2lkZSB0aGUgbmcgY29tcG9uZW50IHRyZWVcbiAgICAgICAgdGhpcy5hcHBSZWYuYXR0YWNoVmlldyhyZWYuaG9zdFZpZXcpO1xuXG4gICAgICAgIC8vIDMuIEdldCBET00gZWxlbWVudCBmcm9tIGNvbXBvbmVudFxuICAgICAgICBjb25zdCBkb21FbGVtID0gKHJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55PilcbiAgICAgICAgICAgIC5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgLy8gNC4gQXBwZW5kIERPTSBlbGVtZW50IHRvIHRoZSBib2R5XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9tRWxlbSk7XG5cbiAgICAgICAgY29uc3QgaW5zdGFuY2U6IEpveXJpZGVTdGVwQ29tcG9uZW50ID0gcmVmLmluc3RhbmNlO1xuICAgICAgICBpbnN0YW5jZS5zdGVwID0gc3RlcDtcbiAgICAgICAgcmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgc3RlcC5zdGVwSW5zdGFuY2UgPSBpbnN0YW5jZTtcblxuICAgICAgICB0aGlzLnJlZk1hcFtzdGVwLm5hbWVdID0gcmVmO1xuICAgIH1cblxuICAgIHJlbW92ZShzdGVwOiBKb3lyaWRlU3RlcCkge1xuICAgICAgICB0aGlzLmFwcFJlZi5kZXRhY2hWaWV3KHRoaXMucmVmTWFwW3N0ZXAubmFtZV0uaG9zdFZpZXcpO1xuICAgICAgICB0aGlzLnJlZk1hcFtzdGVwLm5hbWVdLmRlc3Ryb3koKTtcbiAgICB9XG59XG4iXX0=