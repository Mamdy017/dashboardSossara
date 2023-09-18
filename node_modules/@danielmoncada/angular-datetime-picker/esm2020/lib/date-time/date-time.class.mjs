/**
 * date-time.class
 */
import { Inject, Input, Optional, Directive } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import * as i0 from "@angular/core";
import * as i1 from "./adapter/date-time-adapter.class";
let nextUniqueId = 0;
export var DateView;
(function (DateView) {
    DateView["MONTH"] = "month";
    DateView["YEAR"] = "year";
    DateView["MULTI_YEARS"] = "multi-years";
})(DateView || (DateView = {}));
export class OwlDateTime {
    constructor(dateTimeAdapter, dateTimeFormats) {
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        /**
         * Whether to show the second's timer
         */
        this._showSecondsTimer = false;
        /**
         * Whether the timer is in hour12 format
         */
        this._hour12Timer = false;
        /**
         * The view that the calendar should start in.
         */
        this.startView = DateView.MONTH;
        /**
         * Whether to should only the year and multi-year views.
         */
        this.yearOnly = false;
        /**
         * Whether to should only the multi-year view.
         */
        this.multiyearOnly = false;
        /**
         * Hours to change per step
         */
        this._stepHour = 1;
        /**
         * Minutes to change per step
         */
        this._stepMinute = 1;
        /**
         * Seconds to change per step
         */
        this._stepSecond = 1;
        /**
         * Whether to hide dates in other months at the start or end of the current month.
         */
        this._hideOtherMonths = false;
        /**
         * Date Time Checker to check if the give dateTime is selectable
         */
        this.dateTimeChecker = (dateTime) => {
            return (!!dateTime &&
                (!this.dateTimeFilter || this.dateTimeFilter(dateTime)) &&
                (!this.minDateTime ||
                    this.dateTimeAdapter.compare(dateTime, this.minDateTime) >=
                        0) &&
                (!this.maxDateTime ||
                    this.dateTimeAdapter.compare(dateTime, this.maxDateTime) <= 0));
        };
        if (!this.dateTimeAdapter) {
            throw Error(`OwlDateTimePicker: No provider found for DateTimeAdapter. You must import one of the following ` +
                `modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a ` +
                `custom implementation.`);
        }
        if (!this.dateTimeFormats) {
            throw Error(`OwlDateTimePicker: No provider found for OWL_DATE_TIME_FORMATS. You must import one of the following ` +
                `modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a ` +
                `custom implementation.`);
        }
        this._id = `owl-dt-picker-${nextUniqueId++}`;
    }
    get showSecondsTimer() {
        return this._showSecondsTimer;
    }
    set showSecondsTimer(val) {
        this._showSecondsTimer = coerceBooleanProperty(val);
    }
    get hour12Timer() {
        return this._hour12Timer;
    }
    set hour12Timer(val) {
        this._hour12Timer = coerceBooleanProperty(val);
    }
    get stepHour() {
        return this._stepHour;
    }
    set stepHour(val) {
        this._stepHour = coerceNumberProperty(val, 1);
    }
    get stepMinute() {
        return this._stepMinute;
    }
    set stepMinute(val) {
        this._stepMinute = coerceNumberProperty(val, 1);
    }
    get stepSecond() {
        return this._stepSecond;
    }
    set stepSecond(val) {
        this._stepSecond = coerceNumberProperty(val, 1);
    }
    get firstDayOfWeek() {
        return this._firstDayOfWeek;
    }
    set firstDayOfWeek(value) {
        value = coerceNumberProperty(value);
        if (value > 6 || value < 0) {
            this._firstDayOfWeek = undefined;
        }
        else {
            this._firstDayOfWeek = value;
        }
    }
    get hideOtherMonths() {
        return this._hideOtherMonths;
    }
    set hideOtherMonths(val) {
        this._hideOtherMonths = coerceBooleanProperty(val);
    }
    get id() {
        return this._id;
    }
    get formatString() {
        return this.pickerType === 'both'
            ? this.dateTimeFormats.fullPickerInput
            : this.pickerType === 'calendar'
                ? this.dateTimeFormats.datePickerInput
                : this.dateTimeFormats.timePickerInput;
    }
    get disabled() {
        return false;
    }
    getValidDate(obj) {
        return this.dateTimeAdapter.isDateInstance(obj) &&
            this.dateTimeAdapter.isValid(obj)
            ? obj
            : null;
    }
}
OwlDateTime.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTime, deps: [{ token: i1.DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
OwlDateTime.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTime, inputs: { showSecondsTimer: "showSecondsTimer", hour12Timer: "hour12Timer", startView: "startView", yearOnly: "yearOnly", multiyearOnly: "multiyearOnly", stepHour: "stepHour", stepMinute: "stepMinute", stepSecond: "stepSecond", firstDayOfWeek: "firstDayOfWeek", hideOtherMonths: "hideOtherMonths" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTime, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [OWL_DATE_TIME_FORMATS]
                }] }]; }, propDecorators: { showSecondsTimer: [{
                type: Input
            }], hour12Timer: [{
                type: Input
            }], startView: [{
                type: Input
            }], yearOnly: [{
                type: Input
            }], multiyearOnly: [{
                type: Input
            }], stepHour: [{
                type: Input
            }], stepMinute: [{
                type: Input
            }], stepSecond: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], hideOtherMonths: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGlja2VyL3NyYy9saWIvZGF0ZS10aW1lL2RhdGUtdGltZS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE9BQU8sRUFBZSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUNILHFCQUFxQixFQUNyQixvQkFBb0IsRUFDdkIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDbEUsT0FBTyxFQUNILHFCQUFxQixFQUV4QixNQUFNLGtDQUFrQyxDQUFDOzs7QUFFMUMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBUXJCLE1BQU0sQ0FBTixJQUFZLFFBSVg7QUFKRCxXQUFZLFFBQVE7SUFDaEIsMkJBQWUsQ0FBQTtJQUNmLHlCQUFhLENBQUE7SUFDYix1Q0FBMkIsQ0FBQTtBQUMvQixDQUFDLEVBSlcsUUFBUSxLQUFSLFFBQVEsUUFJbkI7QUFLRCxNQUFNLE9BQWdCLFdBQVc7SUE0TDdCLFlBQzBCLGVBQW1DLEVBRy9DLGVBQW1DO1FBSHZCLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQUcvQyxvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7UUEvTGpEOztXQUVHO1FBQ0ssc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBVWxDOztXQUVHO1FBQ0ssaUJBQVksR0FBRyxLQUFLLENBQUM7UUFVN0I7O1dBRUc7UUFFSCxjQUFTLEdBQWlCLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFHekM7O1dBRUc7UUFFSCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCOztXQUVHO1FBRUgsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEI7O1dBRUc7UUFDSyxjQUFTLEdBQUcsQ0FBQyxDQUFDO1FB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Z0JBT04sYUFBYTtzQkFEWixLQUFLO2dCQVFGLFFBQVE7c0JBRFgsS0FBSztnQkFjRixVQUFVO3NCQURiLEtBQUs7Z0JBY0YsVUFBVTtzQkFEYixLQUFLO2dCQWNGLGNBQWM7c0JBRGpCLEtBQUs7Z0JBbUJGLGVBQWU7c0JBRGxCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGRhdGUtdGltZS5jbGFzc1xuICovXG5pbXBvcnQge0V2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT3B0aW9uYWwsIERpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgICBjb2VyY2VOdW1iZXJQcm9wZXJ0eVxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtEYXRlVGltZUFkYXB0ZXJ9IGZyb20gJy4vYWRhcHRlci9kYXRlLXRpbWUtYWRhcHRlci5jbGFzcyc7XG5pbXBvcnQge1xuICAgIE9XTF9EQVRFX1RJTUVfRk9STUFUUyxcbiAgICBPd2xEYXRlVGltZUZvcm1hdHNcbn0gZnJvbSAnLi9hZGFwdGVyL2RhdGUtdGltZS1mb3JtYXQuY2xhc3MnO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuZXhwb3J0IHR5cGUgUGlja2VyVHlwZSA9ICdib3RoJyB8ICdjYWxlbmRhcicgfCAndGltZXInO1xuXG5leHBvcnQgdHlwZSBQaWNrZXJNb2RlID0gJ3BvcHVwJyB8ICdkaWFsb2cnIHwgJ2lubGluZSc7XG5cbmV4cG9ydCB0eXBlIFNlbGVjdE1vZGUgPSAnc2luZ2xlJyB8ICdyYW5nZScgfCAncmFuZ2VGcm9tJyB8ICdyYW5nZVRvJztcblxuZXhwb3J0IGVudW0gRGF0ZVZpZXcge1xuICAgIE1PTlRIID0gJ21vbnRoJyxcbiAgICBZRUFSID0gJ3llYXInLFxuICAgIE1VTFRJX1lFQVJTID0gJ211bHRpLXllYXJzJ1xufVxuXG5leHBvcnQgdHlwZSBEYXRlVmlld1R5cGUgPSBEYXRlVmlldy5NT05USCB8IERhdGVWaWV3LllFQVIgfCBEYXRlVmlldy5NVUxUSV9ZRUFSUztcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgT3dsRGF0ZVRpbWU8VD4ge1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gc2hvdyB0aGUgc2Vjb25kJ3MgdGltZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIF9zaG93U2Vjb25kc1RpbWVyID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBnZXQgc2hvd1NlY29uZHNUaW1lcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3dTZWNvbmRzVGltZXI7XG4gICAgfVxuXG4gICAgc2V0IHNob3dTZWNvbmRzVGltZXIodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Nob3dTZWNvbmRzVGltZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSB0aW1lciBpcyBpbiBob3VyMTIgZm9ybWF0XG4gICAgICovXG4gICAgcHJpdmF0ZSBfaG91cjEyVGltZXIgPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIGdldCBob3VyMTJUaW1lcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hvdXIxMlRpbWVyO1xuICAgIH1cblxuICAgIHNldCBob3VyMTJUaW1lcih2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5faG91cjEyVGltZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzdGFydFZpZXc6IERhdGVWaWV3VHlwZSA9IERhdGVWaWV3Lk1PTlRIO1xuXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHNob3VsZCBvbmx5IHRoZSB5ZWFyIGFuZCBtdWx0aS15ZWFyIHZpZXdzLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgeWVhck9ubHkgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gc2hvdWxkIG9ubHkgdGhlIG11bHRpLXllYXIgdmlldy5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIG11bHRpeWVhck9ubHkgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEhvdXJzIHRvIGNoYW5nZSBwZXIgc3RlcFxuICAgICAqL1xuICAgIHByaXZhdGUgX3N0ZXBIb3VyID0gMTtcbiAgICBASW5wdXQoKVxuICAgIGdldCBzdGVwSG91cigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RlcEhvdXI7XG4gICAgfVxuXG4gICAgc2V0IHN0ZXBIb3VyKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3N0ZXBIb3VyID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNaW51dGVzIHRvIGNoYW5nZSBwZXIgc3RlcFxuICAgICAqL1xuICAgIHByaXZhdGUgX3N0ZXBNaW51dGUgPSAxO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHN0ZXBNaW51dGUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXBNaW51dGU7XG4gICAgfVxuXG4gICAgc2V0IHN0ZXBNaW51dGUodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc3RlcE1pbnV0ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbCwgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2Vjb25kcyB0byBjaGFuZ2UgcGVyIHN0ZXBcbiAgICAgKi9cbiAgICBwcml2YXRlIF9zdGVwU2Vjb25kID0gMTtcbiAgICBASW5wdXQoKVxuICAgIGdldCBzdGVwU2Vjb25kKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwU2Vjb25kO1xuICAgIH1cblxuICAgIHNldCBzdGVwU2Vjb25kKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3N0ZXBTZWNvbmQgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWwsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgZmlyc3QgZGF5IG9mIHdlZWtcbiAgICAgKi9cbiAgICBwcml2YXRlIF9maXJzdERheU9mV2VlazogbnVtYmVyO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IGZpcnN0RGF5T2ZXZWVrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3REYXlPZldlZWs7XG4gICAgfVxuXG4gICAgc2V0IGZpcnN0RGF5T2ZXZWVrKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgICAgIGlmICh2YWx1ZSA+IDYgfHwgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLl9maXJzdERheU9mV2VlayA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0RGF5T2ZXZWVrID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGhpZGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGF0IHRoZSBzdGFydCBvciBlbmQgb2YgdGhlIGN1cnJlbnQgbW9udGguXG4gICAgICovXG4gICAgcHJpdmF0ZSBfaGlkZU90aGVyTW9udGhzID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBnZXQgaGlkZU90aGVyTW9udGhzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faGlkZU90aGVyTW9udGhzO1xuICAgIH1cblxuICAgIHNldCBoaWRlT3RoZXJNb250aHModmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2hpZGVPdGhlck1vbnRocyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2lkOiBzdHJpbmc7XG4gICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXQgc2VsZWN0ZWQoKTogVCB8IG51bGw7XG5cbiAgICBhYnN0cmFjdCBnZXQgc2VsZWN0ZWRzKCk6IFRbXSB8IG51bGw7XG5cbiAgICBhYnN0cmFjdCBnZXQgZGF0ZVRpbWVGaWx0ZXIoKTogKGRhdGU6IFQgfCBudWxsKSA9PiBib29sZWFuO1xuXG4gICAgYWJzdHJhY3QgZ2V0IG1heERhdGVUaW1lKCk6IFQgfCBudWxsO1xuXG4gICAgYWJzdHJhY3QgZ2V0IG1pbkRhdGVUaW1lKCk6IFQgfCBudWxsO1xuXG4gICAgYWJzdHJhY3QgZ2V0IHNlbGVjdE1vZGUoKTogU2VsZWN0TW9kZTtcblxuICAgIGFic3RyYWN0IGdldCBzdGFydEF0KCk6IFQgfCBudWxsO1xuXG4gICAgYWJzdHJhY3QgZ2V0IGVuZEF0KCk6IFQgfCBudWxsO1xuXG4gICAgYWJzdHJhY3QgZ2V0IG9wZW5lZCgpOiBib29sZWFuO1xuXG4gICAgYWJzdHJhY3QgZ2V0IHBpY2tlck1vZGUoKTogUGlja2VyTW9kZTtcblxuICAgIGFic3RyYWN0IGdldCBwaWNrZXJUeXBlKCk6IFBpY2tlclR5cGU7XG5cbiAgICBhYnN0cmFjdCBnZXQgaXNJblNpbmdsZU1vZGUoKTogYm9vbGVhbjtcblxuICAgIGFic3RyYWN0IGdldCBpc0luUmFuZ2VNb2RlKCk6IGJvb2xlYW47XG5cbiAgICBhYnN0cmFjdCBzZWxlY3QoZGF0ZTogVCB8IFRbXSk6IHZvaWQ7XG5cbiAgICBhYnN0cmFjdCB5ZWFyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxUPjtcblxuICAgIGFic3RyYWN0IG1vbnRoU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxUPjtcblxuICAgIGFic3RyYWN0IGRhdGVTZWxlY3RlZDogRXZlbnRFbWl0dGVyPFQ+O1xuXG4gICAgYWJzdHJhY3Qgc2VsZWN0WWVhcihub3JtYWxpemVkWWVhcjogVCk6IHZvaWQ7XG5cbiAgICBhYnN0cmFjdCBzZWxlY3RNb250aChub3JtYWxpemVkTW9udGg6IFQpOiB2b2lkO1xuXG4gICAgYWJzdHJhY3Qgc2VsZWN0RGF0ZShub3JtYWxpemVkRGF0ZTogVCk6IHZvaWQ7XG5cbiAgICBnZXQgZm9ybWF0U3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlclR5cGUgPT09ICdib3RoJ1xuICAgICAgICAgICAgPyB0aGlzLmRhdGVUaW1lRm9ybWF0cy5mdWxsUGlja2VySW5wdXRcbiAgICAgICAgICAgIDogdGhpcy5waWNrZXJUeXBlID09PSAnY2FsZW5kYXInXG4gICAgICAgICAgICAgICAgPyB0aGlzLmRhdGVUaW1lRm9ybWF0cy5kYXRlUGlja2VySW5wdXRcbiAgICAgICAgICAgICAgICA6IHRoaXMuZGF0ZVRpbWVGb3JtYXRzLnRpbWVQaWNrZXJJbnB1dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEYXRlIFRpbWUgQ2hlY2tlciB0byBjaGVjayBpZiB0aGUgZ2l2ZSBkYXRlVGltZSBpcyBzZWxlY3RhYmxlXG4gICAgICovXG4gICAgcHVibGljIGRhdGVUaW1lQ2hlY2tlciA9IChkYXRlVGltZTogVCkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgISFkYXRlVGltZSAmJlxuICAgICAgICAgICAgKCF0aGlzLmRhdGVUaW1lRmlsdGVyIHx8IHRoaXMuZGF0ZVRpbWVGaWx0ZXIoZGF0ZVRpbWUpKSAmJlxuICAgICAgICAgICAgKCF0aGlzLm1pbkRhdGVUaW1lIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZShkYXRlVGltZSwgdGhpcy5taW5EYXRlVGltZSkgPj1cbiAgICAgICAgICAgICAgICAwKSAmJlxuICAgICAgICAgICAgKCF0aGlzLm1heERhdGVUaW1lIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZShkYXRlVGltZSwgdGhpcy5tYXhEYXRlVGltZSkgPD0gMClcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgICAgICBAT3B0aW9uYWwoKSBwcm90ZWN0ZWQgZGF0ZVRpbWVBZGFwdGVyOiBEYXRlVGltZUFkYXB0ZXI8VD4sXG4gICAgICAgIEBPcHRpb25hbCgpXG4gICAgICAgIEBJbmplY3QoT1dMX0RBVEVfVElNRV9GT1JNQVRTKVxuICAgICAgICBwcm90ZWN0ZWQgZGF0ZVRpbWVGb3JtYXRzOiBPd2xEYXRlVGltZUZvcm1hdHNcbiAgICApIHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGVUaW1lQWRhcHRlcikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICAgYE93bERhdGVUaW1lUGlja2VyOiBObyBwcm92aWRlciBmb3VuZCBmb3IgRGF0ZVRpbWVBZGFwdGVyLiBZb3UgbXVzdCBpbXBvcnQgb25lIG9mIHRoZSBmb2xsb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgYG1vZHVsZXMgYXQgeW91ciBhcHBsaWNhdGlvbiByb290OiBPd2xOYXRpdmVEYXRlVGltZU1vZHVsZSwgT3dsTW9tZW50RGF0ZVRpbWVNb2R1bGUsIG9yIHByb3ZpZGUgYSBgICtcbiAgICAgICAgICAgICAgICBgY3VzdG9tIGltcGxlbWVudGF0aW9uLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZGF0ZVRpbWVGb3JtYXRzKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICAgICBgT3dsRGF0ZVRpbWVQaWNrZXI6IE5vIHByb3ZpZGVyIGZvdW5kIGZvciBPV0xfREFURV9USU1FX0ZPUk1BVFMuIFlvdSBtdXN0IGltcG9ydCBvbmUgb2YgdGhlIGZvbGxvd2luZyBgICtcbiAgICAgICAgICAgICAgICBgbW9kdWxlcyBhdCB5b3VyIGFwcGxpY2F0aW9uIHJvb3Q6IE93bE5hdGl2ZURhdGVUaW1lTW9kdWxlLCBPd2xNb21lbnREYXRlVGltZU1vZHVsZSwgb3IgcHJvdmlkZSBhIGAgK1xuICAgICAgICAgICAgICAgIGBjdXN0b20gaW1wbGVtZW50YXRpb24uYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lkID0gYG93bC1kdC1waWNrZXItJHtuZXh0VW5pcXVlSWQrK31gO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRWYWxpZERhdGUob2JqOiBhbnkpOiBUIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGVUaW1lQWRhcHRlci5pc0RhdGVJbnN0YW5jZShvYmopICYmXG4gICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzVmFsaWQob2JqKVxuICAgICAgICAgICAgPyBvYmpcbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9XG59XG4iXX0=