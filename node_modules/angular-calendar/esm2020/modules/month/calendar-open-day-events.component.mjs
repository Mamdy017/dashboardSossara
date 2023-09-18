import { Component, Input, Output, EventEmitter, } from '@angular/core';
import { trigger, style, state, transition, animate, } from '@angular/animations';
import { isWithinThreshold, trackByEventId } from '../common/util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "angular-draggable-droppable";
import * as i3 from "../common/calendar-event-actions.component";
import * as i4 from "../common/calendar-event-title.component";
import * as i5 from "../common/click.directive";
import * as i6 from "../common/keydown-enter.directive";
import * as i7 from "../common/calendar-a11y.pipe";
export const collapseAnimation = trigger('collapse', [
    state('void', style({
        height: 0,
        overflow: 'hidden',
        'padding-top': 0,
        'padding-bottom': 0,
    })),
    state('*', style({
        height: '*',
        overflow: 'hidden',
        'padding-top': '*',
        'padding-bottom': '*',
    })),
    transition('* => void', animate('150ms ease-out')),
    transition('void => *', animate('150ms ease-in')),
]);
export class CalendarOpenDayEventsComponent {
    constructor() {
        this.isOpen = false;
        this.eventClicked = new EventEmitter();
        this.trackByEventId = trackByEventId;
        this.validateDrag = isWithinThreshold;
    }
}
CalendarOpenDayEventsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarOpenDayEventsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CalendarOpenDayEventsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.2", type: CalendarOpenDayEventsComponent, selector: "mwl-calendar-open-day-events", inputs: { locale: "locale", isOpen: "isOpen", events: "events", customTemplate: "customTemplate", eventTitleTemplate: "eventTitleTemplate", eventActionsTemplate: "eventActionsTemplate", date: "date" }, outputs: { eventClicked: "eventClicked" }, ngImport: i0, template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked"
      let-isOpen="isOpen"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-open-day-events"
        [@collapse]
        *ngIf="isOpen"
        role="application"
      >
        <span
          tabindex="-1"
          role="alert"
          [attr.aria-label]="
            { date: date, locale: locale } | calendarA11y: 'openDayEventsAlert'
          "
        ></span>
        <span
          tabindex="0"
          role="landmark"
          [attr.aria-label]="
            { date: date, locale: locale }
              | calendarA11y: 'openDayEventsLandmark'
          "
        ></span>
        <div
          *ngFor="let event of events; trackBy: trackByEventId"
          [ngClass]="event?.cssClass"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
        >
          <span
            class="cal-event"
            [ngStyle]="{ backgroundColor: event.color?.primary }"
          >
          </span>
          &ngsp;
          <mwl-calendar-event-title
            [event]="event"
            [customTemplate]="eventTitleTemplate"
            view="month"
            (mwlClick)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            (mwlKeydownEnter)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            tabindex="0"
            [attr.aria-label]="
              { event: event, locale: locale }
                | calendarA11y: 'eventDescription'
            "
          >
          </mwl-calendar-event-title>
          &ngsp;
          <mwl-calendar-event-actions
            [event]="event"
            [customTemplate]="eventActionsTemplate"
          >
          </mwl-calendar-event-actions>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        events: events,
        eventClicked: eventClicked,
        isOpen: isOpen,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.DraggableDirective, selector: "[mwlDraggable]", inputs: ["dropData", "dragAxis", "dragSnapGrid", "ghostDragEnabled", "showOriginalElementWhileDragging", "validateDrag", "dragCursor", "dragActiveClass", "ghostElementAppendTo", "ghostElementTemplate", "touchStartLongPress", "autoScroll"], outputs: ["dragPointerDown", "dragStart", "ghostElementCreated", "dragging", "dragEnd"] }, { kind: "component", type: i3.CalendarEventActionsComponent, selector: "mwl-calendar-event-actions", inputs: ["event", "customTemplate"] }, { kind: "component", type: i4.CalendarEventTitleComponent, selector: "mwl-calendar-event-title", inputs: ["event", "customTemplate", "view"] }, { kind: "directive", type: i5.ClickDirective, selector: "[mwlClick]", inputs: ["clickListenerDisabled"], outputs: ["mwlClick"] }, { kind: "directive", type: i6.KeydownEnterDirective, selector: "[mwlKeydownEnter]", outputs: ["mwlKeydownEnter"] }, { kind: "pipe", type: i7.CalendarA11yPipe, name: "calendarA11y" }], animations: [collapseAnimation] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarOpenDayEventsComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-open-day-events',
                    template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked"
      let-isOpen="isOpen"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-open-day-events"
        [@collapse]
        *ngIf="isOpen"
        role="application"
      >
        <span
          tabindex="-1"
          role="alert"
          [attr.aria-label]="
            { date: date, locale: locale } | calendarA11y: 'openDayEventsAlert'
          "
        ></span>
        <span
          tabindex="0"
          role="landmark"
          [attr.aria-label]="
            { date: date, locale: locale }
              | calendarA11y: 'openDayEventsLandmark'
          "
        ></span>
        <div
          *ngFor="let event of events; trackBy: trackByEventId"
          [ngClass]="event?.cssClass"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
        >
          <span
            class="cal-event"
            [ngStyle]="{ backgroundColor: event.color?.primary }"
          >
          </span>
          &ngsp;
          <mwl-calendar-event-title
            [event]="event"
            [customTemplate]="eventTitleTemplate"
            view="month"
            (mwlClick)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            (mwlKeydownEnter)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            tabindex="0"
            [attr.aria-label]="
              { event: event, locale: locale }
                | calendarA11y: 'eventDescription'
            "
          >
          </mwl-calendar-event-title>
          &ngsp;
          <mwl-calendar-event-actions
            [event]="event"
            [customTemplate]="eventActionsTemplate"
          >
          </mwl-calendar-event-actions>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        events: events,
        eventClicked: eventClicked,
        isOpen: isOpen,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
                    animations: [collapseAnimation],
                }]
        }], propDecorators: { locale: [{
                type: Input
            }], isOpen: [{
                type: Input
            }], events: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }], eventTitleTemplate: [{
                type: Input
            }], eventActionsTemplate: [{
                type: Input
            }], date: [{
                type: Input
            }], eventClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2FsZW5kYXIvc3JjL21vZHVsZXMvbW9udGgvY2FsZW5kYXItb3Blbi1kYXktZXZlbnRzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxHQUViLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0IsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7QUFFbkUsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQTZCLE9BQU8sQ0FBQyxVQUFVLEVBQUU7SUFDN0UsS0FBSyxDQUNILE1BQU0sRUFDTixLQUFLLENBQUM7UUFDSixNQUFNLEVBQUUsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFnQixFQUFFLENBQUM7S0FDcEIsQ0FBQyxDQUNIO0lBQ0QsS0FBSyxDQUNILEdBQUcsRUFDSCxLQUFLLENBQUM7UUFDSixNQUFNLEVBQUUsR0FBRztRQUNYLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLGFBQWEsRUFBRSxHQUFHO1FBQ2xCLGdCQUFnQixFQUFFLEdBQUc7S0FDdEIsQ0FBQyxDQUNIO0lBQ0QsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNsRCxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztDQUNsRCxDQUFDLENBQUM7QUEyRkgsTUFBTSxPQUFPLDhCQUE4QjtJQXpGM0M7UUE0RlcsV0FBTSxHQUFZLEtBQUssQ0FBQztRQVl2QixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUdyQyxDQUFDO1FBRUwsbUJBQWMsR0FBRyxjQUFjLENBQUM7UUFFaEMsaUJBQVksR0FBRyxpQkFBaUIsQ0FBQztLQUNsQzs7MkhBdkJZLDhCQUE4QjsrR0FBOUIsOEJBQThCLHlUQXZGL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9GVCx1bERBQ1csQ0FBQyxpQkFBaUIsQ0FBQzsyRkFFcEIsOEJBQThCO2tCQXpGMUMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsOEJBQThCO29CQUN4QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9GVDtvQkFDRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDaEM7OEJBRVUsTUFBTTtzQkFBZCxLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsY0FBYztzQkFBdEIsS0FBSztnQkFFRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBRUcsb0JBQW9CO3NCQUE1QixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFSSxZQUFZO3NCQUFyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIHRyaWdnZXIsXG4gIHN0eWxlLFxuICBzdGF0ZSxcbiAgdHJhbnNpdGlvbixcbiAgYW5pbWF0ZSxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnQgfSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyBpc1dpdGhpblRocmVzaG9sZCwgdHJhY2tCeUV2ZW50SWQgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBjb2xsYXBzZUFuaW1hdGlvbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhID0gdHJpZ2dlcignY29sbGFwc2UnLCBbXG4gIHN0YXRlKFxuICAgICd2b2lkJyxcbiAgICBzdHlsZSh7XG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAncGFkZGluZy10b3AnOiAwLFxuICAgICAgJ3BhZGRpbmctYm90dG9tJzogMCxcbiAgICB9KVxuICApLFxuICBzdGF0ZShcbiAgICAnKicsXG4gICAgc3R5bGUoe1xuICAgICAgaGVpZ2h0OiAnKicsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAncGFkZGluZy10b3AnOiAnKicsXG4gICAgICAncGFkZGluZy1ib3R0b20nOiAnKicsXG4gICAgfSlcbiAgKSxcbiAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgYW5pbWF0ZSgnMTUwbXMgZWFzZS1vdXQnKSksXG4gIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIGFuaW1hdGUoJzE1MG1zIGVhc2UtaW4nKSksXG5dKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLW9wZW4tZGF5LWV2ZW50cycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjZGVmYXVsdFRlbXBsYXRlXG4gICAgICBsZXQtZXZlbnRzPVwiZXZlbnRzXCJcbiAgICAgIGxldC1ldmVudENsaWNrZWQ9XCJldmVudENsaWNrZWRcIlxuICAgICAgbGV0LWlzT3Blbj1cImlzT3BlblwiXG4gICAgICBsZXQtdHJhY2tCeUV2ZW50SWQ9XCJ0cmFja0J5RXZlbnRJZFwiXG4gICAgICBsZXQtdmFsaWRhdGVEcmFnPVwidmFsaWRhdGVEcmFnXCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLW9wZW4tZGF5LWV2ZW50c1wiXG4gICAgICAgIFtAY29sbGFwc2VdXG4gICAgICAgICpuZ0lmPVwiaXNPcGVuXCJcbiAgICAgICAgcm9sZT1cImFwcGxpY2F0aW9uXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICByb2xlPVwiYWxlcnRcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgICB7IGRhdGU6IGRhdGUsIGxvY2FsZTogbG9jYWxlIH0gfCBjYWxlbmRhckExMXk6ICdvcGVuRGF5RXZlbnRzQWxlcnQnXG4gICAgICAgICAgXCJcbiAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgIHJvbGU9XCJsYW5kbWFya1wiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJcbiAgICAgICAgICAgIHsgZGF0ZTogZGF0ZSwgbG9jYWxlOiBsb2NhbGUgfVxuICAgICAgICAgICAgICB8IGNhbGVuZGFyQTExeTogJ29wZW5EYXlFdmVudHNMYW5kbWFyaydcbiAgICAgICAgICBcIlxuICAgICAgICA+PC9zcGFuPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50IG9mIGV2ZW50czsgdHJhY2tCeTogdHJhY2tCeUV2ZW50SWRcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cImV2ZW50Py5jc3NDbGFzc1wiXG4gICAgICAgICAgbXdsRHJhZ2dhYmxlXG4gICAgICAgICAgW2NsYXNzLmNhbC1kcmFnZ2FibGVdPVwiZXZlbnQuZHJhZ2dhYmxlXCJcbiAgICAgICAgICBkcmFnQWN0aXZlQ2xhc3M9XCJjYWwtZHJhZy1hY3RpdmVcIlxuICAgICAgICAgIFtkcm9wRGF0YV09XCJ7IGV2ZW50OiBldmVudCB9XCJcbiAgICAgICAgICBbZHJhZ0F4aXNdPVwieyB4OiBldmVudC5kcmFnZ2FibGUsIHk6IGV2ZW50LmRyYWdnYWJsZSB9XCJcbiAgICAgICAgICBbdmFsaWRhdGVEcmFnXT1cInZhbGlkYXRlRHJhZ1wiXG4gICAgICAgICAgW3RvdWNoU3RhcnRMb25nUHJlc3NdPVwieyBkZWxheTogMzAwLCBkZWx0YTogMzAgfVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnRcIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwieyBiYWNrZ3JvdW5kQ29sb3I6IGV2ZW50LmNvbG9yPy5wcmltYXJ5IH1cIlxuICAgICAgICAgID5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgJm5nc3A7XG4gICAgICAgICAgPG13bC1jYWxlbmRhci1ldmVudC10aXRsZVxuICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCJcbiAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudFRpdGxlVGVtcGxhdGVcIlxuICAgICAgICAgICAgdmlldz1cIm1vbnRoXCJcbiAgICAgICAgICAgIChtd2xDbGljayk9XCJcbiAgICAgICAgICAgICAgZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQsIHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAobXdsS2V5ZG93bkVudGVyKT1cIlxuICAgICAgICAgICAgICBldmVudENsaWNrZWQuZW1pdCh7IGV2ZW50OiBldmVudCwgc291cmNlRXZlbnQ6ICRldmVudCB9KVxuICAgICAgICAgICAgXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIlxuICAgICAgICAgICAgICB7IGV2ZW50OiBldmVudCwgbG9jYWxlOiBsb2NhbGUgfVxuICAgICAgICAgICAgICAgIHwgY2FsZW5kYXJBMTF5OiAnZXZlbnREZXNjcmlwdGlvbidcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LXRpdGxlPlxuICAgICAgICAgICZuZ3NwO1xuICAgICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtYWN0aW9uc1xuICAgICAgICAgICAgW2V2ZW50XT1cImV2ZW50XCJcbiAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJldmVudEFjdGlvbnNUZW1wbGF0ZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLWV2ZW50LWFjdGlvbnM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlIHx8IGRlZmF1bHRUZW1wbGF0ZVwiXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie1xuICAgICAgICBldmVudHM6IGV2ZW50cyxcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIGlzT3BlbjogaXNPcGVuLFxuICAgICAgICB0cmFja0J5RXZlbnRJZDogdHJhY2tCeUV2ZW50SWQsXG4gICAgICAgIHZhbGlkYXRlRHJhZzogdmFsaWRhdGVEcmFnXG4gICAgICB9XCJcbiAgICA+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgYW5pbWF0aW9uczogW2NvbGxhcHNlQW5pbWF0aW9uXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJPcGVuRGF5RXZlbnRzQ29tcG9uZW50IHtcbiAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgZXZlbnRzOiBDYWxlbmRhckV2ZW50W107XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIGRhdGU6IERhdGU7XG5cbiAgQE91dHB1dCgpIGV2ZW50Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xuICAgIGV2ZW50OiBDYWxlbmRhckV2ZW50O1xuICAgIHNvdXJjZUV2ZW50OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudDtcbiAgfT4oKTtcblxuICB0cmFja0J5RXZlbnRJZCA9IHRyYWNrQnlFdmVudElkO1xuXG4gIHZhbGlkYXRlRHJhZyA9IGlzV2l0aGluVGhyZXNob2xkO1xufVxuIl19