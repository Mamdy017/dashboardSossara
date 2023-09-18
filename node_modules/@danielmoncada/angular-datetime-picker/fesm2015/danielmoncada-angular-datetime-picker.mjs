import * as i0 from '@angular/core';
import { Directive, Input, InjectionToken, inject, LOCALE_ID, Optional, Inject, Injectable, EventEmitter, Component, ChangeDetectionStrategy, Output, ViewChild, TemplateRef, SkipSelf, forwardRef, Pipe, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { getLocaleFirstDayOfWeek, DOCUMENT, CommonModule } from '@angular/common';
import * as i1$1 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';
import * as i1$2 from '@angular/cdk/overlay';
import { NoopScrollStrategy, Overlay, OverlayConfig, OverlayModule } from '@angular/cdk/overlay';
import { Subscription, of, merge, Subject, defer } from 'rxjs';
import * as i2 from '@angular/cdk/portal';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, PortalInjector, PortalModule } from '@angular/cdk/portal';
import { ENTER, PAGE_DOWN, PAGE_UP, END, HOME, DOWN_ARROW, UP_ARROW, RIGHT_ARROW, LEFT_ARROW, SPACE, ESCAPE } from '@angular/cdk/keycodes';
import { coerceBooleanProperty, coerceNumberProperty, coerceArray } from '@angular/cdk/coercion';
import { take, debounceTime, filter, startWith } from 'rxjs/operators';
import { trigger, state, style, transition, group, query, animateChild, animate, keyframes } from '@angular/animations';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators } from '@angular/forms';
import * as i1$3 from '@angular/cdk/platform';
import { PlatformModule } from '@angular/cdk/platform';

/**
 * date-time-picker-trigger.directive
 */
class OwlDateTimeTriggerDirective {
    constructor(changeDetector) {
        this.changeDetector = changeDetector;
        this.stateChanges = Subscription.EMPTY;
    }
    get disabled() {
        return this._disabled === undefined ? this.dtPicker.disabled : !!this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    get owlDTTriggerDisabledClass() {
        return this.disabled;
    }
    ngOnInit() {
    }
    ngOnChanges(changes) {
        if (changes.datepicker) {
            this.watchStateChanges();
        }
    }
    ngAfterContentInit() {
        this.watchStateChanges();
    }
    ngOnDestroy() {
        this.stateChanges.unsubscribe();
    }
    handleClickOnHost(event) {
        if (this.dtPicker) {
            this.dtPicker.open();
            event.stopPropagation();
        }
    }
    watchStateChanges() {
        this.stateChanges.unsubscribe();
        const inputDisabled = this.dtPicker && this.dtPicker.dtInput ?
            this.dtPicker.dtInput.disabledChange : of();
        const pickerDisabled = this.dtPicker ?
            this.dtPicker.disabledChange : of();
        this.stateChanges = merge(pickerDisabled, inputDisabled)
            .subscribe(() => {
            this.changeDetector.markForCheck();
        });
    }
}
OwlDateTimeTriggerDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeTriggerDirective, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
OwlDateTimeTriggerDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeTriggerDirective, selector: "[owlDateTimeTrigger]", inputs: { dtPicker: ["owlDateTimeTrigger", "dtPicker"], disabled: "disabled" }, host: { listeners: { "click": "handleClickOnHost($event)" }, properties: { "class.owl-dt-trigger-disabled": "owlDTTriggerDisabledClass" } }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeTriggerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[owlDateTimeTrigger]',
                    host: {
                        '(click)': 'handleClickOnHost($event)',
                        '[class.owl-dt-trigger-disabled]': 'owlDTTriggerDisabledClass'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { dtPicker: [{
                type: Input,
                args: ['owlDateTimeTrigger']
            }], disabled: [{
                type: Input
            }] } });

/**
 * date-time-format.class
 */
/** InjectionToken for date time picker that can be used to override default format. */
const OWL_DATE_TIME_FORMATS = new InjectionToken('OWL_DATE_TIME_FORMATS');

/**
 * date-time-adapter.class
 */
/** InjectionToken for date time picker that can be used to override default locale code. */
const OWL_DATE_TIME_LOCALE = new InjectionToken('OWL_DATE_TIME_LOCALE', {
    providedIn: 'root',
    factory: OWL_DATE_TIME_LOCALE_FACTORY
});
/** @docs-private */
function OWL_DATE_TIME_LOCALE_FACTORY() {
    return inject(LOCALE_ID);
}
/** Provider for OWL_DATE_TIME_LOCALE injection token. */
const OWL_DATE_TIME_LOCALE_PROVIDER = {
    provide: OWL_DATE_TIME_LOCALE,
    useExisting: LOCALE_ID
};
class DateTimeAdapter {
    constructor() {
        /** A stream that emits when the locale changes. */
        this._localeChanges = new Subject();
        /** total milliseconds in a day. */
        this.millisecondsInDay = 86400000;
        /** total milliseconds in a minute. */
        this.milliseondsInMinute = 60000;
    }
    get localeChanges() {
        return this._localeChanges;
    }
    /**
     * Compare two given dates
     * 1 if the first date is after the second,
     * -1 if the first date is before the second
     * 0 if dates are equal.
     * */
    compare(first, second) {
        if (!this.isValid(first) || !this.isValid(second)) {
            throw Error('JSNativeDate: Cannot compare invalid dates.');
        }
        const dateFirst = this.clone(first);
        const dateSecond = this.clone(second);
        const diff = this.getTime(dateFirst) - this.getTime(dateSecond);
        if (diff < 0) {
            return -1;
        }
        else if (diff > 0) {
            return 1;
        }
        else {
            // Return 0 if diff is 0; return NaN if diff is NaN
            return diff;
        }
    }
    /**
     * Check if two given dates are in the same year
     * 1 if the first date's year is after the second,
     * -1 if the first date's year is before the second
     * 0 if two given dates are in the same year
     * */
    compareYear(first, second) {
        if (!this.isValid(first) || !this.isValid(second)) {
            throw Error('JSNativeDate: Cannot compare invalid dates.');
        }
        const yearLeft = this.getYear(first);
        const yearRight = this.getYear(second);
        const diff = yearLeft - yearRight;
        if (diff < 0) {
            return -1;
        }
        else if (diff > 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
    /**
     * Attempts to deserialize a value to a valid date object. This is different from parsing in that
     * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
     * string). The default implementation does not allow any deserialization, it simply checks that
     * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
     * method on all of it's `@Input()` properties that accept dates. It is therefore possible to
     * support passing values from your backend directly to these properties by overriding this method
     * to also deserialize the format used by your backend.
     */
    deserialize(value) {
        if (value == null ||
            (this.isDateInstance(value) && this.isValid(value))) {
            return value;
        }
        return this.invalid();
    }
    /**
     * Sets the locale used for all dates.
     */
    setLocale(locale) {
        this.locale = locale;
        this._localeChanges.next(locale);
    }
    /**
    * Get the locale used for all dates.
    * */
    getLocale() {
        return this.locale;
    }
    /**
     * Clamp the given date between min and max dates.
     */
    clampDate(date, min, max) {
        if (min && this.compare(date, min) < 0) {
            return min;
        }
        if (max && this.compare(date, max) > 0) {
            return max;
        }
        return date;
    }
}

/**
 * date-time.class
 */
let nextUniqueId = 0;
var DateView;
(function (DateView) {
    DateView["MONTH"] = "month";
    DateView["YEAR"] = "year";
    DateView["MULTI_YEARS"] = "multi-years";
})(DateView || (DateView = {}));
class OwlDateTime {
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
OwlDateTime.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTime, deps: [{ token: DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
OwlDateTime.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTime, inputs: { showSecondsTimer: "showSecondsTimer", hour12Timer: "hour12Timer", startView: "startView", yearOnly: "yearOnly", multiyearOnly: "multiyearOnly", stepHour: "stepHour", stepMinute: "stepMinute", stepSecond: "stepSecond", firstDayOfWeek: "firstDayOfWeek", hideOtherMonths: "hideOtherMonths" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTime, decorators: [{
            type: Directive
        }], ctorParameters: function () {
        return [{ type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }];
    }, propDecorators: { showSecondsTimer: [{
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

/**
 * date-time-picker-intl.service
 */
class OwlDateTimeIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the up second button (used by screen readers).  */
        this.upSecondLabel = 'Add a second';
        /** A label for the down second button (used by screen readers).  */
        this.downSecondLabel = 'Minus a second';
        /** A label for the up minute button (used by screen readers).  */
        this.upMinuteLabel = 'Add a minute';
        /** A label for the down minute button (used by screen readers).  */
        this.downMinuteLabel = 'Minus a minute';
        /** A label for the up hour button (used by screen readers).  */
        this.upHourLabel = 'Add a hour';
        /** A label for the down hour button (used by screen readers).  */
        this.downHourLabel = 'Minus a hour';
        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';
        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';
        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';
        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';
        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 21 years';
        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 21 years';
        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Change to month view';
        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';
        /** A label for the cancel button */
        this.cancelBtnLabel = 'Cancel';
        /** A label for the set button */
        this.setBtnLabel = 'Set';
        /** A label for the range 'from' in picker info */
        this.rangeFromLabel = 'From';
        /** A label for the range 'to' in picker info */
        this.rangeToLabel = 'To';
        /** A label for the hour12 button (AM) */
        this.hour12AMLabel = 'AM';
        /** A label for the hour12 button (PM) */
        this.hour12PMLabel = 'PM';
    }
}
OwlDateTimeIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OwlDateTimeIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * calendar-body.component
 */
class CalendarCell {
    constructor(value, displayValue, ariaLabel, enabled, out = false, cellClass = '') {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.out = out;
        this.cellClass = cellClass;
    }
}
class OwlCalendarBodyComponent {
    constructor(elmRef, ngZone) {
        this.elmRef = elmRef;
        this.ngZone = ngZone;
        /**
         * The cell number of the active cell in the table.
         */
        this.activeCell = 0;
        /**
         * The number of columns in the table.
         * */
        this.numCols = 7;
        /**
         * The ratio (width / height) to use for the cells in the table.
         */
        this.cellRatio = 1;
        /**
         * Emit when a calendar cell is selected
         * */
        this.select = new EventEmitter();
    }
    get owlDTCalendarBodyClass() {
        return true;
    }
    get isInSingleMode() {
        return this.selectMode === 'single';
    }
    get isInRangeMode() {
        return (this.selectMode === 'range' ||
            this.selectMode === 'rangeFrom' ||
            this.selectMode === 'rangeTo');
    }
    ngOnInit() { }
    selectCell(cell) {
        this.select.emit(cell);
    }
    isActiveCell(rowIndex, colIndex) {
        const cellNumber = rowIndex * this.numCols + colIndex;
        return cellNumber === this.activeCell;
    }
    /**
     * Check if the cell is selected
     */
    isSelected(value) {
        if (!this.selectedValues || this.selectedValues.length === 0) {
            return false;
        }
        if (this.isInSingleMode) {
            return value === this.selectedValues[0];
        }
        if (this.isInRangeMode) {
            const fromValue = this.selectedValues[0];
            const toValue = this.selectedValues[1];
            return value === fromValue || value === toValue;
        }
    }
    /**
     * Check if the cell in the range
     * */
    isInRange(value) {
        if (this.isInRangeMode) {
            const fromValue = this.selectedValues[0];
            const toValue = this.selectedValues[1];
            if (fromValue !== null && toValue !== null) {
                return value >= fromValue && value <= toValue;
            }
            else {
                return value === fromValue || value === toValue;
            }
        }
    }
    /**
     * Check if the cell is the range from
     * */
    isRangeFrom(value) {
        if (this.isInRangeMode) {
            const fromValue = this.selectedValues[0];
            return fromValue !== null && value === fromValue;
        }
    }
    /**
     * Check if the cell is the range to
     * */
    isRangeTo(value) {
        if (this.isInRangeMode) {
            const toValue = this.selectedValues[1];
            return toValue !== null && value === toValue;
        }
    }
    /**
     * Focus to a active cell
     * */
    focusActiveCell() {
        this.ngZone.runOutsideAngular(() => {
            this.ngZone.onStable
                .asObservable()
                .pipe(take(1))
                .subscribe(() => {
                this.elmRef.nativeElement
                    .querySelector('.owl-dt-calendar-cell-active')
                    .focus();
            });
        });
    }
}
OwlCalendarBodyComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlCalendarBodyComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
OwlCalendarBodyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlCalendarBodyComponent, selector: "[owl-date-time-calendar-body]", inputs: { activeCell: "activeCell", rows: "rows", numCols: "numCols", cellRatio: "cellRatio", todayValue: "todayValue", selectedValues: "selectedValues", selectMode: "selectMode" }, outputs: { select: "select" }, host: { properties: { "class.owl-dt-calendar-body": "owlDTCalendarBodyClass" } }, exportAs: ["owlDateTimeCalendarBody"], ngImport: i0, template: "<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n    <td *ngFor=\"let item of row; let colIndex = index\"\n        class=\"owl-dt-calendar-cell {{item.cellClass}}\"\n        [tabindex]=\"isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n        [class.owl-dt-calendar-cell-active]=\"isActiveCell(rowIndex, colIndex)\"\n        [class.owl-dt-calendar-cell-disabled]=\"!item.enabled\"\n        [class.owl-dt-calendar-cell-in-range]=\"isInRange(item.value)\"\n        [class.owl-dt-calendar-cell-range-from]=\"isRangeFrom(item.value)\"\n        [class.owl-dt-calendar-cell-range-to]=\"isRangeTo(item.value)\"\n        [attr.aria-label]=\"item.ariaLabel\"\n        [attr.aria-disabled]=\"!item.enabled || null\"\n        [attr.aria-current]=\"item.value === todayValue ? 'date' : null\"\n        [attr.aria-selected]=\"isSelected(item.value)\"\n        [style.width.%]=\"100 / numCols\"\n        [style.paddingTop.%]=\"50 * cellRatio / numCols\"\n        [style.paddingBottom.%]=\"50 * cellRatio / numCols\"\n        (click)=\"selectCell(item)\">\n        <span class=\"owl-dt-calendar-cell-content\"\n              [ngClass]=\"{\n                'owl-dt-calendar-cell-out': item.out,\n                'owl-dt-calendar-cell-today': item.value === todayValue,\n                'owl-dt-calendar-cell-selected': isSelected(item.value)\n              }\">\n            {{item.displayValue}}\n        </span>\n    </td>\n</tr>\n", styles: [""], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlCalendarBodyComponent, decorators: [{
            type: Component,
            args: [{ selector: '[owl-date-time-calendar-body]', exportAs: 'owlDateTimeCalendarBody', host: {
                        '[class.owl-dt-calendar-body]': 'owlDTCalendarBodyClass'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\n    <td *ngFor=\"let item of row; let colIndex = index\"\n        class=\"owl-dt-calendar-cell {{item.cellClass}}\"\n        [tabindex]=\"isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n        [class.owl-dt-calendar-cell-active]=\"isActiveCell(rowIndex, colIndex)\"\n        [class.owl-dt-calendar-cell-disabled]=\"!item.enabled\"\n        [class.owl-dt-calendar-cell-in-range]=\"isInRange(item.value)\"\n        [class.owl-dt-calendar-cell-range-from]=\"isRangeFrom(item.value)\"\n        [class.owl-dt-calendar-cell-range-to]=\"isRangeTo(item.value)\"\n        [attr.aria-label]=\"item.ariaLabel\"\n        [attr.aria-disabled]=\"!item.enabled || null\"\n        [attr.aria-current]=\"item.value === todayValue ? 'date' : null\"\n        [attr.aria-selected]=\"isSelected(item.value)\"\n        [style.width.%]=\"100 / numCols\"\n        [style.paddingTop.%]=\"50 * cellRatio / numCols\"\n        [style.paddingBottom.%]=\"50 * cellRatio / numCols\"\n        (click)=\"selectCell(item)\">\n        <span class=\"owl-dt-calendar-cell-content\"\n              [ngClass]=\"{\n                'owl-dt-calendar-cell-out': item.out,\n                'owl-dt-calendar-cell-today': item.value === todayValue,\n                'owl-dt-calendar-cell-selected': isSelected(item.value)\n              }\">\n            {{item.displayValue}}\n        </span>\n    </td>\n</tr>\n", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { activeCell: [{
                type: Input
            }], rows: [{
                type: Input
            }], numCols: [{
                type: Input
            }], cellRatio: [{
                type: Input
            }], todayValue: [{
                type: Input
            }], selectedValues: [{
                type: Input
            }], selectMode: [{
                type: Input
            }], select: [{
                type: Output
            }] } });

/**
 * calendar-month-view.component
 */
const DAYS_PER_WEEK = 7;
const WEEKS_PER_VIEW = 6;
class OwlMonthViewComponent {
    constructor(cdRef, dateTimeAdapter, dateTimeFormats) {
        this.cdRef = cdRef;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        /**
         * Whether to hide dates in other months at the start or end of the current month.
         * */
        this.hideOtherMonths = false;
        this.isDefaultFirstDayOfWeek = true;
        /**
         * The select mode of the picker;
         * */
        this._selectMode = 'single';
        this._selecteds = [];
        this.localeSub = Subscription.EMPTY;
        this.initiated = false;
        /**
         * An array to hold all selectedDates' value
         * the value is the day number in current month
         * */
        this.selectedDates = [];
        /**
         * Callback to invoke when a new date is selected
         * */
        this.selectedChange = new EventEmitter();
        /**
         * Callback to invoke when any date is selected.
         * */
        this.userSelection = new EventEmitter();
        /** Emits when any date is activated. */
        this.pickerMomentChange = new EventEmitter();
    }
    get firstDayOfWeek() {
        return this._firstDayOfWeek;
    }
    set firstDayOfWeek(val) {
        if (val >= 0 && val <= 6 && val !== this._firstDayOfWeek) {
            this._firstDayOfWeek = val;
            this.isDefaultFirstDayOfWeek = false;
            if (this.initiated) {
                this.generateWeekDays();
                this.generateCalendar();
                this.cdRef.markForCheck();
            }
        }
    }
    get selectMode() {
        return this._selectMode;
    }
    set selectMode(val) {
        this._selectMode = val;
        if (this.initiated) {
            this.generateCalendar();
            this.cdRef.markForCheck();
        }
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        const oldSelected = this._selected;
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);
        if (!this.dateTimeAdapter.isSameDay(oldSelected, this._selected)) {
            this.setSelectedDates();
        }
    }
    get selecteds() {
        return this._selecteds;
    }
    set selecteds(values) {
        this._selecteds = values.map(v => {
            v = this.dateTimeAdapter.deserialize(v);
            return this.getValidDate(v);
        });
        this.setSelectedDates();
    }
    get pickerMoment() {
        return this._pickerMoment;
    }
    set pickerMoment(value) {
        const oldMoment = this._pickerMoment;
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment =
            this.getValidDate(value) || this.dateTimeAdapter.now();
        this.firstDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this._pickerMoment), this.dateTimeAdapter.getMonth(this._pickerMoment), 1);
        if (!this.isSameMonth(oldMoment, this._pickerMoment) &&
            this.initiated) {
            this.generateCalendar();
        }
    }
    get dateFilter() {
        return this._dateFilter;
    }
    set dateFilter(filter) {
        this._dateFilter = filter;
        if (this.initiated) {
            this.generateCalendar();
            this.cdRef.markForCheck();
        }
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._minDate = this.getValidDate(value);
        if (this.initiated) {
            this.generateCalendar();
            this.cdRef.markForCheck();
        }
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._maxDate = this.getValidDate(value);
        if (this.initiated) {
            this.generateCalendar();
            this.cdRef.markForCheck();
        }
    }
    get weekdays() {
        return this._weekdays;
    }
    get days() {
        return this._days;
    }
    get activeCell() {
        if (this.pickerMoment) {
            return (this.dateTimeAdapter.getDate(this.pickerMoment) +
                this.firstRowOffset -
                1);
        }
    }
    get isInSingleMode() {
        return this.selectMode === 'single';
    }
    get isInRangeMode() {
        return (this.selectMode === 'range' ||
            this.selectMode === 'rangeFrom' ||
            this.selectMode === 'rangeTo');
    }
    get owlDTCalendarView() {
        return true;
    }
    ngOnInit() {
        this.updateFirstDayOfWeek(this.dateTimeAdapter.getLocale());
        this.generateWeekDays();
        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(locale => {
            this.updateFirstDayOfWeek(locale);
            this.generateWeekDays();
            this.generateCalendar();
            this.cdRef.markForCheck();
        });
    }
    ngAfterContentInit() {
        this.generateCalendar();
        this.initiated = true;
    }
    ngOnDestroy() {
        this.localeSub.unsubscribe();
    }
    /**
     * Handle a calendarCell selected
     */
    selectCalendarCell(cell) {
        // Cases in which the date would not be selected
        // 1, the calendar cell is NOT enabled (is NOT valid)
        // 2, the selected date is NOT in current picker's month and the hideOtherMonths is enabled
        if (!cell.enabled || (this.hideOtherMonths && cell.out)) {
            return;
        }
        this.selectDate(cell.value);
    }
    /**
     * Handle a new date selected
     */
    selectDate(date) {
        const daysDiff = date - 1;
        const selected = this.dateTimeAdapter.addCalendarDays(this.firstDateOfMonth, daysDiff);
        this.selectedChange.emit(selected);
        this.userSelection.emit();
    }
    /**
     * Handle keydown event on calendar body
     */
    handleCalendarKeydown(event) {
        let moment;
        switch (event.keyCode) {
            // minus 1 day
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 day
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            // minus 1 week
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -7);
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 week
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 7);
                this.pickerMomentChange.emit(moment);
                break;
            // move to first day of current month
            case HOME:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 1 - this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            // move to last day of current month
            case END:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment) -
                    this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            // minus 1 month (or 1 year)
            case PAGE_UP:
                moment = event.altKey
                    ? this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1)
                    : this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 month (or 1 year)
            case PAGE_DOWN:
                moment = event.altKey
                    ? this.dateTimeAdapter.addCalendarYears(this.pickerMoment, 1)
                    : this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            // select the pickerMoment
            case ENTER:
                if (!this.dateFilter || this.dateFilter(this.pickerMoment)) {
                    this.selectDate(this.dateTimeAdapter.getDate(this.pickerMoment));
                }
                break;
            default:
                return;
        }
        this.focusActiveCell();
        event.preventDefault();
    }
    /**
     * Generate the calendar weekdays array
     * */
    generateWeekDays() {
        const longWeekdays = this.dateTimeAdapter.getDayOfWeekNames('long');
        const shortWeekdays = this.dateTimeAdapter.getDayOfWeekNames('short');
        const narrowWeekdays = this.dateTimeAdapter.getDayOfWeekNames('narrow');
        const firstDayOfWeek = this.firstDayOfWeek;
        const weekdays = longWeekdays.map((long, i) => {
            return { long, short: shortWeekdays[i], narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays
            .slice(firstDayOfWeek)
            .concat(weekdays.slice(0, firstDayOfWeek));
        this.dateNames = this.dateTimeAdapter.getDateNames();
        return;
    }
    /**
     * Generate the calendar days array
     * */
    generateCalendar() {
        if (!this.pickerMoment) {
            return;
        }
        this.todayDate = null;
        // the first weekday of the month
        const startWeekdayOfMonth = this.dateTimeAdapter.getDay(this.firstDateOfMonth);
        const firstDayOfWeek = this.firstDayOfWeek;
        // the amount of days from the first date of the month
        // if it is < 0, it means the date is in previous month
        let daysDiff = 0 -
            ((startWeekdayOfMonth + (DAYS_PER_WEEK - firstDayOfWeek)) %
                DAYS_PER_WEEK);
        // the index of cell that contains the first date of the month
        this.firstRowOffset = Math.abs(daysDiff);
        this._days = [];
        for (let i = 0; i < WEEKS_PER_VIEW; i++) {
            const week = [];
            for (let j = 0; j < DAYS_PER_WEEK; j++) {
                const date = this.dateTimeAdapter.addCalendarDays(this.firstDateOfMonth, daysDiff);
                const dateCell = this.createDateCell(date, daysDiff);
                // check if the date is today
                if (this.dateTimeAdapter.isSameDay(this.dateTimeAdapter.now(), date)) {
                    this.todayDate = daysDiff + 1;
                }
                week.push(dateCell);
                daysDiff += 1;
            }
            this._days.push(week);
        }
        this.setSelectedDates();
    }
    updateFirstDayOfWeek(locale) {
        if (this.isDefaultFirstDayOfWeek) {
            try {
                this._firstDayOfWeek = getLocaleFirstDayOfWeek(locale);
            }
            catch (_a) {
                this._firstDayOfWeek = 0;
            }
        }
    }
    /**
     * Creates CalendarCell for days.
     */
    createDateCell(date, daysDiff) {
        // total days of the month
        const daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment);
        const dateNum = this.dateTimeAdapter.getDate(date);
        // const dateName = this.dateNames[dateNum - 1];
        const dateName = dateNum.toString();
        const ariaLabel = this.dateTimeAdapter.format(date, this.dateTimeFormats.dateA11yLabel);
        // check if the date if selectable
        const enabled = this.isDateEnabled(date);
        // check if date is not in current month
        const dayValue = daysDiff + 1;
        const out = dayValue < 1 || dayValue > daysInMonth;
        const cellClass = 'owl-dt-day-' + this.dateTimeAdapter.getDay(date);
        return new CalendarCell(dayValue, dateName, ariaLabel, enabled, out, cellClass);
    }
    /**
     * Check if the date is valid
     */
    isDateEnabled(date) {
        return (!!date &&
            (!this.dateFilter || this.dateFilter(date)) &&
            (!this.minDate ||
                this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
            (!this.maxDate ||
                this.dateTimeAdapter.compare(date, this.maxDate) <= 0));
    }
    /**
     * Get a valid date object
     */
    getValidDate(obj) {
        return this.dateTimeAdapter.isDateInstance(obj) &&
            this.dateTimeAdapter.isValid(obj)
            ? obj
            : null;
    }
    /**
     * Check if the give dates are none-null and in the same month
     */
    isSameMonth(dateLeft, dateRight) {
        return !!(dateLeft &&
            dateRight &&
            this.dateTimeAdapter.isValid(dateLeft) &&
            this.dateTimeAdapter.isValid(dateRight) &&
            this.dateTimeAdapter.getYear(dateLeft) ===
                this.dateTimeAdapter.getYear(dateRight) &&
            this.dateTimeAdapter.getMonth(dateLeft) ===
                this.dateTimeAdapter.getMonth(dateRight));
    }
    /**
     * Set the selectedDates value.
     * In single mode, it has only one value which represent the selected date
     * In range mode, it would has two values, one for the fromValue and the other for the toValue
     * */
    setSelectedDates() {
        this.selectedDates = [];
        if (!this.firstDateOfMonth) {
            return;
        }
        if (this.isInSingleMode && this.selected) {
            const dayDiff = this.dateTimeAdapter.differenceInCalendarDays(this.selected, this.firstDateOfMonth);
            this.selectedDates[0] = dayDiff + 1;
            return;
        }
        if (this.isInRangeMode && this.selecteds) {
            this.selectedDates = this.selecteds.map(selected => {
                if (this.dateTimeAdapter.isValid(selected)) {
                    const dayDiff = this.dateTimeAdapter.differenceInCalendarDays(selected, this.firstDateOfMonth);
                    return dayDiff + 1;
                }
                else {
                    return null;
                }
            });
        }
    }
    focusActiveCell() {
        this.calendarBodyElm.focusActiveCell();
    }
}
OwlMonthViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlMonthViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlMonthViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlMonthViewComponent, selector: "owl-date-time-month-view", inputs: { hideOtherMonths: "hideOtherMonths", firstDayOfWeek: "firstDayOfWeek", selectMode: "selectMode", selected: "selected", selecteds: "selecteds", pickerMoment: "pickerMoment", dateFilter: "dateFilter", minDate: "minDate", maxDate: "maxDate" }, outputs: { selectedChange: "selectedChange", userSelection: "userSelection", pickerMomentChange: "pickerMomentChange" }, host: { properties: { "class.owl-dt-calendar-view": "owlDTCalendarView" } }, viewQueries: [{ propertyName: "calendarBodyElm", first: true, predicate: OwlCalendarBodyComponent, descendants: true, static: true }], exportAs: ["owlYearView"], ngImport: i0, template: "<table class=\"owl-dt-calendar-table owl-dt-calendar-month-table\"\n       [class.owl-dt-calendar-only-current-month]=\"hideOtherMonths\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr class=\"owl-dt-weekdays\">\n        <th *ngFor=\"let weekday of weekdays\"\n            [attr.aria-label]=\"weekday.long\"\n            class=\"owl-dt-weekday\" scope=\"col\">\n            <span>{{weekday.short}}</span>\n        </th>\n    </tr>\n    <tr>\n        <th class=\"owl-dt-calendar-table-divider\" aria-hidden=\"true\" colspan=\"7\"></th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"days\" [todayValue]=\"todayDate\"\n           [selectedValues]=\"selectedDates\"\n           [selectMode]=\"selectMode\"\n           [activeCell]=\"activeCell\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\">\n    </tbody>\n</table>\n", styles: [""], components: [{ type: OwlCalendarBodyComponent, selector: "[owl-date-time-calendar-body]", inputs: ["activeCell", "rows", "numCols", "cellRatio", "todayValue", "selectedValues", "selectMode"], outputs: ["select"], exportAs: ["owlDateTimeCalendarBody"] }], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlMonthViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-month-view', exportAs: 'owlYearView', host: {
                        '[class.owl-dt-calendar-view]': 'owlDTCalendarView'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<table class=\"owl-dt-calendar-table owl-dt-calendar-month-table\"\n       [class.owl-dt-calendar-only-current-month]=\"hideOtherMonths\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr class=\"owl-dt-weekdays\">\n        <th *ngFor=\"let weekday of weekdays\"\n            [attr.aria-label]=\"weekday.long\"\n            class=\"owl-dt-weekday\" scope=\"col\">\n            <span>{{weekday.short}}</span>\n        </th>\n    </tr>\n    <tr>\n        <th class=\"owl-dt-calendar-table-divider\" aria-hidden=\"true\" colspan=\"7\"></th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"days\" [todayValue]=\"todayDate\"\n           [selectedValues]=\"selectedDates\"\n           [selectMode]=\"selectMode\"\n           [activeCell]=\"activeCell\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\">\n    </tbody>\n</table>\n", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.ChangeDetectorRef }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }];
    }, propDecorators: { hideOtherMonths: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], selectMode: [{
                type: Input
            }], selected: [{
                type: Input
            }], selecteds: [{
                type: Input
            }], pickerMoment: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], userSelection: [{
                type: Output
            }], pickerMomentChange: [{
                type: Output
            }], calendarBodyElm: [{
                type: ViewChild,
                args: [OwlCalendarBodyComponent, { static: true }]
            }] } });

/**
 * calendar-year-view.component
 */
const MONTHS_PER_YEAR = 12;
const MONTHS_PER_ROW = 3;
class OwlYearViewComponent {
    constructor(cdRef, dateTimeAdapter, dateTimeFormats) {
        this.cdRef = cdRef;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        /**
         * The select mode of the picker;
         * */
        this._selectMode = 'single';
        this._selecteds = [];
        this.localeSub = Subscription.EMPTY;
        this.initiated = false;
        /**
         * An array to hold all selectedDates' month value
         * the value is the month number in current year
         * */
        this.selectedMonths = [];
        /**
         * Callback to invoke when a new month is selected
         * */
        this.change = new EventEmitter();
        /**
         * Emits the selected year. This doesn't imply a change on the selected date
         * */
        this.monthSelected = new EventEmitter();
        /** Emits when any date is activated. */
        this.pickerMomentChange = new EventEmitter();
        /** Emits when use keyboard enter to select a calendar cell */
        this.keyboardEnter = new EventEmitter();
        this.monthNames = this.dateTimeAdapter.getMonthNames('short');
    }
    get selectMode() {
        return this._selectMode;
    }
    set selectMode(val) {
        this._selectMode = val;
        if (this.initiated) {
            this.generateMonthList();
            this.cdRef.markForCheck();
        }
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);
        this.setSelectedMonths();
    }
    get selecteds() {
        return this._selecteds;
    }
    set selecteds(values) {
        this._selecteds = [];
        for (let i = 0; i < values.length; i++) {
            const value = this.dateTimeAdapter.deserialize(values[i]);
            this._selecteds.push(this.getValidDate(value));
        }
        this.setSelectedMonths();
    }
    get pickerMoment() {
        return this._pickerMoment;
    }
    set pickerMoment(value) {
        const oldMoment = this._pickerMoment;
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment =
            this.getValidDate(value) || this.dateTimeAdapter.now();
        if (!this.hasSameYear(oldMoment, this._pickerMoment) &&
            this.initiated) {
            this.generateMonthList();
        }
    }
    get dateFilter() {
        return this._dateFilter;
    }
    set dateFilter(filter) {
        this._dateFilter = filter;
        if (this.initiated) {
            this.generateMonthList();
        }
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._minDate = this.getValidDate(value);
        if (this.initiated) {
            this.generateMonthList();
        }
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._maxDate = this.getValidDate(value);
        if (this.initiated) {
            this.generateMonthList();
        }
    }
    get months() {
        return this._months;
    }
    get activeCell() {
        if (this._pickerMoment) {
            return this.dateTimeAdapter.getMonth(this._pickerMoment);
        }
    }
    get isInSingleMode() {
        return this.selectMode === 'single';
    }
    get isInRangeMode() {
        return (this.selectMode === 'range' ||
            this.selectMode === 'rangeFrom' ||
            this.selectMode === 'rangeTo');
    }
    get owlDTCalendarView() {
        return true;
    }
    ngOnInit() {
        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(() => {
            this.generateMonthList();
            this.cdRef.markForCheck();
        });
    }
    ngAfterContentInit() {
        this.generateMonthList();
        this.initiated = true;
    }
    ngOnDestroy() {
        this.localeSub.unsubscribe();
    }
    /**
     * Handle a calendarCell selected
     */
    selectCalendarCell(cell) {
        this.selectMonth(cell.value);
    }
    /**
     * Handle a new month selected
     */
    selectMonth(month) {
        const firstDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        this.monthSelected.emit(firstDateOfMonth);
        const daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(firstDateOfMonth);
        const result = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, Math.min(daysInMonth, this.dateTimeAdapter.getDate(this.pickerMoment)), this.dateTimeAdapter.getHours(this.pickerMoment), this.dateTimeAdapter.getMinutes(this.pickerMoment), this.dateTimeAdapter.getSeconds(this.pickerMoment));
        this.change.emit(result);
    }
    /**
     * Handle keydown event on calendar body
     */
    handleCalendarKeydown(event) {
        let moment;
        switch (event.keyCode) {
            // minus 1 month
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 month
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            // minus 3 months
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -3);
                this.pickerMomentChange.emit(moment);
                break;
            // add 3 months
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 3);
                this.pickerMomentChange.emit(moment);
                break;
            // move to first month of current year
            case HOME:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            // move to last month of current year
            case END:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 11 - this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            // minus 1 year (or 10 year)
            case PAGE_UP:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? -10 : -1);
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 year (or 10 year)
            case PAGE_DOWN:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? 10 : 1);
                this.pickerMomentChange.emit(moment);
                break;
            // Select current month
            case ENTER:
                this.selectMonth(this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.keyboardEnter.emit();
                break;
            default:
                return;
        }
        this.focusActiveCell();
        event.preventDefault();
    }
    /**
     * Generate the calendar month list
     * */
    generateMonthList() {
        if (!this.pickerMoment) {
            return;
        }
        this.setSelectedMonths();
        this.todayMonth = this.getMonthInCurrentYear(this.dateTimeAdapter.now());
        this._months = [];
        for (let i = 0; i < MONTHS_PER_YEAR / MONTHS_PER_ROW; i++) {
            const row = [];
            for (let j = 0; j < MONTHS_PER_ROW; j++) {
                const month = j + i * MONTHS_PER_ROW;
                const monthCell = this.createMonthCell(month);
                row.push(monthCell);
            }
            this._months.push(row);
        }
        return;
    }
    /**
     * Creates an CalendarCell for the given month.
     */
    createMonthCell(month) {
        const startDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        const ariaLabel = this.dateTimeAdapter.format(startDateOfMonth, this.dateTimeFormats.monthYearA11yLabel);
        const cellClass = 'owl-dt-month-' + month;
        return new CalendarCell(month, this.monthNames[month], ariaLabel, this.isMonthEnabled(month), false, cellClass);
    }
    /**
     * Check if the given month is enable
     */
    isMonthEnabled(month) {
        const firstDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        // If any date in the month is selectable,
        // we count the month as enable
        for (let date = firstDateOfMonth; this.dateTimeAdapter.getMonth(date) === month; date = this.dateTimeAdapter.addCalendarDays(date, 1)) {
            if (!!date &&
                (!this.dateFilter || this.dateFilter(date)) &&
                (!this.minDate ||
                    this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
                (!this.maxDate ||
                    this.dateTimeAdapter.compare(date, this.maxDate) <= 0)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    getMonthInCurrentYear(date) {
        if (this.getValidDate(date) && this.getValidDate(this._pickerMoment)) {
            const result = this.dateTimeAdapter.compareYear(date, this._pickerMoment);
            // < 0 : the given date's year is before pickerMoment's year, we return -1 as selected month value.
            // > 0 : the given date's year is after pickerMoment's year, we return 12 as selected month value.
            // 0 : the give date's year is same as the pickerMoment's year, we return the actual month value.
            if (result < 0) {
                return -1;
            }
            else if (result > 0) {
                return 12;
            }
            else {
                return this.dateTimeAdapter.getMonth(date);
            }
        }
        else {
            return null;
        }
    }
    /**
     * Set the selectedMonths value
     * In single mode, it has only one value which represent the month the selected date in
     * In range mode, it would has two values, one for the month the fromValue in and the other for the month the toValue in
     * */
    setSelectedMonths() {
        this.selectedMonths = [];
        if (this.isInSingleMode && this.selected) {
            this.selectedMonths[0] = this.getMonthInCurrentYear(this.selected);
        }
        if (this.isInRangeMode && this.selecteds) {
            this.selectedMonths[0] = this.getMonthInCurrentYear(this.selecteds[0]);
            this.selectedMonths[1] = this.getMonthInCurrentYear(this.selecteds[1]);
        }
    }
    /**
     * Check the given dates are in the same year
     */
    hasSameYear(dateLeft, dateRight) {
        return !!(dateLeft &&
            dateRight &&
            this.dateTimeAdapter.getYear(dateLeft) ===
                this.dateTimeAdapter.getYear(dateRight));
    }
    /**
     * Get a valid date object
     */
    getValidDate(obj) {
        return this.dateTimeAdapter.isDateInstance(obj) &&
            this.dateTimeAdapter.isValid(obj)
            ? obj
            : null;
    }
    focusActiveCell() {
        this.calendarBodyElm.focusActiveCell();
    }
}
OwlYearViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlYearViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlYearViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlYearViewComponent, selector: "owl-date-time-year-view", inputs: { selectMode: "selectMode", selected: "selected", selecteds: "selecteds", pickerMoment: "pickerMoment", dateFilter: "dateFilter", minDate: "minDate", maxDate: "maxDate" }, outputs: { change: "change", monthSelected: "monthSelected", pickerMomentChange: "pickerMomentChange", keyboardEnter: "keyboardEnter" }, host: { properties: { "class.owl-dt-calendar-view": "owlDTCalendarView" } }, viewQueries: [{ propertyName: "calendarBodyElm", first: true, predicate: OwlCalendarBodyComponent, descendants: true, static: true }], exportAs: ["owlMonthView"], ngImport: i0, template: "<table class=\"owl-dt-calendar-table owl-dt-calendar-year-table\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr>\n        <th class=\"owl-dt-calendar-table-divider\" aria-hidden=\"true\" colspan=\"3\"></th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"months\" [numCols]=\"3\" [cellRatio]=\"3 / 7\"\n           [activeCell]=\"activeCell\"\n           [todayValue]=\"todayMonth\"\n           [selectedValues]=\"selectedMonths\"\n           [selectMode]=\"selectMode\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\">\n    </tbody>\n</table>\n", styles: [""], components: [{ type: OwlCalendarBodyComponent, selector: "[owl-date-time-calendar-body]", inputs: ["activeCell", "rows", "numCols", "cellRatio", "todayValue", "selectedValues", "selectMode"], outputs: ["select"], exportAs: ["owlDateTimeCalendarBody"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlYearViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-year-view', exportAs: 'owlMonthView', host: {
                        '[class.owl-dt-calendar-view]': 'owlDTCalendarView'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<table class=\"owl-dt-calendar-table owl-dt-calendar-year-table\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr>\n        <th class=\"owl-dt-calendar-table-divider\" aria-hidden=\"true\" colspan=\"3\"></th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"months\" [numCols]=\"3\" [cellRatio]=\"3 / 7\"\n           [activeCell]=\"activeCell\"\n           [todayValue]=\"todayMonth\"\n           [selectedValues]=\"selectedMonths\"\n           [selectMode]=\"selectMode\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\">\n    </tbody>\n</table>\n", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.ChangeDetectorRef }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }];
    }, propDecorators: { selectMode: [{
                type: Input
            }], selected: [{
                type: Input
            }], selecteds: [{
                type: Input
            }], pickerMoment: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], change: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], pickerMomentChange: [{
                type: Output
            }], keyboardEnter: [{
                type: Output
            }], calendarBodyElm: [{
                type: ViewChild,
                args: [OwlCalendarBodyComponent, { static: true }]
            }] } });

function defaultOptionsFactory() {
    return DefaultOptions.create();
}
function multiYearOptionsFactory(options) {
    return options.multiYear;
}
class DefaultOptions {
    static create() {
        // Always return new instance
        return {
            multiYear: {
                yearRows: 7,
                yearsPerRow: 3
            }
        };
    }
}
class OptionsTokens {
}
OptionsTokens.all = new InjectionToken('All options token');
OptionsTokens.multiYear = new InjectionToken('Grid view options token');
const optionsProviders = [
    {
        provide: OptionsTokens.all,
        useFactory: defaultOptionsFactory,
    },
    {
        provide: OptionsTokens.multiYear,
        useFactory: multiYearOptionsFactory,
        deps: [OptionsTokens.all],
    },
];

/**
 * calendar-multi-year-view.component
 */
class OwlMultiYearViewComponent {
    constructor(cdRef, pickerIntl, dateTimeAdapter, options) {
        this.cdRef = cdRef;
        this.pickerIntl = pickerIntl;
        this.dateTimeAdapter = dateTimeAdapter;
        this.options = options;
        /**
         * The select mode of the picker;
         * */
        this._selectMode = 'single';
        this._selecteds = [];
        this.initiated = false;
        /**
         * Callback to invoke when a new month is selected
         * */
        this.change = new EventEmitter();
        /**
         * Emits the selected year. This doesn't imply a change on the selected date
         * */
        this.yearSelected = new EventEmitter();
        /** Emits when any date is activated. */
        this.pickerMomentChange = new EventEmitter();
        /** Emits when use keyboard enter to select a calendar cell */
        this.keyboardEnter = new EventEmitter();
    }
    get selectMode() {
        return this._selectMode;
    }
    set selectMode(val) {
        this._selectMode = val;
        if (this.initiated) {
            this.setSelectedYears();
            this.cdRef.markForCheck();
        }
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        const oldSelected = this._selected;
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);
        if (!this.dateTimeAdapter.isSameDay(oldSelected, this._selected)) {
            this.setSelectedYears();
        }
    }
    get selecteds() {
        return this._selecteds;
    }
    set selecteds(values) {
        this._selecteds = values.map((v) => {
            v = this.dateTimeAdapter.deserialize(v);
            return this.getValidDate(v);
        });
        this.setSelectedYears();
    }
    get pickerMoment() {
        return this._pickerMoment;
    }
    set pickerMoment(value) {
        const oldMoment = this._pickerMoment;
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();
        if (oldMoment && this._pickerMoment &&
            !this.isSameYearList(oldMoment, this._pickerMoment)) {
            this.generateYearList();
        }
    }
    get dateFilter() {
        return this._dateFilter;
    }
    set dateFilter(filter) {
        this._dateFilter = filter;
        if (this.initiated) {
            this.generateYearList();
        }
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._minDate = this.getValidDate(value);
        if (this.initiated) {
            this.generateYearList();
        }
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._maxDate = this.getValidDate(value);
        if (this.initiated) {
            this.generateYearList();
        }
    }
    get todayYear() {
        return this._todayYear;
    }
    get years() {
        return this._years;
    }
    get selectedYears() {
        return this._selectedYears;
    }
    get isInSingleMode() {
        return this.selectMode === 'single';
    }
    get isInRangeMode() {
        return this.selectMode === 'range' || this.selectMode === 'rangeFrom'
            || this.selectMode === 'rangeTo';
    }
    get activeCell() {
        if (this._pickerMoment) {
            return this.dateTimeAdapter.getYear(this._pickerMoment) % (this.options.yearsPerRow * this.options.yearRows);
        }
    }
    get tableHeader() {
        if (this._years && this._years.length > 0) {
            return `${this._years[0][0].displayValue} - ${this._years[this.options.yearRows - 1][this.options.yearsPerRow - 1].displayValue}`;
        }
    }
    get prevButtonLabel() {
        return this.pickerIntl.prevMultiYearLabel;
    }
    get nextButtonLabel() {
        return this.pickerIntl.nextMultiYearLabel;
    }
    get owlDTCalendarView() {
        return true;
    }
    get owlDTCalendarMultiYearView() {
        return true;
    }
    ngOnInit() {
    }
    ngAfterContentInit() {
        this._todayYear = this.dateTimeAdapter.getYear(this.dateTimeAdapter.now());
        this.generateYearList();
        this.initiated = true;
    }
    /**
     * Handle a calendarCell selected
     */
    selectCalendarCell(cell) {
        this.selectYear(cell.value);
    }
    selectYear(year) {
        this.yearSelected.emit(this.dateTimeAdapter.createDate(year, 0, 1));
        const firstDateOfMonth = this.dateTimeAdapter.createDate(year, this.dateTimeAdapter.getMonth(this.pickerMoment), 1);
        const daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(firstDateOfMonth);
        const selected = this.dateTimeAdapter.createDate(year, this.dateTimeAdapter.getMonth(this.pickerMoment), Math.min(daysInMonth, this.dateTimeAdapter.getDate(this.pickerMoment)), this.dateTimeAdapter.getHours(this.pickerMoment), this.dateTimeAdapter.getMinutes(this.pickerMoment), this.dateTimeAdapter.getSeconds(this.pickerMoment));
        this.change.emit(selected);
    }
    /**
     * Generate the previous year list
     * */
    prevYearList(event) {
        this._pickerMoment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1 * this.options.yearsPerRow * this.options.yearRows);
        this.generateYearList();
        event.preventDefault();
    }
    /**
     * Generate the next year list
     * */
    nextYearList(event) {
        this._pickerMoment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, this.options.yearsPerRow * this.options.yearRows);
        this.generateYearList();
        event.preventDefault();
    }
    generateYearList() {
        this._years = [];
        const pickerMomentYear = this.dateTimeAdapter.getYear(this._pickerMoment);
        const offset = pickerMomentYear % (this.options.yearsPerRow * this.options.yearRows);
        for (let i = 0; i < this.options.yearRows; i++) {
            const row = [];
            for (let j = 0; j < this.options.yearsPerRow; j++) {
                const year = pickerMomentYear - offset + (j + i * this.options.yearsPerRow);
                const yearCell = this.createYearCell(year);
                row.push(yearCell);
            }
            this._years.push(row);
        }
        return;
    }
    /** Whether the previous period button is enabled. */
    previousEnabled() {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this.isSameYearList(this._pickerMoment, this.minDate);
    }
    /** Whether the next period button is enabled. */
    nextEnabled() {
        return !this.maxDate || !this.isSameYearList(this._pickerMoment, this.maxDate);
    }
    handleCalendarKeydown(event) {
        let moment;
        switch (event.keyCode) {
            // minus 1 year
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 year
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            // minus 3 years
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, -1 * this.options.yearsPerRow);
                this.pickerMomentChange.emit(moment);
                break;
            // add 3 years
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, this.options.yearsPerRow);
                this.pickerMomentChange.emit(moment);
                break;
            // go to the first year of the year page
            case HOME:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, -this.dateTimeAdapter.getYear(this._pickerMoment) % (this.options.yearsPerRow * this.options.yearRows));
                this.pickerMomentChange.emit(moment);
                break;
            // go to the last year of the year page
            case END:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, (this.options.yearsPerRow * this.options.yearRows) - this.dateTimeAdapter.getYear(this._pickerMoment) % (this.options.yearsPerRow * this.options.yearRows) - 1);
                this.pickerMomentChange.emit(moment);
                break;
            // minus 1 year page (or 10 year pages)
            case PAGE_UP:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? -10 * (this.options.yearsPerRow * this.options.yearRows) : -1 * (this.options.yearsPerRow * this.options.yearRows));
                this.pickerMomentChange.emit(moment);
                break;
            // add 1 year page (or 10 year pages)
            case PAGE_DOWN:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? 10 * (this.options.yearsPerRow * this.options.yearRows) : (this.options.yearsPerRow * this.options.yearRows));
                this.pickerMomentChange.emit(moment);
                break;
            case ENTER:
                this.selectYear(this.dateTimeAdapter.getYear(this._pickerMoment));
                this.keyboardEnter.emit();
                break;
            default:
                return;
        }
        this.focusActiveCell();
        event.preventDefault();
    }
    /**
     * Creates an CalendarCell for the given year.
     */
    createYearCell(year) {
        const startDateOfYear = this.dateTimeAdapter.createDate(year, 0, 1);
        const ariaLabel = this.dateTimeAdapter.getYearName(startDateOfYear);
        const cellClass = 'owl-dt-year-' + year;
        return new CalendarCell(year, year.toString(), ariaLabel, this.isYearEnabled(year), false, cellClass);
    }
    setSelectedYears() {
        this._selectedYears = [];
        if (this.isInSingleMode && this.selected) {
            this._selectedYears[0] = this.dateTimeAdapter.getYear(this.selected);
        }
        if (this.isInRangeMode && this.selecteds) {
            this._selectedYears = this.selecteds.map((selected) => {
                if (this.dateTimeAdapter.isValid(selected)) {
                    return this.dateTimeAdapter.getYear(selected);
                }
                else {
                    return null;
                }
            });
        }
    }
    /** Whether the given year is enabled. */
    isYearEnabled(year) {
        // disable if the year is greater than maxDate lower than minDate
        if (year === undefined || year === null ||
            (this.maxDate && year > this.dateTimeAdapter.getYear(this.maxDate)) ||
            (this.minDate && year < this.dateTimeAdapter.getYear(this.minDate))) {
            return false;
        }
        // enable if it reaches here and there's no filter defined
        if (!this.dateFilter) {
            return true;
        }
        const firstOfYear = this.dateTimeAdapter.createDate(year, 0, 1);
        // If any date in the year is enabled count the year as enabled.
        for (let date = firstOfYear; this.dateTimeAdapter.getYear(date) === year; date = this.dateTimeAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    }
    isSameYearList(date1, date2) {
        return Math.floor(this.dateTimeAdapter.getYear(date1) / (this.options.yearsPerRow * this.options.yearRows)) ===
            Math.floor(this.dateTimeAdapter.getYear(date2) / (this.options.yearsPerRow * this.options.yearRows));
    }
    /**
     * Get a valid date object
     */
    getValidDate(obj) {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    }
    focusActiveCell() {
        this.calendarBodyElm.focusActiveCell();
    }
}
OwlMultiYearViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlMultiYearViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: OwlDateTimeIntl }, { token: DateTimeAdapter, optional: true }, { token: OptionsTokens.multiYear }], target: i0.ɵɵFactoryTarget.Component });
OwlMultiYearViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlMultiYearViewComponent, selector: "owl-date-time-multi-year-view", inputs: { selectMode: "selectMode", selected: "selected", selecteds: "selecteds", pickerMoment: "pickerMoment", dateFilter: "dateFilter", minDate: "minDate", maxDate: "maxDate" }, outputs: { change: "change", yearSelected: "yearSelected", pickerMomentChange: "pickerMomentChange", keyboardEnter: "keyboardEnter" }, host: { properties: { "class.owl-dt-calendar-view": "owlDTCalendarView", "class.owl-dt-calendar-multi-year-view": "owlDTCalendarMultiYearView" } }, viewQueries: [{ propertyName: "calendarBodyElm", first: true, predicate: OwlCalendarBodyComponent, descendants: true, static: true }], ngImport: i0, template: "<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!previousEnabled()\" [attr.aria-label]=\"prevButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"prevYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n             version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n             style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n             width=\"100%\" height=\"100%\">\n            <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n<table class=\"owl-dt-calendar-table owl-dt-calendar-multi-year-table\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr>\n        <th colspan=\"3\">{{tableHeader}}</th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"years\" [numCols]=\"3\" [cellRatio]=\"3 / 7\"\n           [activeCell]=\"activeCell\"\n           [todayValue]=\"todayYear\"\n           [selectedValues]=\"selectedYears\"\n           [selectMode]=\"selectMode\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\"></tbody>\n</table>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!nextEnabled()\" [attr.aria-label]=\"nextButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"nextYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n             viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n            <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n", styles: [""], components: [{ type: OwlCalendarBodyComponent, selector: "[owl-date-time-calendar-body]", inputs: ["activeCell", "rows", "numCols", "cellRatio", "todayValue", "selectedValues", "selectMode"], outputs: ["select"], exportAs: ["owlDateTimeCalendarBody"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlMultiYearViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-multi-year-view', host: {
                        '[class.owl-dt-calendar-view]': 'owlDTCalendarView',
                        '[class.owl-dt-calendar-multi-year-view]': 'owlDTCalendarMultiYearView'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!previousEnabled()\" [attr.aria-label]=\"prevButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"prevYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n             version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n             style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n             width=\"100%\" height=\"100%\">\n            <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n<table class=\"owl-dt-calendar-table owl-dt-calendar-multi-year-table\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr>\n        <th colspan=\"3\">{{tableHeader}}</th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"years\" [numCols]=\"3\" [cellRatio]=\"3 / 7\"\n           [activeCell]=\"activeCell\"\n           [todayValue]=\"todayYear\"\n           [selectedValues]=\"selectedYears\"\n           [selectMode]=\"selectMode\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\"></tbody>\n</table>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!nextEnabled()\" [attr.aria-label]=\"nextButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"nextYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n             viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n            <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.ChangeDetectorRef }, { type: OwlDateTimeIntl }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [OptionsTokens.multiYear]
                    }] }];
    }, propDecorators: { selectMode: [{
                type: Input
            }], selected: [{
                type: Input
            }], selecteds: [{
                type: Input
            }], pickerMoment: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], change: [{
                type: Output
            }], yearSelected: [{
                type: Output
            }], pickerMomentChange: [{
                type: Output
            }], keyboardEnter: [{
                type: Output
            }], calendarBodyElm: [{
                type: ViewChild,
                args: [OwlCalendarBodyComponent, { static: true }]
            }] } });

/**
 * calendar.component
 */
class OwlCalendarComponent {
    constructor(elmRef, pickerIntl, ngZone, cdRef, dateTimeAdapter, dateTimeFormats) {
        this.elmRef = elmRef;
        this.pickerIntl = pickerIntl;
        this.ngZone = ngZone;
        this.cdRef = cdRef;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        this.DateView = DateView;
        this._selecteds = [];
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
        /** Emits when the currently picker moment changes. */
        this.pickerMomentChange = new EventEmitter();
        /** Emits when the selected date changes. */
        this.dateClicked = new EventEmitter();
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is selected. */
        this.userSelection = new EventEmitter();
        /**
         * Emits the selected year. This doesn't imply a change on the selected date
         * */
        this.yearSelected = new EventEmitter();
        /**
         * Emits the selected month. This doesn't imply a change on the selected date
         * */
        this.monthSelected = new EventEmitter();
        this.intlChangesSub = Subscription.EMPTY;
        /**
         * Used for scheduling that focus should be moved to the active cell on the next tick.
         * We need to schedule it, rather than do it immediately, because we have to wait
         * for Angular to re-evaluate the view children.
         */
        this.moveFocusOnNextTick = false;
        /**
         * Date filter for the month and year view
         */
        this.dateFilterForViews = (date) => {
            return (!!date &&
                (!this.dateFilter || this.dateFilter(date)) &&
                (!this.minDate ||
                    this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
                (!this.maxDate ||
                    this.dateTimeAdapter.compare(date, this.maxDate) <= 0));
        };
        this.intlChangesSub = this.pickerIntl.changes.subscribe(() => {
            this.cdRef.markForCheck();
        });
    }
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        value = this.getValidDate(value);
        this._minDate = value
            ? this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(value), this.dateTimeAdapter.getMonth(value), this.dateTimeAdapter.getDate(value))
            : null;
    }
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        value = this.dateTimeAdapter.deserialize(value);
        value = this.getValidDate(value);
        this._maxDate = value
            ? this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(value), this.dateTimeAdapter.getMonth(value), this.dateTimeAdapter.getDate(value))
            : null;
    }
    get pickerMoment() {
        return this._pickerMoment;
    }
    set pickerMoment(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment =
            this.getValidDate(value) || this.dateTimeAdapter.now();
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);
    }
    get selecteds() {
        return this._selecteds;
    }
    set selecteds(values) {
        this._selecteds = values.map(v => {
            v = this.dateTimeAdapter.deserialize(v);
            return this.getValidDate(v);
        });
    }
    get periodButtonText() {
        return this.isMonthView
            ? this.dateTimeAdapter.format(this.pickerMoment, this.dateTimeFormats.monthYearLabel)
            : this.dateTimeAdapter.getYearName(this.pickerMoment);
    }
    get periodButtonLabel() {
        return this.isMonthView
            ? this.pickerIntl.switchToMultiYearViewLabel
            : this.pickerIntl.switchToMonthViewLabel;
    }
    get prevButtonLabel() {
        if (this._currentView === DateView.MONTH) {
            return this.pickerIntl.prevMonthLabel;
        }
        else if (this._currentView === DateView.YEAR) {
            return this.pickerIntl.prevYearLabel;
        }
        else {
            return null;
        }
    }
    get nextButtonLabel() {
        if (this._currentView === DateView.MONTH) {
            return this.pickerIntl.nextMonthLabel;
        }
        else if (this._currentView === DateView.YEAR) {
            return this.pickerIntl.nextYearLabel;
        }
        else {
            return null;
        }
    }
    get currentView() {
        return this._currentView;
    }
    set currentView(view) {
        this._currentView = view;
        this.moveFocusOnNextTick = true;
    }
    get isInSingleMode() {
        return this.selectMode === 'single';
    }
    get isInRangeMode() {
        return (this.selectMode === 'range' ||
            this.selectMode === 'rangeFrom' ||
            this.selectMode === 'rangeTo');
    }
    get showControlArrows() {
        return this._currentView !== DateView.MULTI_YEARS;
    }
    get isMonthView() {
        return this._currentView === DateView.MONTH;
    }
    /**
     * Bind class 'owl-dt-calendar' to host
     * */
    get owlDTCalendarClass() {
        return true;
    }
    ngOnInit() {
    }
    ngAfterContentInit() {
        this._currentView = this.startView;
    }
    ngAfterViewChecked() {
        if (this.moveFocusOnNextTick) {
            this.moveFocusOnNextTick = false;
            this.focusActiveCell();
        }
    }
    ngOnDestroy() {
        this.intlChangesSub.unsubscribe();
    }
    /**
     * Toggle between month view and year view
     */
    toggleViews() {
        let nextView = null;
        if (this._currentView === DateView.MONTH) {
            nextView = DateView.MULTI_YEARS;
        }
        else {
            if (this.multiyearOnly) {
                nextView = DateView.MULTI_YEARS;
            }
            else if (this.yearOnly) {
                nextView = this._currentView === DateView.YEAR ? DateView.MULTI_YEARS : DateView.YEAR;
            }
            else {
                nextView = DateView.MONTH;
            }
        }
        this.currentView = nextView;
    }
    /**
     * Handles user clicks on the previous button.
     * */
    previousClicked() {
        this.pickerMoment = this.isMonthView
            ? this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1)
            : this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1);
        this.pickerMomentChange.emit(this.pickerMoment);
    }
    /**
     * Handles user clicks on the next button.
     * */
    nextClicked() {
        this.pickerMoment = this.isMonthView
            ? this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1)
            : this.dateTimeAdapter.addCalendarYears(this.pickerMoment, 1);
        this.pickerMomentChange.emit(this.pickerMoment);
    }
    dateSelected(date) {
        if (!this.dateFilterForViews(date)) {
            return;
        }
        this.dateClicked.emit(date);
        this.selectedChange.emit(date);
        /*if ((this.isInSingleMode && !this.dateTimeAdapter.isSameDay(date, this.selected)) ||
            this.isInRangeMode) {
            this.selectedChange.emit(date);
        }*/
    }
    /**
     * Change the pickerMoment value and switch to a specific view
     */
    goToDateInView(date, view) {
        this.handlePickerMomentChange(date);
        if ((!this.yearOnly && !this.multiyearOnly) ||
            (this.multiyearOnly && (view !== DateView.MONTH && view !== DateView.YEAR)) ||
            (this.yearOnly && view !== DateView.MONTH)) {
            this.currentView = view;
        }
        return;
    }
    /**
     * Change the pickerMoment value
     */
    handlePickerMomentChange(date) {
        this.pickerMoment = this.dateTimeAdapter.clampDate(date, this.minDate, this.maxDate);
        this.pickerMomentChange.emit(this.pickerMoment);
        return;
    }
    userSelected() {
        this.userSelection.emit();
    }
    /**
     * Whether the previous period button is enabled.
     */
    prevButtonEnabled() {
        return (!this.minDate || !this.isSameView(this.pickerMoment, this.minDate));
    }
    /**
     * Whether the next period button is enabled.
     */
    nextButtonEnabled() {
        return (!this.maxDate || !this.isSameView(this.pickerMoment, this.maxDate));
    }
    /**
     * Focus to the host element
     * */
    focusActiveCell() {
        this.ngZone.runOutsideAngular(() => {
            this.ngZone.onStable
                .asObservable()
                .pipe(take(1))
                .subscribe(() => {
                this.elmRef.nativeElement
                    .querySelector('.owl-dt-calendar-cell-active')
                    .focus();
            });
        });
    }
    selectYearInMultiYearView(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    selectMonthInYearView(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     */
    isSameView(date1, date2) {
        if (this._currentView === DateView.MONTH) {
            return !!(date1 &&
                date2 &&
                this.dateTimeAdapter.getYear(date1) ===
                    this.dateTimeAdapter.getYear(date2) &&
                this.dateTimeAdapter.getMonth(date1) ===
                    this.dateTimeAdapter.getMonth(date2));
        }
        else if (this._currentView === DateView.YEAR) {
            return !!(date1 &&
                date2 &&
                this.dateTimeAdapter.getYear(date1) ===
                    this.dateTimeAdapter.getYear(date2));
        }
        else {
            return false;
        }
    }
    /**
     * Get a valid date object
     */
    getValidDate(obj) {
        return this.dateTimeAdapter.isDateInstance(obj) &&
            this.dateTimeAdapter.isValid(obj)
            ? obj
            : null;
    }
}
OwlCalendarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlCalendarComponent, deps: [{ token: i0.ElementRef }, { token: OwlDateTimeIntl }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlCalendarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlCalendarComponent, selector: "owl-date-time-calendar", inputs: { minDate: "minDate", maxDate: "maxDate", pickerMoment: "pickerMoment", selected: "selected", selecteds: "selecteds", dateFilter: "dateFilter", firstDayOfWeek: "firstDayOfWeek", selectMode: "selectMode", startView: "startView", yearOnly: "yearOnly", multiyearOnly: "multiyearOnly", hideOtherMonths: "hideOtherMonths" }, outputs: { pickerMomentChange: "pickerMomentChange", dateClicked: "dateClicked", selectedChange: "selectedChange", userSelection: "userSelection", yearSelected: "yearSelected", monthSelected: "monthSelected" }, host: { properties: { "class.owl-dt-calendar": "owlDTCalendarClass" } }, exportAs: ["owlDateTimeCalendar"], ngImport: i0, template: "<div class=\"owl-dt-calendar-control\">\n    <!-- focus when keyboard tab (http://kizu.ru/en/blog/keyboard-only-focus/#x) -->\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!prevButtonEnabled()\"\n            [attr.aria-label]=\"prevButtonLabel\"\n            (click)=\"previousClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n                 style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n    <div class=\"owl-dt-calendar-control-content\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-period-button\"\n                type=\"button\" tabindex=\"0\"\n                [attr.aria-label]=\"periodButtonLabel\"\n                (click)=\"toggleViews()\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{periodButtonText}}\n\n                <span class=\"owl-dt-control-button-arrow\"\n                      [style.transform]=\"'rotate(' + (isMonthView? 0 : 180) +'deg)'\">\n                    <!-- <editor-fold desc=\"SVG Arrow\"> -->\n                    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                         width=\"50%\" height=\"50%\" viewBox=\"0 0 292.362 292.362\" style=\"enable-background:new 0 0 292.362 292.362;\"\n                         xml:space=\"preserve\">\n                        <g>\n                            <path d=\"M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424\n                                C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428\n                                s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z\"/>\n                        </g>\n                    </svg>\n                    <!-- </editor-fold> -->\n                </span>\n            </span>\n        </button>\n    </div>\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!nextButtonEnabled()\"\n            [attr.aria-label]=\"nextButtonLabel\"\n            (click)=\"nextClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n        <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                 viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n                <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                    c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                    c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                    C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n</div>\n<div class=\"owl-dt-calendar-main\" cdkMonitorSubtreeFocus [ngSwitch]=\"currentView\" tabindex=\"-1\">\n    <owl-date-time-month-view\n            *ngSwitchCase=\"DateView.MONTH\"\n            [pickerMoment]=\"pickerMoment\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            [hideOtherMonths]=\"hideOtherMonths\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (selectedChange)=\"dateSelected($event)\"\n            (userSelection)=\"userSelected()\"></owl-date-time-month-view>\n\n    <owl-date-time-year-view\n            *ngSwitchCase=\"DateView.YEAR\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (monthSelected)=\"selectMonthInYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.MONTH)\"></owl-date-time-year-view>\n\n    <owl-date-time-multi-year-view\n            *ngSwitchCase=\"DateView.MULTI_YEARS\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (yearSelected)=\"selectYearInMultiYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.YEAR)\"></owl-date-time-multi-year-view>\n</div>\n", styles: [""], components: [{ type: OwlMonthViewComponent, selector: "owl-date-time-month-view", inputs: ["hideOtherMonths", "firstDayOfWeek", "selectMode", "selected", "selecteds", "pickerMoment", "dateFilter", "minDate", "maxDate"], outputs: ["selectedChange", "userSelection", "pickerMomentChange"], exportAs: ["owlYearView"] }, { type: OwlYearViewComponent, selector: "owl-date-time-year-view", inputs: ["selectMode", "selected", "selecteds", "pickerMoment", "dateFilter", "minDate", "maxDate"], outputs: ["change", "monthSelected", "pickerMomentChange", "keyboardEnter"], exportAs: ["owlMonthView"] }, { type: OwlMultiYearViewComponent, selector: "owl-date-time-multi-year-view", inputs: ["selectMode", "selected", "selecteds", "pickerMoment", "dateFilter", "minDate", "maxDate"], outputs: ["change", "yearSelected", "pickerMomentChange", "keyboardEnter"] }], directives: [{ type: i1$1.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"] }, { type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-calendar', exportAs: 'owlDateTimeCalendar', host: {
                        '[class.owl-dt-calendar]': 'owlDTCalendarClass'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"owl-dt-calendar-control\">\n    <!-- focus when keyboard tab (http://kizu.ru/en/blog/keyboard-only-focus/#x) -->\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!prevButtonEnabled()\"\n            [attr.aria-label]=\"prevButtonLabel\"\n            (click)=\"previousClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n                 style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n    <div class=\"owl-dt-calendar-control-content\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-period-button\"\n                type=\"button\" tabindex=\"0\"\n                [attr.aria-label]=\"periodButtonLabel\"\n                (click)=\"toggleViews()\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{periodButtonText}}\n\n                <span class=\"owl-dt-control-button-arrow\"\n                      [style.transform]=\"'rotate(' + (isMonthView? 0 : 180) +'deg)'\">\n                    <!-- <editor-fold desc=\"SVG Arrow\"> -->\n                    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                         width=\"50%\" height=\"50%\" viewBox=\"0 0 292.362 292.362\" style=\"enable-background:new 0 0 292.362 292.362;\"\n                         xml:space=\"preserve\">\n                        <g>\n                            <path d=\"M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424\n                                C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428\n                                s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z\"/>\n                        </g>\n                    </svg>\n                    <!-- </editor-fold> -->\n                </span>\n            </span>\n        </button>\n    </div>\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!nextButtonEnabled()\"\n            [attr.aria-label]=\"nextButtonLabel\"\n            (click)=\"nextClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n        <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                 viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n                <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                    c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                    c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                    C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n</div>\n<div class=\"owl-dt-calendar-main\" cdkMonitorSubtreeFocus [ngSwitch]=\"currentView\" tabindex=\"-1\">\n    <owl-date-time-month-view\n            *ngSwitchCase=\"DateView.MONTH\"\n            [pickerMoment]=\"pickerMoment\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            [hideOtherMonths]=\"hideOtherMonths\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (selectedChange)=\"dateSelected($event)\"\n            (userSelection)=\"userSelected()\"></owl-date-time-month-view>\n\n    <owl-date-time-year-view\n            *ngSwitchCase=\"DateView.YEAR\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (monthSelected)=\"selectMonthInYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.MONTH)\"></owl-date-time-year-view>\n\n    <owl-date-time-multi-year-view\n            *ngSwitchCase=\"DateView.MULTI_YEARS\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (yearSelected)=\"selectYearInMultiYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.YEAR)\"></owl-date-time-multi-year-view>\n</div>\n", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: OwlDateTimeIntl }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }];
    }, propDecorators: { minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], pickerMoment: [{
                type: Input
            }], selected: [{
                type: Input
            }], selecteds: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], selectMode: [{
                type: Input
            }], startView: [{
                type: Input
            }], yearOnly: [{
                type: Input
            }], multiyearOnly: [{
                type: Input
            }], hideOtherMonths: [{
                type: Input
            }], pickerMomentChange: [{
                type: Output
            }], dateClicked: [{
                type: Output
            }], selectedChange: [{
                type: Output
            }], userSelection: [{
                type: Output
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }] } });

/**
 * timer-box.component
 */
class OwlTimerBoxComponent {
    constructor() {
        this.showDivider = false;
        this.step = 1;
        this.valueChange = new EventEmitter();
        this.inputChange = new EventEmitter();
        this.inputStream = new Subject();
        this.inputStreamSub = Subscription.EMPTY;
        this.hasFocus = false;
        this.onValueInputMouseWheelBind = this.onValueInputMouseWheel.bind(this);
    }
    get displayValue() {
        if (this.hasFocus) {
            // Don't try to reformat the value that user is currently editing
            return this.valueInput.nativeElement.value;
        }
        const value = this.boxValue || this.value;
        if (value === null || isNaN(value)) {
            return '';
        }
        return value < 10 ? '0' + value.toString() : value.toString();
    }
    get owlDTTimerBoxClass() {
        return true;
    }
    ngOnInit() {
        this.inputStreamSub = this.inputStream.pipe(debounceTime(750)).subscribe((val) => {
            if (val) {
                const inputValue = coerceNumberProperty(val, 0);
                this.updateValueViaInput(inputValue);
            }
        });
        this.bindValueInputMouseWheel();
    }
    ngOnDestroy() {
        this.unbindValueInputMouseWheel();
        this.inputStreamSub.unsubscribe();
    }
    upBtnClicked() {
        this.updateValue(this.value + this.step);
    }
    downBtnClicked() {
        this.updateValue(this.value - this.step);
    }
    handleInputChange(val) {
        this.inputStream.next(val);
    }
    focusIn() {
        this.hasFocus = true;
    }
    focusOut(value) {
        this.hasFocus = false;
        if (value) {
            const inputValue = coerceNumberProperty(value, 0);
            this.updateValueViaInput(inputValue);
        }
    }
    updateValue(value) {
        this.valueChange.emit(value);
    }
    updateValueViaInput(value) {
        if (value > this.max || value < this.min) {
            return;
        }
        this.inputChange.emit(value);
    }
    onValueInputMouseWheel(event) {
        event = event || window.event;
        const delta = event.wheelDelta || -event.deltaY || -event.detail;
        if (delta > 0) {
            if (!this.upBtnDisabled) {
                this.upBtnClicked();
            }
        }
        else if (delta < 0) {
            if (!this.downBtnDisabled) {
                this.downBtnClicked();
            }
        }
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }
    bindValueInputMouseWheel() {
        this.valueInput.nativeElement.addEventListener('onwheel' in document ? 'wheel' : 'mousewheel', this.onValueInputMouseWheelBind);
    }
    unbindValueInputMouseWheel() {
        this.valueInput.nativeElement.removeEventListener('onwheel' in document ? 'wheel' : 'mousewheel', this.onValueInputMouseWheelBind);
    }
}
OwlTimerBoxComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlTimerBoxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
OwlTimerBoxComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlTimerBoxComponent, selector: "owl-date-time-timer-box", inputs: { showDivider: "showDivider", upBtnAriaLabel: "upBtnAriaLabel", upBtnDisabled: "upBtnDisabled", downBtnAriaLabel: "downBtnAriaLabel", downBtnDisabled: "downBtnDisabled", boxValue: "boxValue", value: "value", min: "min", max: "max", step: "step", inputLabel: "inputLabel" }, outputs: { valueChange: "valueChange", inputChange: "inputChange" }, host: { properties: { "class.owl-dt-timer-box": "owlDTTimerBoxClass" } }, viewQueries: [{ propertyName: "valueInput", first: true, predicate: ["valueInput"], descendants: true, static: true }], exportAs: ["owlDateTimeTimerBox"], ngImport: i0, template: "<div *ngIf=\"showDivider\" class=\"owl-dt-timer-divider\" aria-hidden=\"true\"></div>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        type=\"button\" tabindex=\"-1\"\n        [disabled]=\"upBtnDisabled\"\n        [attr.aria-label]=\"upBtnAriaLabel\"\n        (click)=\"upBtnClicked()\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Up\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 451.847 451.846\"\n                 style=\"enable-background:new 0 0 451.847 451.846;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                    <path d=\"M248.292,106.406l194.281,194.29c12.365,12.359,12.365,32.391,0,44.744c-12.354,12.354-32.391,12.354-44.744,0\n                        L225.923,173.529L54.018,345.44c-12.36,12.354-32.395,12.354-44.748,0c-12.359-12.354-12.359-32.391,0-44.75L203.554,106.4\n                        c6.18-6.174,14.271-9.259,22.369-9.259C234.018,97.141,242.115,100.232,248.292,106.406z\"/>\n                </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n<label class=\"owl-dt-timer-content\">\n    <input class=\"owl-dt-timer-input\" maxlength=\"2\"\n           [value]=\"displayValue\"\n           (keydown.arrowup)=\"!upBtnDisabled && upBtnClicked()\"\n           (keydown.arrowdown)=\"!downBtnDisabled && downBtnClicked()\"\n           (input)=\"handleInputChange(valueInput.value)\"\n           (focusin)=\"focusIn()\"\n           (focusout)=\"focusOut(valueInput.value)\"\n           #valueInput>\n    <span class=\"owl-hidden-accessible\">{{inputLabel}}</span>\n</label>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        type=\"button\" tabindex=\"-1\"\n        [disabled]=\"downBtnDisabled\"\n        [attr.aria-label]=\"downBtnAriaLabel\"\n        (click)=\"downBtnClicked()\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Down\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 451.847 451.846\"\n                 style=\"enable-background:new 0 0 451.847 451.846;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                    <path d=\"M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751\n                        c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0\n                        c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z\"/>\n                </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n", styles: [""], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlTimerBoxComponent, decorators: [{
            type: Component,
            args: [{ exportAs: 'owlDateTimeTimerBox', selector: 'owl-date-time-timer-box', preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.owl-dt-timer-box]': 'owlDTTimerBoxClass'
                    }, template: "<div *ngIf=\"showDivider\" class=\"owl-dt-timer-divider\" aria-hidden=\"true\"></div>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        type=\"button\" tabindex=\"-1\"\n        [disabled]=\"upBtnDisabled\"\n        [attr.aria-label]=\"upBtnAriaLabel\"\n        (click)=\"upBtnClicked()\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Up\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 451.847 451.846\"\n                 style=\"enable-background:new 0 0 451.847 451.846;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                    <path d=\"M248.292,106.406l194.281,194.29c12.365,12.359,12.365,32.391,0,44.744c-12.354,12.354-32.391,12.354-44.744,0\n                        L225.923,173.529L54.018,345.44c-12.36,12.354-32.395,12.354-44.748,0c-12.359-12.354-12.359-32.391,0-44.75L203.554,106.4\n                        c6.18-6.174,14.271-9.259,22.369-9.259C234.018,97.141,242.115,100.232,248.292,106.406z\"/>\n                </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n<label class=\"owl-dt-timer-content\">\n    <input class=\"owl-dt-timer-input\" maxlength=\"2\"\n           [value]=\"displayValue\"\n           (keydown.arrowup)=\"!upBtnDisabled && upBtnClicked()\"\n           (keydown.arrowdown)=\"!downBtnDisabled && downBtnClicked()\"\n           (input)=\"handleInputChange(valueInput.value)\"\n           (focusin)=\"focusIn()\"\n           (focusout)=\"focusOut(valueInput.value)\"\n           #valueInput>\n    <span class=\"owl-hidden-accessible\">{{inputLabel}}</span>\n</label>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        type=\"button\" tabindex=\"-1\"\n        [disabled]=\"downBtnDisabled\"\n        [attr.aria-label]=\"downBtnAriaLabel\"\n        (click)=\"downBtnClicked()\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Down\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 451.847 451.846\"\n                 style=\"enable-background:new 0 0 451.847 451.846;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                    <path d=\"M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751\n                        c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0\n                        c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z\"/>\n                </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n", styles: [""] }]
        }], ctorParameters: function () { return []; }, propDecorators: { showDivider: [{
                type: Input
            }], upBtnAriaLabel: [{
                type: Input
            }], upBtnDisabled: [{
                type: Input
            }], downBtnAriaLabel: [{
                type: Input
            }], downBtnDisabled: [{
                type: Input
            }], boxValue: [{
                type: Input
            }], value: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], step: [{
                type: Input
            }], inputLabel: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], inputChange: [{
                type: Output
            }], valueInput: [{
                type: ViewChild,
                args: ['valueInput', { static: true }]
            }] } });

/**
 * timer.component
 */
class OwlTimerComponent {
    constructor(ngZone, elmRef, pickerIntl, cdRef, dateTimeAdapter) {
        this.ngZone = ngZone;
        this.elmRef = elmRef;
        this.pickerIntl = pickerIntl;
        this.cdRef = cdRef;
        this.dateTimeAdapter = dateTimeAdapter;
        this.isPM = false; // a flag indicates the current timer moment is in PM or AM
        /**
         * Hours to change per step
         */
        this.stepHour = 1;
        /**
         * Minutes to change per step
         */
        this.stepMinute = 1;
        /**
         * Seconds to change per step
         */
        this.stepSecond = 1;
        this.selectedChange = new EventEmitter();
    }
    get pickerMoment() {
        return this._pickerMoment;
    }
    set pickerMoment(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment =
            this.getValidDate(value) || this.dateTimeAdapter.now();
    }
    get minDateTime() {
        return this._minDateTime;
    }
    set minDateTime(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._minDateTime = this.getValidDate(value);
    }
    get maxDateTime() {
        return this._maxDateTime;
    }
    set maxDateTime(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this._maxDateTime = this.getValidDate(value);
    }
    get hourValue() {
        return this.dateTimeAdapter.getHours(this.pickerMoment);
    }
    /**
     * The value would be displayed in hourBox.
     * We need this because the value displayed in hourBox it not
     * the same as the hourValue when the timer is in hour12Timer mode.
     * */
    get hourBoxValue() {
        let hours = this.hourValue;
        if (!this.hour12Timer) {
            return hours;
        }
        else {
            if (hours === 0) {
                hours = 12;
                this.isPM = false;
            }
            else if (hours > 0 && hours < 12) {
                this.isPM = false;
            }
            else if (hours === 12) {
                this.isPM = true;
            }
            else if (hours > 12 && hours < 24) {
                hours = hours - 12;
                this.isPM = true;
            }
            return hours;
        }
    }
    get minuteValue() {
        return this.dateTimeAdapter.getMinutes(this.pickerMoment);
    }
    get secondValue() {
        return this.dateTimeAdapter.getSeconds(this.pickerMoment);
    }
    get upHourButtonLabel() {
        return this.pickerIntl.upHourLabel;
    }
    get downHourButtonLabel() {
        return this.pickerIntl.downHourLabel;
    }
    get upMinuteButtonLabel() {
        return this.pickerIntl.upMinuteLabel;
    }
    get downMinuteButtonLabel() {
        return this.pickerIntl.downMinuteLabel;
    }
    get upSecondButtonLabel() {
        return this.pickerIntl.upSecondLabel;
    }
    get downSecondButtonLabel() {
        return this.pickerIntl.downSecondLabel;
    }
    get hour12ButtonLabel() {
        return this.isPM
            ? this.pickerIntl.hour12PMLabel
            : this.pickerIntl.hour12AMLabel;
    }
    get owlDTTimerClass() {
        return true;
    }
    get owlDTTimeTabIndex() {
        return -1;
    }
    ngOnInit() { }
    /**
     * Focus to the host element
     * */
    focus() {
        this.ngZone.runOutsideAngular(() => {
            this.ngZone.onStable
                .asObservable()
                .pipe(take(1))
                .subscribe(() => {
                this.elmRef.nativeElement.focus();
            });
        });
    }
    /**
     * Set the hour value via typing into timer box input
     * We need this to handle the hour value when the timer is in hour12 mode
     * */
    setHourValueViaInput(hours) {
        if (this.hour12Timer && this.isPM && hours >= 1 && hours <= 11) {
            hours = hours + 12;
        }
        else if (this.hour12Timer && !this.isPM && hours === 12) {
            hours = 0;
        }
        this.setHourValue(hours);
    }
    setHourValue(hours) {
        const m = this.dateTimeAdapter.setHours(this.pickerMoment, hours);
        this.selectedChange.emit(m);
        this.cdRef.markForCheck();
    }
    setMinuteValue(minutes) {
        const m = this.dateTimeAdapter.setMinutes(this.pickerMoment, minutes);
        this.selectedChange.emit(m);
        this.cdRef.markForCheck();
    }
    setSecondValue(seconds) {
        const m = this.dateTimeAdapter.setSeconds(this.pickerMoment, seconds);
        this.selectedChange.emit(m);
        this.cdRef.markForCheck();
    }
    setMeridiem(event) {
        this.isPM = !this.isPM;
        let hours = this.hourValue;
        if (this.isPM) {
            hours = hours + 12;
        }
        else {
            hours = hours - 12;
        }
        if (hours >= 0 && hours <= 23) {
            this.setHourValue(hours);
        }
        this.cdRef.markForCheck();
        event.preventDefault();
    }
    /**
     * Check if the up hour button is enabled
     */
    upHourEnabled() {
        return (!this.maxDateTime ||
            this.compareHours(this.stepHour, this.maxDateTime) < 1);
    }
    /**
     * Check if the down hour button is enabled
     */
    downHourEnabled() {
        return (!this.minDateTime ||
            this.compareHours(-this.stepHour, this.minDateTime) > -1);
    }
    /**
     * Check if the up minute button is enabled
     */
    upMinuteEnabled() {
        return (!this.maxDateTime ||
            this.compareMinutes(this.stepMinute, this.maxDateTime) < 1);
    }
    /**
     * Check if the down minute button is enabled
     */
    downMinuteEnabled() {
        return (!this.minDateTime ||
            this.compareMinutes(-this.stepMinute, this.minDateTime) > -1);
    }
    /**
     * Check if the up second button is enabled
     */
    upSecondEnabled() {
        return (!this.maxDateTime ||
            this.compareSeconds(this.stepSecond, this.maxDateTime) < 1);
    }
    /**
     * Check if the down second button is enabled
     */
    downSecondEnabled() {
        return (!this.minDateTime ||
            this.compareSeconds(-this.stepSecond, this.minDateTime) > -1);
    }
    /**
     * PickerMoment's hour value +/- certain amount and compare it to the give date
     * 1 is after the comparedDate
     * -1 is before the comparedDate
     * 0 is equal the comparedDate
     * */
    compareHours(amount, comparedDate) {
        const hours = this.dateTimeAdapter.getHours(this.pickerMoment) + amount;
        const result = this.dateTimeAdapter.setHours(this.pickerMoment, hours);
        return this.dateTimeAdapter.compare(result, comparedDate);
    }
    /**
     * PickerMoment's minute value +/- certain amount and compare it to the give date
     * 1 is after the comparedDate
     * -1 is before the comparedDate
     * 0 is equal the comparedDate
     * */
    compareMinutes(amount, comparedDate) {
        const minutes = this.dateTimeAdapter.getMinutes(this.pickerMoment) + amount;
        const result = this.dateTimeAdapter.setMinutes(this.pickerMoment, minutes);
        return this.dateTimeAdapter.compare(result, comparedDate);
    }
    /**
     * PickerMoment's second value +/- certain amount and compare it to the give date
     * 1 is after the comparedDate
     * -1 is before the comparedDate
     * 0 is equal the comparedDate
     * */
    compareSeconds(amount, comparedDate) {
        const seconds = this.dateTimeAdapter.getSeconds(this.pickerMoment) + amount;
        const result = this.dateTimeAdapter.setSeconds(this.pickerMoment, seconds);
        return this.dateTimeAdapter.compare(result, comparedDate);
    }
    /**
     * Get a valid date object
     */
    getValidDate(obj) {
        return this.dateTimeAdapter.isDateInstance(obj) &&
            this.dateTimeAdapter.isValid(obj)
            ? obj
            : null;
    }
}
OwlTimerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlTimerComponent, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: OwlDateTimeIntl }, { token: i0.ChangeDetectorRef }, { token: DateTimeAdapter, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlTimerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlTimerComponent, selector: "owl-date-time-timer", inputs: { pickerMoment: "pickerMoment", minDateTime: "minDateTime", maxDateTime: "maxDateTime", showSecondsTimer: "showSecondsTimer", hour12Timer: "hour12Timer", stepHour: "stepHour", stepMinute: "stepMinute", stepSecond: "stepSecond" }, outputs: { selectedChange: "selectedChange" }, host: { properties: { "class.owl-dt-timer": "owlDTTimerClass", "attr.tabindex": "owlDTTimeTabIndex" } }, exportAs: ["owlDateTimeTimer"], ngImport: i0, template: "<owl-date-time-timer-box\n        [upBtnAriaLabel]=\"upHourButtonLabel\"\n        [downBtnAriaLabel]=\"downHourButtonLabel\"\n        [upBtnDisabled]=\"!upHourEnabled()\"\n        [downBtnDisabled]=\"!downHourEnabled()\"\n        [boxValue]=\"hourBoxValue\"\n        [value]=\"hourValue\" [min]=\"0\" [max]=\"23\"\n        [step]=\"stepHour\" [inputLabel]=\"'Hour'\"\n        (inputChange)=\"setHourValueViaInput($event)\"\n        (valueChange)=\"setHourValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upMinuteButtonLabel\"\n        [downBtnAriaLabel]=\"downMinuteButtonLabel\"\n        [upBtnDisabled]=\"!upMinuteEnabled()\"\n        [downBtnDisabled]=\"!downMinuteEnabled()\"\n        [value]=\"minuteValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepMinute\" [inputLabel]=\"'Minute'\"\n        (inputChange)=\"setMinuteValue($event)\"\n        (valueChange)=\"setMinuteValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        *ngIf=\"showSecondsTimer\"\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upSecondButtonLabel\"\n        [downBtnAriaLabel]=\"downSecondButtonLabel\"\n        [upBtnDisabled]=\"!upSecondEnabled()\"\n        [downBtnDisabled]=\"!downSecondEnabled()\"\n        [value]=\"secondValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepSecond\" [inputLabel]=\"'Second'\"\n        (inputChange)=\"setSecondValue($event)\"\n        (valueChange)=\"setSecondValue($event)\"></owl-date-time-timer-box>\n\n<div *ngIf=\"hour12Timer\" class=\"owl-dt-timer-hour12\">\n    <button class=\"owl-dt-control-button owl-dt-timer-hour12-box\"\n            type=\"button\" tabindex=\"0\"\n            (click)=\"setMeridiem($event)\">\n        <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n            {{hour12ButtonLabel}}\n        </span>\n    </button>\n</div>\n", styles: [""], components: [{ type: OwlTimerBoxComponent, selector: "owl-date-time-timer-box", inputs: ["showDivider", "upBtnAriaLabel", "upBtnDisabled", "downBtnAriaLabel", "downBtnDisabled", "boxValue", "value", "min", "max", "step", "inputLabel"], outputs: ["valueChange", "inputChange"], exportAs: ["owlDateTimeTimerBox"] }], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlTimerComponent, decorators: [{
            type: Component,
            args: [{ exportAs: 'owlDateTimeTimer', selector: 'owl-date-time-timer', preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.owl-dt-timer]': 'owlDTTimerClass',
                        '[attr.tabindex]': 'owlDTTimeTabIndex'
                    }, template: "<owl-date-time-timer-box\n        [upBtnAriaLabel]=\"upHourButtonLabel\"\n        [downBtnAriaLabel]=\"downHourButtonLabel\"\n        [upBtnDisabled]=\"!upHourEnabled()\"\n        [downBtnDisabled]=\"!downHourEnabled()\"\n        [boxValue]=\"hourBoxValue\"\n        [value]=\"hourValue\" [min]=\"0\" [max]=\"23\"\n        [step]=\"stepHour\" [inputLabel]=\"'Hour'\"\n        (inputChange)=\"setHourValueViaInput($event)\"\n        (valueChange)=\"setHourValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upMinuteButtonLabel\"\n        [downBtnAriaLabel]=\"downMinuteButtonLabel\"\n        [upBtnDisabled]=\"!upMinuteEnabled()\"\n        [downBtnDisabled]=\"!downMinuteEnabled()\"\n        [value]=\"minuteValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepMinute\" [inputLabel]=\"'Minute'\"\n        (inputChange)=\"setMinuteValue($event)\"\n        (valueChange)=\"setMinuteValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        *ngIf=\"showSecondsTimer\"\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upSecondButtonLabel\"\n        [downBtnAriaLabel]=\"downSecondButtonLabel\"\n        [upBtnDisabled]=\"!upSecondEnabled()\"\n        [downBtnDisabled]=\"!downSecondEnabled()\"\n        [value]=\"secondValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepSecond\" [inputLabel]=\"'Second'\"\n        (inputChange)=\"setSecondValue($event)\"\n        (valueChange)=\"setSecondValue($event)\"></owl-date-time-timer-box>\n\n<div *ngIf=\"hour12Timer\" class=\"owl-dt-timer-hour12\">\n    <button class=\"owl-dt-control-button owl-dt-timer-hour12-box\"\n            type=\"button\" tabindex=\"0\"\n            (click)=\"setMeridiem($event)\">\n        <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n            {{hour12ButtonLabel}}\n        </span>\n    </button>\n</div>\n", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: OwlDateTimeIntl }, { type: i0.ChangeDetectorRef }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }];
    }, propDecorators: { pickerMoment: [{
                type: Input
            }], minDateTime: [{
                type: Input
            }], maxDateTime: [{
                type: Input
            }], showSecondsTimer: [{
                type: Input
            }], hour12Timer: [{
                type: Input
            }], stepHour: [{
                type: Input
            }], stepMinute: [{
                type: Input
            }], stepSecond: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }] } });

/**
 * date-time-picker.animations
 */
const owlDateTimePickerAnimations = {
    transformPicker: trigger('transformPicker', [
        state('void', style({ opacity: 0, transform: 'scale(1, 0)' })),
        state('enter', style({ opacity: 1, transform: 'scale(1, 1)' })),
        transition('void => enter', group([
            query('@fadeInPicker', animateChild(), { optional: true }),
            animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
        ])),
        transition('enter => void', animate('100ms linear', style({ opacity: 0 })))
    ]),
    fadeInPicker: trigger('fadeInPicker', [
        state('enter', style({ opacity: 1 })),
        state('void', style({ opacity: 0 })),
        transition('void => enter', animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
    ])
};

/**
 * date-time-picker-container.component
 */
class OwlDateTimeContainerComponent {
    constructor(cdRef, elmRef, pickerIntl, dateTimeAdapter) {
        this.cdRef = cdRef;
        this.elmRef = elmRef;
        this.pickerIntl = pickerIntl;
        this.dateTimeAdapter = dateTimeAdapter;
        this.activeSelectedIndex = 0; // The current active SelectedIndex in range select mode (0: 'from', 1: 'to')
        /**
         * Stream emits when try to hide picker
         * */
        this.hidePicker$ = new Subject();
        /**
         * Stream emits when try to confirm the selected value
         * */
        this.confirmSelected$ = new Subject();
        this.pickerOpened$ = new Subject();
    }
    get hidePickerStream() {
        return this.hidePicker$.asObservable();
    }
    get confirmSelectedStream() {
        return this.confirmSelected$.asObservable();
    }
    get pickerOpenedStream() {
        return this.pickerOpened$.asObservable();
    }
    get pickerMoment() {
        return this._clamPickerMoment;
    }
    set pickerMoment(value) {
        if (value) {
            this._clamPickerMoment = this.dateTimeAdapter.clampDate(value, this.picker.minDateTime, this.picker.maxDateTime);
        }
        this.cdRef.markForCheck();
    }
    get pickerType() {
        return this.picker.pickerType;
    }
    get cancelLabel() {
        return this.pickerIntl.cancelBtnLabel;
    }
    get setLabel() {
        return this.pickerIntl.setBtnLabel;
    }
    /**
     * The range 'from' label
     * */
    get fromLabel() {
        return this.pickerIntl.rangeFromLabel;
    }
    /**
     * The range 'to' label
     * */
    get toLabel() {
        return this.pickerIntl.rangeToLabel;
    }
    /**
     * The range 'from' formatted value
     * */
    get fromFormattedValue() {
        const value = this.picker.selecteds[0];
        return value
            ? this.dateTimeAdapter.format(value, this.picker.formatString)
            : '';
    }
    /**
     * The range 'to' formatted value
     * */
    get toFormattedValue() {
        const value = this.picker.selecteds[1];
        return value
            ? this.dateTimeAdapter.format(value, this.picker.formatString)
            : '';
    }
    /**
     * Cases in which the control buttons show in the picker
     * 1) picker mode is 'dialog'
     * 2) picker type is NOT 'calendar' and the picker mode is NOT 'inline'
     * */
    get showControlButtons() {
        return (this.picker.pickerMode === 'dialog' ||
            (this.picker.pickerType !== 'calendar' &&
                this.picker.pickerMode !== 'inline'));
    }
    get containerElm() {
        return this.elmRef.nativeElement;
    }
    get owlDTContainerClass() {
        return true;
    }
    get owlDTPopupContainerClass() {
        return this.picker.pickerMode === 'popup';
    }
    get owlDTDialogContainerClass() {
        return this.picker.pickerMode === 'dialog';
    }
    get owlDTInlineContainerClass() {
        return this.picker.pickerMode === 'inline';
    }
    get owlDTContainerDisabledClass() {
        return this.picker.disabled;
    }
    get owlDTContainerId() {
        return this.picker.id;
    }
    get owlDTContainerAnimation() {
        return this.picker.pickerMode === 'inline' ? '' : 'enter';
    }
    ngOnInit() {
        if (this.picker.selectMode === 'range') {
            if (this.picker.selecteds[0]) {
                this.retainStartTime = this.dateTimeAdapter.clone(this.picker.selecteds[0]);
            }
            if (this.picker.selecteds[1]) {
                this.retainEndTime = this.dateTimeAdapter.clone(this.picker.selecteds[1]);
            }
        }
    }
    ngAfterContentInit() {
        this.initPicker();
    }
    ngAfterViewInit() {
        this.focusPicker();
    }
    handleContainerAnimationDone(event) {
        const toState = event.toState;
        if (toState === 'enter') {
            this.pickerOpened$.next();
        }
    }
    dateSelected(date) {
        let result;
        if (this.picker.isInSingleMode) {
            result = this.dateSelectedInSingleMode(date);
            if (result) {
                this.pickerMoment = result;
                this.picker.select(result);
            }
            else {
                // we close the picker when result is null and pickerType is calendar.
                if (this.pickerType === 'calendar') {
                    this.hidePicker$.next(null);
                }
            }
            return;
        }
        if (this.picker.isInRangeMode) {
            result = this.dateSelectedInRangeMode(date);
            if (result) {
                this.pickerMoment = result[this.activeSelectedIndex];
                this.picker.select(result);
            }
        }
    }
    timeSelected(time) {
        this.pickerMoment = this.dateTimeAdapter.clone(time);
        if (!this.picker.dateTimeChecker(this.pickerMoment)) {
            return;
        }
        if (this.picker.isInSingleMode) {
            this.picker.select(this.pickerMoment);
            return;
        }
        if (this.picker.isInRangeMode) {
            const selecteds = [...this.picker.selecteds];
            // check if the 'from' is after 'to' or 'to'is before 'from'
            // In this case, we set both the 'from' and 'to' the same value
            if ((this.activeSelectedIndex === 0 &&
                selecteds[1] &&
                this.dateTimeAdapter.compare(this.pickerMoment, selecteds[1]) === 1) ||
                (this.activeSelectedIndex === 1 &&
                    selecteds[0] &&
                    this.dateTimeAdapter.compare(this.pickerMoment, selecteds[0]) === -1)) {
                selecteds[0] = this.pickerMoment;
                selecteds[1] = this.pickerMoment;
            }
            else {
                selecteds[this.activeSelectedIndex] = this.pickerMoment;
            }
            if (selecteds[0]) {
                this.retainStartTime = this.dateTimeAdapter.clone(selecteds[0]);
            }
            if (selecteds[1]) {
                this.retainEndTime = this.dateTimeAdapter.clone(selecteds[1]);
            }
            this.picker.select(selecteds);
        }
    }
    /**
     * Handle click on cancel button
     */
    onCancelClicked(event) {
        this.hidePicker$.next(null);
        event.preventDefault();
        return;
    }
    /**
     * Handle click on set button
     */
    onSetClicked(event) {
        if (!this.picker.dateTimeChecker(this.pickerMoment)) {
            this.hidePicker$.next(null);
            event.preventDefault();
            return;
        }
        this.confirmSelected$.next(event);
        event.preventDefault();
        return;
    }
    /**
     * Handle click on inform radio group
     */
    handleClickOnInfoGroup(event, index) {
        this.setActiveSelectedIndex(index);
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * Handle click on inform radio group
     */
    handleKeydownOnInfoGroup(event, next, index) {
        switch (event.keyCode) {
            case DOWN_ARROW:
            case RIGHT_ARROW:
            case UP_ARROW:
            case LEFT_ARROW:
                next.focus();
                this.setActiveSelectedIndex(index === 0 ? 1 : 0);
                event.preventDefault();
                event.stopPropagation();
                break;
            case SPACE:
                this.setActiveSelectedIndex(index);
                event.preventDefault();
                event.stopPropagation();
                break;
            default:
                return;
        }
    }
    /**
     * Set the value of activeSelectedIndex
     */
    setActiveSelectedIndex(index) {
        if (this.picker.selectMode === 'range' &&
            this.activeSelectedIndex !== index) {
            this.activeSelectedIndex = index;
            const selected = this.picker.selecteds[this.activeSelectedIndex];
            if (this.picker.selecteds && selected) {
                this.pickerMoment = this.dateTimeAdapter.clone(selected);
            }
        }
        return;
    }
    initPicker() {
        this.pickerMoment = this.picker.startAt || this.dateTimeAdapter.now();
        this.activeSelectedIndex = this.picker.selectMode === 'rangeTo' ? 1 : 0;
    }
    /**
     * Select calendar date in single mode,
     * it returns null when date is not selected.
     */
    dateSelectedInSingleMode(date) {
        if (this.dateTimeAdapter.isSameDay(date, this.picker.selected)) {
            return null;
        }
        return this.updateAndCheckCalendarDate(date);
    }
    /**
     * Select dates in range Mode
     */
    dateSelectedInRangeMode(date) {
        let from = this.picker.selecteds[0];
        let to = this.picker.selecteds[1];
        const result = this.updateAndCheckCalendarDate(date);
        if (!result) {
            return null;
        }
        // if the given calendar day is after or equal to 'from',
        // set ths given date as 'to'
        // otherwise, set it as 'from' and set 'to' to null
        if (this.picker.selectMode === 'range') {
            if (this.picker.selecteds &&
                this.picker.selecteds.length &&
                !to &&
                from &&
                this.dateTimeAdapter.differenceInCalendarDays(result, from) >= 0) {
                if (this.picker.endAt && !this.retainEndTime) {
                    to = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(result), this.dateTimeAdapter.getMonth(result), this.dateTimeAdapter.getDate(result), this.dateTimeAdapter.getHours(this.picker.endAt), this.dateTimeAdapter.getMinutes(this.picker.endAt), this.dateTimeAdapter.getSeconds(this.picker.endAt));
                }
                else if (this.retainEndTime) {
                    to = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(result), this.dateTimeAdapter.getMonth(result), this.dateTimeAdapter.getDate(result), this.dateTimeAdapter.getHours(this.retainEndTime), this.dateTimeAdapter.getMinutes(this.retainEndTime), this.dateTimeAdapter.getSeconds(this.retainEndTime));
                }
                else {
                    to = result;
                }
                this.activeSelectedIndex = 1;
            }
            else {
                if (this.picker.startAt && !this.retainStartTime) {
                    from = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(result), this.dateTimeAdapter.getMonth(result), this.dateTimeAdapter.getDate(result), this.dateTimeAdapter.getHours(this.picker.startAt), this.dateTimeAdapter.getMinutes(this.picker.startAt), this.dateTimeAdapter.getSeconds(this.picker.startAt));
                }
                else if (this.retainStartTime) {
                    from = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(result), this.dateTimeAdapter.getMonth(result), this.dateTimeAdapter.getDate(result), this.dateTimeAdapter.getHours(this.retainStartTime), this.dateTimeAdapter.getMinutes(this.retainStartTime), this.dateTimeAdapter.getSeconds(this.retainStartTime));
                }
                else {
                    from = result;
                }
                to = null;
                this.activeSelectedIndex = 0;
            }
        }
        else if (this.picker.selectMode === 'rangeFrom') {
            from = result;
            // if the from value is after the to value, set the to value as null
            if (to && this.dateTimeAdapter.compare(from, to) > 0) {
                to = null;
            }
        }
        else if (this.picker.selectMode === 'rangeTo') {
            to = result;
            // if the from value is after the to value, set the from value as null
            if (from && this.dateTimeAdapter.compare(from, to) > 0) {
                from = null;
            }
        }
        return [from, to];
    }
    /**
     * Update the given calendar date's time and check if it is valid
     * Because the calendar date has 00:00:00 as default time, if the picker type is 'both',
     * we need to update the given calendar date's time before selecting it.
     * if it is valid, return the updated dateTime
     * if it is not valid, return null
     */
    updateAndCheckCalendarDate(date) {
        let result;
        // if the picker is 'both', update the calendar date's time value
        if (this.picker.pickerType === 'both') {
            result = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(date), this.dateTimeAdapter.getMonth(date), this.dateTimeAdapter.getDate(date), this.dateTimeAdapter.getHours(this.pickerMoment), this.dateTimeAdapter.getMinutes(this.pickerMoment), this.dateTimeAdapter.getSeconds(this.pickerMoment));
            result = this.dateTimeAdapter.clampDate(result, this.picker.minDateTime, this.picker.maxDateTime);
        }
        else {
            result = this.dateTimeAdapter.clone(date);
        }
        // check the updated dateTime
        return this.picker.dateTimeChecker(result) ? result : null;
    }
    /**
     * Focus to the picker
     * */
    focusPicker() {
        if (this.picker.pickerMode === 'inline') {
            return;
        }
        if (this.calendar) {
            this.calendar.focusActiveCell();
        }
        else if (this.timer) {
            this.timer.focus();
        }
    }
}
OwlDateTimeContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeContainerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: OwlDateTimeIntl }, { token: DateTimeAdapter, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDateTimeContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeContainerComponent, selector: "owl-date-time-container", host: { listeners: { "@transformPicker.done": "handleContainerAnimationDone($event)" }, properties: { "class.owl-dt-container": "owlDTContainerClass", "class.owl-dt-popup-container": "owlDTPopupContainerClass", "class.owl-dt-dialog-container": "owlDTDialogContainerClass", "class.owl-dt-inline-container": "owlDTInlineContainerClass", "class.owl-dt-container-disabled": "owlDTContainerDisabledClass", "attr.id": "owlDTContainerId", "@transformPicker": "owlDTContainerAnimation" } }, viewQueries: [{ propertyName: "calendar", first: true, predicate: OwlCalendarComponent, descendants: true }, { propertyName: "timer", first: true, predicate: OwlTimerComponent, descendants: true }], exportAs: ["owlDateTimeContainer"], ngImport: i0, template: "<div [cdkTrapFocus]=\"picker.pickerMode !== 'inline'\"\n     [@fadeInPicker]=\"picker.pickerMode === 'inline'? '' : 'enter'\"\n     class=\"owl-dt-container-inner\">\n\n    <owl-date-time-calendar\n            *ngIf=\"pickerType === 'both' || pickerType === 'calendar'\"\n            class=\"owl-dt-container-row\"\n            [firstDayOfWeek]=\"picker.firstDayOfWeek\"\n            [(pickerMoment)]=\"pickerMoment\"\n            [selected]=\"picker.selected\"\n            [selecteds]=\"picker.selecteds\"\n            [selectMode]=\"picker.selectMode\"\n            [minDate]=\"picker.minDateTime\"\n            [maxDate]=\"picker.maxDateTime\"\n            [dateFilter]=\"picker.dateTimeFilter\"\n            [startView]=\"picker.startView\"\n            [yearOnly]=\"picker.yearOnly\"\n            [multiyearOnly]=\"picker.multiyearOnly\"\n            [hideOtherMonths]=\"picker.hideOtherMonths\"\n            (yearSelected)=\"picker.selectYear($event)\"\n            (monthSelected)=\"picker.selectMonth($event)\"\n            (dateClicked)=\"picker.selectDate($event)\"\n            (selectedChange)=\"dateSelected($event)\"></owl-date-time-calendar>\n\n    <owl-date-time-timer\n            *ngIf=\"pickerType === 'both' || pickerType === 'timer'\"\n            class=\"owl-dt-container-row\"\n            [pickerMoment]=\"pickerMoment\"\n            [minDateTime]=\"picker.minDateTime\"\n            [maxDateTime]=\"picker.maxDateTime\"\n            [showSecondsTimer]=\"picker.showSecondsTimer\"\n            [hour12Timer]=\"picker.hour12Timer\"\n            [stepHour]=\"picker.stepHour\"\n            [stepMinute]=\"picker.stepMinute\"\n            [stepSecond]=\"picker.stepSecond\"\n            (selectedChange)=\"timeSelected($event)\"></owl-date-time-timer>\n\n    <div *ngIf=\"picker.isInRangeMode\"\n         role=\"radiogroup\"\n         class=\"owl-dt-container-info owl-dt-container-row\">\n        <div role=\"radio\" [tabindex]=\"activeSelectedIndex === 0 ? 0 : -1\"\n             [attr.aria-checked]=\"activeSelectedIndex === 0\"\n             class=\"owl-dt-control owl-dt-container-range owl-dt-container-from\"\n             [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 0}\"\n             (click)=\"handleClickOnInfoGroup($event, 0)\"\n             (keydown)=\"handleKeydownOnInfoGroup($event, to, 0)\" #from>\n            <span class=\"owl-dt-control-content owl-dt-container-range-content\" tabindex=\"-1\">\n                <span class=\"owl-dt-container-info-label\">{{fromLabel}}:</span>\n                <span class=\"owl-dt-container-info-value\">{{fromFormattedValue}}</span>\n            </span>\n        </div>\n        <div role=\"radio\" [tabindex]=\"activeSelectedIndex === 1 ? 0 : -1\"\n             [attr.aria-checked]=\"activeSelectedIndex === 1\"\n             class=\"owl-dt-control owl-dt-container-range owl-dt-container-to\"\n             [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 1}\"\n             (click)=\"handleClickOnInfoGroup($event, 1)\"\n             (keydown)=\"handleKeydownOnInfoGroup($event, from, 1)\" #to>\n            <span class=\"owl-dt-control-content owl-dt-container-range-content\" tabindex=\"-1\">\n                <span class=\"owl-dt-container-info-label\">{{toLabel}}:</span>\n                <span class=\"owl-dt-container-info-value\">{{toFormattedValue}}</span>\n            </span>\n        </div>\n    </div>\n\n    <div *ngIf=\"showControlButtons\" class=\"owl-dt-container-buttons owl-dt-container-row\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-container-control-button\"\n                type=\"button\" tabindex=\"0\"\n                (click)=\"onCancelClicked($event)\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{cancelLabel}}\n            </span>\n        </button>\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-container-control-button\"\n                type=\"button\" tabindex=\"0\"\n                (click)=\"onSetClicked($event)\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{setLabel}}\n            </span>\n        </button>\n    </div>\n</div>\n", styles: [""], components: [{ type: OwlCalendarComponent, selector: "owl-date-time-calendar", inputs: ["minDate", "maxDate", "pickerMoment", "selected", "selecteds", "dateFilter", "firstDayOfWeek", "selectMode", "startView", "yearOnly", "multiyearOnly", "hideOtherMonths"], outputs: ["pickerMomentChange", "dateClicked", "selectedChange", "userSelection", "yearSelected", "monthSelected"], exportAs: ["owlDateTimeCalendar"] }, { type: OwlTimerComponent, selector: "owl-date-time-timer", inputs: ["pickerMoment", "minDateTime", "maxDateTime", "showSecondsTimer", "hour12Timer", "stepHour", "stepMinute", "stepSecond"], outputs: ["selectedChange"], exportAs: ["owlDateTimeTimer"] }], directives: [{ type: i1$1.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [
        owlDateTimePickerAnimations.transformPicker,
        owlDateTimePickerAnimations.fadeInPicker
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeContainerComponent, decorators: [{
            type: Component,
            args: [{ exportAs: 'owlDateTimeContainer', selector: 'owl-date-time-container', changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, animations: [
                        owlDateTimePickerAnimations.transformPicker,
                        owlDateTimePickerAnimations.fadeInPicker
                    ], host: {
                        '(@transformPicker.done)': 'handleContainerAnimationDone($event)',
                        '[class.owl-dt-container]': 'owlDTContainerClass',
                        '[class.owl-dt-popup-container]': 'owlDTPopupContainerClass',
                        '[class.owl-dt-dialog-container]': 'owlDTDialogContainerClass',
                        '[class.owl-dt-inline-container]': 'owlDTInlineContainerClass',
                        '[class.owl-dt-container-disabled]': 'owlDTContainerDisabledClass',
                        '[attr.id]': 'owlDTContainerId',
                        '[@transformPicker]': 'owlDTContainerAnimation',
                    }, template: "<div [cdkTrapFocus]=\"picker.pickerMode !== 'inline'\"\n     [@fadeInPicker]=\"picker.pickerMode === 'inline'? '' : 'enter'\"\n     class=\"owl-dt-container-inner\">\n\n    <owl-date-time-calendar\n            *ngIf=\"pickerType === 'both' || pickerType === 'calendar'\"\n            class=\"owl-dt-container-row\"\n            [firstDayOfWeek]=\"picker.firstDayOfWeek\"\n            [(pickerMoment)]=\"pickerMoment\"\n            [selected]=\"picker.selected\"\n            [selecteds]=\"picker.selecteds\"\n            [selectMode]=\"picker.selectMode\"\n            [minDate]=\"picker.minDateTime\"\n            [maxDate]=\"picker.maxDateTime\"\n            [dateFilter]=\"picker.dateTimeFilter\"\n            [startView]=\"picker.startView\"\n            [yearOnly]=\"picker.yearOnly\"\n            [multiyearOnly]=\"picker.multiyearOnly\"\n            [hideOtherMonths]=\"picker.hideOtherMonths\"\n            (yearSelected)=\"picker.selectYear($event)\"\n            (monthSelected)=\"picker.selectMonth($event)\"\n            (dateClicked)=\"picker.selectDate($event)\"\n            (selectedChange)=\"dateSelected($event)\"></owl-date-time-calendar>\n\n    <owl-date-time-timer\n            *ngIf=\"pickerType === 'both' || pickerType === 'timer'\"\n            class=\"owl-dt-container-row\"\n            [pickerMoment]=\"pickerMoment\"\n            [minDateTime]=\"picker.minDateTime\"\n            [maxDateTime]=\"picker.maxDateTime\"\n            [showSecondsTimer]=\"picker.showSecondsTimer\"\n            [hour12Timer]=\"picker.hour12Timer\"\n            [stepHour]=\"picker.stepHour\"\n            [stepMinute]=\"picker.stepMinute\"\n            [stepSecond]=\"picker.stepSecond\"\n            (selectedChange)=\"timeSelected($event)\"></owl-date-time-timer>\n\n    <div *ngIf=\"picker.isInRangeMode\"\n         role=\"radiogroup\"\n         class=\"owl-dt-container-info owl-dt-container-row\">\n        <div role=\"radio\" [tabindex]=\"activeSelectedIndex === 0 ? 0 : -1\"\n             [attr.aria-checked]=\"activeSelectedIndex === 0\"\n             class=\"owl-dt-control owl-dt-container-range owl-dt-container-from\"\n             [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 0}\"\n             (click)=\"handleClickOnInfoGroup($event, 0)\"\n             (keydown)=\"handleKeydownOnInfoGroup($event, to, 0)\" #from>\n            <span class=\"owl-dt-control-content owl-dt-container-range-content\" tabindex=\"-1\">\n                <span class=\"owl-dt-container-info-label\">{{fromLabel}}:</span>\n                <span class=\"owl-dt-container-info-value\">{{fromFormattedValue}}</span>\n            </span>\n        </div>\n        <div role=\"radio\" [tabindex]=\"activeSelectedIndex === 1 ? 0 : -1\"\n             [attr.aria-checked]=\"activeSelectedIndex === 1\"\n             class=\"owl-dt-control owl-dt-container-range owl-dt-container-to\"\n             [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 1}\"\n             (click)=\"handleClickOnInfoGroup($event, 1)\"\n             (keydown)=\"handleKeydownOnInfoGroup($event, from, 1)\" #to>\n            <span class=\"owl-dt-control-content owl-dt-container-range-content\" tabindex=\"-1\">\n                <span class=\"owl-dt-container-info-label\">{{toLabel}}:</span>\n                <span class=\"owl-dt-container-info-value\">{{toFormattedValue}}</span>\n            </span>\n        </div>\n    </div>\n\n    <div *ngIf=\"showControlButtons\" class=\"owl-dt-container-buttons owl-dt-container-row\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-container-control-button\"\n                type=\"button\" tabindex=\"0\"\n                (click)=\"onCancelClicked($event)\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{cancelLabel}}\n            </span>\n        </button>\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-container-control-button\"\n                type=\"button\" tabindex=\"0\"\n                (click)=\"onSetClicked($event)\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{setLabel}}\n            </span>\n        </button>\n    </div>\n</div>\n", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: OwlDateTimeIntl }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }];
    }, propDecorators: { calendar: [{
                type: ViewChild,
                args: [OwlCalendarComponent]
            }], timer: [{
                type: ViewChild,
                args: [OwlTimerComponent]
            }] } });

let uniqueId = 0;
class OwlDialogConfig {
    constructor() {
        /**
         * ID of the element that describes the dialog.
         */
        this.ariaDescribedBy = null;
        /**
         * Whether to focus the dialog when the dialog is opened
         */
        this.autoFocus = true;
        /** Whether the dialog has a backdrop. */
        this.hasBackdrop = true;
        /** Data being injected into the child component. */
        this.data = null;
        /** Whether the user can use escape or clicking outside to close a modal. */
        this.disableClose = false;
        /**
         * The ARIA role of the dialog element.
         */
        this.role = 'dialog';
        /**
         * Custom class for the pane
         * */
        this.paneClass = '';
        /**
         * Mouse Event
         * */
        this.event = null;
        /**
         * Custom class for the backdrop
         * */
        this.backdropClass = '';
        /**
         * Whether the dialog should close when the user goes backwards/forwards in history.
         * */
        this.closeOnNavigation = true;
        /** Width of the dialog. */
        this.width = '';
        /** Height of the dialog. */
        this.height = '';
        /**
         * The max-width of the overlay panel.
         * If a number is provided, pixel units are assumed.
         * */
        this.maxWidth = '85vw';
        /**
         * The scroll strategy when the dialog is open
         * Learn more this from https://material.angular.io/cdk/overlay/overview#scroll-strategies
         * */
        this.scrollStrategy = new NoopScrollStrategy();
        this.id = `owl-dialog-${uniqueId++}`;
    }
}

class OwlDialogRef {
    constructor(overlayRef, container, id, location) {
        this.overlayRef = overlayRef;
        this.container = container;
        this.id = id;
        this._beforeClose$ = new Subject();
        this._afterOpen$ = new Subject();
        this._afterClosed$ = new Subject();
        /** Subscription to changes in the user's location. */
        this.locationChanged = Subscription.EMPTY;
        /** Whether the user is allowed to close the dialog. */
        this.disableClose = this.container.config.disableClose;
        this.container.animationStateChanged
            .pipe(filter((event) => event.phaseName === 'done' && event.toState === 'enter'), take(1))
            .subscribe(() => {
            this._afterOpen$.next();
            this._afterOpen$.complete();
        });
        this.container.animationStateChanged
            .pipe(filter((event) => event.phaseName === 'done' && event.toState === 'exit'), take(1))
            .subscribe(() => {
            this.overlayRef.dispose();
            this.locationChanged.unsubscribe();
            this._afterClosed$.next(this.result);
            this._afterClosed$.complete();
            this.componentInstance = null;
        });
        this.overlayRef.keydownEvents()
            .pipe(filter(event => event.keyCode === ESCAPE && !this.disableClose))
            .subscribe(() => this.close());
        if (location) {
            this.locationChanged = location.subscribe(() => {
                if (this.container.config.closeOnNavigation) {
                    this.close();
                }
            });
        }
    }
    close(dialogResult) {
        this.result = dialogResult;
        this.container.animationStateChanged
            .pipe(filter((event) => event.phaseName === 'start'), take(1))
            .subscribe(() => {
            this._beforeClose$.next(dialogResult);
            this._beforeClose$.complete();
            this.overlayRef.detachBackdrop();
        });
        this.container.startExitAnimation();
    }
    /**
     * Gets an observable that emits when the overlay's backdrop has been clicked.
     */
    backdropClick() {
        return this.overlayRef.backdropClick();
    }
    /**
     * Gets an observable that emits when keydown events are targeted on the overlay.
     */
    keydownEvents() {
        return this.overlayRef.keydownEvents();
    }
    /**
     * Updates the dialog's position.
     * @param position New dialog position.
     */
    updatePosition(position) {
        const strategy = this.getPositionStrategy();
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        this.overlayRef.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width = 'auto', height = 'auto') {
        this.getPositionStrategy().width(width).height(height);
        this.overlayRef.updatePosition();
        return this;
    }
    isAnimating() {
        return this.container.isAnimating;
    }
    afterOpen() {
        return this._afterOpen$.asObservable();
    }
    beforeClose() {
        return this._beforeClose$.asObservable();
    }
    afterClosed() {
        return this._afterClosed$.asObservable();
    }
    /** Fetches the position strategy object from the overlay ref. */
    getPositionStrategy() {
        return this.overlayRef.getConfig().positionStrategy;
    }
}

/**
 * dialog-container.component
 */
const zoomFadeIn = {
    opacity: 0,
    transform: 'translateX({{ x }}) translateY({{ y }}) scale({{scale}})'
};
const zoomFadeInFrom = {
    opacity: 0,
    transform: 'translateX({{ x }}) translateY({{ y }}) scale({{scale}})',
    transformOrigin: '{{ ox }} {{ oy }}'
};
class OwlDialogContainerComponent extends BasePortalOutlet {
    constructor(changeDetector, elementRef, focusTrapFactory, document) {
        super();
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
        this.focusTrapFactory = focusTrapFactory;
        this.document = document;
        this.portalOutlet = null;
        /** ID of the element that should be considered as the dialog's label. */
        this.ariaLabelledBy = null;
        /** Emits when an animation state changes. */
        this.animationStateChanged = new EventEmitter();
        this.isAnimating = false;
        this.state = 'enter';
        // for animation purpose
        this.params = {
            x: '0px',
            y: '0px',
            ox: '50%',
            oy: '50%',
            scale: 0
        };
        // A variable to hold the focused element before the dialog was open.
        // This would help us to refocus back to element when the dialog was closed.
        this.elementFocusedBeforeDialogWasOpened = null;
    }
    get config() {
        return this._config;
    }
    get owlDialogContainerClass() {
        return true;
    }
    get owlDialogContainerTabIndex() {
        return -1;
    }
    get owlDialogContainerId() {
        return this._config.id;
    }
    get owlDialogContainerRole() {
        return this._config.role || null;
    }
    get owlDialogContainerAriaLabelledby() {
        return this.ariaLabelledBy;
    }
    get owlDialogContainerAriaDescribedby() {
        return this._config.ariaDescribedBy || null;
    }
    get owlDialogContainerAnimation() {
        return { value: this.state, params: this.params };
    }
    ngOnInit() { }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     */
    attachComponentPortal(portal) {
        if (this.portalOutlet.hasAttached()) {
            throw Error('Attempting to attach dialog content after content is already attached');
        }
        this.savePreviouslyFocusedElement();
        return this.portalOutlet.attachComponentPortal(portal);
    }
    attachTemplatePortal(portal) {
        throw new Error('Method not implemented.');
    }
    setConfig(config) {
        this._config = config;
        if (config.event) {
            this.calculateZoomOrigin(event);
        }
    }
    onAnimationStart(event) {
        this.isAnimating = true;
        this.animationStateChanged.emit(event);
    }
    onAnimationDone(event) {
        if (event.toState === 'enter') {
            this.trapFocus();
        }
        else if (event.toState === 'exit') {
            this.restoreFocus();
        }
        this.animationStateChanged.emit(event);
        this.isAnimating = false;
    }
    startExitAnimation() {
        this.state = 'exit';
        this.changeDetector.markForCheck();
    }
    /**
     * Calculate origin used in the `zoomFadeInFrom()`
     * for animation purpose
     */
    calculateZoomOrigin(event) {
        if (!event) {
            return;
        }
        const clientX = event.clientX;
        const clientY = event.clientY;
        const wh = window.innerWidth / 2;
        const hh = window.innerHeight / 2;
        const x = clientX - wh;
        const y = clientY - hh;
        const ox = clientX / window.innerWidth;
        const oy = clientY / window.innerHeight;
        this.params.x = `${x}px`;
        this.params.y = `${y}px`;
        this.params.ox = `${ox * 100}%`;
        this.params.oy = `${oy * 100}%`;
        this.params.scale = 0;
        return;
    }
    /**
     * Save the focused element before dialog was open
     */
    savePreviouslyFocusedElement() {
        if (this.document) {
            this.elementFocusedBeforeDialogWasOpened = this.document
                .activeElement;
            Promise.resolve().then(() => this.elementRef.nativeElement.focus());
        }
    }
    trapFocus() {
        if (!this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
        }
        if (this._config.autoFocus) {
            this.focusTrap.focusInitialElementWhenReady();
        }
    }
    restoreFocus() {
        const toFocus = this.elementFocusedBeforeDialogWasOpened;
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
        if (this.focusTrap) {
            this.focusTrap.destroy();
        }
    }
}
OwlDialogContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogContainerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1$1.FocusTrapFactory }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDialogContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDialogContainerComponent, selector: "owl-dialog-container", host: { listeners: { "@slideModal.start": "onAnimationStart($event)", "@slideModal.done": "onAnimationDone($event)" }, properties: { "class.owl-dialog-container": "owlDialogContainerClass", "attr.tabindex": "owlDialogContainerTabIndex", "attr.id": "owlDialogContainerId", "attr.role": "owlDialogContainerRole", "attr.aria-labelledby": "owlDialogContainerAriaLabelledby", "attr.aria-describedby": "owlDialogContainerAriaDescribedby", "@slideModal": "owlDialogContainerAnimation" } }, viewQueries: [{ propertyName: "portalOutlet", first: true, predicate: CdkPortalOutlet, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<ng-template [cdkPortalOutlet]></ng-template>\n", directives: [{ type: i2.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [
        trigger('slideModal', [
            transition('void => enter', [
                style(zoomFadeInFrom),
                animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
                animate('150ms', keyframes([
                    style({ transform: 'scale(1)', offset: 0 }),
                    style({ transform: 'scale(1.05)', offset: 0.3 }),
                    style({ transform: 'scale(.95)', offset: 0.8 }),
                    style({ transform: 'scale(1)', offset: 1.0 })
                ])),
                animateChild()
            ], {
                params: {
                    x: '0px',
                    y: '0px',
                    ox: '50%',
                    oy: '50%',
                    scale: 1
                }
            }),
            transition('enter => exit', [animateChild(), animate(200, style(zoomFadeIn))], { params: { x: '0px', y: '0px', ox: '50%', oy: '50%' } })
        ])
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-dialog-container', animations: [
                        trigger('slideModal', [
                            transition('void => enter', [
                                style(zoomFadeInFrom),
                                animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
                                animate('150ms', keyframes([
                                    style({ transform: 'scale(1)', offset: 0 }),
                                    style({ transform: 'scale(1.05)', offset: 0.3 }),
                                    style({ transform: 'scale(.95)', offset: 0.8 }),
                                    style({ transform: 'scale(1)', offset: 1.0 })
                                ])),
                                animateChild()
                            ], {
                                params: {
                                    x: '0px',
                                    y: '0px',
                                    ox: '50%',
                                    oy: '50%',
                                    scale: 1
                                }
                            }),
                            transition('enter => exit', [animateChild(), animate(200, style(zoomFadeIn))], { params: { x: '0px', y: '0px', ox: '50%', oy: '50%' } })
                        ])
                    ], host: {
                        '(@slideModal.start)': 'onAnimationStart($event)',
                        '(@slideModal.done)': 'onAnimationDone($event)',
                        '[class.owl-dialog-container]': 'owlDialogContainerClass',
                        '[attr.tabindex]': 'owlDialogContainerTabIndex',
                        '[attr.id]': 'owlDialogContainerId',
                        '[attr.role]': 'owlDialogContainerRole',
                        '[attr.aria-labelledby]': 'owlDialogContainerAriaLabelledby',
                        '[attr.aria-describedby]': 'owlDialogContainerAriaDescribedby',
                        '[@slideModal]': 'owlDialogContainerAnimation'
                    }, template: "<ng-template [cdkPortalOutlet]></ng-template>\n" }]
        }], ctorParameters: function () {
        return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1$1.FocusTrapFactory }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [DOCUMENT]
                    }] }];
    }, propDecorators: { portalOutlet: [{
                type: ViewChild,
                args: [CdkPortalOutlet, { static: true }]
            }] } });

/**
 * object.utils
 */
/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param dest The object which will have properties copied to it.
 * @param sources The source objects from which properties will be copied.
 */
function extendObject(dest, ...sources) {
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (const source of sources) {
        if (source != null) {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}

/**
 * index
 */

/**
 * dialog.service
 */
const OWL_DIALOG_DATA = new InjectionToken('OwlDialogData');
/**
 * Injection token that determines the scroll handling while the dialog is open.
 * */
const OWL_DIALOG_SCROLL_STRATEGY = new InjectionToken('owl-dialog-scroll-strategy');
function OWL_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    const fn = () => overlay.scrollStrategies.block();
    return fn;
}
/** @docs-private */
const OWL_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: OWL_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: OWL_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY
};
/**
 * Injection token that can be used to specify default dialog options.
 * */
const OWL_DIALOG_DEFAULT_OPTIONS = new InjectionToken('owl-dialog-default-options');
class OwlDialogService {
    constructor(overlay, injector, location, scrollStrategy, defaultOptions, parentDialog, overlayContainer) {
        this.overlay = overlay;
        this.injector = injector;
        this.location = location;
        this.defaultOptions = defaultOptions;
        this.parentDialog = parentDialog;
        this.overlayContainer = overlayContainer;
        this.ariaHiddenElements = new Map();
        this._openDialogsAtThisLevel = [];
        this._afterOpenAtThisLevel = new Subject();
        this._afterAllClosedAtThisLevel = new Subject();
        /**
         * Stream that emits when all open dialog have finished closing.
         * Will emit on subscribe if there are no open dialogs to begin with.
         */
        this.afterAllClosed = defer(() => this._openDialogsAtThisLevel.length
            ? this._afterAllClosed
            : this._afterAllClosed.pipe(startWith(undefined)));
        this.scrollStrategy = scrollStrategy;
        if (!parentDialog && location) {
            location.subscribe(() => this.closeAll());
        }
    }
    /** Keeps track of the currently-open dialogs. */
    get openDialogs() {
        return this.parentDialog
            ? this.parentDialog.openDialogs
            : this._openDialogsAtThisLevel;
    }
    /** Stream that emits when a dialog has been opened. */
    get afterOpen() {
        return this.parentDialog
            ? this.parentDialog.afterOpen
            : this._afterOpenAtThisLevel;
    }
    get _afterAllClosed() {
        const parent = this.parentDialog;
        return parent
            ? parent._afterAllClosed
            : this._afterAllClosedAtThisLevel;
    }
    open(componentOrTemplateRef, config) {
        config = applyConfigDefaults(config, this.defaultOptions);
        if (config.id && this.getDialogById(config.id)) {
            throw Error(`Dialog with id "${config.id}" exists already. The dialog id must be unique.`);
        }
        const overlayRef = this.createOverlay(config);
        const dialogContainer = this.attachDialogContainer(overlayRef, config);
        const dialogRef = this.attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config);
        if (!this.openDialogs.length) {
            this.hideNonDialogContentFromAssistiveTechnology();
        }
        this.openDialogs.push(dialogRef);
        dialogRef
            .afterClosed()
            .subscribe(() => this.removeOpenDialog(dialogRef));
        this.afterOpen.next(dialogRef);
        return dialogRef;
    }
    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll() {
        let i = this.openDialogs.length;
        while (i--) {
            this.openDialogs[i].close();
        }
    }
    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    getDialogById(id) {
        return this.openDialogs.find(dialog => dialog.id === id);
    }
    attachDialogContent(componentOrTemplateRef, dialogContainer, overlayRef, config) {
        const dialogRef = new OwlDialogRef(overlayRef, dialogContainer, config.id, this.location);
        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(() => {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }
        if (componentOrTemplateRef instanceof TemplateRef) {
        }
        else {
            const injector = this.createInjector(config, dialogRef, dialogContainer);
            const contentRef = dialogContainer.attachComponentPortal(new ComponentPortal(componentOrTemplateRef, undefined, injector));
            dialogRef.componentInstance = contentRef.instance;
        }
        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);
        return dialogRef;
    }
    createInjector(config, dialogRef, dialogContainer) {
        const userInjector = config &&
            config.viewContainerRef &&
            config.viewContainerRef.injector;
        const injectionTokens = new WeakMap();
        injectionTokens.set(OwlDialogRef, dialogRef);
        injectionTokens.set(OwlDialogContainerComponent, dialogContainer);
        injectionTokens.set(OWL_DIALOG_DATA, config.data);
        return new PortalInjector(userInjector || this.injector, injectionTokens);
    }
    createOverlay(config) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }
    attachDialogContainer(overlayRef, config) {
        const containerPortal = new ComponentPortal(OwlDialogContainerComponent, config.viewContainerRef);
        const containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.setConfig(config);
        return containerRef.instance;
    }
    getOverlayConfig(dialogConfig) {
        const state = new OverlayConfig({
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: dialogConfig.scrollStrategy || this.scrollStrategy(),
            panelClass: dialogConfig.paneClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            minWidth: dialogConfig.minWidth,
            minHeight: dialogConfig.minHeight,
            maxWidth: dialogConfig.maxWidth,
            maxHeight: dialogConfig.maxHeight
        });
        if (dialogConfig.backdropClass) {
            state.backdropClass = dialogConfig.backdropClass;
        }
        return state;
    }
    removeOpenDialog(dialogRef) {
        const index = this._openDialogsAtThisLevel.indexOf(dialogRef);
        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this.ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    }
                    else {
                        element.removeAttribute('aria-hidden');
                    }
                });
                this.ariaHiddenElements.clear();
                this._afterAllClosed.next();
            }
        }
    }
    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    hideNonDialogContentFromAssistiveTechnology() {
        const overlayContainer = this.overlayContainer.getContainerElement();
        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            const siblings = overlayContainer.parentElement.children;
            for (let i = siblings.length - 1; i > -1; i--) {
                const sibling = siblings[i];
                if (sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')) {
                    this.ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }
}
OwlDialogService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogService, deps: [{ token: i1$2.Overlay }, { token: i0.Injector }, { token: i1.Location, optional: true }, { token: OWL_DIALOG_SCROLL_STRATEGY }, { token: OWL_DIALOG_DEFAULT_OPTIONS, optional: true }, { token: OwlDialogService, optional: true, skipSelf: true }, { token: i1$2.OverlayContainer }], target: i0.ɵɵFactoryTarget.Injectable });
OwlDialogService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i1$2.Overlay }, { type: i0.Injector }, { type: i1.Location, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [OWL_DIALOG_SCROLL_STRATEGY]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DIALOG_DEFAULT_OPTIONS]
                    }] }, { type: OwlDialogService, decorators: [{
                        type: Optional
                    }, {
                        type: SkipSelf
                    }] }, { type: i1$2.OverlayContainer }];
    } });
/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default config setting
 * @returns The new configuration object.
 */
function applyConfigDefaults(config, defaultOptions) {
    return extendObject(new OwlDialogConfig(), config, defaultOptions);
}

/**
 * date-time-picker.component
 */
/** Injection token that determines the scroll handling while the dtPicker is open. */
const OWL_DTPICKER_SCROLL_STRATEGY = new InjectionToken('owl-dtpicker-scroll-strategy');
/** @docs-private */
function OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    const fn = () => overlay.scrollStrategies.block();
    return fn;
}
/** @docs-private */
const OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: OWL_DTPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY
};
class OwlDateTimeComponent extends OwlDateTime {
    constructor(overlay, viewContainerRef, dialogService, ngZone, changeDetector, dateTimeAdapter, defaultScrollStrategy, dateTimeFormats, document) {
        super(dateTimeAdapter, dateTimeFormats);
        this.overlay = overlay;
        this.viewContainerRef = viewContainerRef;
        this.dialogService = dialogService;
        this.ngZone = ngZone;
        this.changeDetector = changeDetector;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        this.document = document;
        /** Custom class for the picker backdrop. */
        this.backdropClass = [];
        /** Custom class for the picker overlay pane. */
        this.panelClass = [];
        /**
         * Set the type of the dateTime picker
         *      'both' -- show both calendar and timer
         *      'calendar' -- show only calendar
         *      'timer' -- show only timer
         */
        this._pickerType = 'both';
        /**
         * Whether the picker open as a dialog
         */
        this._pickerMode = 'popup';
        /** Whether the calendar is open. */
        this._opened = false;
        /**
         * Callback when the picker is closed
         * */
        this.afterPickerClosed = new EventEmitter();
        /**
         * Callback when the picker is open
         * */
        this.afterPickerOpen = new EventEmitter();
        /**
         * Emits selected year in multi-year view
         * This doesn't imply a change on the selected date.
         * */
        this.yearSelected = new EventEmitter();
        /**
         * Emits selected month in year view
         * This doesn't imply a change on the selected date.
         * */
        this.monthSelected = new EventEmitter();
        /**
         * Emits selected date
         * */
        this.dateSelected = new EventEmitter();
        /**
         * Emit when the selected value has been confirmed
         * */
        this.confirmSelectedChange = new EventEmitter();
        /**
         * Emits when the date time picker is disabled.
         * */
        this.disabledChange = new EventEmitter();
        this.dtInputSub = Subscription.EMPTY;
        this.hidePickerStreamSub = Subscription.EMPTY;
        this.confirmSelectedStreamSub = Subscription.EMPTY;
        this.pickerOpenedStreamSub = Subscription.EMPTY;
        /** The element that was focused before the date time picker was opened. */
        this.focusedElementBeforeOpen = null;
        this._selecteds = [];
        this.defaultScrollStrategy = defaultScrollStrategy;
    }
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        if (this._startAt) {
            return this._startAt;
        }
        if (this._dtInput) {
            if (this._dtInput.selectMode === 'single') {
                return this._dtInput.value || null;
            }
            else if (this._dtInput.selectMode === 'range' ||
                this._dtInput.selectMode === 'rangeFrom') {
                return this._dtInput.values[0] || null;
            }
            else if (this._dtInput.selectMode === 'rangeTo') {
                return this._dtInput.values[1] || null;
            }
        }
        else {
            return null;
        }
    }
    set startAt(date) {
        this._startAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
    }
    get endAt() {
        if (this._endAt) {
            return this._endAt;
        }
        if (this._dtInput) {
            if (this._dtInput.selectMode === 'single') {
                return this._dtInput.value || null;
            }
            else if (this._dtInput.selectMode === 'range' ||
                this._dtInput.selectMode === 'rangeFrom') {
                return this._dtInput.values[1] || null;
            }
        }
        else {
            return null;
        }
    }
    set endAt(date) {
        this._endAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
    }
    get pickerType() {
        return this._pickerType;
    }
    set pickerType(val) {
        if (val !== this._pickerType) {
            this._pickerType = val;
            if (this._dtInput) {
                this._dtInput.formatNativeInputValue();
            }
        }
    }
    get pickerMode() {
        return this._pickerMode;
    }
    set pickerMode(mode) {
        if (mode === 'popup') {
            this._pickerMode = mode;
        }
        else {
            this._pickerMode = 'dialog';
        }
    }
    get disabled() {
        return this._disabled === undefined && this._dtInput
            ? this._dtInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        value = coerceBooleanProperty(value);
        if (value !== this._disabled) {
            this._disabled = value;
            this.disabledChange.next(value);
        }
    }
    get opened() {
        return this._opened;
    }
    set opened(val) {
        val ? this.open() : this.close();
    }
    get dtInput() {
        return this._dtInput;
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this.changeDetector.markForCheck();
    }
    get selecteds() {
        return this._selecteds;
    }
    set selecteds(values) {
        this._selecteds = values;
        this.changeDetector.markForCheck();
    }
    /** The minimum selectable date. */
    get minDateTime() {
        return this._dtInput && this._dtInput.min;
    }
    /** The maximum selectable date. */
    get maxDateTime() {
        return this._dtInput && this._dtInput.max;
    }
    get dateTimeFilter() {
        return this._dtInput && this._dtInput.dateTimeFilter;
    }
    get selectMode() {
        return this._dtInput.selectMode;
    }
    get isInSingleMode() {
        return this._dtInput.isInSingleMode;
    }
    get isInRangeMode() {
        return this._dtInput.isInRangeMode;
    }
    ngOnInit() { }
    ngOnDestroy() {
        this.close();
        this.dtInputSub.unsubscribe();
        this.disabledChange.complete();
        if (this.popupRef) {
            this.popupRef.dispose();
        }
    }
    registerInput(input) {
        if (this._dtInput) {
            throw Error('A Owl DateTimePicker can only be associated with a single input.');
        }
        this._dtInput = input;
        this.dtInputSub = this._dtInput.valueChange.subscribe((value) => {
            if (Array.isArray(value)) {
                this.selecteds = value;
            }
            else {
                this.selected = value;
            }
        });
    }
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this._dtInput) {
            throw Error('Attempted to open an DateTimePicker with no associated input.');
        }
        if (this.document) {
            this.focusedElementBeforeOpen = this.document.activeElement;
        }
        // reset the picker selected value
        if (this.isInSingleMode) {
            this.selected = this._dtInput.value;
        }
        else if (this.isInRangeMode) {
            this.selecteds = this._dtInput.values;
        }
        // when the picker is open , we make sure the picker's current selected time value
        // is the same as the _startAt time value.
        if (this.selected && this.pickerType !== 'calendar' && this._startAt) {
            this.selected = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.selected), this.dateTimeAdapter.getMonth(this.selected), this.dateTimeAdapter.getDate(this.selected), this.dateTimeAdapter.getHours(this._startAt), this.dateTimeAdapter.getMinutes(this._startAt), this.dateTimeAdapter.getSeconds(this._startAt));
        }
        this.pickerMode === 'dialog' ? this.openAsDialog() : this.openAsPopup();
        this.pickerContainer.picker = this;
        // Listen to picker container's hidePickerStream
        this.hidePickerStreamSub = this.pickerContainer.hidePickerStream.subscribe(() => {
            this.close();
        });
        // Listen to picker container's confirmSelectedStream
        this.confirmSelectedStreamSub = this.pickerContainer.confirmSelectedStream.subscribe((event) => {
            this.confirmSelect(event);
        });
    }
    /**
     * Selects the given date
     */
    select(date) {
        if (Array.isArray(date)) {
            this.selecteds = [...date];
        }
        else {
            this.selected = date;
        }
        /**
         * Cases in which automatically confirm the select when date or dates are selected:
         * 1) picker mode is NOT 'dialog'
         * 2) picker type is 'calendar' and selectMode is 'single'.
         * 3) picker type is 'calendar' and selectMode is 'range' and
         *    the 'selecteds' has 'from'(selecteds[0]) and 'to'(selecteds[1]) values.
         * 4) selectMode is 'rangeFrom' and selecteds[0] has value.
         * 5) selectMode is 'rangeTo' and selecteds[1] has value.
         * */
        if (this.pickerMode !== 'dialog' &&
            this.pickerType === 'calendar' &&
            ((this.selectMode === 'single' && this.selected) ||
                (this.selectMode === 'rangeFrom' && this.selecteds[0]) ||
                (this.selectMode === 'rangeTo' && this.selecteds[1]) ||
                (this.selectMode === 'range' &&
                    this.selecteds[0] &&
                    this.selecteds[1]))) {
            this.confirmSelect();
        }
    }
    /**
     * Emits the selected year in multi-year view
     * */
    selectYear(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    /**
     * Emits selected month in year view
     * */
    selectMonth(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /**
     * Emits the selected date
     * */
    selectDate(normalizedDate) {
        this.dateSelected.emit(normalizedDate);
    }
    /**
     * Hide the picker
     */
    close() {
        if (!this._opened) {
            return;
        }
        if (this.popupRef && this.popupRef.hasAttached()) {
            this.popupRef.detach();
        }
        if (this.pickerContainerPortal &&
            this.pickerContainerPortal.isAttached) {
            this.pickerContainerPortal.detach();
        }
        if (this.hidePickerStreamSub) {
            this.hidePickerStreamSub.unsubscribe();
            this.hidePickerStreamSub = null;
        }
        if (this.confirmSelectedStreamSub) {
            this.confirmSelectedStreamSub.unsubscribe();
            this.confirmSelectedStreamSub = null;
        }
        if (this.pickerOpenedStreamSub) {
            this.pickerOpenedStreamSub.unsubscribe();
            this.pickerOpenedStreamSub = null;
        }
        if (this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
        }
        const completeClose = () => {
            if (this._opened) {
                this._opened = false;
                const selected = this.selected || this.selecteds;
                this.afterPickerClosed.emit(selected);
                this.focusedElementBeforeOpen = null;
            }
        };
        if (this.focusedElementBeforeOpen &&
            typeof this.focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            this.focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /**
     * Confirm the selected value
     */
    confirmSelect(event) {
        if (this.isInSingleMode) {
            const selected = this.selected || this.startAt || this.dateTimeAdapter.now();
            this.confirmSelectedChange.emit(selected);
        }
        else if (this.isInRangeMode) {
            this.confirmSelectedChange.emit(this.selecteds);
        }
        this.close();
        return;
    }
    /**
     * Open the picker as a dialog
     */
    openAsDialog() {
        this.dialogRef = this.dialogService.open(OwlDateTimeContainerComponent, {
            autoFocus: false,
            backdropClass: [
                'cdk-overlay-dark-backdrop',
                ...coerceArray(this.backdropClass)
            ],
            paneClass: ['owl-dt-dialog', ...coerceArray(this.panelClass)],
            viewContainerRef: this.viewContainerRef,
            scrollStrategy: this.scrollStrategy || this.defaultScrollStrategy()
        });
        this.pickerContainer = this.dialogRef.componentInstance;
        this.dialogRef.afterOpen().subscribe(() => {
            this.afterPickerOpen.emit(null);
            this._opened = true;
        });
        this.dialogRef.afterClosed().subscribe(() => this.close());
    }
    /**
     * Open the picker as popup
     */
    openAsPopup() {
        if (!this.pickerContainerPortal) {
            this.pickerContainerPortal = new ComponentPortal(OwlDateTimeContainerComponent, this.viewContainerRef);
        }
        if (!this.popupRef) {
            this.createPopup();
        }
        if (!this.popupRef.hasAttached()) {
            const componentRef = this.popupRef.attach(this.pickerContainerPortal);
            this.pickerContainer = componentRef.instance;
            // Update the position once the calendar has rendered.
            this.ngZone.onStable
                .asObservable()
                .pipe(take(1))
                .subscribe(() => {
                this.popupRef.updatePosition();
            });
            // emit open stream
            this.pickerOpenedStreamSub = this.pickerContainer.pickerOpenedStream
                .pipe(take(1))
                .subscribe(() => {
                this.afterPickerOpen.emit(null);
                this._opened = true;
            });
        }
    }
    createPopup() {
        const overlayConfig = new OverlayConfig({
            positionStrategy: this.createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: [
                'cdk-overlay-transparent-backdrop',
                ...coerceArray(this.backdropClass)
            ],
            scrollStrategy: this.scrollStrategy || this.defaultScrollStrategy(),
            panelClass: ['owl-dt-popup', ...coerceArray(this.panelClass)]
        });
        this.popupRef = this.overlay.create(overlayConfig);
        merge(this.popupRef.backdropClick(), this.popupRef.detachments(), this.popupRef
            .keydownEvents()
            .pipe(filter(event => event.keyCode === ESCAPE ||
            (this._dtInput &&
                event.altKey &&
                event.keyCode === UP_ARROW)))).subscribe(() => this.close());
    }
    /**
     * Create the popup PositionStrategy.
     * */
    createPopupPositionStrategy() {
        return this.overlay
            .position()
            .flexibleConnectedTo(this._dtInput.elementRef)
            .withTransformOriginOn('.owl-dt-container')
            .withFlexibleDimensions(false)
            .withPush(false)
            .withPositions([
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top'
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom'
            },
            {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top'
            },
            {
                originX: 'end',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'bottom'
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
                offsetY: -176
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
                offsetY: -352
            }
        ]);
    }
}
OwlDateTimeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeComponent, deps: [{ token: i1$2.Overlay }, { token: i0.ViewContainerRef }, { token: OwlDialogService }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: DateTimeAdapter, optional: true }, { token: OWL_DTPICKER_SCROLL_STRATEGY }, { token: OWL_DATE_TIME_FORMATS, optional: true }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDateTimeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeComponent, selector: "owl-date-time", inputs: { backdropClass: "backdropClass", panelClass: "panelClass", startAt: "startAt", endAt: "endAt", pickerType: "pickerType", pickerMode: "pickerMode", disabled: "disabled", opened: "opened", scrollStrategy: "scrollStrategy" }, outputs: { afterPickerClosed: "afterPickerClosed", afterPickerOpen: "afterPickerOpen", yearSelected: "yearSelected", monthSelected: "monthSelected", dateSelected: "dateSelected" }, exportAs: ["owlDateTime"], usesInheritance: true, ngImport: i0, template: "", styles: [""], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time', exportAs: 'owlDateTime', changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, template: "", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i1$2.Overlay }, { type: i0.ViewContainerRef }, { type: OwlDialogService }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [OWL_DTPICKER_SCROLL_STRATEGY]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [DOCUMENT]
                    }] }];
    }, propDecorators: { backdropClass: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], startAt: [{
                type: Input
            }], endAt: [{
                type: Input
            }], pickerType: [{
                type: Input
            }], pickerMode: [{
                type: Input
            }], disabled: [{
                type: Input
            }], opened: [{
                type: Input
            }], scrollStrategy: [{
                type: Input
            }], afterPickerClosed: [{
                type: Output
            }], afterPickerOpen: [{
                type: Output
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], dateSelected: [{
                type: Output
            }] } });

/**
 * date-time-picker-input.directive
 */
const OWL_DATETIME_VALUE_ACCESSOR$1 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwlDateTimeInputDirective),
    multi: true
};
const OWL_DATETIME_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => OwlDateTimeInputDirective),
    multi: true
};
class OwlDateTimeInputDirective {
    constructor(elmRef, renderer, dateTimeAdapter, dateTimeFormats) {
        this.elmRef = elmRef;
        this.renderer = renderer;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        /**
         * The picker's select mode
         */
        this._selectMode = 'single';
        /**
         * The character to separate the 'from' and 'to' in input value
         */
        this.rangeSeparator = '-';
        this._values = [];
        /**
         * Callback to invoke when `change` event is fired on this `<input>`
         * */
        this.dateTimeChange = new EventEmitter();
        /**
         * Callback to invoke when an `input` event is fired on this `<input>`.
         * */
        this.dateTimeInput = new EventEmitter();
        this.dtPickerSub = Subscription.EMPTY;
        this.localeSub = Subscription.EMPTY;
        this.lastValueValid = true;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.validatorOnChange = () => { };
        /** The form control validator for whether the input parses. */
        this.parseValidator = () => {
            return this.lastValueValid
                ? null
                : { owlDateTimeParse: { text: this.elmRef.nativeElement.value } };
        };
        /** The form control validator for the min date. */
        this.minValidator = (control) => {
            if (this.isInSingleMode) {
                const controlValue = this.getValidDate(this.dateTimeAdapter.deserialize(control.value));
                return !this.min ||
                    !controlValue ||
                    this.dateTimeAdapter.compare(this.min, controlValue) <= 0
                    ? null
                    : { owlDateTimeMin: { min: this.min, actual: controlValue } };
            }
            else if (this.isInRangeMode && control.value) {
                const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
                const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));
                return !this.min ||
                    !controlValueFrom ||
                    !controlValueTo ||
                    this.dateTimeAdapter.compare(this.min, controlValueFrom) <= 0
                    ? null
                    : {
                        owlDateTimeMin: {
                            min: this.min,
                            actual: [controlValueFrom, controlValueTo]
                        }
                    };
            }
        };
        /** The form control validator for the max date. */
        this.maxValidator = (control) => {
            if (this.isInSingleMode) {
                const controlValue = this.getValidDate(this.dateTimeAdapter.deserialize(control.value));
                return !this.max ||
                    !controlValue ||
                    this.dateTimeAdapter.compare(this.max, controlValue) >= 0
                    ? null
                    : { owlDateTimeMax: { max: this.max, actual: controlValue } };
            }
            else if (this.isInRangeMode && control.value) {
                const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
                const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));
                return !this.max ||
                    !controlValueFrom ||
                    !controlValueTo ||
                    this.dateTimeAdapter.compare(this.max, controlValueTo) >= 0
                    ? null
                    : {
                        owlDateTimeMax: {
                            max: this.max,
                            actual: [controlValueFrom, controlValueTo]
                        }
                    };
            }
        };
        /** The form control validator for the date filter. */
        this.filterValidator = (control) => {
            const controlValue = this.getValidDate(this.dateTimeAdapter.deserialize(control.value));
            return !this._dateTimeFilter ||
                !controlValue ||
                this._dateTimeFilter(controlValue)
                ? null
                : { owlDateTimeFilter: true };
        };
        /**
         * The form control validator for the range.
         * Check whether the 'before' value is before the 'to' value
         * */
        this.rangeValidator = (control) => {
            if (this.isInSingleMode || !control.value) {
                return null;
            }
            const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
            const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));
            return !controlValueFrom ||
                !controlValueTo ||
                this.dateTimeAdapter.compare(controlValueFrom, controlValueTo) <= 0
                ? null
                : { owlDateTimeRange: true };
        };
        /**
         * The form control validator for the range when required.
         * Check whether the 'before' and 'to' values are present
         * */
        this.requiredRangeValidator = (control) => {
            if (this.isInSingleMode || !control.value || !this.required) {
                return null;
            }
            const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
            const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));
            return !controlValueFrom ||
                !controlValueTo
                ? { owlRequiredDateTimeRange: [controlValueFrom, controlValueTo] }
                : null;
        };
        /** The combined form control validator for this input. */
        this.validator = Validators.compose([
            this.parseValidator,
            this.minValidator,
            this.maxValidator,
            this.filterValidator,
            this.rangeValidator,
            this.requiredRangeValidator
        ]);
        /** Emits when the value changes (either due to user input or programmatic change). */
        this.valueChange = new EventEmitter();
        /** Emits when the disabled state has changed */
        this.disabledChange = new EventEmitter();
        if (!this.dateTimeAdapter) {
            throw Error(`OwlDateTimePicker: No provider found for DateTimePicker. You must import one of the following ` +
                `modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a ` +
                `custom implementation.`);
        }
        if (!this.dateTimeFormats) {
            throw Error(`OwlDateTimePicker: No provider found for OWL_DATE_TIME_FORMATS. You must import one of the following ` +
                `modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a ` +
                `custom implementation.`);
        }
        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(() => {
            this.value = this.value;
        });
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = value === '' || value;
        this.validatorOnChange();
    }
    /**
     * The date time picker that this input is associated with.
     * */
    set owlDateTime(value) {
        this.registerDateTimePicker(value);
    }
    /**
     * A function to filter date time
     */
    set owlDateTimeFilter(filter) {
        this._dateTimeFilter = filter;
        this.validatorOnChange();
    }
    get dateTimeFilter() {
        return this._dateTimeFilter;
    }
    get disabled() {
        return !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        const element = this.elmRef.nativeElement;
        if (this._disabled !== newValue) {
            this._disabled = newValue;
            this.disabledChange.emit(newValue);
        }
        // We need to null check the `blur` method, because it's undefined during SSR.
        if (newValue && element.blur) {
            // Normally, native input elements automatically blur if they turn disabled. This behavior
            // is problematic, because it would mean that it triggers another change detection cycle,
            // which then causes a changed after checked error if the input element was focused before.
            element.blur();
        }
    }
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.validatorOnChange();
    }
    get max() {
        return this._max;
    }
    set max(value) {
        this._max = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.validatorOnChange();
    }
    get selectMode() {
        return this._selectMode;
    }
    set selectMode(mode) {
        if (mode !== 'single' &&
            mode !== 'range' &&
            mode !== 'rangeFrom' &&
            mode !== 'rangeTo') {
            throw Error('OwlDateTime Error: invalid selectMode value!');
        }
        this._selectMode = mode;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        value = this.dateTimeAdapter.deserialize(value);
        this.lastValueValid = !value || this.dateTimeAdapter.isValid(value);
        value = this.getValidDate(value);
        const oldDate = this._value;
        this._value = value;
        // set the input property 'value'
        this.formatNativeInputValue();
        // check if the input value changed
        if (!this.dateTimeAdapter.isEqual(oldDate, value)) {
            this.valueChange.emit(value);
        }
    }
    get values() {
        return this._values;
    }
    set values(values) {
        if (values && values.length > 0) {
            this._values = values.map(v => {
                v = this.dateTimeAdapter.deserialize(v);
                return this.getValidDate(v);
            });
            this.lastValueValid =
                (!this._values[0] ||
                    this.dateTimeAdapter.isValid(this._values[0])) &&
                    (!this._values[1] ||
                        this.dateTimeAdapter.isValid(this._values[1]));
        }
        else {
            this._values = [];
            this.lastValueValid = true;
        }
        // set the input property 'value'
        this.formatNativeInputValue();
        this.valueChange.emit(this._values);
    }
    get elementRef() {
        return this.elmRef;
    }
    get isInSingleMode() {
        return this._selectMode === 'single';
    }
    get isInRangeMode() {
        return (this._selectMode === 'range' ||
            this._selectMode === 'rangeFrom' ||
            this._selectMode === 'rangeTo');
    }
    get owlDateTimeInputAriaHaspopup() {
        return true;
    }
    get owlDateTimeInputAriaOwns() {
        return (this.dtPicker.opened && this.dtPicker.id) || null;
    }
    get minIso8601() {
        return this.min ? this.dateTimeAdapter.toIso8601(this.min) : null;
    }
    get maxIso8601() {
        return this.max ? this.dateTimeAdapter.toIso8601(this.max) : null;
    }
    get owlDateTimeInputDisabled() {
        return this.disabled;
    }
    ngOnInit() {
        if (!this.dtPicker) {
            throw Error(`OwlDateTimePicker: the picker input doesn't have any associated owl-date-time component`);
        }
    }
    ngAfterContentInit() {
        this.dtPickerSub = this.dtPicker.confirmSelectedChange.subscribe((selecteds) => {
            if (Array.isArray(selecteds)) {
                this.values = selecteds;
            }
            else {
                this.value = selecteds;
            }
            this.onModelChange(selecteds);
            this.onModelTouched();
            this.dateTimeChange.emit({
                source: this,
                value: selecteds,
                input: this.elmRef.nativeElement
            });
            this.dateTimeInput.emit({
                source: this,
                value: selecteds,
                input: this.elmRef.nativeElement
            });
        });
    }
    ngOnDestroy() {
        this.dtPickerSub.unsubscribe();
        this.localeSub.unsubscribe();
        this.valueChange.complete();
        this.disabledChange.complete();
    }
    writeValue(value) {
        if (this.isInSingleMode) {
            this.value = value;
        }
        else {
            this.values = value;
        }
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    validate(c) {
        return this.validator ? this.validator(c) : null;
    }
    registerOnValidatorChange(fn) {
        this.validatorOnChange = fn;
    }
    /**
     * Open the picker when user hold alt + DOWN_ARROW
     * */
    handleKeydownOnHost(event) {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this.dtPicker.open();
            event.preventDefault();
        }
    }
    handleBlurOnHost(event) {
        this.onModelTouched();
    }
    handleInputOnHost(event) {
        const value = event.target.value;
        if (this._selectMode === 'single') {
            this.changeInputInSingleMode(value);
        }
        else if (this._selectMode === 'range') {
            this.changeInputInRangeMode(value);
        }
        else {
            this.changeInputInRangeFromToMode(value);
        }
    }
    handleChangeOnHost(event) {
        let v;
        if (this.isInSingleMode) {
            v = this.value;
        }
        else if (this.isInRangeMode) {
            v = this.values;
        }
        this.dateTimeChange.emit({
            source: this,
            value: v,
            input: this.elmRef.nativeElement
        });
    }
    /**
     * Set the native input property 'value'
     */
    formatNativeInputValue() {
        if (this.isInSingleMode) {
            this.renderer.setProperty(this.elmRef.nativeElement, 'value', this._value
                ? this.dateTimeAdapter.format(this._value, this.dtPicker.formatString)
                : '');
        }
        else if (this.isInRangeMode) {
            if (this._values && this.values.length > 0) {
                const from = this._values[0];
                const to = this._values[1];
                const fromFormatted = from
                    ? this.dateTimeAdapter.format(from, this.dtPicker.formatString)
                    : '';
                const toFormatted = to
                    ? this.dateTimeAdapter.format(to, this.dtPicker.formatString)
                    : '';
                if (!fromFormatted && !toFormatted) {
                    this.renderer.setProperty(this.elmRef.nativeElement, 'value', null);
                }
                else {
                    if (this._selectMode === 'range') {
                        this.renderer.setProperty(this.elmRef.nativeElement, 'value', fromFormatted +
                            ' ' +
                            this.rangeSeparator +
                            ' ' +
                            toFormatted);
                    }
                    else if (this._selectMode === 'rangeFrom') {
                        this.renderer.setProperty(this.elmRef.nativeElement, 'value', fromFormatted);
                    }
                    else if (this._selectMode === 'rangeTo') {
                        this.renderer.setProperty(this.elmRef.nativeElement, 'value', toFormatted);
                    }
                }
            }
            else {
                this.renderer.setProperty(this.elmRef.nativeElement, 'value', '');
            }
        }
        return;
    }
    /**
     * Register the relationship between this input and its picker component
     */
    registerDateTimePicker(picker) {
        if (picker) {
            this.dtPicker = picker;
            this.dtPicker.registerInput(this);
        }
    }
    /**
     * Convert a given obj to a valid date object
     */
    getValidDate(obj) {
        return this.dateTimeAdapter.isDateInstance(obj) &&
            this.dateTimeAdapter.isValid(obj)
            ? obj
            : null;
    }
    /**
     * Convert a time string to a date-time string
     * When pickerType is 'timer', the value in the picker's input is a time string.
     * The dateTimeAdapter parse fn could not parse a time string to a Date Object.
     * Therefore we need this fn to convert a time string to a date-time string.
     */
    convertTimeStringToDateTimeString(timeString, dateTime) {
        if (timeString) {
            const v = dateTime || this.dateTimeAdapter.now();
            const dateString = this.dateTimeAdapter.format(v, this.dateTimeFormats.datePickerInput);
            return dateString + ' ' + timeString;
        }
        else {
            return null;
        }
    }
    /**
     * Handle input change in single mode
     */
    changeInputInSingleMode(inputValue) {
        let value = inputValue;
        if (this.dtPicker.pickerType === 'timer') {
            value = this.convertTimeStringToDateTimeString(value, this.value);
        }
        let result = this.dateTimeAdapter.parse(value, this.dateTimeFormats.parseInput);
        this.lastValueValid = !result || this.dateTimeAdapter.isValid(result);
        result = this.getValidDate(result);
        // if the newValue is the same as the oldValue, we intend to not fire the valueChange event
        // result equals to null means there is input event, but the input value is invalid
        if (!this.isSameValue(result, this._value) || result === null) {
            this._value = result;
            this.valueChange.emit(result);
            this.onModelChange(result);
            this.dateTimeInput.emit({
                source: this,
                value: result,
                input: this.elmRef.nativeElement
            });
        }
    }
    /**
     * Handle input change in rangeFrom or rangeTo mode
     */
    changeInputInRangeFromToMode(inputValue) {
        const originalValue = this._selectMode === 'rangeFrom'
            ? this._values[0]
            : this._values[1];
        if (this.dtPicker.pickerType === 'timer') {
            inputValue = this.convertTimeStringToDateTimeString(inputValue, originalValue);
        }
        let result = this.dateTimeAdapter.parse(inputValue, this.dateTimeFormats.parseInput);
        this.lastValueValid = !result || this.dateTimeAdapter.isValid(result);
        result = this.getValidDate(result);
        // if the newValue is the same as the oldValue, we intend to not fire the valueChange event
        if ((this._selectMode === 'rangeFrom' &&
            this.isSameValue(result, this._values[0]) &&
            result) ||
            (this._selectMode === 'rangeTo' &&
                this.isSameValue(result, this._values[1]) &&
                result)) {
            return;
        }
        this._values =
            this._selectMode === 'rangeFrom'
                ? [result, this._values[1]]
                : [this._values[0], result];
        this.valueChange.emit(this._values);
        this.onModelChange(this._values);
        this.dateTimeInput.emit({
            source: this,
            value: this._values,
            input: this.elmRef.nativeElement
        });
    }
    /**
     * Handle input change in range mode
     */
    changeInputInRangeMode(inputValue) {
        const selecteds = inputValue.split(this.rangeSeparator);
        let fromString = selecteds[0];
        let toString = selecteds[1];
        if (this.dtPicker.pickerType === 'timer') {
            fromString = this.convertTimeStringToDateTimeString(fromString, this.values[0]);
            toString = this.convertTimeStringToDateTimeString(toString, this.values[1]);
        }
        let from = this.dateTimeAdapter.parse(fromString, this.dateTimeFormats.parseInput);
        let to = this.dateTimeAdapter.parse(toString, this.dateTimeFormats.parseInput);
        this.lastValueValid =
            (!from || this.dateTimeAdapter.isValid(from)) &&
                (!to || this.dateTimeAdapter.isValid(to));
        from = this.getValidDate(from);
        to = this.getValidDate(to);
        // if the newValue is the same as the oldValue, we intend to not fire the valueChange event
        if (!this.isSameValue(from, this._values[0]) ||
            !this.isSameValue(to, this._values[1]) ||
            (from === null && to === null)) {
            this._values = [from, to];
            this.valueChange.emit(this._values);
            this.onModelChange(this._values);
            this.dateTimeInput.emit({
                source: this,
                value: this._values,
                input: this.elmRef.nativeElement
            });
        }
    }
    /**
     * Check if the two value is the same
     */
    isSameValue(first, second) {
        if (first && second) {
            return this.dateTimeAdapter.compare(first, second) === 0;
        }
        return first === second;
    }
}
OwlDateTimeInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInputDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
OwlDateTimeInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeInputDirective, selector: "input[owlDateTime]", inputs: { required: "required", owlDateTime: "owlDateTime", owlDateTimeFilter: "owlDateTimeFilter", _disabled: "_disabled", min: "min", max: "max", selectMode: "selectMode", rangeSeparator: "rangeSeparator", value: "value", values: "values" }, outputs: { dateTimeChange: "dateTimeChange", dateTimeInput: "dateTimeInput" }, host: { listeners: { "keydown": "handleKeydownOnHost($event)", "blur": "handleBlurOnHost($event)", "input": "handleInputOnHost($event)", "change": "handleChangeOnHost($event)" }, properties: { "attr.aria-haspopup": "owlDateTimeInputAriaHaspopup", "attr.aria-owns": "owlDateTimeInputAriaOwns", "attr.min": "minIso8601", "attr.max": "maxIso8601", "disabled": "owlDateTimeInputDisabled" } }, providers: [
        OWL_DATETIME_VALUE_ACCESSOR$1,
        OWL_DATETIME_VALIDATORS,
    ], exportAs: ["owlDateTimeInput"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[owlDateTime]',
                    exportAs: 'owlDateTimeInput',
                    host: {
                        '(keydown)': 'handleKeydownOnHost($event)',
                        '(blur)': 'handleBlurOnHost($event)',
                        '(input)': 'handleInputOnHost($event)',
                        '(change)': 'handleChangeOnHost($event)',
                        '[attr.aria-haspopup]': 'owlDateTimeInputAriaHaspopup',
                        '[attr.aria-owns]': 'owlDateTimeInputAriaOwns',
                        '[attr.min]': 'minIso8601',
                        '[attr.max]': 'maxIso8601',
                        '[disabled]': 'owlDateTimeInputDisabled'
                    },
                    providers: [
                        OWL_DATETIME_VALUE_ACCESSOR$1,
                        OWL_DATETIME_VALIDATORS,
                    ],
                }]
        }], ctorParameters: function () {
        return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }];
    }, propDecorators: { required: [{
                type: Input
            }], owlDateTime: [{
                type: Input
            }], owlDateTimeFilter: [{
                type: Input
            }], _disabled: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], selectMode: [{
                type: Input
            }], rangeSeparator: [{
                type: Input
            }], value: [{
                type: Input
            }], values: [{
                type: Input
            }], dateTimeChange: [{
                type: Output
            }], dateTimeInput: [{
                type: Output
            }] } });

/**
 * numberFixedLen.pipe
 */
class NumberFixedLenPipe {
    transform(num, len) {
        const number = Math.floor(num);
        const length = Math.floor(len);
        if (num === null || isNaN(number) || isNaN(length)) {
            return num;
        }
        let numString = number.toString();
        while (numString.length < length) {
            numString = '0' + numString;
        }
        return numString;
    }
}
NumberFixedLenPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NumberFixedLenPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
NumberFixedLenPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NumberFixedLenPipe, name: "numberFixedLen" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NumberFixedLenPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'numberFixedLen'
                }]
        }] });

/**
 * date-time-inline.component
 */
const OWL_DATETIME_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwlDateTimeInlineComponent),
    multi: true
};
class OwlDateTimeInlineComponent extends OwlDateTime {
    constructor(changeDetector, dateTimeAdapter, dateTimeFormats) {
        super(dateTimeAdapter, dateTimeFormats);
        this.changeDetector = changeDetector;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        /**
         * Set the type of the dateTime picker
         *      'both' -- show both calendar and timer
         *      'calendar' -- show only calendar
         *      'timer' -- show only timer
         */
        this._pickerType = 'both';
        this._disabled = false;
        this._selectMode = 'single';
        this._values = [];
        /**
         * Emits selected year in multi-year view
         * This doesn't imply a change on the selected date.
         * */
        this.yearSelected = new EventEmitter();
        /**
         * Emits selected month in year view
         * This doesn't imply a change on the selected date.
         * */
        this.monthSelected = new EventEmitter();
        /**
         * Emits selected date
         * */
        this.dateSelected = new EventEmitter();
        this._selecteds = [];
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    get pickerType() {
        return this._pickerType;
    }
    set pickerType(val) {
        if (val !== this._pickerType) {
            this._pickerType = val;
        }
    }
    get disabled() {
        return !!this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    get selectMode() {
        return this._selectMode;
    }
    set selectMode(mode) {
        if (mode !== 'single' &&
            mode !== 'range' &&
            mode !== 'rangeFrom' &&
            mode !== 'rangeTo') {
            throw Error('OwlDateTime Error: invalid selectMode value!');
        }
        this._selectMode = mode;
    }
    get startAt() {
        if (this._startAt) {
            return this._startAt;
        }
        if (this.selectMode === 'single') {
            return this.value || null;
        }
        else if (this.selectMode === 'range' ||
            this.selectMode === 'rangeFrom') {
            return this.values[0] || null;
        }
        else if (this.selectMode === 'rangeTo') {
            return this.values[1] || null;
        }
        else {
            return null;
        }
    }
    set startAt(date) {
        this._startAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
    }
    get endAt() {
        if (this._endAt) {
            return this._endAt;
        }
        if (this.selectMode === 'single') {
            return this.value || null;
        }
        else if (this.selectMode === 'range' ||
            this.selectMode === 'rangeFrom') {
            return this.values[1] || null;
        }
        else {
            return null;
        }
    }
    set endAt(date) {
        this._endAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
    }
    get dateTimeFilter() {
        return this._dateTimeFilter;
    }
    set dateTimeFilter(filter) {
        this._dateTimeFilter = filter;
    }
    get minDateTime() {
        return this._min || null;
    }
    set minDateTime(value) {
        this._min = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.changeDetector.markForCheck();
    }
    get maxDateTime() {
        return this._max || null;
    }
    set maxDateTime(value) {
        this._max = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.changeDetector.markForCheck();
    }
    get value() {
        return this._value;
    }
    set value(value) {
        value = this.dateTimeAdapter.deserialize(value);
        value = this.getValidDate(value);
        this._value = value;
        this.selected = value;
    }
    get values() {
        return this._values;
    }
    set values(values) {
        if (values && values.length > 0) {
            values = values.map(v => {
                v = this.dateTimeAdapter.deserialize(v);
                v = this.getValidDate(v);
                return v ? this.dateTimeAdapter.clone(v) : null;
            });
            this._values = [...values];
            this.selecteds = [...values];
        }
        else {
            this._values = [];
            this.selecteds = [];
        }
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
        this.changeDetector.markForCheck();
    }
    get selecteds() {
        return this._selecteds;
    }
    set selecteds(values) {
        this._selecteds = values;
        this.changeDetector.markForCheck();
    }
    get opened() {
        return true;
    }
    get pickerMode() {
        return 'inline';
    }
    get isInSingleMode() {
        return this._selectMode === 'single';
    }
    get isInRangeMode() {
        return (this._selectMode === 'range' ||
            this._selectMode === 'rangeFrom' ||
            this._selectMode === 'rangeTo');
    }
    get owlDTInlineClass() {
        return true;
    }
    ngOnInit() {
        this.container.picker = this;
    }
    writeValue(value) {
        if (this.isInSingleMode) {
            this.value = value;
            this.container.pickerMoment = value;
        }
        else {
            this.values = value;
            this.container.pickerMoment = this._values[this.container.activeSelectedIndex];
        }
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    select(date) {
        if (this.disabled) {
            return;
        }
        if (Array.isArray(date)) {
            this.values = [...date];
        }
        else {
            this.value = date;
        }
        this.onModelChange(date);
        this.onModelTouched();
    }
    /**
     * Emits the selected year in multi-year view
     * */
    selectYear(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    /**
     * Emits selected month in year view
     * */
    selectMonth(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /**
     * Emits the selected date
     * */
    selectDate(normalizedDate) {
        this.dateSelected.emit(normalizedDate);
    }
}
OwlDateTimeInlineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInlineComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDateTimeInlineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeInlineComponent, selector: "owl-date-time-inline", inputs: { pickerType: "pickerType", disabled: "disabled", selectMode: "selectMode", startAt: "startAt", endAt: "endAt", dateTimeFilter: ["owlDateTimeFilter", "dateTimeFilter"], minDateTime: ["min", "minDateTime"], maxDateTime: ["max", "maxDateTime"], value: "value", values: "values" }, outputs: { yearSelected: "yearSelected", monthSelected: "monthSelected", dateSelected: "dateSelected" }, host: { properties: { "class.owl-dt-inline": "owlDTInlineClass" } }, providers: [OWL_DATETIME_VALUE_ACCESSOR], viewQueries: [{ propertyName: "container", first: true, predicate: OwlDateTimeContainerComponent, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<owl-date-time-container></owl-date-time-container>", styles: [""], components: [{ type: OwlDateTimeContainerComponent, selector: "owl-date-time-container", exportAs: ["owlDateTimeContainer"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-inline', host: {
                        '[class.owl-dt-inline]': 'owlDTInlineClass'
                    }, changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, providers: [OWL_DATETIME_VALUE_ACCESSOR], template: "<owl-date-time-container></owl-date-time-container>", styles: [""] }]
        }], ctorParameters: function () {
        return [{ type: i0.ChangeDetectorRef }, { type: DateTimeAdapter, decorators: [{
                        type: Optional
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_FORMATS]
                    }] }];
    }, propDecorators: { container: [{
                type: ViewChild,
                args: [OwlDateTimeContainerComponent, { static: true }]
            }], pickerType: [{
                type: Input
            }], disabled: [{
                type: Input
            }], selectMode: [{
                type: Input
            }], startAt: [{
                type: Input
            }], endAt: [{
                type: Input
            }], dateTimeFilter: [{
                type: Input,
                args: ['owlDateTimeFilter']
            }], minDateTime: [{
                type: Input,
                args: ['min']
            }], maxDateTime: [{
                type: Input,
                args: ['max']
            }], value: [{
                type: Input
            }], values: [{
                type: Input
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], dateSelected: [{
                type: Output
            }] } });

/**
 * dialog.module
 */
class OwlDialogModule {
}
OwlDialogModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OwlDialogModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, declarations: [OwlDialogContainerComponent], imports: [CommonModule, A11yModule, OverlayModule, PortalModule] });
OwlDialogModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, providers: [
        OWL_DIALOG_SCROLL_STRATEGY_PROVIDER,
        OwlDialogService,
    ], imports: [[CommonModule, A11yModule, OverlayModule, PortalModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, A11yModule, OverlayModule, PortalModule],
                    exports: [],
                    declarations: [
                        OwlDialogContainerComponent,
                    ],
                    providers: [
                        OWL_DIALOG_SCROLL_STRATEGY_PROVIDER,
                        OwlDialogService,
                    ],
                    entryComponents: [
                        OwlDialogContainerComponent,
                    ]
                }]
        }] });

/**
 * date-time.module
 */
class OwlDateTimeModule {
}
OwlDateTimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OwlDateTimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeModule, declarations: [OwlDateTimeTriggerDirective,
        OwlDateTimeInputDirective,
        OwlDateTimeComponent,
        OwlDateTimeContainerComponent,
        OwlMultiYearViewComponent,
        OwlYearViewComponent,
        OwlMonthViewComponent,
        OwlTimerComponent,
        OwlTimerBoxComponent,
        OwlCalendarComponent,
        OwlCalendarBodyComponent,
        NumberFixedLenPipe,
        OwlDateTimeInlineComponent], imports: [CommonModule, OverlayModule, OwlDialogModule, A11yModule], exports: [OwlCalendarComponent,
        OwlTimerComponent,
        OwlDateTimeTriggerDirective,
        OwlDateTimeInputDirective,
        OwlDateTimeComponent,
        OwlDateTimeInlineComponent,
        OwlMultiYearViewComponent,
        OwlYearViewComponent,
        OwlMonthViewComponent] });
OwlDateTimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeModule, providers: [
        OwlDateTimeIntl,
        OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER,
        ...optionsProviders,
    ], imports: [[CommonModule, OverlayModule, OwlDialogModule, A11yModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, OwlDialogModule, A11yModule],
                    exports: [
                        OwlCalendarComponent,
                        OwlTimerComponent,
                        OwlDateTimeTriggerDirective,
                        OwlDateTimeInputDirective,
                        OwlDateTimeComponent,
                        OwlDateTimeInlineComponent,
                        OwlMultiYearViewComponent,
                        OwlYearViewComponent,
                        OwlMonthViewComponent,
                    ],
                    declarations: [
                        OwlDateTimeTriggerDirective,
                        OwlDateTimeInputDirective,
                        OwlDateTimeComponent,
                        OwlDateTimeContainerComponent,
                        OwlMultiYearViewComponent,
                        OwlYearViewComponent,
                        OwlMonthViewComponent,
                        OwlTimerComponent,
                        OwlTimerBoxComponent,
                        OwlCalendarComponent,
                        OwlCalendarBodyComponent,
                        NumberFixedLenPipe,
                        OwlDateTimeInlineComponent,
                    ],
                    providers: [
                        OwlDateTimeIntl,
                        OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER,
                        ...optionsProviders,
                    ],
                    entryComponents: [
                        OwlDateTimeContainerComponent,
                    ]
                }]
        }] });

/**
 * array.utils
 */
/** Creates an array and fills it with values. */
function range(length, valueFunction) {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

/**
 * date.utils
 */
/**
 * Creates a date with the given year, month, date, hour, minute and second. Does not allow over/under-flow of the
 * month and date.
 */
function createDate(year, month, date, hours = 0, minutes = 0, seconds = 0) {
    if (month < 0 || month > 11) {
        throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }
    if (date < 1) {
        throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }
    if (hours < 0 || hours > 23) {
        throw Error(`Invalid hours "${hours}". Hours has to be between 0 and 23.`);
    }
    if (minutes < 0 || minutes > 59) {
        throw Error(`Invalid minutes "${minutes}". Minutes has to between 0 and 59.`);
    }
    if (seconds < 0 || seconds > 59) {
        throw Error(`Invalid seconds "${seconds}". Seconds has to be between 0 and 59.`);
    }
    const result = createDateWithOverflow(year, month, date, hours, minutes, seconds);
    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    // For example, createDate(2017, 1, 31) would try to create a date 2017/02/31 which is invalid
    if (result.getMonth() !== month) {
        throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
}
/**
 * Gets the number of days in the month of the given date.
 */
function getNumDaysInMonth(date) {
    const lastDateOfMonth = createDateWithOverflow(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDateOfMonth.getDate();
}
/**
 * Creates a date but allows the month and date to overflow.
 */
function createDateWithOverflow(year, month, date, hours = 0, minutes = 0, seconds = 0) {
    const result = new Date(year, month, date, hours, minutes, seconds);
    if (year >= 0 && year < 100) {
        result.setFullYear(result.getFullYear() - 1900);
    }
    return result;
}

/**
 * constants
 */
/** Whether the browser supports the Intl API. */
const SUPPORTS_INTL_API = typeof Intl !== 'undefined';
/** The default month names to use if Intl API is not available. */
const DEFAULT_MONTH_NAMES = {
    long: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    short: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};
/** The default day of the week names to use if Intl API is not available. */
const DEFAULT_DAY_OF_WEEK_NAMES = {
    long: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};
/** The default date names to use if Intl API is not available. */
const DEFAULT_DATE_NAMES = range(31, i => String(i + 1));

/**
 * native-date-time-adapter.class
 */
/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings an with out of bounds month, date, etc.
 */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:[+\-]\d{2}:\d{2}))?)?$/;
class NativeDateTimeAdapter extends DateTimeAdapter {
    constructor(owlDateTimeLocale, platform) {
        super();
        this.owlDateTimeLocale = owlDateTimeLocale;
        super.setLocale(owlDateTimeLocale);
        // IE does its own time zone correction, so we disable this on IE.
        this.useUtcForDisplay = !platform.TRIDENT;
        this._clampDate = platform.TRIDENT || platform.EDGE;
    }
    getYear(date) {
        return date.getFullYear();
    }
    getMonth(date) {
        return date.getMonth();
    }
    getDay(date) {
        return date.getDay();
    }
    getDate(date) {
        return date.getDate();
    }
    getHours(date) {
        return date.getHours();
    }
    getMinutes(date) {
        return date.getMinutes();
    }
    getSeconds(date) {
        return date.getSeconds();
    }
    getTime(date) {
        return date.getTime();
    }
    getNumDaysInMonth(date) {
        return getNumDaysInMonth(date);
    }
    differenceInCalendarDays(dateLeft, dateRight) {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.createDate(this.getYear(dateLeft), this.getMonth(dateLeft), this.getDate(dateLeft));
            const dateRightStartOfDay = this.createDate(this.getYear(dateRight), this.getMonth(dateRight), this.getDate(dateRight));
            const timeStampLeft = this.getTime(dateLeftStartOfDay) -
                dateLeftStartOfDay.getTimezoneOffset() *
                    this.milliseondsInMinute;
            const timeStampRight = this.getTime(dateRightStartOfDay) -
                dateRightStartOfDay.getTimezoneOffset() *
                    this.milliseondsInMinute;
            return Math.round((timeStampLeft - timeStampRight) / this.millisecondsInDay);
        }
        else {
            return null;
        }
    }
    getYearName(date) {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                year: 'numeric',
                timeZone: 'utc'
            });
            return this.stripDirectionalityCharacters(this._format(dtf, date));
        }
        return String(this.getYear(date));
    }
    getMonthNames(style) {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                month: style,
                timeZone: 'utc'
            });
            return range(12, i => this.stripDirectionalityCharacters(this._format(dtf, new Date(2017, i, 1))));
        }
        return DEFAULT_MONTH_NAMES[style];
    }
    getDayOfWeekNames(style) {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                weekday: style,
                timeZone: 'utc'
            });
            return range(7, i => this.stripDirectionalityCharacters(this._format(dtf, new Date(2017, 0, i + 1))));
        }
        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }
    getDateNames() {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                day: 'numeric',
                timeZone: 'utc'
            });
            return range(31, i => this.stripDirectionalityCharacters(this._format(dtf, new Date(2017, 0, i + 1))));
        }
        return DEFAULT_DATE_NAMES;
    }
    toIso8601(date) {
        return date.toISOString();
    }
    isEqual(dateLeft, dateRight) {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            return dateLeft.getTime() === dateRight.getTime();
        }
        else {
            return false;
        }
    }
    isSameDay(dateLeft, dateRight) {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.clone(dateLeft);
            const dateRightStartOfDay = this.clone(dateRight);
            dateLeftStartOfDay.setHours(0, 0, 0, 0);
            dateRightStartOfDay.setHours(0, 0, 0, 0);
            return (dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime());
        }
        else {
            return false;
        }
    }
    isValid(date) {
        return date && !isNaN(date.getTime());
    }
    invalid() {
        return new Date(NaN);
    }
    isDateInstance(obj) {
        return obj instanceof Date;
    }
    addCalendarYears(date, amount) {
        return this.addCalendarMonths(date, amount * 12);
    }
    addCalendarMonths(date, amount) {
        const result = this.clone(date);
        amount = Number(amount);
        const desiredMonth = result.getMonth() + amount;
        const dateWithDesiredMonth = new Date(0);
        dateWithDesiredMonth.setFullYear(result.getFullYear(), desiredMonth, 1);
        dateWithDesiredMonth.setHours(0, 0, 0, 0);
        const daysInMonth = this.getNumDaysInMonth(dateWithDesiredMonth);
        // Set the last day of the new month
        // if the original date was the last day of the longer month
        result.setMonth(desiredMonth, Math.min(daysInMonth, result.getDate()));
        return result;
    }
    addCalendarDays(date, amount) {
        const result = this.clone(date);
        amount = Number(amount);
        result.setDate(result.getDate() + amount);
        return result;
    }
    setHours(date, amount) {
        const result = this.clone(date);
        result.setHours(amount);
        return result;
    }
    setMinutes(date, amount) {
        const result = this.clone(date);
        result.setMinutes(amount);
        return result;
    }
    setSeconds(date, amount) {
        const result = this.clone(date);
        result.setSeconds(amount);
        return result;
    }
    createDate(year, month, date, hours = 0, minutes = 0, seconds = 0) {
        return createDate(year, month, date, hours, minutes, seconds);
    }
    clone(date) {
        return this.createDate(this.getYear(date), this.getMonth(date), this.getDate(date), this.getHours(date), this.getMinutes(date), this.getSeconds(date));
    }
    now() {
        return new Date();
    }
    format(date, displayFormat) {
        if (!this.isValid(date)) {
            throw Error('JSNativeDate: Cannot format invalid date.');
        }
        if (SUPPORTS_INTL_API) {
            if (this._clampDate &&
                (date.getFullYear() < 1 || date.getFullYear() > 9999)) {
                date = this.clone(date);
                date.setFullYear(Math.max(1, Math.min(9999, date.getFullYear())));
            }
            displayFormat = Object.assign(Object.assign({}, displayFormat), { timeZone: 'utc' });
            const dtf = new Intl.DateTimeFormat(this.getLocale(), displayFormat);
            return this.stripDirectionalityCharacters(this._format(dtf, date));
        }
        return this.stripDirectionalityCharacters(date.toDateString());
    }
    parse(value, parseFormat) {
        // There is no way using the native JS Date to set the parse format or locale
        if (typeof value === 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    }
    /**
     * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
     * invalid date for all other values.
     */
    deserialize(value) {
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
            // string is the right format first.
            if (ISO_8601_REGEX.test(value)) {
                const date = new Date(value);
                if (this.isValid(date)) {
                    return date;
                }
            }
        }
        return super.deserialize(value);
    }
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     */
    stripDirectionalityCharacters(str) {
        return str.replace(/[\u200e\u200f]/g, '');
    }
    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     */
    _format(dtf, date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        return dtf.format(d);
    }
}
NativeDateTimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeAdapter, deps: [{ token: OWL_DATE_TIME_LOCALE, optional: true }, { token: i1$3.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
NativeDateTimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_LOCALE]
                    }] }, { type: i1$3.Platform }];
    } });

const OWL_NATIVE_DATE_TIME_FORMATS = {
    parseInput: null,
    fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
    timePickerInput: { hour: 'numeric', minute: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

/**
 * native-date-time.module
 */
class NativeDateTimeModule {
}
NativeDateTimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NativeDateTimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeModule, imports: [PlatformModule] });
NativeDateTimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeModule, providers: [
        { provide: DateTimeAdapter, useClass: NativeDateTimeAdapter },
    ], imports: [[PlatformModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: NativeDateTimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [PlatformModule],
                    providers: [
                        { provide: DateTimeAdapter, useClass: NativeDateTimeAdapter },
                    ],
                }]
        }] });
class OwlNativeDateTimeModule {
}
OwlNativeDateTimeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlNativeDateTimeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OwlNativeDateTimeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlNativeDateTimeModule, imports: [NativeDateTimeModule] });
OwlNativeDateTimeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlNativeDateTimeModule, providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: OWL_NATIVE_DATE_TIME_FORMATS }], imports: [[NativeDateTimeModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlNativeDateTimeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [NativeDateTimeModule],
                    providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: OWL_NATIVE_DATE_TIME_FORMATS }],
                }]
        }] });

/**
 * unix-timestamp-date-time-adapter.class
 */
class UnixTimestampDateTimeAdapter extends DateTimeAdapter {
    constructor(owlDateTimeLocale, platform) {
        super();
        this.owlDateTimeLocale = owlDateTimeLocale;
        super.setLocale(owlDateTimeLocale);
        // IE does its own time zone correction, so we disable this on IE.
        this.useUtcForDisplay = !platform.TRIDENT;
        this._clampDate = platform.TRIDENT || platform.EDGE;
    }
    static stripDirectionalityCharacters(str) {
        return str.replace(UnixTimestampDateTimeAdapter.search_ltr_rtl_pattern, '');
    }
    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     */
    static _format(dtf, date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        return dtf.format(d);
    }
    addCalendarDays(date, amount) {
        const result = new Date(date);
        amount = Number(amount);
        result.setDate(result.getDate() + amount);
        return result.getTime();
    }
    addCalendarMonths(date, amount) {
        const result = new Date(date);
        amount = Number(amount);
        const desiredMonth = result.getMonth() + amount;
        const dateWithDesiredMonth = new Date(0);
        dateWithDesiredMonth.setFullYear(result.getFullYear(), desiredMonth, 1);
        dateWithDesiredMonth.setHours(0, 0, 0, 0);
        const daysInMonth = this.getNumDaysInMonth(dateWithDesiredMonth.getTime());
        // Set the last day of the new month
        // if the original date was the last day of the longer month
        result.setMonth(desiredMonth, Math.min(daysInMonth, result.getDate()));
        return result.getTime();
    }
    addCalendarYears(date, amount) {
        return this.addCalendarMonths(date, amount * 12);
    }
    clone(date) {
        return date;
    }
    createDate(year, month, date, hours = 0, minutes = 0, seconds = 0) {
        return createDate(year, month, date, hours, minutes, seconds).getTime();
    }
    differenceInCalendarDays(dateLeft, dateRight) {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.createDate(this.getYear(dateLeft), this.getMonth(dateLeft), this.getDate(dateLeft));
            const dateRightStartOfDay = this.createDate(this.getYear(dateRight), this.getMonth(dateRight), this.getDate(dateRight));
            const timeStampLeft = this.getTime(dateLeftStartOfDay) -
                new Date(dateLeftStartOfDay).getTimezoneOffset() *
                    this.milliseondsInMinute;
            const timeStampRight = this.getTime(dateRightStartOfDay) -
                new Date(dateRightStartOfDay).getTimezoneOffset() *
                    this.milliseondsInMinute;
            return Math.round((timeStampLeft - timeStampRight) / this.millisecondsInDay);
        }
        else {
            return null;
        }
    }
    format(date, displayFormat) {
        if (!this.isValid(date)) {
            throw Error('JSNativeDate: Cannot format invalid date.');
        }
        const jsDate = new Date(date);
        if (SUPPORTS_INTL_API) {
            if (this._clampDate &&
                (jsDate.getFullYear() < 1 || jsDate.getFullYear() > 9999)) {
                jsDate.setFullYear(Math.max(1, Math.min(9999, jsDate.getFullYear())));
            }
            displayFormat = Object.assign(Object.assign({}, displayFormat), { timeZone: 'utc' });
            const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, jsDate));
        }
        return UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(jsDate.toDateString());
    }
    getDate(date) {
        return new Date(date).getDate();
    }
    getDateNames() {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                day: 'numeric',
                timeZone: 'utc'
            });
            return range(31, i => UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, new Date(2017, 0, i + 1))));
        }
        return DEFAULT_DATE_NAMES;
    }
    getDay(date) {
        return new Date(date).getDay();
    }
    getDayOfWeekNames(style) {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                weekday: style,
                timeZone: 'utc'
            });
            return range(7, i => UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, new Date(2017, 0, i + 1))));
        }
        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }
    getHours(date) {
        return new Date(date).getHours();
    }
    getMinutes(date) {
        return new Date(date).getMinutes();
    }
    getMonth(date) {
        return new Date(date).getMonth();
    }
    getMonthNames(style) {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                month: style,
                timeZone: 'utc'
            });
            return range(12, i => UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, new Date(2017, i, 1))));
        }
        return DEFAULT_MONTH_NAMES[style];
    }
    getNumDaysInMonth(date) {
        return getNumDaysInMonth(new Date(date));
    }
    getSeconds(date) {
        return new Date(date).getSeconds();
    }
    getTime(date) {
        return date;
    }
    getYear(date) {
        return new Date(date).getFullYear();
    }
    getYearName(date) {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                year: 'numeric',
                timeZone: 'utc'
            });
            return UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, new Date(date)));
        }
        return String(this.getYear(date));
    }
    invalid() {
        return NaN;
    }
    isDateInstance(obj) {
        return typeof obj === 'number';
    }
    isEqual(dateLeft, dateRight) {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            return dateLeft === dateRight;
        }
        else {
            return false;
        }
    }
    isSameDay(dateLeft, dateRight) {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = new Date(dateLeft);
            const dateRightStartOfDay = new Date(dateRight);
            dateLeftStartOfDay.setHours(0, 0, 0, 0);
            dateRightStartOfDay.setHours(0, 0, 0, 0);
            return (dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime());
        }
        else {
            return false;
        }
    }
    isValid(date) {
        return (date || date === 0) && !isNaN(date);
    }
    now() {
        return new Date().getTime();
    }
    parse(value, parseFormat) {
        // There is no way using the native JS Date to set the parse format or locale
        if (typeof value === 'number') {
            return value;
        }
        return value ? new Date(Date.parse(value)).getTime() : null;
    }
    setHours(date, amount) {
        const result = new Date(date);
        result.setHours(amount);
        return result.getTime();
    }
    setMinutes(date, amount) {
        const result = new Date(date);
        result.setMinutes(amount);
        return result.getTime();
    }
    setSeconds(date, amount) {
        const result = new Date(date);
        result.setSeconds(amount);
        return result.getTime();
    }
    toIso8601(date) {
        return new Date(date).toISOString();
    }
}
/**
 * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
 * other browsers do not. We remove them to make output consistent and because they interfere with
 * date parsing.
 */
UnixTimestampDateTimeAdapter.search_ltr_rtl_pattern = '/[\u200e\u200f]/g';
UnixTimestampDateTimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: UnixTimestampDateTimeAdapter, deps: [{ token: OWL_DATE_TIME_LOCALE, optional: true }, { token: i1$3.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
UnixTimestampDateTimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: UnixTimestampDateTimeAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: UnixTimestampDateTimeAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [OWL_DATE_TIME_LOCALE]
                    }] }, { type: i1$3.Platform }];
    } });

const OWL_UNIX_TIMESTAMP_DATE_TIME_FORMATS = {
    parseInput: null,
    fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
    datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
    timePickerInput: { hour: 'numeric', minute: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

/**
 * picker
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CalendarCell, DateTimeAdapter, DateView, DefaultOptions, NativeDateTimeAdapter, OWL_DATETIME_VALIDATORS, OWL_DATETIME_VALUE_ACCESSOR$1 as OWL_DATETIME_VALUE_ACCESSOR, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_LOCALE_PROVIDER, OWL_UNIX_TIMESTAMP_DATE_TIME_FORMATS, OptionsTokens, OwlCalendarBodyComponent, OwlCalendarComponent, OwlDateTimeComponent, OwlDateTimeInlineComponent, OwlDateTimeInputDirective, OwlDateTimeIntl, OwlDateTimeModule, OwlDateTimeTriggerDirective, OwlMonthViewComponent, OwlMultiYearViewComponent, OwlNativeDateTimeModule, OwlTimerComponent, OwlYearViewComponent, UnixTimestampDateTimeAdapter, defaultOptionsFactory, multiYearOptionsFactory, optionsProviders };
//# sourceMappingURL=danielmoncada-angular-datetime-picker.mjs.map
