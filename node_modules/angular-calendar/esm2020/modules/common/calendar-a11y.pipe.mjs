import { Pipe, LOCALE_ID, Inject } from '@angular/core';
import { CalendarA11y } from './calendar-a11y.provider';
import * as i0 from "@angular/core";
import * as i1 from "./calendar-a11y.provider";
/**
 * This pipe is primarily for rendering aria labels. Example usage:
 * ```typescript
 * // where `myEvent` is a `CalendarEvent` and myLocale is a locale identifier
 * {{ { event: myEvent, locale: myLocale } | calendarA11y: 'eventDescription' }}
 * ```
 */
export class CalendarA11yPipe {
    constructor(calendarA11y, locale) {
        this.calendarA11y = calendarA11y;
        this.locale = locale;
    }
    transform(a11yParams, method) {
        a11yParams.locale = a11yParams.locale || this.locale;
        if (typeof this.calendarA11y[method] === 'undefined') {
            const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarA11y.prototype)).filter((iMethod) => iMethod !== 'constructor');
            throw new Error(`${method} is not a valid a11y method. Can only be one of ${allowedMethods.join(', ')}`);
        }
        return this.calendarA11y[method](a11yParams);
    }
}
CalendarA11yPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarA11yPipe, deps: [{ token: i1.CalendarA11y }, { token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Pipe });
CalendarA11yPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.1.2", ngImport: i0, type: CalendarA11yPipe, name: "calendarA11y" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: CalendarA11yPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'calendarA11y',
                }]
        }], ctorParameters: function () { return [{ type: i1.CalendarA11y }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYTExeS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jYWxlbmRhci9zcmMvbW9kdWxlcy9jb21tb24vY2FsZW5kYXItYTExeS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7QUFHeEQ7Ozs7OztHQU1HO0FBSUgsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUNVLFlBQTBCLEVBQ1AsTUFBYztRQURqQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUNQLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDeEMsQ0FBQztJQUVKLFNBQVMsQ0FBQyxVQUFzQixFQUFFLE1BQWM7UUFDOUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckQsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3BELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FDL0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQzlDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLENBQUM7WUFDakQsTUFBTSxJQUFJLEtBQUssQ0FDYixHQUFHLE1BQU0sbURBQW1ELGNBQWMsQ0FBQyxJQUFJLENBQzdFLElBQUksQ0FDTCxFQUFFLENBQ0osQ0FBQztTQUNIO1FBQ0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7OzZHQW5CVSxnQkFBZ0IsOENBR2pCLFNBQVM7MkdBSFIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBSDVCLElBQUk7bUJBQUM7b0JBQ0osSUFBSSxFQUFFLGNBQWM7aUJBQ3JCOzswQkFJSSxNQUFNOzJCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtLCBMT0NBTEVfSUQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FsZW5kYXJBMTF5IH0gZnJvbSAnLi9jYWxlbmRhci1hMTF5LnByb3ZpZGVyJztcbmltcG9ydCB7IEExMXlQYXJhbXMgfSBmcm9tICcuL2NhbGVuZGFyLWExMXkuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBUaGlzIHBpcGUgaXMgcHJpbWFyaWx5IGZvciByZW5kZXJpbmcgYXJpYSBsYWJlbHMuIEV4YW1wbGUgdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyB3aGVyZSBgbXlFdmVudGAgaXMgYSBgQ2FsZW5kYXJFdmVudGAgYW5kIG15TG9jYWxlIGlzIGEgbG9jYWxlIGlkZW50aWZpZXJcbiAqIHt7IHsgZXZlbnQ6IG15RXZlbnQsIGxvY2FsZTogbXlMb2NhbGUgfSB8IGNhbGVuZGFyQTExeTogJ2V2ZW50RGVzY3JpcHRpb24nIH19XG4gKiBgYGBcbiAqL1xuQFBpcGUoe1xuICBuYW1lOiAnY2FsZW5kYXJBMTF5Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ2FsZW5kYXJBMTF5UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNhbGVuZGFyQTExeTogQ2FsZW5kYXJBMTF5LFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZTogc3RyaW5nXG4gICkge31cblxuICB0cmFuc2Zvcm0oYTExeVBhcmFtczogQTExeVBhcmFtcywgbWV0aG9kOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGExMXlQYXJhbXMubG9jYWxlID0gYTExeVBhcmFtcy5sb2NhbGUgfHwgdGhpcy5sb2NhbGU7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmNhbGVuZGFyQTExeVttZXRob2RdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgYWxsb3dlZE1ldGhvZHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhcbiAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKENhbGVuZGFyQTExeS5wcm90b3R5cGUpXG4gICAgICApLmZpbHRlcigoaU1ldGhvZCkgPT4gaU1ldGhvZCAhPT0gJ2NvbnN0cnVjdG9yJyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGAke21ldGhvZH0gaXMgbm90IGEgdmFsaWQgYTExeSBtZXRob2QuIENhbiBvbmx5IGJlIG9uZSBvZiAke2FsbG93ZWRNZXRob2RzLmpvaW4oXG4gICAgICAgICAgJywgJ1xuICAgICAgICApfWBcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNhbGVuZGFyQTExeVttZXRob2RdKGExMXlQYXJhbXMpO1xuICB9XG59XG4iXX0=