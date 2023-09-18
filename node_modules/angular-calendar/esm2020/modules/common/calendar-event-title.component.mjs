import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./calendar-event-title.pipe";
import * as i3 from "./calendar-a11y.pipe";
export class CalendarEventTitleComponent {
}
CalendarEventTitleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarEventTitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CalendarEventTitleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.2", type: CalendarEventTitleComponent, selector: "mwl-calendar-event-title", inputs: { event: "event", customTemplate: "customTemplate", view: "view" }, ngImport: i0, template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle: view:event"
        [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'"
      >
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }"
    >
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i2.CalendarEventTitlePipe, name: "calendarEventTitle" }, { kind: "pipe", type: i3.CalendarA11yPipe, name: "calendarA11y" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarEventTitleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-event-title',
                    template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle: view:event"
        [attr.aria-hidden]="{} | calendarA11y: 'hideEventTitle'"
      >
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }"
    >
    </ng-template>
  `,
                }]
        }], propDecorators: { event: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }], view: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jYWxlbmRhci9zcmMvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItZXZlbnQtdGl0bGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFlLE1BQU0sZUFBZSxDQUFDOzs7OztBQXdCOUQsTUFBTSxPQUFPLDJCQUEyQjs7d0hBQTNCLDJCQUEyQjs0R0FBM0IsMkJBQTJCLDRJQW5CNUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJUOzJGQUVVLDJCQUEyQjtrQkFyQnZDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVDtpQkFDRjs4QkFFVSxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsY0FBYztzQkFBdEIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudCB9IGZyb20gJ2NhbGVuZGFyLXV0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRUZW1wbGF0ZSBsZXQtZXZlbnQ9XCJldmVudFwiIGxldC12aWV3PVwidmlld1wiPlxuICAgICAgPHNwYW5cbiAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnQtdGl0bGVcIlxuICAgICAgICBbaW5uZXJIVE1MXT1cImV2ZW50LnRpdGxlIHwgY2FsZW5kYXJFdmVudFRpdGxlOiB2aWV3OmV2ZW50XCJcbiAgICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwie30gfCBjYWxlbmRhckExMXk6ICdoaWRlRXZlbnRUaXRsZSdcIlxuICAgICAgPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICB2aWV3OiB2aWV3XG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJFdmVudFRpdGxlQ29tcG9uZW50IHtcbiAgQElucHV0KCkgZXZlbnQ6IENhbGVuZGFyRXZlbnQ7XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgdmlldzogc3RyaW5nO1xufVxuIl19