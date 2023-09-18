import { Component, Input, Output, EventEmitter, } from '@angular/core';
import { isWithinThreshold, trackByEventId } from '../common/util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "angular-draggable-droppable";
import * as i3 from "../common/calendar-tooltip.directive";
import * as i4 from "../common/click.directive";
import * as i5 from "../common/calendar-date.pipe";
import * as i6 from "../common/calendar-event-title.pipe";
import * as i7 from "../common/calendar-a11y.pipe";
export class CalendarMonthCellComponent {
    constructor() {
        this.highlightDay = new EventEmitter();
        this.unhighlightDay = new EventEmitter();
        this.eventClicked = new EventEmitter();
        this.trackByEventId = trackByEventId;
        this.validateDrag = isWithinThreshold;
    }
}
CalendarMonthCellComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarMonthCellComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CalendarMonthCellComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.2", type: CalendarMonthCellComponent, selector: "mwl-calendar-month-cell", inputs: { day: "day", openDay: "openDay", locale: "locale", tooltipPlacement: "tooltipPlacement", tooltipAppendToBody: "tooltipAppendToBody", customTemplate: "customTemplate", tooltipTemplate: "tooltipTemplate", tooltipDelay: "tooltipDelay" }, outputs: { highlightDay: "highlightDay", unhighlightDay: "unhighlightDay", eventClicked: "eventClicked" }, host: { properties: { "class.cal-past": "day.isPast", "class.cal-today": "day.isToday", "class.cal-future": "day.isFuture", "class.cal-weekend": "day.isWeekend", "class.cal-in-month": "day.inMonth", "class.cal-out-month": "!day.inMonth", "class.cal-has-events": "day.events.length > 0", "class.cal-open": "day === openDay", "class.cal-event-highlight": "!!day.backgroundColor" }, classAttribute: "cal-cell cal-day-cell" }, ngImport: i0, template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDelay="tooltipDelay"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-cell-top"
        [attr.aria-label]="
          { day: day, locale: locale } | calendarA11y: 'monthCell'
        "
      >
        <span aria-hidden="true">
          <span class="cal-day-badge" *ngIf="day.badgeTotal > 0">{{
            day.badgeTotal
          }}</span>
          <span class="cal-day-number">{{
            day.date | calendarDate: 'monthViewDayNumber':locale
          }}</span>
        </span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy: trackByEventId"
          [ngStyle]="{ backgroundColor: event.color?.primary }"
          [ngClass]="event?.cssClass"
          (mouseenter)="highlightDay.emit({ event: event })"
          (mouseleave)="unhighlightDay.emit({ event: event })"
          [mwlCalendarTooltip]="
            event.title | calendarEventTitle: 'monthTooltip':event
          "
          [tooltipPlacement]="tooltipPlacement"
          [tooltipEvent]="event"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipAppendToBody]="tooltipAppendToBody"
          [tooltipDelay]="tooltipDelay"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event, draggedFrom: day }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
          (mwlClick)="eventClicked.emit({ event: event, sourceEvent: $event })"
          [attr.aria-hidden]="{} | calendarA11y: 'hideMonthCellEvents'"
        ></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDelay: tooltipDelay,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.DraggableDirective, selector: "[mwlDraggable]", inputs: ["dropData", "dragAxis", "dragSnapGrid", "ghostDragEnabled", "showOriginalElementWhileDragging", "validateDrag", "dragCursor", "dragActiveClass", "ghostElementAppendTo", "ghostElementTemplate", "touchStartLongPress", "autoScroll"], outputs: ["dragPointerDown", "dragStart", "ghostElementCreated", "dragging", "dragEnd"] }, { kind: "directive", type: i3.CalendarTooltipDirective, selector: "[mwlCalendarTooltip]", inputs: ["mwlCalendarTooltip", "tooltipPlacement", "tooltipTemplate", "tooltipEvent", "tooltipAppendToBody", "tooltipDelay"] }, { kind: "directive", type: i4.ClickDirective, selector: "[mwlClick]", inputs: ["clickListenerDisabled"], outputs: ["mwlClick"] }, { kind: "pipe", type: i5.CalendarDatePipe, name: "calendarDate" }, { kind: "pipe", type: i6.CalendarEventTitlePipe, name: "calendarEventTitle" }, { kind: "pipe", type: i7.CalendarA11yPipe, name: "calendarA11y" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarMonthCellComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-month-cell',
                    template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDelay="tooltipDelay"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-cell-top"
        [attr.aria-label]="
          { day: day, locale: locale } | calendarA11y: 'monthCell'
        "
      >
        <span aria-hidden="true">
          <span class="cal-day-badge" *ngIf="day.badgeTotal > 0">{{
            day.badgeTotal
          }}</span>
          <span class="cal-day-number">{{
            day.date | calendarDate: 'monthViewDayNumber':locale
          }}</span>
        </span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy: trackByEventId"
          [ngStyle]="{ backgroundColor: event.color?.primary }"
          [ngClass]="event?.cssClass"
          (mouseenter)="highlightDay.emit({ event: event })"
          (mouseleave)="unhighlightDay.emit({ event: event })"
          [mwlCalendarTooltip]="
            event.title | calendarEventTitle: 'monthTooltip':event
          "
          [tooltipPlacement]="tooltipPlacement"
          [tooltipEvent]="event"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipAppendToBody]="tooltipAppendToBody"
          [tooltipDelay]="tooltipDelay"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event, draggedFrom: day }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
          (mwlClick)="eventClicked.emit({ event: event, sourceEvent: $event })"
          [attr.aria-hidden]="{} | calendarA11y: 'hideMonthCellEvents'"
        ></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDelay: tooltipDelay,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
                    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
                    host: {
                        class: 'cal-cell cal-day-cell',
                        '[class.cal-past]': 'day.isPast',
                        '[class.cal-today]': 'day.isToday',
                        '[class.cal-future]': 'day.isFuture',
                        '[class.cal-weekend]': 'day.isWeekend',
                        '[class.cal-in-month]': 'day.inMonth',
                        '[class.cal-out-month]': '!day.inMonth',
                        '[class.cal-has-events]': 'day.events.length > 0',
                        '[class.cal-open]': 'day === openDay',
                        '[class.cal-event-highlight]': '!!day.backgroundColor',
                    },
                }]
        }], propDecorators: { day: [{
                type: Input
            }], openDay: [{
                type: Input
            }], locale: [{
                type: Input
            }], tooltipPlacement: [{
                type: Input
            }], tooltipAppendToBody: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }], tooltipTemplate: [{
                type: Input
            }], tooltipDelay: [{
                type: Input
            }], highlightDay: [{
                type: Output
            }], unhighlightDay: [{
                type: Output
            }], eventClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9udGgtY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNhbGVuZGFyL3NyYy9tb2R1bGVzL21vbnRoL2NhbGVuZGFyLW1vbnRoLWNlbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEdBRWIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7QUFpR25FLE1BQU0sT0FBTywwQkFBMEI7SUE5RnZDO1FBK0dZLGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFckQsbUJBQWMsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2RCxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUdyQyxDQUFDO1FBRUwsbUJBQWMsR0FBRyxjQUFjLENBQUM7UUFFaEMsaUJBQVksR0FBRyxpQkFBaUIsQ0FBQztLQUNsQzs7dUhBN0JZLDBCQUEwQjsyR0FBMUIsMEJBQTBCLHEwQkE1RjNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZFVDsyRkFlVSwwQkFBMEI7a0JBOUZ0QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2RVQ7b0JBQ0QscUVBQXFFO29CQUNyRSxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLHVCQUF1Qjt3QkFDOUIsa0JBQWtCLEVBQUUsWUFBWTt3QkFDaEMsbUJBQW1CLEVBQUUsYUFBYTt3QkFDbEMsb0JBQW9CLEVBQUUsY0FBYzt3QkFDcEMscUJBQXFCLEVBQUUsZUFBZTt3QkFDdEMsc0JBQXNCLEVBQUUsYUFBYTt3QkFDckMsdUJBQXVCLEVBQUUsY0FBYzt3QkFDdkMsd0JBQXdCLEVBQUUsdUJBQXVCO3dCQUNqRCxrQkFBa0IsRUFBRSxpQkFBaUI7d0JBQ3JDLDZCQUE2QixFQUFFLHVCQUF1QjtxQkFDdkQ7aUJBQ0Y7OEJBRVUsR0FBRztzQkFBWCxLQUFLO2dCQUVHLE9BQU87c0JBQWYsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUVHLG1CQUFtQjtzQkFBM0IsS0FBSztnQkFFRyxjQUFjO3NCQUF0QixLQUFLO2dCQUVHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUcsWUFBWTtzQkFBcEIsS0FBSztnQkFFSSxZQUFZO3NCQUFyQixNQUFNO2dCQUVHLGNBQWM7c0JBQXZCLE1BQU07Z0JBRUcsWUFBWTtzQkFBckIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBUZW1wbGF0ZVJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNb250aFZpZXdEYXksIENhbGVuZGFyRXZlbnQgfSBmcm9tICdjYWxlbmRhci11dGlscyc7XG5pbXBvcnQgeyBpc1dpdGhpblRocmVzaG9sZCwgdHJhY2tCeUV2ZW50SWQgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbXdsLWNhbGVuZGFyLW1vbnRoLWNlbGwnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LWRheT1cImRheVwiXG4gICAgICBsZXQtb3BlbkRheT1cIm9wZW5EYXlcIlxuICAgICAgbGV0LWxvY2FsZT1cImxvY2FsZVwiXG4gICAgICBsZXQtdG9vbHRpcFBsYWNlbWVudD1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgbGV0LWhpZ2hsaWdodERheT1cImhpZ2hsaWdodERheVwiXG4gICAgICBsZXQtdW5oaWdobGlnaHREYXk9XCJ1bmhpZ2hsaWdodERheVwiXG4gICAgICBsZXQtZXZlbnRDbGlja2VkPVwiZXZlbnRDbGlja2VkXCJcbiAgICAgIGxldC10b29sdGlwVGVtcGxhdGU9XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgbGV0LXRvb2x0aXBBcHBlbmRUb0JvZHk9XCJ0b29sdGlwQXBwZW5kVG9Cb2R5XCJcbiAgICAgIGxldC10b29sdGlwRGVsYXk9XCJ0b29sdGlwRGVsYXlcIlxuICAgICAgbGV0LXRyYWNrQnlFdmVudElkPVwidHJhY2tCeUV2ZW50SWRcIlxuICAgICAgbGV0LXZhbGlkYXRlRHJhZz1cInZhbGlkYXRlRHJhZ1wiXG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImNhbC1jZWxsLXRvcFwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgeyBkYXk6IGRheSwgbG9jYWxlOiBsb2NhbGUgfSB8IGNhbGVuZGFyQTExeTogJ21vbnRoQ2VsbCdcbiAgICAgICAgXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYWwtZGF5LWJhZGdlXCIgKm5nSWY9XCJkYXkuYmFkZ2VUb3RhbCA+IDBcIj57e1xuICAgICAgICAgICAgZGF5LmJhZGdlVG90YWxcbiAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhbC1kYXktbnVtYmVyXCI+e3tcbiAgICAgICAgICAgIGRheS5kYXRlIHwgY2FsZW5kYXJEYXRlOiAnbW9udGhWaWV3RGF5TnVtYmVyJzpsb2NhbGVcbiAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2FsLWV2ZW50c1wiICpuZ0lmPVwiZGF5LmV2ZW50cy5sZW5ndGggPiAwXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudFwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGV2ZW50IG9mIGRheS5ldmVudHM7IHRyYWNrQnk6IHRyYWNrQnlFdmVudElkXCJcbiAgICAgICAgICBbbmdTdHlsZV09XCJ7IGJhY2tncm91bmRDb2xvcjogZXZlbnQuY29sb3I/LnByaW1hcnkgfVwiXG4gICAgICAgICAgW25nQ2xhc3NdPVwiZXZlbnQ/LmNzc0NsYXNzXCJcbiAgICAgICAgICAobW91c2VlbnRlcik9XCJoaWdobGlnaHREYXkuZW1pdCh7IGV2ZW50OiBldmVudCB9KVwiXG4gICAgICAgICAgKG1vdXNlbGVhdmUpPVwidW5oaWdobGlnaHREYXkuZW1pdCh7IGV2ZW50OiBldmVudCB9KVwiXG4gICAgICAgICAgW213bENhbGVuZGFyVG9vbHRpcF09XCJcbiAgICAgICAgICAgIGV2ZW50LnRpdGxlIHwgY2FsZW5kYXJFdmVudFRpdGxlOiAnbW9udGhUb29sdGlwJzpldmVudFxuICAgICAgICAgIFwiXG4gICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICAgICAgW3Rvb2x0aXBFdmVudF09XCJldmVudFwiXG4gICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgIFt0b29sdGlwQXBwZW5kVG9Cb2R5XT1cInRvb2x0aXBBcHBlbmRUb0JvZHlcIlxuICAgICAgICAgIFt0b29sdGlwRGVsYXldPVwidG9vbHRpcERlbGF5XCJcbiAgICAgICAgICBtd2xEcmFnZ2FibGVcbiAgICAgICAgICBbY2xhc3MuY2FsLWRyYWdnYWJsZV09XCJldmVudC5kcmFnZ2FibGVcIlxuICAgICAgICAgIGRyYWdBY3RpdmVDbGFzcz1cImNhbC1kcmFnLWFjdGl2ZVwiXG4gICAgICAgICAgW2Ryb3BEYXRhXT1cInsgZXZlbnQ6IGV2ZW50LCBkcmFnZ2VkRnJvbTogZGF5IH1cIlxuICAgICAgICAgIFtkcmFnQXhpc109XCJ7IHg6IGV2ZW50LmRyYWdnYWJsZSwgeTogZXZlbnQuZHJhZ2dhYmxlIH1cIlxuICAgICAgICAgIFt2YWxpZGF0ZURyYWddPVwidmFsaWRhdGVEcmFnXCJcbiAgICAgICAgICBbdG91Y2hTdGFydExvbmdQcmVzc109XCJ7IGRlbGF5OiAzMDAsIGRlbHRhOiAzMCB9XCJcbiAgICAgICAgICAobXdsQ2xpY2spPVwiZXZlbnRDbGlja2VkLmVtaXQoeyBldmVudDogZXZlbnQsIHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cInt9IHwgY2FsZW5kYXJBMTF5OiAnaGlkZU1vbnRoQ2VsbEV2ZW50cydcIlxuICAgICAgICA+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGUgfHwgZGVmYXVsdFRlbXBsYXRlXCJcbiAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgIGRheTogZGF5LFxuICAgICAgICBvcGVuRGF5OiBvcGVuRGF5LFxuICAgICAgICBsb2NhbGU6IGxvY2FsZSxcbiAgICAgICAgdG9vbHRpcFBsYWNlbWVudDogdG9vbHRpcFBsYWNlbWVudCxcbiAgICAgICAgaGlnaGxpZ2h0RGF5OiBoaWdobGlnaHREYXksXG4gICAgICAgIHVuaGlnaGxpZ2h0RGF5OiB1bmhpZ2hsaWdodERheSxcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIHRvb2x0aXBUZW1wbGF0ZTogdG9vbHRpcFRlbXBsYXRlLFxuICAgICAgICB0b29sdGlwQXBwZW5kVG9Cb2R5OiB0b29sdGlwQXBwZW5kVG9Cb2R5LFxuICAgICAgICB0b29sdGlwRGVsYXk6IHRvb2x0aXBEZWxheSxcbiAgICAgICAgdHJhY2tCeUV2ZW50SWQ6IHRyYWNrQnlFdmVudElkLFxuICAgICAgICB2YWxpZGF0ZURyYWc6IHZhbGlkYXRlRHJhZ1xuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvbm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdjYWwtY2VsbCBjYWwtZGF5LWNlbGwnLFxuICAgICdbY2xhc3MuY2FsLXBhc3RdJzogJ2RheS5pc1Bhc3QnLFxuICAgICdbY2xhc3MuY2FsLXRvZGF5XSc6ICdkYXkuaXNUb2RheScsXG4gICAgJ1tjbGFzcy5jYWwtZnV0dXJlXSc6ICdkYXkuaXNGdXR1cmUnLFxuICAgICdbY2xhc3MuY2FsLXdlZWtlbmRdJzogJ2RheS5pc1dlZWtlbmQnLFxuICAgICdbY2xhc3MuY2FsLWluLW1vbnRoXSc6ICdkYXkuaW5Nb250aCcsXG4gICAgJ1tjbGFzcy5jYWwtb3V0LW1vbnRoXSc6ICchZGF5LmluTW9udGgnLFxuICAgICdbY2xhc3MuY2FsLWhhcy1ldmVudHNdJzogJ2RheS5ldmVudHMubGVuZ3RoID4gMCcsXG4gICAgJ1tjbGFzcy5jYWwtb3Blbl0nOiAnZGF5ID09PSBvcGVuRGF5JyxcbiAgICAnW2NsYXNzLmNhbC1ldmVudC1oaWdobGlnaHRdJzogJyEhZGF5LmJhY2tncm91bmRDb2xvcicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyTW9udGhDZWxsQ29tcG9uZW50IHtcbiAgQElucHV0KCkgZGF5OiBNb250aFZpZXdEYXk7XG5cbiAgQElucHV0KCkgb3BlbkRheTogTW9udGhWaWV3RGF5O1xuXG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBEZWxheTogbnVtYmVyIHwgbnVsbDtcblxuICBAT3V0cHV0KCkgaGlnaGxpZ2h0RGF5OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAT3V0cHV0KCkgdW5oaWdobGlnaHREYXk6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoKSBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHtcbiAgICBldmVudDogQ2FsZW5kYXJFdmVudDtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudDtcbiAgfT4oKTtcblxuICB0cmFja0J5RXZlbnRJZCA9IHRyYWNrQnlFdmVudElkO1xuXG4gIHZhbGlkYXRlRHJhZyA9IGlzV2l0aGluVGhyZXNob2xkO1xufVxuIl19