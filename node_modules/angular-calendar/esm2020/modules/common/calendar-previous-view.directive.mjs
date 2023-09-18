import { Directive, HostListener, Input, Output, EventEmitter, } from '@angular/core';
import { CalendarView } from './calendar-view.enum';
import { addDaysWithExclusions } from './util';
import * as i0 from "@angular/core";
import * as i1 from "../../date-adapters/date-adapter";
/**
 * Change the view date to the previous view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarPreviousView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Previous
 * </button>
 * ```
 */
export class CalendarPreviousViewDirective {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
        /**
         * Days to skip when going back by 1 day
         */
        this.excludeDays = [];
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    onClick() {
        const subFn = {
            day: this.dateAdapter.subDays,
            week: this.dateAdapter.subWeeks,
            month: this.dateAdapter.subMonths,
        }[this.view];
        if (this.view === CalendarView.Day) {
            this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -1, this.excludeDays));
        }
        else if (this.view === CalendarView.Week && this.daysInWeek) {
            this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -this.daysInWeek, this.excludeDays));
        }
        else {
            this.viewDateChange.emit(subFn(this.viewDate, 1));
        }
    }
}
CalendarPreviousViewDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarPreviousViewDirective, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Directive });
CalendarPreviousViewDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.1.2", type: CalendarPreviousViewDirective, selector: "[mwlCalendarPreviousView]", inputs: { view: "view", viewDate: "viewDate", excludeDays: "excludeDays", daysInWeek: "daysInWeek" }, outputs: { viewDateChange: "viewDateChange" }, host: { listeners: { "click": "onClick()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarPreviousViewDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mwlCalendarPreviousView]',
                }]
        }], ctorParameters: function () { return [{ type: i1.DateAdapter }]; }, propDecorators: { view: [{
                type: Input
            }], viewDate: [{
                type: Input
            }], excludeDays: [{
                type: Input
            }], daysInWeek: [{
                type: Input
            }], viewDateChange: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItcHJldmlvdXMtdmlldy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNhbGVuZGFyL3NyYy9tb2R1bGVzL2NvbW1vbi9jYWxlbmRhci1wcmV2aW91cy12aWV3LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sUUFBUSxDQUFDOzs7QUFFL0M7Ozs7Ozs7Ozs7O0dBV0c7QUFJSCxNQUFNLE9BQU8sNkJBQTZCO0lBMEJ4QyxZQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQWY1Qzs7V0FFRztRQUNNLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBT3BDOztXQUVHO1FBQ08sbUJBQWMsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUVuQixDQUFDO0lBRWhEOztPQUVHO0lBRUgsT0FBTztRQUNMLE1BQU0sS0FBSyxHQUFRO1lBQ2pCLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU87WUFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUTtZQUMvQixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1NBQ2xDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxHQUFHLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQ3RCLHFCQUFxQixDQUNuQixJQUFJLENBQUMsV0FBVyxFQUNoQixJQUFJLENBQUMsUUFBUSxFQUNiLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxXQUFXLENBQ2pCLENBQ0YsQ0FBQztTQUNIO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUM3RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDdEIscUJBQXFCLENBQ25CLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxRQUFRLEVBQ2IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNoQixJQUFJLENBQUMsV0FBVyxDQUNqQixDQUNGLENBQUM7U0FDSDthQUFNO1lBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7OzBIQTVEVSw2QkFBNkI7OEdBQTdCLDZCQUE2QjsyRkFBN0IsNkJBQTZCO2tCQUh6QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3RDO2tHQUtVLElBQUk7c0JBQVosS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQUtHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBS0csVUFBVTtzQkFBbEIsS0FBSztnQkFLSSxjQUFjO3NCQUF2QixNQUFNO2dCQVFQLE9BQU87c0JBRE4sWUFBWTt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IENhbGVuZGFyVmlldyB9IGZyb20gJy4vY2FsZW5kYXItdmlldy5lbnVtJztcbmltcG9ydCB7IGFkZERheXNXaXRoRXhjbHVzaW9ucyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ2hhbmdlIHRoZSB2aWV3IGRhdGUgdG8gdGhlIHByZXZpb3VzIHZpZXcuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIDxidXR0b25cbiAqICBtd2xDYWxlbmRhclByZXZpb3VzVmlld1xuICogIFsodmlld0RhdGUpXT1cInZpZXdEYXRlXCJcbiAqICBbdmlld109XCJ2aWV3XCI+XG4gKiAgUHJldmlvdXNcbiAqIDwvYnV0dG9uPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xDYWxlbmRhclByZXZpb3VzVmlld10nLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclByZXZpb3VzVmlld0RpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2aWV3XG4gICAqL1xuICBASW5wdXQoKSB2aWV3OiBDYWxlbmRhclZpZXcgfCAnbW9udGgnIHwgJ3dlZWsnIHwgJ2RheSc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZpZXcgZGF0ZVxuICAgKi9cbiAgQElucHV0KCkgdmlld0RhdGU6IERhdGU7XG5cbiAgLyoqXG4gICAqIERheXMgdG8gc2tpcCB3aGVuIGdvaW5nIGJhY2sgYnkgMSBkYXlcbiAgICovXG4gIEBJbnB1dCgpIGV4Y2x1ZGVEYXlzOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgaW4gYSB3ZWVrLiBJZiBzZXQgd2lsbCBzdWJ0cmFjdCB0aGlzIGFtb3VudCBvZiBkYXlzIGluc3RlYWQgb2YgMSB3ZWVrXG4gICAqL1xuICBASW5wdXQoKSBkYXlzSW5XZWVrOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB2aWV3IGRhdGUgaXMgY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHZpZXdEYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGF0ZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIpIHt9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgb25DbGljaygpOiB2b2lkIHtcbiAgICBjb25zdCBzdWJGbjogYW55ID0ge1xuICAgICAgZGF5OiB0aGlzLmRhdGVBZGFwdGVyLnN1YkRheXMsXG4gICAgICB3ZWVrOiB0aGlzLmRhdGVBZGFwdGVyLnN1YldlZWtzLFxuICAgICAgbW9udGg6IHRoaXMuZGF0ZUFkYXB0ZXIuc3ViTW9udGhzLFxuICAgIH1bdGhpcy52aWV3XTtcblxuICAgIGlmICh0aGlzLnZpZXcgPT09IENhbGVuZGFyVmlldy5EYXkpIHtcbiAgICAgIHRoaXMudmlld0RhdGVDaGFuZ2UuZW1pdChcbiAgICAgICAgYWRkRGF5c1dpdGhFeGNsdXNpb25zKFxuICAgICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgICAtMSxcbiAgICAgICAgICB0aGlzLmV4Y2x1ZGVEYXlzXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZpZXcgPT09IENhbGVuZGFyVmlldy5XZWVrICYmIHRoaXMuZGF5c0luV2Vlaykge1xuICAgICAgdGhpcy52aWV3RGF0ZUNoYW5nZS5lbWl0KFxuICAgICAgICBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgICB0aGlzLnZpZXdEYXRlLFxuICAgICAgICAgIC10aGlzLmRheXNJbldlZWssXG4gICAgICAgICAgdGhpcy5leGNsdWRlRGF5c1xuICAgICAgICApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXdEYXRlQ2hhbmdlLmVtaXQoc3ViRm4odGhpcy52aWV3RGF0ZSwgMSkpO1xuICAgIH1cbiAgfVxufVxuIl19