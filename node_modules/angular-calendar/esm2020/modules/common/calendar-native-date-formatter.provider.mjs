import { Injectable } from '@angular/core';
import { getWeekViewPeriod } from './util';
import * as i0 from "@angular/core";
import * as i1 from "../../date-adapters/date-adapter";
/**
 * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting.
 *
 * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
 */
export class CalendarNativeDateFormatter {
    constructor(dateAdapter) {
        this.dateAdapter = dateAdapter;
    }
    /**
     * The month view header week day labels
     */
    monthViewColumnHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }
    /**
     * The month view cell day number
     */
    monthViewDayNumber({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date);
    }
    /**
     * The month view title
     */
    monthViewTitle({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
        }).format(date);
    }
    /**
     * The week view header week day labels
     */
    weekViewColumnHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }
    /**
     * The week view sub header day and month labels
     */
    weekViewColumnSubHeader({ date, locale, }) {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
        }).format(date);
    }
    /**
     * The week view title
     */
    weekViewTitle({ date, locale, weekStartsOn, excludeDays, daysInWeek, }) {
        const { viewStart, viewEnd } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
        const format = (dateToFormat, showYear) => new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short',
            year: showYear ? 'numeric' : undefined,
        }).format(dateToFormat);
        return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
    }
    /**
     * The time formatting down the left hand side of the week view
     */
    weekViewHour({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
    }
    /**
     * The time formatting down the left hand side of the day view
     */
    dayViewHour({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
    }
    /**
     * The day view title
     */
    dayViewTitle({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        }).format(date);
    }
}
CalendarNativeDateFormatter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarNativeDateFormatter, deps: [{ token: i1.DateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
CalendarNativeDateFormatter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarNativeDateFormatter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarNativeDateFormatter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.DateAdapter }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbmF0aXZlLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jYWxlbmRhci9zcmMvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItbmF0aXZlLWRhdGUtZm9ybWF0dGVyLnByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sUUFBUSxDQUFDOzs7QUFFM0M7Ozs7R0FJRztBQUVILE1BQU0sT0FBTywyQkFBMkI7SUFHdEMsWUFBc0IsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFBRyxDQUFDO0lBRWxEOztPQUVHO0lBQ0kscUJBQXFCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUF1QjtRQUNoRSxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVEOztPQUVHO0lBQ0ksa0JBQWtCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUF1QjtRQUM3RCxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVEOztPQUVHO0lBQ0ksY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBdUI7UUFDekQsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksRUFBRSxTQUFTO1lBQ2YsS0FBSyxFQUFFLE1BQU07U0FDZCxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7T0FFRztJQUNJLG9CQUFvQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBdUI7UUFDL0QsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRDs7T0FFRztJQUNJLHVCQUF1QixDQUFDLEVBQzdCLElBQUksRUFDSixNQUFNLEdBQ2M7UUFDcEIsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQ3JDLEdBQUcsRUFBRSxTQUFTO1lBQ2QsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxFQUNuQixJQUFJLEVBQ0osTUFBTSxFQUNOLFlBQVksRUFDWixXQUFXLEVBQ1gsVUFBVSxHQUNVO1FBQ3BCLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsaUJBQWlCLENBQzlDLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksRUFDSixZQUFZLEVBQ1osV0FBVyxFQUNYLFVBQVUsQ0FDWCxDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsQ0FBQyxZQUFrQixFQUFFLFFBQWlCLEVBQUUsRUFBRSxDQUN2RCxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO1lBQzlCLEdBQUcsRUFBRSxTQUFTO1lBQ2QsS0FBSyxFQUFFLE9BQU87WUFDZCxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDdkMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUxQixPQUFPLEdBQUcsTUFBTSxDQUNkLFNBQVMsRUFDVCxTQUFTLENBQUMsY0FBYyxFQUFFLEtBQUssT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUN4RCxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUF1QjtRQUN2RCxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVEOztPQUVHO0lBQ0ksV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBdUI7UUFDdEQsT0FBTyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRDs7T0FFRztJQUNJLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQXVCO1FBQ3ZELE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUNyQyxHQUFHLEVBQUUsU0FBUztZQUNkLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsTUFBTTtTQUNoQixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7O3dIQXhHVSwyQkFBMkI7NEhBQTNCLDJCQUEyQjsyRkFBM0IsMkJBQTJCO2tCQUR2QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2FsZW5kYXJEYXRlRm9ybWF0dGVySW50ZXJmYWNlLFxuICBEYXRlRm9ybWF0dGVyUGFyYW1zLFxufSBmcm9tICcuL2NhbGVuZGFyLWRhdGUtZm9ybWF0dGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IGdldFdlZWtWaWV3UGVyaW9kIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBUaGlzIHdpbGwgdXNlIDxhIGhyZWY9XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9JbnRsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SW50bDwvYT4gQVBJIHRvIGRvIGFsbCBkYXRlIGZvcm1hdHRpbmcuXG4gKlxuICogWW91IHdpbGwgbmVlZCB0byBpbmNsdWRlIGEgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9hbmR5ZWFybnNoYXcvSW50bC5qcy9cIj5wb2x5ZmlsbDwvYT4gZm9yIG9sZGVyIGJyb3dzZXJzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJOYXRpdmVEYXRlRm9ybWF0dGVyXG4gIGltcGxlbWVudHMgQ2FsZW5kYXJEYXRlRm9ybWF0dGVySW50ZXJmYWNlXG57XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXIpIHt9XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCB2aWV3IGhlYWRlciB3ZWVrIGRheSBsYWJlbHNcbiAgICovXG4gIHB1YmxpYyBtb250aFZpZXdDb2x1bW5IZWFkZXIoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwgeyB3ZWVrZGF5OiAnbG9uZycgfSkuZm9ybWF0KGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtb250aCB2aWV3IGNlbGwgZGF5IG51bWJlclxuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld0RheU51bWJlcih7IGRhdGUsIGxvY2FsZSB9OiBEYXRlRm9ybWF0dGVyUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCB7IGRheTogJ251bWVyaWMnIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbW9udGggdmlldyB0aXRsZVxuICAgKi9cbiAgcHVibGljIG1vbnRoVmlld1RpdGxlKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHtcbiAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgIG1vbnRoOiAnbG9uZycsXG4gICAgfSkuZm9ybWF0KGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgaGVhZGVyIHdlZWsgZGF5IGxhYmVsc1xuICAgKi9cbiAgcHVibGljIHdlZWtWaWV3Q29sdW1uSGVhZGVyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgd2Vla2RheTogJ2xvbmcnIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgd2VlayB2aWV3IHN1YiBoZWFkZXIgZGF5IGFuZCBtb250aCBsYWJlbHNcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld0NvbHVtblN1YkhlYWRlcih7XG4gICAgZGF0ZSxcbiAgICBsb2NhbGUsXG4gIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHtcbiAgICAgIGRheTogJ251bWVyaWMnLFxuICAgICAgbW9udGg6ICdzaG9ydCcsXG4gICAgfSkuZm9ybWF0KGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWVrIHZpZXcgdGl0bGVcbiAgICovXG4gIHB1YmxpYyB3ZWVrVmlld1RpdGxlKHtcbiAgICBkYXRlLFxuICAgIGxvY2FsZSxcbiAgICB3ZWVrU3RhcnRzT24sXG4gICAgZXhjbHVkZURheXMsXG4gICAgZGF5c0luV2VlayxcbiAgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgY29uc3QgeyB2aWV3U3RhcnQsIHZpZXdFbmQgfSA9IGdldFdlZWtWaWV3UGVyaW9kKFxuICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgIGRhdGUsXG4gICAgICB3ZWVrU3RhcnRzT24sXG4gICAgICBleGNsdWRlRGF5cyxcbiAgICAgIGRheXNJbldlZWtcbiAgICApO1xuXG4gICAgY29uc3QgZm9ybWF0ID0gKGRhdGVUb0Zvcm1hdDogRGF0ZSwgc2hvd1llYXI6IGJvb2xlYW4pID0+XG4gICAgICBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHtcbiAgICAgICAgZGF5OiAnbnVtZXJpYycsXG4gICAgICAgIG1vbnRoOiAnc2hvcnQnLFxuICAgICAgICB5ZWFyOiBzaG93WWVhciA/ICdudW1lcmljJyA6IHVuZGVmaW5lZCxcbiAgICAgIH0pLmZvcm1hdChkYXRlVG9Gb3JtYXQpO1xuXG4gICAgcmV0dXJuIGAke2Zvcm1hdChcbiAgICAgIHZpZXdTdGFydCxcbiAgICAgIHZpZXdTdGFydC5nZXRVVENGdWxsWWVhcigpICE9PSB2aWV3RW5kLmdldFVUQ0Z1bGxZZWFyKClcbiAgICApfSAtICR7Zm9ybWF0KHZpZXdFbmQsIHRydWUpfWA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgZm9ybWF0dGluZyBkb3duIHRoZSBsZWZ0IGhhbmQgc2lkZSBvZiB0aGUgd2VlayB2aWV3XG4gICAqL1xuICBwdWJsaWMgd2Vla1ZpZXdIb3VyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgaG91cjogJ251bWVyaWMnIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBmb3JtYXR0aW5nIGRvd24gdGhlIGxlZnQgaGFuZCBzaWRlIG9mIHRoZSBkYXkgdmlld1xuICAgKi9cbiAgcHVibGljIGRheVZpZXdIb3VyKHsgZGF0ZSwgbG9jYWxlIH06IERhdGVGb3JtYXR0ZXJQYXJhbXMpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUsIHsgaG91cjogJ251bWVyaWMnIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGF5IHZpZXcgdGl0bGVcbiAgICovXG4gIHB1YmxpYyBkYXlWaWV3VGl0bGUoeyBkYXRlLCBsb2NhbGUgfTogRGF0ZUZvcm1hdHRlclBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSwge1xuICAgICAgZGF5OiAnbnVtZXJpYycsXG4gICAgICBtb250aDogJ2xvbmcnLFxuICAgICAgeWVhcjogJ251bWVyaWMnLFxuICAgICAgd2Vla2RheTogJ2xvbmcnLFxuICAgIH0pLmZvcm1hdChkYXRlKTtcbiAgfVxufVxuIl19