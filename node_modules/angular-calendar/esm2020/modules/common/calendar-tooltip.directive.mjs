import { Directive, Component, HostListener, Input, Inject, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { positionElements } from 'positioning';
import { of, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class CalendarTooltipWindowComponent {
}
CalendarTooltipWindowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarTooltipWindowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CalendarTooltipWindowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.2", type: CalendarTooltipWindowComponent, selector: "mwl-calendar-tooltip-window", inputs: { contents: "contents", placement: "placement", event: "event", customTemplate: "customTemplate" }, ngImport: i0, template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event"
    >
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }"
    >
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarTooltipWindowComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-tooltip-window',
                    template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event"
    >
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }"
    >
    </ng-template>
  `,
                }]
        }], propDecorators: { contents: [{
                type: Input
            }], placement: [{
                type: Input
            }], event: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }] } });
export class CalendarTooltipDirective {
    constructor(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document // eslint-disable-line
    ) {
        this.elementRef = elementRef;
        this.injector = injector;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.document = document;
        this.placement = 'auto'; // eslint-disable-line  @angular-eslint/no-input-rename
        this.delay = null; // eslint-disable-line  @angular-eslint/no-input-rename
        this.cancelTooltipDelay$ = new Subject();
        this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
    }
    ngOnChanges(changes) {
        if (this.tooltipRef &&
            (changes.contents || changes.customTemplate || changes.event)) {
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            this.tooltipRef.changeDetectorRef.markForCheck();
            if (!this.contents) {
                this.hide();
            }
        }
    }
    ngOnDestroy() {
        this.hide();
    }
    onMouseOver() {
        const delay$ = this.delay === null ? of('now') : timer(this.delay);
        delay$.pipe(takeUntil(this.cancelTooltipDelay$)).subscribe(() => {
            this.show();
        });
    }
    onMouseOut() {
        this.hide();
    }
    show() {
        if (!this.tooltipRef && this.contents) {
            this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            if (this.appendToBody) {
                this.document.body.appendChild(this.tooltipRef.location.nativeElement);
            }
            requestAnimationFrame(() => {
                this.positionTooltip();
            });
        }
    }
    hide() {
        if (this.tooltipRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
            this.tooltipRef = null;
        }
        this.cancelTooltipDelay$.next();
    }
    positionTooltip(previousPositions = []) {
        if (this.tooltipRef) {
            this.tooltipRef.changeDetectorRef.detectChanges();
            this.tooltipRef.instance.placement = positionElements(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
            // keep re-positioning the tooltip until the arrow position doesn't make a difference
            if (previousPositions.indexOf(this.tooltipRef.instance.placement) === -1) {
                this.positionTooltip([
                    ...previousPositions,
                    this.tooltipRef.instance.placement,
                ]);
            }
        }
    }
}
CalendarTooltipDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarTooltipDirective, deps: [{ token: i0.ElementRef }, { token: i0.Injector }, { token: i0.Renderer2 }, { token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
CalendarTooltipDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.1.2", type: CalendarTooltipDirective, selector: "[mwlCalendarTooltip]", inputs: { contents: ["mwlCalendarTooltip", "contents"], placement: ["tooltipPlacement", "placement"], customTemplate: ["tooltipTemplate", "customTemplate"], event: ["tooltipEvent", "event"], appendToBody: ["tooltipAppendToBody", "appendToBody"], delay: ["tooltipDelay", "delay"] }, host: { listeners: { "mouseenter": "onMouseOver()", "mouseleave": "onMouseOut()" } }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarTooltipDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mwlCalendarTooltip]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Injector }, { type: i0.Renderer2 }, { type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { contents: [{
                type: Input,
                args: ['mwlCalendarTooltip']
            }], placement: [{
                type: Input,
                args: ['tooltipPlacement']
            }], customTemplate: [{
                type: Input,
                args: ['tooltipTemplate']
            }], event: [{
                type: Input,
                args: ['tooltipEvent']
            }], appendToBody: [{
                type: Input,
                args: ['tooltipAppendToBody']
            }], delay: [{
                type: Input,
                args: ['tooltipDelay']
            }], onMouseOver: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseOut: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItdG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNhbGVuZGFyL3NyYy9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci10b29sdGlwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEVBRVosS0FBSyxFQU9MLE1BQU0sR0FLUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFrQixnQkFBZ0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUUvRCxPQUFPLEVBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUEyQjNDLE1BQU0sT0FBTyw4QkFBOEI7OzJIQUE5Qiw4QkFBOEI7K0dBQTlCLDhCQUE4QiwrS0F2Qi9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQlQ7MkZBRVUsOEJBQThCO2tCQXpCMUMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCVDtpQkFDRjs4QkFFVSxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLGNBQWM7c0JBQXRCLEtBQUs7O0FBTVIsTUFBTSxPQUFPLHdCQUF3QjtJQWlCbkMsWUFDVSxVQUFzQixFQUN0QixRQUFrQixFQUNsQixRQUFtQixFQUMzQix3QkFBa0QsRUFDMUMsZ0JBQWtDLEVBQ2hCLFFBQVEsQ0FBQyxzQkFBc0I7O1FBTGpELGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsYUFB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QUFDLG9CQUFvQjtnQkFFQSxTQUFTO3NCQUFuQyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFFQyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFFRCxLQUFLO3NCQUEzQixLQUFLO3VCQUFDLGNBQWM7Z0JBRVMsWUFBWTtzQkFBekMsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBRUwsS0FBSztzQkFBM0IsS0FBSzt1QkFBQyxjQUFjO2dCQXdDckIsV0FBVztzQkFEVixZQUFZO3VCQUFDLFlBQVk7Z0JBVTFCLFVBQVU7c0JBRFQsWUFBWTt1QkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBDb21wb25lbnQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgT25EZXN0cm95LFxuICBJbnB1dCxcbiAgQ29tcG9uZW50UmVmLFxuICBJbmplY3RvcixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBFbGVtZW50UmVmLFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBJbmplY3QsXG4gIFJlbmRlcmVyMixcbiAgVGVtcGxhdGVSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSwgcG9zaXRpb25FbGVtZW50cyB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnQgfSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLXRvb2x0aXAtd2luZG93JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGVcbiAgICAgICNkZWZhdWx0VGVtcGxhdGVcbiAgICAgIGxldC1jb250ZW50cz1cImNvbnRlbnRzXCJcbiAgICAgIGxldC1wbGFjZW1lbnQ9XCJwbGFjZW1lbnRcIlxuICAgICAgbGV0LWV2ZW50PVwiZXZlbnRcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYWwtdG9vbHRpcFwiIFtuZ0NsYXNzXT1cIidjYWwtdG9vbHRpcC0nICsgcGxhY2VtZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYWwtdG9vbHRpcC1hcnJvd1wiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLXRvb2x0aXAtaW5uZXJcIiBbaW5uZXJIdG1sXT1cImNvbnRlbnRzXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIGNvbnRlbnRzOiBjb250ZW50cyxcbiAgICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICAgIGV2ZW50OiBldmVudFxuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGNvbnRlbnRzOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgcGxhY2VtZW50OiBzdHJpbmc7XG5cbiAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyRXZlbnQ7XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xDYWxlbmRhclRvb2x0aXBdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJUb29sdGlwRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASW5wdXQoJ213bENhbGVuZGFyVG9vbHRpcCcpIGNvbnRlbnRzOiBzdHJpbmc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgIEBhbmd1bGFyLWVzbGludC9uby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBQbGFjZW1lbnQnKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2F1dG8nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lICBAYW5ndWxhci1lc2xpbnQvbm8taW5wdXQtcmVuYW1lXG5cbiAgQElucHV0KCd0b29sdGlwVGVtcGxhdGUnKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSAgQGFuZ3VsYXItZXNsaW50L25vLWlucHV0LXJlbmFtZVxuXG4gIEBJbnB1dCgndG9vbHRpcEV2ZW50JykgZXZlbnQ6IENhbGVuZGFyRXZlbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgIEBhbmd1bGFyLWVzbGludC9uby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBBcHBlbmRUb0JvZHknKSBhcHBlbmRUb0JvZHk6IGJvb2xlYW47IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgIEBhbmd1bGFyLWVzbGludC9uby1pbnB1dC1yZW5hbWVcblxuICBASW5wdXQoJ3Rvb2x0aXBEZWxheScpIGRlbGF5OiBudW1iZXIgfCBudWxsID0gbnVsbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSAgQGFuZ3VsYXItZXNsaW50L25vLWlucHV0LXJlbmFtZVxuXG4gIHByaXZhdGUgdG9vbHRpcEZhY3Rvcnk6IENvbXBvbmVudEZhY3Rvcnk8Q2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50PjtcbiAgcHJpdmF0ZSB0b29sdGlwUmVmOiBDb21wb25lbnRSZWY8Q2FsZW5kYXJUb29sdGlwV2luZG93Q29tcG9uZW50PjtcbiAgcHJpdmF0ZSBjYW5jZWxUb29sdGlwRGVsYXkkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgKSB7XG4gICAgdGhpcy50b29sdGlwRmFjdG9yeSA9IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShcbiAgICAgIENhbGVuZGFyVG9vbHRpcFdpbmRvd0NvbXBvbmVudFxuICAgICk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKFxuICAgICAgdGhpcy50b29sdGlwUmVmICYmXG4gICAgICAoY2hhbmdlcy5jb250ZW50cyB8fCBjaGFuZ2VzLmN1c3RvbVRlbXBsYXRlIHx8IGNoYW5nZXMuZXZlbnQpXG4gICAgKSB7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UuY29udGVudHMgPSB0aGlzLmNvbnRlbnRzO1xuICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLmN1c3RvbVRlbXBsYXRlID0gdGhpcy5jdXN0b21UZW1wbGF0ZTtcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5ldmVudCA9IHRoaXMuZXZlbnQ7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIGlmICghdGhpcy5jb250ZW50cykge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBvbk1vdXNlT3ZlcigpOiB2b2lkIHtcbiAgICBjb25zdCBkZWxheSQ6IE9ic2VydmFibGU8YW55PiA9XG4gICAgICB0aGlzLmRlbGF5ID09PSBudWxsID8gb2YoJ25vdycpIDogdGltZXIodGhpcy5kZWxheSk7XG4gICAgZGVsYXkkLnBpcGUodGFrZVVudGlsKHRoaXMuY2FuY2VsVG9vbHRpcERlbGF5JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxuICBvbk1vdXNlT3V0KCk6IHZvaWQge1xuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy50b29sdGlwUmVmICYmIHRoaXMuY29udGVudHMpIHtcbiAgICAgIHRoaXMudG9vbHRpcFJlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoXG4gICAgICAgIHRoaXMudG9vbHRpcEZhY3RvcnksXG4gICAgICAgIDAsXG4gICAgICAgIHRoaXMuaW5qZWN0b3IsXG4gICAgICAgIFtdXG4gICAgICApO1xuICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLmNvbnRlbnRzID0gdGhpcy5jb250ZW50cztcbiAgICAgIHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5jdXN0b21UZW1wbGF0ZSA9IHRoaXMuY3VzdG9tVGVtcGxhdGU7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UuZXZlbnQgPSB0aGlzLmV2ZW50O1xuICAgICAgaWYgKHRoaXMuYXBwZW5kVG9Cb2R5KSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRvb2x0aXBSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB0aGlzLnBvc2l0aW9uVG9vbHRpcCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoaWRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRvb2x0aXBSZWYpIHtcbiAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5yZW1vdmUoXG4gICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5pbmRleE9mKHRoaXMudG9vbHRpcFJlZi5ob3N0VmlldylcbiAgICAgICk7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmNhbmNlbFRvb2x0aXBEZWxheSQubmV4dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3NpdGlvblRvb2x0aXAocHJldmlvdXNQb3NpdGlvbnM6IHN0cmluZ1tdID0gW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sdGlwUmVmKSB7XG4gICAgICB0aGlzLnRvb2x0aXBSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy50b29sdGlwUmVmLmluc3RhbmNlLnBsYWNlbWVudCA9IHBvc2l0aW9uRWxlbWVudHMoXG4gICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICB0aGlzLnRvb2x0aXBSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSxcbiAgICAgICAgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgIHRoaXMuYXBwZW5kVG9Cb2R5XG4gICAgICApO1xuICAgICAgLy8ga2VlcCByZS1wb3NpdGlvbmluZyB0aGUgdG9vbHRpcCB1bnRpbCB0aGUgYXJyb3cgcG9zaXRpb24gZG9lc24ndCBtYWtlIGEgZGlmZmVyZW5jZVxuICAgICAgaWYgKFxuICAgICAgICBwcmV2aW91c1Bvc2l0aW9ucy5pbmRleE9mKHRoaXMudG9vbHRpcFJlZi5pbnN0YW5jZS5wbGFjZW1lbnQpID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb25Ub29sdGlwKFtcbiAgICAgICAgICAuLi5wcmV2aW91c1Bvc2l0aW9ucyxcbiAgICAgICAgICB0aGlzLnRvb2x0aXBSZWYuaW5zdGFuY2UucGxhY2VtZW50LFxuICAgICAgICBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==