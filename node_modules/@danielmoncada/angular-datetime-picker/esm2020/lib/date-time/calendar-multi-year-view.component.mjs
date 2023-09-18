/**
 * calendar-multi-year-view.component
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { CalendarCell, OwlCalendarBodyComponent } from './calendar-body.component';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { OptionsTokens } from './options-provider';
import * as i0 from "@angular/core";
import * as i1 from "./date-time-picker-intl.service";
import * as i2 from "./adapter/date-time-adapter.class";
import * as i3 from "./calendar-body.component";
export class OwlMultiYearViewComponent {
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
OwlMultiYearViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlMultiYearViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.OwlDateTimeIntl }, { token: i2.DateTimeAdapter, optional: true }, { token: OptionsTokens.multiYear }], target: i0.ɵɵFactoryTarget.Component });
OwlMultiYearViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlMultiYearViewComponent, selector: "owl-date-time-multi-year-view", inputs: { selectMode: "selectMode", selected: "selected", selecteds: "selecteds", pickerMoment: "pickerMoment", dateFilter: "dateFilter", minDate: "minDate", maxDate: "maxDate" }, outputs: { change: "change", yearSelected: "yearSelected", pickerMomentChange: "pickerMomentChange", keyboardEnter: "keyboardEnter" }, host: { properties: { "class.owl-dt-calendar-view": "owlDTCalendarView", "class.owl-dt-calendar-multi-year-view": "owlDTCalendarMultiYearView" } }, viewQueries: [{ propertyName: "calendarBodyElm", first: true, predicate: OwlCalendarBodyComponent, descendants: true, static: true }], ngImport: i0, template: "<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!previousEnabled()\" [attr.aria-label]=\"prevButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"prevYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n             version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n             style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n             width=\"100%\" height=\"100%\">\n            <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n<table class=\"owl-dt-calendar-table owl-dt-calendar-multi-year-table\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr>\n        <th colspan=\"3\">{{tableHeader}}</th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"years\" [numCols]=\"3\" [cellRatio]=\"3 / 7\"\n           [activeCell]=\"activeCell\"\n           [todayValue]=\"todayYear\"\n           [selectedValues]=\"selectedYears\"\n           [selectMode]=\"selectMode\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\"></tbody>\n</table>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!nextEnabled()\" [attr.aria-label]=\"nextButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"nextYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n             viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n            <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n", styles: [""], components: [{ type: i3.OwlCalendarBodyComponent, selector: "[owl-date-time-calendar-body]", inputs: ["activeCell", "rows", "numCols", "cellRatio", "todayValue", "selectedValues", "selectMode"], outputs: ["select"], exportAs: ["owlDateTimeCalendarBody"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlMultiYearViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-multi-year-view', host: {
                        '[class.owl-dt-calendar-view]': 'owlDTCalendarView',
                        '[class.owl-dt-calendar-multi-year-view]': 'owlDTCalendarMultiYearView'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!previousEnabled()\" [attr.aria-label]=\"prevButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"prevYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n             version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n             style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n             width=\"100%\" height=\"100%\">\n            <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n<table class=\"owl-dt-calendar-table owl-dt-calendar-multi-year-table\">\n    <thead class=\"owl-dt-calendar-header\">\n    <tr>\n        <th colspan=\"3\">{{tableHeader}}</th>\n    </tr>\n    </thead>\n    <tbody owl-date-time-calendar-body role=\"grid\"\n           [rows]=\"years\" [numCols]=\"3\" [cellRatio]=\"3 / 7\"\n           [activeCell]=\"activeCell\"\n           [todayValue]=\"todayYear\"\n           [selectedValues]=\"selectedYears\"\n           [selectMode]=\"selectMode\"\n           (keydown)=\"handleCalendarKeydown($event)\"\n           (select)=\"selectCalendarCell($event)\"></tbody>\n</table>\n<button class=\"owl-dt-control-button owl-dt-control-arrow-button\"\n        [disabled]=\"!nextEnabled()\" [attr.aria-label]=\"nextButtonLabel\"\n        type=\"button\" tabindex=\"0\" (click)=\"nextYearList($event)\">\n    <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n        <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n             viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n            <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n        </svg>\n        <!-- </editor-fold> -->\n    </span>\n</button>\n", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.OwlDateTimeIntl }, { type: i2.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [OptionsTokens.multiYear]
                }] }]; }, propDecorators: { selectMode: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbXVsdGkteWVhci12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BpY2tlci9zcmMvbGliL2RhdGUtdGltZS9jYWxlbmRhci1tdWx0aS15ZWFyLXZpZXcuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGlja2VyL3NyYy9saWIvZGF0ZS10aW1lL2NhbGVuZGFyLW11bHRpLXllYXItdmlldy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFFSCx1QkFBdUIsRUFBRSxpQkFBaUIsRUFDMUMsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbkYsT0FBTyxFQUNILFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxFQUNYLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxhQUFhLEVBQVcsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7QUFjNUQsTUFBTSxPQUFPLHlCQUF5QjtJQTBMbEMsWUFBcUIsS0FBd0IsRUFDeEIsVUFBMkIsRUFDZixlQUFtQyxFQUNkLE9BQVk7UUFIN0MsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDZixvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7UUFDZCxZ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LENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDeEcsQ0FBQztJQUVPLGVBQWU7UUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQyxDQUFDOztzSEFqYVEseUJBQXlCLGlJQTZMYixhQUFhLENBQUMsU0FBUzswR0E3TG5DLHlCQUF5Qixxa0JBZ0x2Qix3QkFBd0IsOERDN052Qyx3dkZBNENBOzJGRENhLHlCQUF5QjtrQkFackMsU0FBUzsrQkFDSSwrQkFBK0IsUUFHbkM7d0JBQ0YsOEJBQThCLEVBQUUsbUJBQW1CO3dCQUNuRCx5Q0FBeUMsRUFBRSw0QkFBNEI7cUJBQzFFLHVCQUNvQixLQUFLLG1CQUNULHVCQUF1QixDQUFDLE1BQU07OzBCQStMakMsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxhQUFhLENBQUMsU0FBUzs0Q0F0THhDLFVBQVU7c0JBRGIsS0FBSztnQkFnQkYsUUFBUTtzQkFEWCxLQUFLO2dCQWlCRixTQUFTO3NCQURaLEtBQUs7Z0JBZUYsWUFBWTtzQkFEZixLQUFLO2dCQXFCRixVQUFVO3NCQURiLEtBQUs7Z0JBZUYsT0FBTztzQkFEVixLQUFLO2dCQWdCRixPQUFPO3NCQURWLEtBQUs7Z0JBOERhLE1BQU07c0JBQXhCLE1BQU07Z0JBS1ksWUFBWTtzQkFBOUIsTUFBTTtnQkFHWSxrQkFBa0I7c0JBQXBDLE1BQU07Z0JBR1ksYUFBYTtzQkFBL0IsTUFBTTtnQkFHZ0QsZUFBZTtzQkFBckUsU0FBUzt1QkFBQyx3QkFBd0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGNhbGVuZGFyLW11bHRpLXllYXItdmlldy5jb21wb25lbnRcbiAqL1xuXG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE9uSW5pdCxcbiAgICBPcHRpb25hbCxcbiAgICBPdXRwdXQsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZVRpbWVBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVyL2RhdGUtdGltZS1hZGFwdGVyLmNsYXNzJztcbmltcG9ydCB7IENhbGVuZGFyQ2VsbCwgT3dsQ2FsZW5kYXJCb2R5Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWxlY3RNb2RlIH0gZnJvbSAnLi9kYXRlLXRpbWUuY2xhc3MnO1xuaW1wb3J0IHtcbiAgICBET1dOX0FSUk9XLFxuICAgIEVORCxcbiAgICBFTlRFUixcbiAgICBIT01FLFxuICAgIExFRlRfQVJST1csXG4gICAgUEFHRV9ET1dOLFxuICAgIFBBR0VfVVAsXG4gICAgUklHSFRfQVJST1csXG4gICAgVVBfQVJST1dcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IE93bERhdGVUaW1lSW50bCB9IGZyb20gJy4vZGF0ZS10aW1lLXBpY2tlci1pbnRsLnNlcnZpY2UnO1xuaW1wb3J0IHsgT3B0aW9uc1Rva2VucywgT3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucy1wcm92aWRlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnb3dsLWRhdGUtdGltZS1tdWx0aS15ZWFyLXZpZXcnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jYWxlbmRhci1tdWx0aS15ZWFyLXZpZXcuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NhbGVuZGFyLW11bHRpLXllYXItdmlldy5jb21wb25lbnQuc2NzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1tjbGFzcy5vd2wtZHQtY2FsZW5kYXItdmlld10nOiAnb3dsRFRDYWxlbmRhclZpZXcnLFxuICAgICAgICAnW2NsYXNzLm93bC1kdC1jYWxlbmRhci1tdWx0aS15ZWFyLXZpZXddJzogJ293bERUQ2FsZW5kYXJNdWx0aVllYXJWaWV3J1xuICAgIH0sXG4gICAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuXG5leHBvcnQgY2xhc3MgT3dsTXVsdGlZZWFyVmlld0NvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2VsZWN0IG1vZGUgb2YgdGhlIHBpY2tlcjtcbiAgICAgKiAqL1xuICAgIHByaXZhdGUgX3NlbGVjdE1vZGU6IFNlbGVjdE1vZGUgPSAnc2luZ2xlJztcbiAgICBASW5wdXQoKVxuICAgIGdldCBzZWxlY3RNb2RlKCk6IFNlbGVjdE1vZGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0TW9kZTtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0TW9kZSggdmFsOiBTZWxlY3RNb2RlICkge1xuICAgICAgICB0aGlzLl9zZWxlY3RNb2RlID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5pbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRZZWFycygpO1xuICAgICAgICAgICAgdGhpcy5jZFJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUuICovXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IFQgfCBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHNlbGVjdGVkKCk6IFQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RlZCggdmFsdWU6IFQgfCBudWxsICkge1xuICAgICAgICBjb25zdCBvbGRTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGVkO1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRhdGVUaW1lQWRhcHRlci5pc1NhbWVEYXkob2xkU2VsZWN0ZWQsIHRoaXMuX3NlbGVjdGVkKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFllYXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZWxlY3RlZHM6IFRbXSA9IFtdO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHNlbGVjdGVkcygpOiBUW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRzO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RlZHMoIHZhbHVlczogVFtdICkge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZHMgPSB2YWx1ZXMubWFwKCggdiApID0+IHtcbiAgICAgICAgICAgIHYgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhbGlkRGF0ZSh2KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRZZWFycygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3BpY2tlck1vbWVudDogVCB8IG51bGw7XG4gICAgQElucHV0KClcbiAgICBnZXQgcGlja2VyTW9tZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGlja2VyTW9tZW50O1xuICAgIH1cblxuICAgIHNldCBwaWNrZXJNb21lbnQoIHZhbHVlOiBUICkge1xuICAgICAgICBjb25zdCBvbGRNb21lbnQgPSB0aGlzLl9waWNrZXJNb21lbnQ7XG4gICAgICAgIHZhbHVlID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpO1xuICAgICAgICB0aGlzLl9waWNrZXJNb21lbnQgPSB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSkgfHwgdGhpcy5kYXRlVGltZUFkYXB0ZXIubm93KCk7XG5cbiAgICAgICAgaWYgKG9sZE1vbWVudCAmJiB0aGlzLl9waWNrZXJNb21lbnQgJiZcbiAgICAgICAgICAgICF0aGlzLmlzU2FtZVllYXJMaXN0KG9sZE1vbWVudCwgdGhpcy5fcGlja2VyTW9tZW50KSkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVllYXJMaXN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZmlsdGVyIHdoaWNoIGRhdGVzIGFyZSBzZWxlY3RhYmxlXG4gICAgICogKi9cbiAgICBwcml2YXRlIF9kYXRlRmlsdGVyOiAoIGRhdGU6IFQgKSA9PiBib29sZWFuO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IGRhdGVGaWx0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRlRmlsdGVyO1xuICAgIH1cblxuICAgIHNldCBkYXRlRmlsdGVyKCBmaWx0ZXI6ICggZGF0ZTogVCApID0+IGJvb2xlYW4gKSB7XG4gICAgICAgIHRoaXMuX2RhdGVGaWx0ZXIgPSBmaWx0ZXI7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYXRlZCkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVllYXJMaXN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICAgIHByaXZhdGUgX21pbkRhdGU6IFQgfCBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IG1pbkRhdGUoKTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWluRGF0ZTtcbiAgICB9XG5cbiAgICBzZXQgbWluRGF0ZSggdmFsdWU6IFQgfCBudWxsICkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWluRGF0ZSA9IHRoaXMuZ2V0VmFsaWREYXRlKHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlWWVhckxpc3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gICAgcHJpdmF0ZSBfbWF4RGF0ZTogVCB8IG51bGw7XG4gICAgQElucHV0KClcbiAgICBnZXQgbWF4RGF0ZSgpOiBUIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICAgIH1cblxuICAgIHNldCBtYXhEYXRlKCB2YWx1ZTogVCB8IG51bGwgKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpO1xuICAgICAgICB0aGlzLl9tYXhEYXRlID0gdGhpcy5nZXRWYWxpZERhdGUodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5pbml0aWF0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVZZWFyTGlzdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdG9kYXlZZWFyOiBudW1iZXI7XG4gICAgZ2V0IHRvZGF5WWVhcigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG9kYXlZZWFyO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3llYXJzOiBDYWxlbmRhckNlbGxbXVtdO1xuICAgIGdldCB5ZWFycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3llYXJzO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3NlbGVjdGVkWWVhcnM6IG51bWJlcltdO1xuICAgIGdldCBzZWxlY3RlZFllYXJzKCk6IG51bWJlcltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkWWVhcnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWF0ZWQgPSBmYWxzZTtcblxuICAgIGdldCBpc0luU2luZ2xlTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0TW9kZSA9PT0gJ3NpbmdsZSc7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5SYW5nZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdE1vZGUgPT09ICdyYW5nZScgfHwgdGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2VGcm9tJ1xuICAgICAgICAgICAgfHwgdGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2VUbyc7XG4gICAgfVxuXG4gICAgZ2V0IGFjdGl2ZUNlbGwoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuX3BpY2tlck1vbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFllYXIodGhpcy5fcGlja2VyTW9tZW50KSAlICh0aGlzLm9wdGlvbnMueWVhcnNQZXJSb3cgKiB0aGlzLm9wdGlvbnMueWVhclJvd3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHRhYmxlSGVhZGVyKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLl95ZWFycyAmJiB0aGlzLl95ZWFycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5feWVhcnNbMF1bMF0uZGlzcGxheVZhbHVlfSAtICR7dGhpcy5feWVhcnNbdGhpcy5vcHRpb25zLnllYXJSb3dzIC0gMV1bdGhpcy5vcHRpb25zLnllYXJzUGVyUm93IC0gMV0uZGlzcGxheVZhbHVlfWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcHJldkJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlckludGwucHJldk11bHRpWWVhckxhYmVsO1xuICAgIH1cblxuICAgIGdldCBuZXh0QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja2VySW50bC5uZXh0TXVsdGlZZWFyTGFiZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gYSBuZXcgbW9udGggaXMgc2VsZWN0ZWRcbiAgICAgKiAqL1xuICAgIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhci4gVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlXG4gICAgICogKi9cbiAgICBAT3V0cHV0KCkgcmVhZG9ubHkgeWVhclNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxUPigpO1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gYW55IGRhdGUgaXMgYWN0aXZhdGVkLiAqL1xuICAgIEBPdXRwdXQoKSByZWFkb25seSBwaWNrZXJNb21lbnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxUPiA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIC8qKiBFbWl0cyB3aGVuIHVzZSBrZXlib2FyZCBlbnRlciB0byBzZWxlY3QgYSBjYWxlbmRhciBjZWxsICovXG4gICAgQE91dHB1dCgpIHJlYWRvbmx5IGtleWJvYXJkRW50ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICAvKiogVGhlIGJvZHkgb2YgY2FsZW5kYXIgdGFibGUgKi9cbiAgICBAVmlld0NoaWxkKE93bENhbGVuZGFyQm9keUNvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSkgY2FsZW5kYXJCb2R5RWxtOiBPd2xDYWxlbmRhckJvZHlDb21wb25lbnQ7XG5cbiAgICBnZXQgb3dsRFRDYWxlbmRhclZpZXcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBvd2xEVENhbGVuZGFyTXVsdGlZZWFyVmlldygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICAgICBwcml2YXRlIHBpY2tlckludGw6IE93bERhdGVUaW1lSW50bCxcbiAgICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkYXRlVGltZUFkYXB0ZXI6IERhdGVUaW1lQWRhcHRlcjxUPixcbiAgICAgICAgICAgICAgICAgQEluamVjdChPcHRpb25zVG9rZW5zLm11bHRpWWVhcikgcHJpdmF0ZSBvcHRpb25zOiBhbnkpIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fdG9kYXlZZWFyID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLmRhdGVUaW1lQWRhcHRlci5ub3coKSk7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVZZWFyTGlzdCgpO1xuICAgICAgICB0aGlzLmluaXRpYXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGEgY2FsZW5kYXJDZWxsIHNlbGVjdGVkXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdENhbGVuZGFyQ2VsbCggY2VsbDogQ2FsZW5kYXJDZWxsICk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlbGVjdFllYXIoY2VsbC52YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3RZZWFyKCB5ZWFyOiBudW1iZXIgKTogdm9pZCB7XG4gICAgICAgIHRoaXMueWVhclNlbGVjdGVkLmVtaXQodGhpcy5kYXRlVGltZUFkYXB0ZXIuY3JlYXRlRGF0ZSh5ZWFyLCAwLCAxKSk7XG4gICAgICAgIGNvbnN0IGZpcnN0RGF0ZU9mTW9udGggPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5jcmVhdGVEYXRlKFxuICAgICAgICAgICAgeWVhcixcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1vbnRoKHRoaXMucGlja2VyTW9tZW50KSxcbiAgICAgICAgICAgIDFcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZGF5c0luTW9udGggPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXROdW1EYXlzSW5Nb250aChmaXJzdERhdGVPZk1vbnRoKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5jcmVhdGVEYXRlKFxuICAgICAgICAgICAgeWVhcixcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1vbnRoKHRoaXMucGlja2VyTW9tZW50KSxcbiAgICAgICAgICAgIE1hdGgubWluKGRheXNJbk1vbnRoLCB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXREYXRlKHRoaXMucGlja2VyTW9tZW50KSksXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRIb3Vycyh0aGlzLnBpY2tlck1vbWVudCksXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNaW51dGVzKHRoaXMucGlja2VyTW9tZW50KSxcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFNlY29uZHModGhpcy5waWNrZXJNb21lbnQpLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoc2VsZWN0ZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBwcmV2aW91cyB5ZWFyIGxpc3RcbiAgICAgKiAqL1xuICAgIHB1YmxpYyBwcmV2WWVhckxpc3QoIGV2ZW50OiBhbnkgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BpY2tlck1vbWVudCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5waWNrZXJNb21lbnQsIC0xICogdGhpcy5vcHRpb25zLnllYXJzUGVyUm93ICogdGhpcy5vcHRpb25zLnllYXJSb3dzKTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVllYXJMaXN0KCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgdGhlIG5leHQgeWVhciBsaXN0XG4gICAgICogKi9cbiAgICBwdWJsaWMgbmV4dFllYXJMaXN0KCBldmVudDogYW55ICk6IHZvaWQge1xuICAgICAgICB0aGlzLl9waWNrZXJNb21lbnQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMucGlja2VyTW9tZW50LCB0aGlzLm9wdGlvbnMueWVhcnNQZXJSb3cgKiB0aGlzLm9wdGlvbnMueWVhclJvd3MpO1xuICAgICAgICB0aGlzLmdlbmVyYXRlWWVhckxpc3QoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVZZWFyTGlzdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5feWVhcnMgPSBbXTtcblxuICAgICAgICBjb25zdCBwaWNrZXJNb21lbnRZZWFyID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLl9waWNrZXJNb21lbnQpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBwaWNrZXJNb21lbnRZZWFyICUgKHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyAqIHRoaXMub3B0aW9ucy55ZWFyUm93cyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMueWVhclJvd3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5vcHRpb25zLnllYXJzUGVyUm93OyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gcGlja2VyTW9tZW50WWVhciAtIG9mZnNldCArIChqICsgaSAqIHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3QgeWVhckNlbGwgPSB0aGlzLmNyZWF0ZVllYXJDZWxsKHllYXIpO1xuICAgICAgICAgICAgICAgIHJvdy5wdXNoKHllYXJDZWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5feWVhcnMucHVzaChyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgfVxuXG4gICAgLyoqIFdoZXRoZXIgdGhlIHByZXZpb3VzIHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC4gKi9cbiAgICBwdWJsaWMgcHJldmlvdXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMubWluRGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICF0aGlzLm1pbkRhdGUgfHwgIXRoaXMuaXNTYW1lWWVhckxpc3QodGhpcy5fcGlja2VyTW9tZW50LCB0aGlzLm1pbkRhdGUpO1xuICAgIH1cblxuICAgIC8qKiBXaGV0aGVyIHRoZSBuZXh0IHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC4gKi9cbiAgICBwdWJsaWMgbmV4dEVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5tYXhEYXRlIHx8ICF0aGlzLmlzU2FtZVllYXJMaXN0KHRoaXMuX3BpY2tlck1vbWVudCwgdGhpcy5tYXhEYXRlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlQ2FsZW5kYXJLZXlkb3duKCBldmVudDogS2V5Ym9hcmRFdmVudCApOiB2b2lkIHtcbiAgICAgICAgbGV0IG1vbWVudDtcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAvLyBtaW51cyAxIHllYXJcbiAgICAgICAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgICAgICAgICBtb21lbnQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX3BpY2tlck1vbWVudCwgLTEpO1xuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50Q2hhbmdlLmVtaXQobW9tZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gYWRkIDEgeWVhclxuICAgICAgICAgICAgY2FzZSBSSUdIVF9BUlJPVzpcbiAgICAgICAgICAgICAgICBtb21lbnQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX3BpY2tlck1vbWVudCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXJNb21lbnRDaGFuZ2UuZW1pdChtb21lbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBtaW51cyAzIHllYXJzXG4gICAgICAgICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICAgICAgICAgIG1vbWVudCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fcGlja2VyTW9tZW50LCAtMSAqIHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyk7XG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXJNb21lbnRDaGFuZ2UuZW1pdChtb21lbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBhZGQgMyB5ZWFyc1xuICAgICAgICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICAgICAgICAgIG1vbWVudCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fcGlja2VyTW9tZW50LCB0aGlzLm9wdGlvbnMueWVhcnNQZXJSb3cpO1xuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50Q2hhbmdlLmVtaXQobW9tZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gZ28gdG8gdGhlIGZpcnN0IHllYXIgb2YgdGhlIHllYXIgcGFnZVxuICAgICAgICAgICAgY2FzZSBIT01FOlxuICAgICAgICAgICAgICAgIG1vbWVudCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fcGlja2VyTW9tZW50LFxuICAgICAgICAgICAgICAgICAgICAtdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLl9waWNrZXJNb21lbnQpICUgKHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyAqIHRoaXMub3B0aW9ucy55ZWFyUm93cykpO1xuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50Q2hhbmdlLmVtaXQobW9tZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gZ28gdG8gdGhlIGxhc3QgeWVhciBvZiB0aGUgeWVhciBwYWdlXG4gICAgICAgICAgICBjYXNlIEVORDpcbiAgICAgICAgICAgICAgICBtb21lbnQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMuX3BpY2tlck1vbWVudCxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyAqIHRoaXMub3B0aW9ucy55ZWFyUm93cykgLSB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKHRoaXMuX3BpY2tlck1vbWVudCkgJSAodGhpcy5vcHRpb25zLnllYXJzUGVyUm93ICogdGhpcy5vcHRpb25zLnllYXJSb3dzKSAtIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50Q2hhbmdlLmVtaXQobW9tZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gbWludXMgMSB5ZWFyIHBhZ2UgKG9yIDEwIHllYXIgcGFnZXMpXG4gICAgICAgICAgICBjYXNlIFBBR0VfVVA6XG4gICAgICAgICAgICAgICAgbW9tZW50ID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLnBpY2tlck1vbWVudCwgZXZlbnQuYWx0S2V5ID8gLTEwICogKHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyAqIHRoaXMub3B0aW9ucy55ZWFyUm93cykgOiAtMSAqICh0aGlzLm9wdGlvbnMueWVhcnNQZXJSb3cgKiB0aGlzLm9wdGlvbnMueWVhclJvd3MpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlck1vbWVudENoYW5nZS5lbWl0KG1vbWVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIGFkZCAxIHllYXIgcGFnZSAob3IgMTAgeWVhciBwYWdlcylcbiAgICAgICAgICAgIGNhc2UgUEFHRV9ET1dOOlxuICAgICAgICAgICAgICAgIG1vbWVudCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5waWNrZXJNb21lbnQsIGV2ZW50LmFsdEtleSA/IDEwICogKHRoaXMub3B0aW9ucy55ZWFyc1BlclJvdyAqIHRoaXMub3B0aW9ucy55ZWFyUm93cykgOiAodGhpcy5vcHRpb25zLnllYXJzUGVyUm93ICogdGhpcy5vcHRpb25zLnllYXJSb3dzKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXJNb21lbnRDaGFuZ2UuZW1pdChtb21lbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIEVOVEVSOlxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0WWVhcih0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKHRoaXMuX3BpY2tlck1vbWVudCkpO1xuICAgICAgICAgICAgICAgIHRoaXMua2V5Ym9hcmRFbnRlci5lbWl0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIENhbGVuZGFyQ2VsbCBmb3IgdGhlIGdpdmVuIHllYXIuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjcmVhdGVZZWFyQ2VsbCggeWVhcjogbnVtYmVyICk6IENhbGVuZGFyQ2VsbCB7XG4gICAgICAgIGNvbnN0IHN0YXJ0RGF0ZU9mWWVhciA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNyZWF0ZURhdGUoeWVhciwgMCwgMSk7XG4gICAgICAgIGNvbnN0IGFyaWFMYWJlbCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFllYXJOYW1lKHN0YXJ0RGF0ZU9mWWVhcik7XG4gICAgICAgIGNvbnN0IGNlbGxDbGFzcyA9ICdvd2wtZHQteWVhci0nICsgeWVhcjtcbiAgICAgICAgcmV0dXJuIG5ldyBDYWxlbmRhckNlbGwoeWVhciwgeWVhci50b1N0cmluZygpLCBhcmlhTGFiZWwsIHRoaXMuaXNZZWFyRW5hYmxlZCh5ZWFyKSwgZmFsc2UsIGNlbGxDbGFzcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRTZWxlY3RlZFllYXJzKCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkWWVhcnMgPSBbXTtcblxuICAgICAgICBpZiAodGhpcy5pc0luU2luZ2xlTW9kZSAmJiB0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RlZFllYXJzWzBdID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzSW5SYW5nZU1vZGUgJiYgdGhpcy5zZWxlY3RlZHMpIHtcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkWWVhcnMgPSB0aGlzLnNlbGVjdGVkcy5tYXAoKCBzZWxlY3RlZCApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNWYWxpZChzZWxlY3RlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFllYXIoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFdoZXRoZXIgdGhlIGdpdmVuIHllYXIgaXMgZW5hYmxlZC4gKi9cbiAgICBwcml2YXRlIGlzWWVhckVuYWJsZWQoIHllYXI6IG51bWJlciApIHtcbiAgICAgICAgLy8gZGlzYWJsZSBpZiB0aGUgeWVhciBpcyBncmVhdGVyIHRoYW4gbWF4RGF0ZSBsb3dlciB0aGFuIG1pbkRhdGVcbiAgICAgICAgaWYgKHllYXIgPT09IHVuZGVmaW5lZCB8fCB5ZWFyID09PSBudWxsIHx8XG4gICAgICAgICAgICAodGhpcy5tYXhEYXRlICYmIHllYXIgPiB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKHRoaXMubWF4RGF0ZSkpIHx8XG4gICAgICAgICAgICAodGhpcy5taW5EYXRlICYmIHllYXIgPCB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKHRoaXMubWluRGF0ZSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbmFibGUgaWYgaXQgcmVhY2hlcyBoZXJlIGFuZCB0aGVyZSdzIG5vIGZpbHRlciBkZWZpbmVkXG4gICAgICAgIGlmICghdGhpcy5kYXRlRmlsdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpcnN0T2ZZZWFyID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY3JlYXRlRGF0ZSh5ZWFyLCAwLCAxKTtcblxuICAgICAgICAvLyBJZiBhbnkgZGF0ZSBpbiB0aGUgeWVhciBpcyBlbmFibGVkIGNvdW50IHRoZSB5ZWFyIGFzIGVuYWJsZWQuXG4gICAgICAgIGZvciAobGV0IGRhdGUgPSBmaXJzdE9mWWVhcjsgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcihkYXRlKSA9PT0geWVhcjtcbiAgICAgICAgICAgICBkYXRlID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKGRhdGUsIDEpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRlRmlsdGVyKGRhdGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1NhbWVZZWFyTGlzdCggZGF0ZTE6IFQsIGRhdGUyOiBUICk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKGRhdGUxKSAvICh0aGlzLm9wdGlvbnMueWVhcnNQZXJSb3cgKiB0aGlzLm9wdGlvbnMueWVhclJvd3MpKSA9PT1cbiAgICAgICAgICAgIE1hdGguZmxvb3IodGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMikgLyAodGhpcy5vcHRpb25zLnllYXJzUGVyUm93ICogdGhpcy5vcHRpb25zLnllYXJSb3dzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgdmFsaWQgZGF0ZSBvYmplY3RcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFZhbGlkRGF0ZSggb2JqOiBhbnkgKTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gKHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzRGF0ZUluc3RhbmNlKG9iaikgJiYgdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNWYWxpZChvYmopKSA/IG9iaiA6IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmb2N1c0FjdGl2ZUNlbGwoKSB7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJCb2R5RWxtLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgIH1cbn1cbiIsIjxidXR0b24gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1idXR0b24gb3dsLWR0LWNvbnRyb2wtYXJyb3ctYnV0dG9uXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cIiFwcmV2aW91c0VuYWJsZWQoKVwiIFthdHRyLmFyaWEtbGFiZWxdPVwicHJldkJ1dHRvbkxhYmVsXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiIChjbGljayk9XCJwcmV2WWVhckxpc3QoJGV2ZW50KVwiPlxuICAgIDxzcGFuIGNsYXNzPVwib3dsLWR0LWNvbnRyb2wtYnV0dG9uLWNvbnRlbnRcIiB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgIDwhLS0gPGVkaXRvci1mb2xkIGRlc2M9XCJTVkcgQXJyb3cgTGVmdFwiPiAtLT5cbiAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICAgICAgIHZlcnNpb249XCIxLjFcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHZpZXdCb3g9XCIwIDAgMjUwLjczOCAyNTAuNzM4XCJcbiAgICAgICAgICAgICBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4O1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCJcbiAgICAgICAgICAgICB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XG4gICAgICAgICAgICA8cGF0aCBzdHlsZT1cImZpbGwtcnVsZTogZXZlbm9kZDsgY2xpcC1ydWxlOiBldmVub2RkO1wiIGQ9XCJNOTYuNjMzLDEyNS4zNjlsOTUuMDUzLTk0LjUzM2M3LjEwMS03LjA1NSw3LjEwMS0xOC40OTIsMC0yNS41NDYgICBjLTcuMS03LjA1NC0xOC42MTMtNy4wNTQtMjUuNzE0LDBMNTguOTg5LDExMS42ODljLTMuNzg0LDMuNzU5LTUuNDg3LDguNzU5LTUuMjM4LDEzLjY4Yy0wLjI0OSw0LjkyMiwxLjQ1NCw5LjkyMSw1LjIzOCwxMy42ODEgICBsMTA2Ljk4MywxMDYuMzk4YzcuMTAxLDcuMDU1LDE4LjYxMyw3LjA1NSwyNS43MTQsMGM3LjEwMS03LjA1NCw3LjEwMS0xOC40OTEsMC0yNS41NDRMOTYuNjMzLDEyNS4zNjl6XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAgPCEtLSA8L2VkaXRvci1mb2xkPiAtLT5cbiAgICA8L3NwYW4+XG48L2J1dHRvbj5cbjx0YWJsZSBjbGFzcz1cIm93bC1kdC1jYWxlbmRhci10YWJsZSBvd2wtZHQtY2FsZW5kYXItbXVsdGkteWVhci10YWJsZVwiPlxuICAgIDx0aGVhZCBjbGFzcz1cIm93bC1kdC1jYWxlbmRhci1oZWFkZXJcIj5cbiAgICA8dHI+XG4gICAgICAgIDx0aCBjb2xzcGFuPVwiM1wiPnt7dGFibGVIZWFkZXJ9fTwvdGg+XG4gICAgPC90cj5cbiAgICA8L3RoZWFkPlxuICAgIDx0Ym9keSBvd2wtZGF0ZS10aW1lLWNhbGVuZGFyLWJvZHkgcm9sZT1cImdyaWRcIlxuICAgICAgICAgICBbcm93c109XCJ5ZWFyc1wiIFtudW1Db2xzXT1cIjNcIiBbY2VsbFJhdGlvXT1cIjMgLyA3XCJcbiAgICAgICAgICAgW2FjdGl2ZUNlbGxdPVwiYWN0aXZlQ2VsbFwiXG4gICAgICAgICAgIFt0b2RheVZhbHVlXT1cInRvZGF5WWVhclwiXG4gICAgICAgICAgIFtzZWxlY3RlZFZhbHVlc109XCJzZWxlY3RlZFllYXJzXCJcbiAgICAgICAgICAgW3NlbGVjdE1vZGVdPVwic2VsZWN0TW9kZVwiXG4gICAgICAgICAgIChrZXlkb3duKT1cImhhbmRsZUNhbGVuZGFyS2V5ZG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgKHNlbGVjdCk9XCJzZWxlY3RDYWxlbmRhckNlbGwoJGV2ZW50KVwiPjwvdGJvZHk+XG48L3RhYmxlPlxuPGJ1dHRvbiBjbGFzcz1cIm93bC1kdC1jb250cm9sLWJ1dHRvbiBvd2wtZHQtY29udHJvbC1hcnJvdy1idXR0b25cIlxuICAgICAgICBbZGlzYWJsZWRdPVwiIW5leHRFbmFibGVkKClcIiBbYXR0ci5hcmlhLWxhYmVsXT1cIm5leHRCdXR0b25MYWJlbFwiXG4gICAgICAgIHR5cGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIiAoY2xpY2spPVwibmV4dFllYXJMaXN0KCRldmVudClcIj5cbiAgICA8c3BhbiBjbGFzcz1cIm93bC1kdC1jb250cm9sLWJ1dHRvbi1jb250ZW50XCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICA8IS0tIDxlZGl0b3ItZm9sZCBkZXNjPVwiU1ZHIEFycm93IFJpZ2h0XCI+IC0tPlxuICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG4gICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNTAuNzM4IDI1MC43MzhcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4O1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgICAgICA8cGF0aCBzdHlsZT1cImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO1wiIGQ9XCJNMTkxLjc1LDExMS42ODlMODQuNzY2LDUuMjkxYy03LjEtNy4wNTUtMTguNjEzLTcuMDU1LTI1LjcxMywwXG4gICAgICAgICAgICAgICAgYy03LjEwMSw3LjA1NC03LjEwMSwxOC40OSwwLDI1LjU0NGw5NS4wNTMsOTQuNTM0bC05NS4wNTMsOTQuNTMzYy03LjEwMSw3LjA1NC03LjEwMSwxOC40OTEsMCwyNS41NDVcbiAgICAgICAgICAgICAgICBjNy4xLDcuMDU0LDE4LjYxMyw3LjA1NCwyNS43MTMsMEwxOTEuNzUsMTM5LjA1YzMuNzg0LTMuNzU5LDUuNDg3LTguNzU5LDUuMjM4LTEzLjY4MVxuICAgICAgICAgICAgICAgIEMxOTcuMjM3LDEyMC40NDcsMTk1LjUzNCwxMTUuNDQ4LDE5MS43NSwxMTEuNjg5elwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICAgIDwhLS0gPC9lZGl0b3ItZm9sZD4gLS0+XG4gICAgPC9zcGFuPlxuPC9idXR0b24+XG4iXX0=