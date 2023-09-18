import { Directive, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { JoyrideStep } from '../models/joyride-step.class';
import { JoyrideError } from '../models/joyride-error.class';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../services/joyride-steps-container.service";
import * as i2 from "../services/dom.service";
import * as i3 from "@angular/router";
import * as i4 from "../services/templates.service";
export const NO_POSITION = 'NO_POSITION';
export class JoyrideDirective {
    constructor(joyrideStepsContainer, viewContainerRef, domService, router, templateService, platformId) {
        this.joyrideStepsContainer = joyrideStepsContainer;
        this.viewContainerRef = viewContainerRef;
        this.domService = domService;
        this.router = router;
        this.templateService = templateService;
        this.platformId = platformId;
        this.stepPosition = NO_POSITION;
        this.prev = new EventEmitter();
        this.next = new EventEmitter();
        this.done = new EventEmitter();
        this.subscriptions = [];
        this.windowRef = this.domService.getNativeWindow();
        this.step = new JoyrideStep();
    }
    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId))
            return;
        if (this.prevTemplate)
            this.templateService.setPrevButton(this.prevTemplate);
        if (this.nextTemplate)
            this.templateService.setNextButton(this.nextTemplate);
        if (this.doneTemplate)
            this.templateService.setDoneButton(this.doneTemplate);
        if (this.counterTemplate)
            this.templateService.setCounter(this.counterTemplate);
        this.step.position = this.stepPosition;
        this.step.targetViewContainer = this.viewContainerRef;
        this.setAsyncFields(this.step);
        this.step.stepContent = this.stepContent;
        this.step.stepContentParams = this.stepContentParams;
        this.step.nextClicked = this.next;
        this.step.prevCliked = this.prev;
        this.step.tourDone = this.done;
        if (!this.name)
            throw new JoyrideError("All the steps should have the 'joyrideStep' property set with a custom name.");
        this.step.name = this.name;
        this.step.route = this.router.url.substr(0, 1) === '/' ? this.router.url.substr(1) : this.router.url;
        this.step.transformCssStyle = this.windowRef.getComputedStyle(this.viewContainerRef.element.nativeElement).transform;
        this.step.isElementOrAncestorFixed =
            this.isElementFixed(this.viewContainerRef.element) ||
                this.isAncestorsFixed(this.viewContainerRef.element.nativeElement.parentElement);
        this.joyrideStepsContainer.addStep(this.step);
    }
    ngOnChanges(changes) {
        if (changes['title'] || changes['text']) {
            this.setAsyncFields(this.step);
        }
    }
    isElementFixed(element) {
        return this.windowRef.getComputedStyle(element.nativeElement).position === 'fixed';
    }
    setAsyncFields(step) {
        if (this.title instanceof Observable) {
            this.subscriptions.push(this.title.subscribe(title => {
                step.title.next(title);
            }));
        }
        else {
            step.title.next(this.title);
        }
        if (this.text instanceof Observable) {
            this.subscriptions.push(this.text.subscribe(text => {
                step.text.next(text);
            }));
        }
        else {
            step.text.next(this.text);
        }
    }
    isAncestorsFixed(nativeElement) {
        if (!nativeElement || !nativeElement.parentElement)
            return false;
        let isElementFixed = this.windowRef.getComputedStyle(nativeElement.parentElement).position === 'fixed';
        if (nativeElement.nodeName === 'BODY') {
            return isElementFixed;
        }
        if (isElementFixed)
            return true;
        else
            return this.isAncestorsFixed(nativeElement.parentElement);
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
}
JoyrideDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideDirective, deps: [{ token: i1.JoyrideStepsContainerService }, { token: i0.ViewContainerRef }, { token: i2.DomRefService }, { token: i3.Router }, { token: i4.TemplatesService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive });
JoyrideDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.1", type: JoyrideDirective, selector: "joyrideStep, [joyrideStep]", inputs: { name: ["joyrideStep", "name"], nextStep: "nextStep", title: "title", text: "text", stepPosition: "stepPosition", stepContent: "stepContent", stepContentParams: "stepContentParams", prevTemplate: "prevTemplate", nextTemplate: "nextTemplate", doneTemplate: "doneTemplate", counterTemplate: "counterTemplate" }, outputs: { prev: "prev", next: "next", done: "done" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: JoyrideDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'joyrideStep, [joyrideStep]'
                }]
        }], ctorParameters: function () { return [{ type: i1.JoyrideStepsContainerService }, { type: i0.ViewContainerRef }, { type: i2.DomRefService }, { type: i3.Router }, { type: i4.TemplatesService }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { name: [{
                type: Input,
                args: ['joyrideStep']
            }], nextStep: [{
                type: Input
            }], title: [{
                type: Input
            }], text: [{
                type: Input
            }], stepPosition: [{
                type: Input
            }], stepContent: [{
                type: Input
            }], stepContentParams: [{
                type: Input
            }], prevTemplate: [{
                type: Input
            }], nextTemplate: [{
                type: Input
            }], doneTemplate: [{
                type: Input
            }], counterTemplate: [{
                type: Input
            }], prev: [{
                type: Output
            }], next: [{
                type: Output
            }], done: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam95cmlkZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtam95cmlkZS9zcmMvbGliL2RpcmVjdGl2ZXMvam95cmlkZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFHVCxLQUFLLEVBR0wsTUFBTSxFQUNOLFlBQVksRUFDWixNQUFNLEVBQ04sV0FBVyxFQUlkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUUzRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHN0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFcEQsT0FBTyxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7Ozs7OztBQUVoRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDO0FBS3pDLE1BQU0sT0FBTyxnQkFBZ0I7SUErQ3pCLFlBQ3FCLHFCQUFtRCxFQUM1RCxnQkFBa0MsRUFDekIsVUFBeUIsRUFDekIsTUFBYyxFQUNkLGVBQWlDLEVBQ3JCLFVBQWtCO1FBTDlCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBOEI7UUFDNUQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUN6QixlQUFVLEdBQVYsVUFBVSxDQUFlO1FBQ3pCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFDckIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQXZDbkQsaUJBQVksR0FBWSxXQUFXLENBQUM7UUFxQnBDLFNBQUksR0FBdUIsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUduRCxTQUFJLEdBQXVCLElBQUksWUFBWSxFQUFPLENBQUM7UUFHbkQsU0FBSSxHQUF1QixJQUFJLFlBQVksRUFBTyxDQUFDO1FBSTNDLGtC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LENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7UUFDdkcsSUFBSSxhQUFhLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBRTtZQUNuQyxPQUFPLGNBQWMsQ0FBQztTQUN6QjtRQUNELElBQUksY0FBYztZQUFFLE9BQU8sSUFBSSxDQUFDOztZQUMzQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs2R0FqSVEsZ0JBQWdCLGlMQXFEYixXQUFXO2lHQXJEZCxnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFINUIsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsNEJBQTRCO2lCQUN6QztvTkFzRGdELE1BQU07MEJBQTlDLE1BQU07MkJBQUMsV0FBVzs0Q0FuRHZCLElBQUk7c0JBREgsS0FBSzt1QkFBQyxhQUFhO2dCQUlwQixRQUFRO3NCQURQLEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixZQUFZO3NCQURYLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixZQUFZO3NCQURYLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUlOLFlBQVk7c0JBRFgsS0FBSztnQkFJTixlQUFlO3NCQURkLEtBQUs7Z0JBSU4sSUFBSTtzQkFESCxNQUFNO2dCQUlQLElBQUk7c0JBREgsTUFBTTtnQkFJUCxJQUFJO3NCQURILE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIERpcmVjdGl2ZSxcbiAgICBFbGVtZW50UmVmLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgSW5wdXQsXG4gICAgVmlld0NvbnRhaW5lclJlZixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBQTEFURk9STV9JRCxcbiAgICBPbkNoYW5nZXMsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3lcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKb3lyaWRlU3RlcCB9IGZyb20gJy4uL21vZGVscy9qb3lyaWRlLXN0ZXAuY2xhc3MnO1xuaW1wb3J0IHsgSm95cmlkZVN0ZXBzQ29udGFpbmVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2pveXJpZGUtc3RlcHMtY29udGFpbmVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSm95cmlkZUVycm9yIH0gZnJvbSAnLi4vbW9kZWxzL2pveXJpZGUtZXJyb3IuY2xhc3MnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IERvbVJlZlNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kb20uc2VydmljZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBUZW1wbGF0ZXNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdGVtcGxhdGVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBjb25zdCBOT19QT1NJVElPTiA9ICdOT19QT1NJVElPTic7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnam95cmlkZVN0ZXAsIFtqb3lyaWRlU3RlcF0nXG59KVxuZXhwb3J0IGNsYXNzIEpveXJpZGVEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCdqb3lyaWRlU3RlcCcpXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBuZXh0U3RlcD86IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgdGl0bGU/OiBzdHJpbmcgfCBPYnNlcnZhYmxlPHN0cmluZz47XG5cbiAgICBASW5wdXQoKVxuICAgIHRleHQ/OiBzdHJpbmcgfCBPYnNlcnZhYmxlPHN0cmluZz47XG5cbiAgICBASW5wdXQoKVxuICAgIHN0ZXBQb3NpdGlvbj86IHN0cmluZyA9IE5PX1BPU0lUSU9OO1xuXG4gICAgQElucHV0KClcbiAgICBzdGVwQ29udGVudD86IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBASW5wdXQoKVxuICAgIHN0ZXBDb250ZW50UGFyYW1zPzogT2JqZWN0O1xuXG4gICAgQElucHV0KClcbiAgICBwcmV2VGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBuZXh0VGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBkb25lVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBjb3VudGVyVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQE91dHB1dCgpXG4gICAgcHJldj86IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBuZXh0PzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIGRvbmU/OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgcHJpdmF0ZSB3aW5kb3dSZWY6IFdpbmRvdztcbiAgICBwcml2YXRlIHN0ZXA6IEpveXJpZGVTdGVwO1xuICAgIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGpveXJpZGVTdGVwc0NvbnRhaW5lcjogSm95cmlkZVN0ZXBzQ29udGFpbmVyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGRvbVNlcnZpY2U6IERvbVJlZlNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGVTZXJ2aWNlOiBUZW1wbGF0ZXNTZXJ2aWNlLFxuICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdFxuICAgICkge1xuICAgICAgICB0aGlzLndpbmRvd1JlZiA9IHRoaXMuZG9tU2VydmljZS5nZXROYXRpdmVXaW5kb3coKTtcbiAgICAgICAgdGhpcy5zdGVwID0gbmV3IEpveXJpZGVTdGVwKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMucHJldlRlbXBsYXRlKSB0aGlzLnRlbXBsYXRlU2VydmljZS5zZXRQcmV2QnV0dG9uKHRoaXMucHJldlRlbXBsYXRlKTtcbiAgICAgICAgaWYgKHRoaXMubmV4dFRlbXBsYXRlKSB0aGlzLnRlbXBsYXRlU2VydmljZS5zZXROZXh0QnV0dG9uKHRoaXMubmV4dFRlbXBsYXRlKTtcbiAgICAgICAgaWYgKHRoaXMuZG9uZVRlbXBsYXRlKSB0aGlzLnRlbXBsYXRlU2VydmljZS5zZXREb25lQnV0dG9uKHRoaXMuZG9uZVRlbXBsYXRlKTtcbiAgICAgICAgaWYgKHRoaXMuY291bnRlclRlbXBsYXRlKSB0aGlzLnRlbXBsYXRlU2VydmljZS5zZXRDb3VudGVyKHRoaXMuY291bnRlclRlbXBsYXRlKTtcbiAgICAgICAgdGhpcy5zdGVwLnBvc2l0aW9uID0gdGhpcy5zdGVwUG9zaXRpb247XG4gICAgICAgIHRoaXMuc3RlcC50YXJnZXRWaWV3Q29udGFpbmVyID0gdGhpcy52aWV3Q29udGFpbmVyUmVmO1xuICAgICAgICB0aGlzLnNldEFzeW5jRmllbGRzKHRoaXMuc3RlcCk7XG4gICAgICAgIHRoaXMuc3RlcC5zdGVwQ29udGVudCA9IHRoaXMuc3RlcENvbnRlbnQ7XG4gICAgICAgIHRoaXMuc3RlcC5zdGVwQ29udGVudFBhcmFtcyA9IHRoaXMuc3RlcENvbnRlbnRQYXJhbXM7XG4gICAgICAgIHRoaXMuc3RlcC5uZXh0Q2xpY2tlZCA9IHRoaXMubmV4dDtcbiAgICAgICAgdGhpcy5zdGVwLnByZXZDbGlrZWQgPSB0aGlzLnByZXY7XG4gICAgICAgIHRoaXMuc3RlcC50b3VyRG9uZSA9IHRoaXMuZG9uZTtcbiAgICAgICAgaWYgKCF0aGlzLm5hbWUpIHRocm93IG5ldyBKb3lyaWRlRXJyb3IoXCJBbGwgdGhlIHN0ZXBzIHNob3VsZCBoYXZlIHRoZSAnam95cmlkZVN0ZXAnIHByb3BlcnR5IHNldCB3aXRoIGEgY3VzdG9tIG5hbWUuXCIpO1xuICAgICAgICB0aGlzLnN0ZXAubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5zdGVwLnJvdXRlID0gdGhpcy5yb3V0ZXIudXJsLnN1YnN0cigwLCAxKSA9PT0gJy8nID8gdGhpcy5yb3V0ZXIudXJsLnN1YnN0cigxKSA6IHRoaXMucm91dGVyLnVybDtcbiAgICAgICAgdGhpcy5zdGVwLnRyYW5zZm9ybUNzc1N0eWxlID0gdGhpcy53aW5kb3dSZWYuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudC5uYXRpdmVFbGVtZW50KS50cmFuc2Zvcm07XG4gICAgICAgIHRoaXMuc3RlcC5pc0VsZW1lbnRPckFuY2VzdG9yRml4ZWQgPVxuICAgICAgICAgICAgdGhpcy5pc0VsZW1lbnRGaXhlZCh0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudCkgfHxcbiAgICAgICAgICAgIHRoaXMuaXNBbmNlc3RvcnNGaXhlZCh0aGlzLnZpZXdDb250YWluZXJSZWYuZWxlbWVudC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuam95cmlkZVN0ZXBzQ29udGFpbmVyLmFkZFN0ZXAodGhpcy5zdGVwKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzWyd0aXRsZSddIHx8IGNoYW5nZXNbJ3RleHQnXSkge1xuICAgICAgICAgICAgdGhpcy5zZXRBc3luY0ZpZWxkcyh0aGlzLnN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0VsZW1lbnRGaXhlZChlbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpbmRvd1JlZi5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQubmF0aXZlRWxlbWVudCkucG9zaXRpb24gPT09ICdmaXhlZCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRBc3luY0ZpZWxkcyhzdGVwOiBKb3lyaWRlU3RlcCkge1xuICAgICAgICBpZiAodGhpcy50aXRsZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUuc3Vic2NyaWJlKHRpdGxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcC50aXRsZS5uZXh0KHRpdGxlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ZXAudGl0bGUubmV4dCh0aGlzLnRpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50ZXh0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0LnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcC50ZXh0Lm5leHQodGV4dCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGVwLnRleHQubmV4dCh0aGlzLnRleHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0FuY2VzdG9yc0ZpeGVkKG5hdGl2ZUVsZW1lbnQ6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIW5hdGl2ZUVsZW1lbnQgfHwgIW5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgaXNFbGVtZW50Rml4ZWQgPSB0aGlzLndpbmRvd1JlZi5nZXRDb21wdXRlZFN0eWxlKG5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCkucG9zaXRpb24gPT09ICdmaXhlZCc7XG4gICAgICAgIGlmIChuYXRpdmVFbGVtZW50Lm5vZGVOYW1lID09PSAnQk9EWScpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0VsZW1lbnRGaXhlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNFbGVtZW50Rml4ZWQpIHJldHVybiB0cnVlO1xuICAgICAgICBlbHNlIHJldHVybiB0aGlzLmlzQW5jZXN0b3JzRml4ZWQobmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHtcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=