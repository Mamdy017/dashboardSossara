import { Pipe, LOCALE_ID, Inject } from '@angular/core';
import { CalendarDateFormatter } from './calendar-date-formatter.provider';
import * as i0 from "@angular/core";
import * as i1 from "./calendar-date-formatter.provider";
/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
export class CalendarDatePipe {
    constructor(dateFormatter, locale) {
        this.dateFormatter = dateFormatter;
        this.locale = locale;
    }
    transform(date, method, locale = this.locale, weekStartsOn = 0, excludeDays = [], daysInWeek) {
        if (typeof this.dateFormatter[method] === 'undefined') {
            const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarDateFormatter.prototype)).filter((iMethod) => iMethod !== 'constructor');
            throw new Error(`${method} is not a valid date formatter. Can only be one of ${allowedMethods.join(', ')}`);
        }
        return this.dateFormatter[method]({
            date,
            locale,
            weekStartsOn,
            excludeDays,
            daysInWeek,
        });
    }
}
CalendarDatePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarDatePipe, deps: [{ token: i1.CalendarDateFormatter }, { token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Pipe });
CalendarDatePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.1.2", ngImport: i0, type: CalendarDatePipe, name: "calendarDate" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarDatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'calendarDate',
                }]
        }], ctorParameters: function () { return [{ type: i1.CalendarDateFormatter }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItZGF0ZS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jYWxlbmRhci9zcmMvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItZGF0ZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7OztBQUUzRTs7Ozs7O0dBTUc7QUFJSCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQ1UsYUFBb0MsRUFDakIsTUFBYztRQURqQyxrQkFBYSxHQUFiLGFBQWEsQ0FBdUI7UUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUN4QyxDQUFDO0lBRUosU0FBUyxDQUNQLElBQVUsRUFDVixNQUFjLEVBQ2QsU0FBaUIsSUFBSSxDQUFDLE1BQU0sRUFDNUIsZUFBdUIsQ0FBQyxFQUN4QixjQUF3QixFQUFFLEVBQzFCLFVBQW1CO1FBRW5CLElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNyRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQy9DLE1BQU0sQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQ3ZELENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLENBQUM7WUFDakQsTUFBTSxJQUFJLEtBQUssQ0FDYixHQUFHLE1BQU0sc0RBQXNELGNBQWMsQ0FBQyxJQUFJLENBQ2hGLElBQUksQ0FDTCxFQUFFLENBQ0osQ0FBQztTQUNIO1FBQ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLElBQUk7WUFDSixNQUFNO1lBQ04sWUFBWTtZQUNaLFdBQVc7WUFDWCxVQUFVO1NBQ1gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7NkdBL0JVLGdCQUFnQix1REFHakIsU0FBUzsyR0FIUixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFINUIsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsY0FBYztpQkFDckI7OzBCQUlJLE1BQU07MkJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0sIExPQ0FMRV9JRCwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckRhdGVGb3JtYXR0ZXIgfSBmcm9tICcuL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyJztcblxuLyoqXG4gKiBUaGlzIHBpcGUgaXMgcHJpbWFyaWx5IGZvciByZW5kZXJpbmcgdGhlIGN1cnJlbnQgdmlldyB0aXRsZS4gRXhhbXBsZSB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIHdoZXJlIGB2aWV3RGF0ZWAgaXMgYSBgRGF0ZWAgYW5kIHZpZXcgaXMgYCdtb250aCcgfCAnd2VlaycgfCAnZGF5J2BcbiAqIHt7IHZpZXdEYXRlIHwgY2FsZW5kYXJEYXRlOih2aWV3ICsgJ1ZpZXdUaXRsZScpOidlbicgfX1cbiAqIGBgYFxuICovXG5AUGlwZSh7XG4gIG5hbWU6ICdjYWxlbmRhckRhdGUnLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckRhdGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZGF0ZUZvcm1hdHRlcjogQ2FsZW5kYXJEYXRlRm9ybWF0dGVyLFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZTogc3RyaW5nXG4gICkge31cblxuICB0cmFuc2Zvcm0oXG4gICAgZGF0ZTogRGF0ZSxcbiAgICBtZXRob2Q6IHN0cmluZyxcbiAgICBsb2NhbGU6IHN0cmluZyA9IHRoaXMubG9jYWxlLFxuICAgIHdlZWtTdGFydHNPbjogbnVtYmVyID0gMCxcbiAgICBleGNsdWRlRGF5czogbnVtYmVyW10gPSBbXSxcbiAgICBkYXlzSW5XZWVrPzogbnVtYmVyXG4gICk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRhdGVGb3JtYXR0ZXJbbWV0aG9kXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IGFsbG93ZWRNZXRob2RzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoXG4gICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihDYWxlbmRhckRhdGVGb3JtYXR0ZXIucHJvdG90eXBlKVxuICAgICAgKS5maWx0ZXIoKGlNZXRob2QpID0+IGlNZXRob2QgIT09ICdjb25zdHJ1Y3RvcicpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgJHttZXRob2R9IGlzIG5vdCBhIHZhbGlkIGRhdGUgZm9ybWF0dGVyLiBDYW4gb25seSBiZSBvbmUgb2YgJHthbGxvd2VkTWV0aG9kcy5qb2luKFxuICAgICAgICAgICcsICdcbiAgICAgICAgKX1gXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kYXRlRm9ybWF0dGVyW21ldGhvZF0oe1xuICAgICAgZGF0ZSxcbiAgICAgIGxvY2FsZSxcbiAgICAgIHdlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVEYXlzLFxuICAgICAgZGF5c0luV2VlayxcbiAgICB9KTtcbiAgfVxufVxuIl19