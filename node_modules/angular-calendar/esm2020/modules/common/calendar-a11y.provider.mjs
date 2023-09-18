import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * This class is responsible for adding accessibility to the calendar.
 * You may override any of its methods via angulars DI to suit your requirements.
 * For example:
 *
 * ```typescript
 * import { A11yParams, CalendarA11y } from 'angular-calendar';
 * import { formatDate, I18nPluralPipe } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * // adding your own a11y params
 * export interface CustomA11yParams extends A11yParams {
 *   isDrSuess?: boolean;
 * }
 *
 * @Injectable()
 * export class CustomCalendarA11y extends CalendarA11y {
 *   constructor(protected i18nPlural: I18nPluralPipe) {
 *     super(i18nPlural);
 *   }
 *
 *   // overriding a function
 *   public openDayEventsLandmark({ date, locale, isDrSuess }: CustomA11yParams): string {
 *     if (isDrSuess) {
 *       return `
 *         ${formatDate(date, 'EEEE MMMM d', locale)}
 *          Today you are you! That is truer than true! There is no one alive
 *          who is you-er than you!
 *       `;
 *     }
 *   }
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *  provide: CalendarA11y,
 *  useClass: CustomCalendarA11y
 * }]
 * ```
 */
export class CalendarA11y {
    constructor(i18nPlural) {
        this.i18nPlural = i18nPlural;
    }
    /**
     * Aria label for the badges/date of a cell
     * @example: `Saturday October 19 1 event click to expand`
     */
    monthCell({ day, locale }) {
        if (day.badgeTotal > 0) {
            return `
        ${formatDate(day.date, 'EEEE MMMM d', locale)},
        ${this.i18nPlural.transform(day.badgeTotal, {
                '=0': 'No events',
                '=1': 'One event',
                other: '# events',
            })},
         click to expand
      `;
        }
        else {
            return `${formatDate(day.date, 'EEEE MMMM d', locale)}`;
        }
    }
    /**
     * Aria label for the open day events start landmark
     * @example: `Saturday October 19 expanded view`
     */
    openDayEventsLandmark({ date, locale }) {
        return `
      Beginning of expanded view for ${formatDate(date, 'EEEE MMMM dd', locale)}
    `;
    }
    /**
     * Aria label for alert that a day in the month view was expanded
     * @example: `Saturday October 19 expanded`
     */
    openDayEventsAlert({ date, locale }) {
        return `${formatDate(date, 'EEEE MMMM dd', locale)} expanded`;
    }
    /**
     * Descriptive aria label for an event
     * @example: `Saturday October 19th, Scott's Pizza Party, from 11:00am to 5:00pm`
     */
    eventDescription({ event, locale }) {
        if (event.allDay === true) {
            return this.allDayEventDescription({ event, locale });
        }
        const aria = `
      ${formatDate(event.start, 'EEEE MMMM dd', locale)},
      ${event.title}, from ${formatDate(event.start, 'hh:mm a', locale)}
    `;
        if (event.end) {
            return aria + ` to ${formatDate(event.end, 'hh:mm a', locale)}`;
        }
        return aria;
    }
    /**
     * Descriptive aria label for an all day event
     * @example:
     * `Scott's Party, event spans multiple days: start time October 19 5:00pm, no stop time`
     */
    allDayEventDescription({ event, locale }) {
        const aria = `
      ${event.title}, event spans multiple days:
      start time ${formatDate(event.start, 'MMMM dd hh:mm a', locale)}
    `;
        if (event.end) {
            return (aria + `, stop time ${formatDate(event.end, 'MMMM d hh:mm a', locale)}`);
        }
        return aria + `, no stop time`;
    }
    /**
     * Aria label for the calendar event actions icons
     * @returns 'Edit' for fa-pencil icons, and 'Delete' for fa-times icons
     */
    actionButtonLabel({ action }) {
        return action.a11yLabel;
    }
    /**
     * @returns {number} Tab index to be given to month cells
     */
    monthCellTabIndex() {
        return 0;
    }
    /**
     * @returns true if the events inside the month cell should be aria-hidden
     */
    hideMonthCellEvents() {
        return true;
    }
    /**
     * @returns true if event titles should be aria-hidden (global)
     */
    hideEventTitle() {
        return true;
    }
    /**
     * @returns true if hour segments in the week view should be aria-hidden
     */
    hideWeekHourSegment() {
        return true;
    }
    /**
     * @returns true if hour segments in the day view should be aria-hidden
     */
    hideDayHourSegment() {
        return true;
    }
}
CalendarA11y.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarA11y, deps: [{ token: i1.I18nPluralPipe }], target: i0.ɵɵFactoryTarget.Injectable });
CalendarA11y.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarA11y });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarA11y, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.I18nPluralPipe }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYTExeS5wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2FsZW5kYXIvc3JjL21vZHVsZXMvY29tbW9uL2NhbGVuZGFyLWExMXkucHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFrQixNQUFNLGlCQUFpQixDQUFDOzs7QUFHN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVDRztBQUVILE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQXNCLFVBQTBCO1FBQTFCLGVBQVUsR0FBVixVQUFVLENBQWdCO0lBQUcsQ0FBQztJQUVwRDs7O09BR0c7SUFDSSxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFjO1FBQzFDLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDdEIsT0FBTztVQUNILFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUM7VUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDMUMsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxXQUFXO2dCQUNqQixLQUFLLEVBQUUsVUFBVTthQUNsQixDQUFDOztPQUVILENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO1NBQ3pEO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLHFCQUFxQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBYztRQUN2RCxPQUFPO3VDQUM0QixVQUFVLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUM7S0FDMUUsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSSxrQkFBa0IsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQWM7UUFDcEQsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBYztRQUNuRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDdkQ7UUFFRCxNQUFNLElBQUksR0FBRztRQUNULFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUM7UUFDL0MsS0FBSyxDQUFDLEtBQUssVUFBVSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDO0tBQ2xFLENBQUM7UUFDRixJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDYixPQUFPLElBQUksR0FBRyxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHNCQUFzQixDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBYztRQUN6RCxNQUFNLElBQUksR0FBRztRQUNULEtBQUssQ0FBQyxLQUFLO21CQUNBLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQztLQUNoRSxDQUFDO1FBQ0YsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ2IsT0FBTyxDQUNMLElBQUksR0FBRyxlQUFlLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQ3hFLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxpQkFBaUIsQ0FBQyxFQUFFLE1BQU0sRUFBYztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksbUJBQW1CO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0ksY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNJLG1CQUFtQjtRQUN4QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNJLGtCQUFrQjtRQUN2QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O3lHQXZIVSxZQUFZOzZHQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFEeEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZvcm1hdERhdGUsIEkxOG5QbHVyYWxQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEExMXlQYXJhbXMgfSBmcm9tICcuL2NhbGVuZGFyLWExMXkuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGlzIHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgYWNjZXNzaWJpbGl0eSB0byB0aGUgY2FsZW5kYXIuXG4gKiBZb3UgbWF5IG92ZXJyaWRlIGFueSBvZiBpdHMgbWV0aG9kcyB2aWEgYW5ndWxhcnMgREkgdG8gc3VpdCB5b3VyIHJlcXVpcmVtZW50cy5cbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IEExMXlQYXJhbXMsIENhbGVuZGFyQTExeSB9IGZyb20gJ2FuZ3VsYXItY2FsZW5kYXInO1xuICogaW1wb3J0IHsgZm9ybWF0RGF0ZSwgSTE4blBsdXJhbFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuICogaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICpcbiAqIC8vIGFkZGluZyB5b3VyIG93biBhMTF5IHBhcmFtc1xuICogZXhwb3J0IGludGVyZmFjZSBDdXN0b21BMTF5UGFyYW1zIGV4dGVuZHMgQTExeVBhcmFtcyB7XG4gKiAgIGlzRHJTdWVzcz86IGJvb2xlYW47XG4gKiB9XG4gKlxuICogQEluamVjdGFibGUoKVxuICogZXhwb3J0IGNsYXNzIEN1c3RvbUNhbGVuZGFyQTExeSBleHRlbmRzIENhbGVuZGFyQTExeSB7XG4gKiAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpMThuUGx1cmFsOiBJMThuUGx1cmFsUGlwZSkge1xuICogICAgIHN1cGVyKGkxOG5QbHVyYWwpO1xuICogICB9XG4gKlxuICogICAvLyBvdmVycmlkaW5nIGEgZnVuY3Rpb25cbiAqICAgcHVibGljIG9wZW5EYXlFdmVudHNMYW5kbWFyayh7IGRhdGUsIGxvY2FsZSwgaXNEclN1ZXNzIH06IEN1c3RvbUExMXlQYXJhbXMpOiBzdHJpbmcge1xuICogICAgIGlmIChpc0RyU3Vlc3MpIHtcbiAqICAgICAgIHJldHVybiBgXG4gKiAgICAgICAgICR7Zm9ybWF0RGF0ZShkYXRlLCAnRUVFRSBNTU1NIGQnLCBsb2NhbGUpfVxuICogICAgICAgICAgVG9kYXkgeW91IGFyZSB5b3UhIFRoYXQgaXMgdHJ1ZXIgdGhhbiB0cnVlISBUaGVyZSBpcyBubyBvbmUgYWxpdmVcbiAqICAgICAgICAgIHdobyBpcyB5b3UtZXIgdGhhbiB5b3UhXG4gKiAgICAgICBgO1xuICogICAgIH1cbiAqICAgfVxuICogfVxuICpcbiAqIC8vIGluIHlvdXIgY29tcG9uZW50IHRoYXQgdXNlcyB0aGUgY2FsZW5kYXJcbiAqIHByb3ZpZGVyczogW3tcbiAqICBwcm92aWRlOiBDYWxlbmRhckExMXksXG4gKiAgdXNlQ2xhc3M6IEN1c3RvbUNhbGVuZGFyQTExeVxuICogfV1cbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJBMTF5IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGkxOG5QbHVyYWw6IEkxOG5QbHVyYWxQaXBlKSB7fVxuXG4gIC8qKlxuICAgKiBBcmlhIGxhYmVsIGZvciB0aGUgYmFkZ2VzL2RhdGUgb2YgYSBjZWxsXG4gICAqIEBleGFtcGxlOiBgU2F0dXJkYXkgT2N0b2JlciAxOSAxIGV2ZW50IGNsaWNrIHRvIGV4cGFuZGBcbiAgICovXG4gIHB1YmxpYyBtb250aENlbGwoeyBkYXksIGxvY2FsZSB9OiBBMTF5UGFyYW1zKTogc3RyaW5nIHtcbiAgICBpZiAoZGF5LmJhZGdlVG90YWwgPiAwKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgICAke2Zvcm1hdERhdGUoZGF5LmRhdGUsICdFRUVFIE1NTU0gZCcsIGxvY2FsZSl9LFxuICAgICAgICAke3RoaXMuaTE4blBsdXJhbC50cmFuc2Zvcm0oZGF5LmJhZGdlVG90YWwsIHtcbiAgICAgICAgICAnPTAnOiAnTm8gZXZlbnRzJyxcbiAgICAgICAgICAnPTEnOiAnT25lIGV2ZW50JyxcbiAgICAgICAgICBvdGhlcjogJyMgZXZlbnRzJyxcbiAgICAgICAgfSl9LFxuICAgICAgICAgY2xpY2sgdG8gZXhwYW5kXG4gICAgICBgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYCR7Zm9ybWF0RGF0ZShkYXkuZGF0ZSwgJ0VFRUUgTU1NTSBkJywgbG9jYWxlKX1gO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBcmlhIGxhYmVsIGZvciB0aGUgb3BlbiBkYXkgZXZlbnRzIHN0YXJ0IGxhbmRtYXJrXG4gICAqIEBleGFtcGxlOiBgU2F0dXJkYXkgT2N0b2JlciAxOSBleHBhbmRlZCB2aWV3YFxuICAgKi9cbiAgcHVibGljIG9wZW5EYXlFdmVudHNMYW5kbWFyayh7IGRhdGUsIGxvY2FsZSB9OiBBMTF5UGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYFxuICAgICAgQmVnaW5uaW5nIG9mIGV4cGFuZGVkIHZpZXcgZm9yICR7Zm9ybWF0RGF0ZShkYXRlLCAnRUVFRSBNTU1NIGRkJywgbG9jYWxlKX1cbiAgICBgO1xuICB9XG5cbiAgLyoqXG4gICAqIEFyaWEgbGFiZWwgZm9yIGFsZXJ0IHRoYXQgYSBkYXkgaW4gdGhlIG1vbnRoIHZpZXcgd2FzIGV4cGFuZGVkXG4gICAqIEBleGFtcGxlOiBgU2F0dXJkYXkgT2N0b2JlciAxOSBleHBhbmRlZGBcbiAgICovXG4gIHB1YmxpYyBvcGVuRGF5RXZlbnRzQWxlcnQoeyBkYXRlLCBsb2NhbGUgfTogQTExeVBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke2Zvcm1hdERhdGUoZGF0ZSwgJ0VFRUUgTU1NTSBkZCcsIGxvY2FsZSl9IGV4cGFuZGVkYDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGl2ZSBhcmlhIGxhYmVsIGZvciBhbiBldmVudFxuICAgKiBAZXhhbXBsZTogYFNhdHVyZGF5IE9jdG9iZXIgMTl0aCwgU2NvdHQncyBQaXp6YSBQYXJ0eSwgZnJvbSAxMTowMGFtIHRvIDU6MDBwbWBcbiAgICovXG4gIHB1YmxpYyBldmVudERlc2NyaXB0aW9uKHsgZXZlbnQsIGxvY2FsZSB9OiBBMTF5UGFyYW1zKTogc3RyaW5nIHtcbiAgICBpZiAoZXZlbnQuYWxsRGF5ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5hbGxEYXlFdmVudERlc2NyaXB0aW9uKHsgZXZlbnQsIGxvY2FsZSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmlhID0gYFxuICAgICAgJHtmb3JtYXREYXRlKGV2ZW50LnN0YXJ0LCAnRUVFRSBNTU1NIGRkJywgbG9jYWxlKX0sXG4gICAgICAke2V2ZW50LnRpdGxlfSwgZnJvbSAke2Zvcm1hdERhdGUoZXZlbnQuc3RhcnQsICdoaDptbSBhJywgbG9jYWxlKX1cbiAgICBgO1xuICAgIGlmIChldmVudC5lbmQpIHtcbiAgICAgIHJldHVybiBhcmlhICsgYCB0byAke2Zvcm1hdERhdGUoZXZlbnQuZW5kLCAnaGg6bW0gYScsIGxvY2FsZSl9YDtcbiAgICB9XG4gICAgcmV0dXJuIGFyaWE7XG4gIH1cblxuICAvKipcbiAgICogRGVzY3JpcHRpdmUgYXJpYSBsYWJlbCBmb3IgYW4gYWxsIGRheSBldmVudFxuICAgKiBAZXhhbXBsZTpcbiAgICogYFNjb3R0J3MgUGFydHksIGV2ZW50IHNwYW5zIG11bHRpcGxlIGRheXM6IHN0YXJ0IHRpbWUgT2N0b2JlciAxOSA1OjAwcG0sIG5vIHN0b3AgdGltZWBcbiAgICovXG4gIHB1YmxpYyBhbGxEYXlFdmVudERlc2NyaXB0aW9uKHsgZXZlbnQsIGxvY2FsZSB9OiBBMTF5UGFyYW1zKTogc3RyaW5nIHtcbiAgICBjb25zdCBhcmlhID0gYFxuICAgICAgJHtldmVudC50aXRsZX0sIGV2ZW50IHNwYW5zIG11bHRpcGxlIGRheXM6XG4gICAgICBzdGFydCB0aW1lICR7Zm9ybWF0RGF0ZShldmVudC5zdGFydCwgJ01NTU0gZGQgaGg6bW0gYScsIGxvY2FsZSl9XG4gICAgYDtcbiAgICBpZiAoZXZlbnQuZW5kKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBhcmlhICsgYCwgc3RvcCB0aW1lICR7Zm9ybWF0RGF0ZShldmVudC5lbmQsICdNTU1NIGQgaGg6bW0gYScsIGxvY2FsZSl9YFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyaWEgKyBgLCBubyBzdG9wIHRpbWVgO1xuICB9XG5cbiAgLyoqXG4gICAqIEFyaWEgbGFiZWwgZm9yIHRoZSBjYWxlbmRhciBldmVudCBhY3Rpb25zIGljb25zXG4gICAqIEByZXR1cm5zICdFZGl0JyBmb3IgZmEtcGVuY2lsIGljb25zLCBhbmQgJ0RlbGV0ZScgZm9yIGZhLXRpbWVzIGljb25zXG4gICAqL1xuICBwdWJsaWMgYWN0aW9uQnV0dG9uTGFiZWwoeyBhY3Rpb24gfTogQTExeVBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGFjdGlvbi5hMTF5TGFiZWw7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge251bWJlcn0gVGFiIGluZGV4IHRvIGJlIGdpdmVuIHRvIG1vbnRoIGNlbGxzXG4gICAqL1xuICBwdWJsaWMgbW9udGhDZWxsVGFiSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBldmVudHMgaW5zaWRlIHRoZSBtb250aCBjZWxsIHNob3VsZCBiZSBhcmlhLWhpZGRlblxuICAgKi9cbiAgcHVibGljIGhpZGVNb250aENlbGxFdmVudHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgdHJ1ZSBpZiBldmVudCB0aXRsZXMgc2hvdWxkIGJlIGFyaWEtaGlkZGVuIChnbG9iYWwpXG4gICAqL1xuICBwdWJsaWMgaGlkZUV2ZW50VGl0bGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgdHJ1ZSBpZiBob3VyIHNlZ21lbnRzIGluIHRoZSB3ZWVrIHZpZXcgc2hvdWxkIGJlIGFyaWEtaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgaGlkZVdlZWtIb3VyU2VnbWVudCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB0cnVlIGlmIGhvdXIgc2VnbWVudHMgaW4gdGhlIGRheSB2aWV3IHNob3VsZCBiZSBhcmlhLWhpZGRlblxuICAgKi9cbiAgcHVibGljIGhpZGVEYXlIb3VyU2VnbWVudCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19