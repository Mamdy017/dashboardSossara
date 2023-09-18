import { Component, Input, } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMapTo, startWith, map, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../date-adapters/date-adapter";
import * as i2 from "@angular/common";
export class CalendarWeekViewCurrentTimeMarkerComponent {
    constructor(dateAdapter, zone) {
        this.dateAdapter = dateAdapter;
        this.zone = zone;
        this.columnDate$ = new BehaviorSubject(undefined);
        this.marker$ = this.zone.onStable.pipe(switchMap(() => interval(60 * 1000)), startWith(0), switchMapTo(this.columnDate$), map((columnDate) => {
            const startOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayStartHour), this.dayStartMinute);
            const endOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayEndHour), this.dayEndMinute);
            const hourHeightModifier = (this.hourSegments * this.hourSegmentHeight) /
                (this.hourDuration || 60);
            const now = new Date();
            return {
                isVisible: this.dateAdapter.isSameDay(columnDate, now) &&
                    now >= startOfDay &&
                    now <= endOfDay,
                top: this.dateAdapter.differenceInMinutes(now, startOfDay) *
                    hourHeightModifier,
            };
        }));
    }
    ngOnChanges(changes) {
        if (changes.columnDate) {
            this.columnDate$.next(changes.columnDate.currentValue);
        }
    }
}
CalendarWeekViewCurrentTimeMarkerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarWeekViewCurrentTimeMarkerComponent, deps: [{ token: i1.DateAdapter }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
CalendarWeekViewCurrentTimeMarkerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.1.2", type: CalendarWeekViewCurrentTimeMarkerComponent, selector: "mwl-calendar-week-view-current-time-marker", inputs: { columnDate: "columnDate", dayStartHour: "dayStartHour", dayStartMinute: "dayStartMinute", dayEndHour: "dayEndHour", dayEndMinute: "dayEndMinute", hourSegments: "hourSegments", hourDuration: "hourDuration", hourSegmentHeight: "hourSegmentHeight", customTemplate: "customTemplate" }, usesOnChanges: true, ngImport: i0, template: `
    <ng-template
      #defaultTemplate
      let-columnDate="columnDate"
      let-dayStartHour="dayStartHour"
      let-dayStartMinute="dayStartMinute"
      let-dayEndHour="dayEndHour"
      let-dayEndMinute="dayEndMinute"
      let-isVisible="isVisible"
      let-topPx="topPx"
    >
      <div
        class="cal-current-time-marker"
        *ngIf="isVisible"
        [style.top.px]="topPx"
      ></div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        columnDate: columnDate,
        dayStartHour: dayStartHour,
        dayStartMinute: dayStartMinute,
        dayEndHour: dayEndHour,
        dayEndMinute: dayEndMinute,
        isVisible: (marker$ | async)?.isVisible,
        topPx: (marker$ | async)?.top
      }"
    >
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarWeekViewCurrentTimeMarkerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-week-view-current-time-marker',
                    template: `
    <ng-template
      #defaultTemplate
      let-columnDate="columnDate"
      let-dayStartHour="dayStartHour"
      let-dayStartMinute="dayStartMinute"
      let-dayEndHour="dayEndHour"
      let-dayEndMinute="dayEndMinute"
      let-isVisible="isVisible"
      let-topPx="topPx"
    >
      <div
        class="cal-current-time-marker"
        *ngIf="isVisible"
        [style.top.px]="topPx"
      ></div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        columnDate: columnDate,
        dayStartHour: dayStartHour,
        dayStartMinute: dayStartMinute,
        dayEndHour: dayEndHour,
        dayEndMinute: dayEndMinute,
        isVisible: (marker$ | async)?.isVisible,
        topPx: (marker$ | async)?.top
      }"
    >
    </ng-template>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.DateAdapter }, { type: i0.NgZone }]; }, propDecorators: { columnDate: [{
                type: Input
            }], dayStartHour: [{
                type: Input
            }], dayStartMinute: [{
                type: Input
            }], dayEndHour: [{
                type: Input
            }], dayEndMinute: [{
                type: Input
            }], hourSegments: [{
                type: Input
            }], hourDuration: [{
                type: Input
            }], hourSegmentHeight: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWN1cnJlbnQtdGltZS1tYXJrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jYWxlbmRhci9zcmMvbW9kdWxlcy93ZWVrL2NhbGVuZGFyLXdlZWstdmlldy1jdXJyZW50LXRpbWUtbWFya2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssR0FLTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUM3RCxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFxQ3hFLE1BQU0sT0FBTywwQ0FBMEM7SUFxRHJELFlBQW9CLFdBQXdCLEVBQVUsSUFBWTtRQUE5QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7UUFsQ2xFLGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQU8sU0FBUyxDQUFDLENBQUM7UUFFbkQsWUFBTyxHQUdGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FDMUIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFDcEMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUNaLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQzdCLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUN4RCxJQUFJLENBQUMsY0FBYyxDQUNwQixDQUFDO1lBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQ3RELElBQUksQ0FBQyxZQUFZLENBQ2xCLENBQUM7WUFDRixNQUFNLGtCQUFrQixHQUN0QixDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2dCQUM1QyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLENBQUM7WUFDNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixPQUFPO2dCQUNMLFNBQVMsRUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDO29CQUMzQyxHQUFHLElBQUksVUFBVTtvQkFDakIsR0FBRyxJQUFJLFFBQVE7Z0JBQ2pCLEdBQUcsRUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUM7b0JBQ3JELGtCQUFrQjthQUNyQixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUVtRSxDQUFDO0lBRXRFLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7O3VJQTNEVSwwQ0FBMEM7MkhBQTFDLDBDQUEwQywyWUFoQzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4QlQ7MkZBRVUsMENBQTBDO2tCQWxDdEQsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNENBQTRDO29CQUN0RCxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCVDtpQkFDRjt1SEFFVSxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsY0FBYztzQkFBdEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsWUFBWTtzQkFBcEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLGlCQUFpQjtzQkFBekIsS0FBSztnQkFFRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgaW50ZXJ2YWwsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN3aXRjaE1hcFRvLCBzdGFydFdpdGgsIG1hcCwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi9kYXRlLWFkYXB0ZXJzL2RhdGUtYWRhcHRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci13ZWVrLXZpZXctY3VycmVudC10aW1lLW1hcmtlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjZGVmYXVsdFRlbXBsYXRlXG4gICAgICBsZXQtY29sdW1uRGF0ZT1cImNvbHVtbkRhdGVcIlxuICAgICAgbGV0LWRheVN0YXJ0SG91cj1cImRheVN0YXJ0SG91clwiXG4gICAgICBsZXQtZGF5U3RhcnRNaW51dGU9XCJkYXlTdGFydE1pbnV0ZVwiXG4gICAgICBsZXQtZGF5RW5kSG91cj1cImRheUVuZEhvdXJcIlxuICAgICAgbGV0LWRheUVuZE1pbnV0ZT1cImRheUVuZE1pbnV0ZVwiXG4gICAgICBsZXQtaXNWaXNpYmxlPVwiaXNWaXNpYmxlXCJcbiAgICAgIGxldC10b3BQeD1cInRvcFB4XCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiY2FsLWN1cnJlbnQtdGltZS1tYXJrZXJcIlxuICAgICAgICAqbmdJZj1cImlzVmlzaWJsZVwiXG4gICAgICAgIFtzdHlsZS50b3AucHhdPVwidG9wUHhcIlxuICAgICAgPjwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgY29sdW1uRGF0ZTogY29sdW1uRGF0ZSxcbiAgICAgICAgZGF5U3RhcnRIb3VyOiBkYXlTdGFydEhvdXIsXG4gICAgICAgIGRheVN0YXJ0TWludXRlOiBkYXlTdGFydE1pbnV0ZSxcbiAgICAgICAgZGF5RW5kSG91cjogZGF5RW5kSG91cixcbiAgICAgICAgZGF5RW5kTWludXRlOiBkYXlFbmRNaW51dGUsXG4gICAgICAgIGlzVmlzaWJsZTogKG1hcmtlciQgfCBhc3luYyk/LmlzVmlzaWJsZSxcbiAgICAgICAgdG9wUHg6IChtYXJrZXIkIHwgYXN5bmMpPy50b3BcbiAgICAgIH1cIlxuICAgID5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhcldlZWtWaWV3Q3VycmVudFRpbWVNYXJrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBjb2x1bW5EYXRlOiBEYXRlO1xuXG4gIEBJbnB1dCgpIGRheVN0YXJ0SG91cjogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIGRheVN0YXJ0TWludXRlOiBudW1iZXI7XG5cbiAgQElucHV0KCkgZGF5RW5kSG91cjogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIGRheUVuZE1pbnV0ZTogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50czogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIGhvdXJEdXJhdGlvbjogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50SGVpZ2h0OiBudW1iZXI7XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29sdW1uRGF0ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PERhdGU+KHVuZGVmaW5lZCk7XG5cbiAgbWFya2VyJDogT2JzZXJ2YWJsZTx7XG4gICAgaXNWaXNpYmxlOiBib29sZWFuO1xuICAgIHRvcDogbnVtYmVyO1xuICB9PiA9IHRoaXMuem9uZS5vblN0YWJsZS5waXBlKFxuICAgIHN3aXRjaE1hcCgoKSA9PiBpbnRlcnZhbCg2MCAqIDEwMDApKSxcbiAgICBzdGFydFdpdGgoMCksXG4gICAgc3dpdGNoTWFwVG8odGhpcy5jb2x1bW5EYXRlJCksXG4gICAgbWFwKChjb2x1bW5EYXRlKSA9PiB7XG4gICAgICBjb25zdCBzdGFydE9mRGF5ID0gdGhpcy5kYXRlQWRhcHRlci5zZXRNaW51dGVzKFxuICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLnNldEhvdXJzKGNvbHVtbkRhdGUsIHRoaXMuZGF5U3RhcnRIb3VyKSxcbiAgICAgICAgdGhpcy5kYXlTdGFydE1pbnV0ZVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGVuZE9mRGF5ID0gdGhpcy5kYXRlQWRhcHRlci5zZXRNaW51dGVzKFxuICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLnNldEhvdXJzKGNvbHVtbkRhdGUsIHRoaXMuZGF5RW5kSG91ciksXG4gICAgICAgIHRoaXMuZGF5RW5kTWludXRlXG4gICAgICApO1xuICAgICAgY29uc3QgaG91ckhlaWdodE1vZGlmaWVyID1cbiAgICAgICAgKHRoaXMuaG91clNlZ21lbnRzICogdGhpcy5ob3VyU2VnbWVudEhlaWdodCkgL1xuICAgICAgICAodGhpcy5ob3VyRHVyYXRpb24gfHwgNjApO1xuICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmlzaWJsZTpcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLmlzU2FtZURheShjb2x1bW5EYXRlLCBub3cpICYmXG4gICAgICAgICAgbm93ID49IHN0YXJ0T2ZEYXkgJiZcbiAgICAgICAgICBub3cgPD0gZW5kT2ZEYXksXG4gICAgICAgIHRvcDpcbiAgICAgICAgICB0aGlzLmRhdGVBZGFwdGVyLmRpZmZlcmVuY2VJbk1pbnV0ZXMobm93LCBzdGFydE9mRGF5KSAqXG4gICAgICAgICAgaG91ckhlaWdodE1vZGlmaWVyLFxuICAgICAgfTtcbiAgICB9KVxuICApO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLCBwcml2YXRlIHpvbmU6IE5nWm9uZSkge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuY29sdW1uRGF0ZSkge1xuICAgICAgdGhpcy5jb2x1bW5EYXRlJC5uZXh0KGNoYW5nZXMuY29sdW1uRGF0ZS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19