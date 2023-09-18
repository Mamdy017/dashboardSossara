/**
 * calendar.component
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output } from '@angular/core';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { DateView } from './date-time.class';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./date-time-picker-intl.service";
import * as i2 from "./adapter/date-time-adapter.class";
import * as i3 from "./calendar-month-view.component";
import * as i4 from "./calendar-year-view.component";
import * as i5 from "./calendar-multi-year-view.component";
import * as i6 from "@angular/cdk/a11y";
import * as i7 from "@angular/common";
export class OwlCalendarComponent {
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
OwlCalendarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlCalendarComponent, deps: [{ token: i0.ElementRef }, { token: i1.OwlDateTimeIntl }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlCalendarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlCalendarComponent, selector: "owl-date-time-calendar", inputs: { minDate: "minDate", maxDate: "maxDate", pickerMoment: "pickerMoment", selected: "selected", selecteds: "selecteds", dateFilter: "dateFilter", firstDayOfWeek: "firstDayOfWeek", selectMode: "selectMode", startView: "startView", yearOnly: "yearOnly", multiyearOnly: "multiyearOnly", hideOtherMonths: "hideOtherMonths" }, outputs: { pickerMomentChange: "pickerMomentChange", dateClicked: "dateClicked", selectedChange: "selectedChange", userSelection: "userSelection", yearSelected: "yearSelected", monthSelected: "monthSelected" }, host: { properties: { "class.owl-dt-calendar": "owlDTCalendarClass" } }, exportAs: ["owlDateTimeCalendar"], ngImport: i0, template: "<div class=\"owl-dt-calendar-control\">\n    <!-- focus when keyboard tab (http://kizu.ru/en/blog/keyboard-only-focus/#x) -->\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!prevButtonEnabled()\"\n            [attr.aria-label]=\"prevButtonLabel\"\n            (click)=\"previousClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n                 style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n    <div class=\"owl-dt-calendar-control-content\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-period-button\"\n                type=\"button\" tabindex=\"0\"\n                [attr.aria-label]=\"periodButtonLabel\"\n                (click)=\"toggleViews()\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{periodButtonText}}\n\n                <span class=\"owl-dt-control-button-arrow\"\n                      [style.transform]=\"'rotate(' + (isMonthView? 0 : 180) +'deg)'\">\n                    <!-- <editor-fold desc=\"SVG Arrow\"> -->\n                    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                         width=\"50%\" height=\"50%\" viewBox=\"0 0 292.362 292.362\" style=\"enable-background:new 0 0 292.362 292.362;\"\n                         xml:space=\"preserve\">\n                        <g>\n                            <path d=\"M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424\n                                C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428\n                                s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z\"/>\n                        </g>\n                    </svg>\n                    <!-- </editor-fold> -->\n                </span>\n            </span>\n        </button>\n    </div>\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!nextButtonEnabled()\"\n            [attr.aria-label]=\"nextButtonLabel\"\n            (click)=\"nextClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n        <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                 viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n                <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                    c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                    c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                    C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n</div>\n<div class=\"owl-dt-calendar-main\" cdkMonitorSubtreeFocus [ngSwitch]=\"currentView\" tabindex=\"-1\">\n    <owl-date-time-month-view\n            *ngSwitchCase=\"DateView.MONTH\"\n            [pickerMoment]=\"pickerMoment\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            [hideOtherMonths]=\"hideOtherMonths\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (selectedChange)=\"dateSelected($event)\"\n            (userSelection)=\"userSelected()\"></owl-date-time-month-view>\n\n    <owl-date-time-year-view\n            *ngSwitchCase=\"DateView.YEAR\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (monthSelected)=\"selectMonthInYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.MONTH)\"></owl-date-time-year-view>\n\n    <owl-date-time-multi-year-view\n            *ngSwitchCase=\"DateView.MULTI_YEARS\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (yearSelected)=\"selectYearInMultiYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.YEAR)\"></owl-date-time-multi-year-view>\n</div>\n", styles: [""], components: [{ type: i3.OwlMonthViewComponent, selector: "owl-date-time-month-view", inputs: ["hideOtherMonths", "firstDayOfWeek", "selectMode", "selected", "selecteds", "pickerMoment", "dateFilter", "minDate", "maxDate"], outputs: ["selectedChange", "userSelection", "pickerMomentChange"], exportAs: ["owlYearView"] }, { type: i4.OwlYearViewComponent, selector: "owl-date-time-year-view", inputs: ["selectMode", "selected", "selecteds", "pickerMoment", "dateFilter", "minDate", "maxDate"], outputs: ["change", "monthSelected", "pickerMomentChange", "keyboardEnter"], exportAs: ["owlMonthView"] }, { type: i5.OwlMultiYearViewComponent, selector: "owl-date-time-multi-year-view", inputs: ["selectMode", "selected", "selecteds", "pickerMoment", "dateFilter", "minDate", "maxDate"], outputs: ["change", "yearSelected", "pickerMomentChange", "keyboardEnter"] }], directives: [{ type: i6.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"] }, { type: i7.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { type: i7.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlCalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-calendar', exportAs: 'owlDateTimeCalendar', host: {
                        '[class.owl-dt-calendar]': 'owlDTCalendarClass'
                    }, preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"owl-dt-calendar-control\">\n    <!-- focus when keyboard tab (http://kizu.ru/en/blog/keyboard-only-focus/#x) -->\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!prevButtonEnabled()\"\n            [attr.aria-label]=\"prevButtonLabel\"\n            (click)=\"previousClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Left\"> -->\n        <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n                 version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\"\n                 style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"\n                 width=\"100%\" height=\"100%\">\n                <path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n    <div class=\"owl-dt-calendar-control-content\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-period-button\"\n                type=\"button\" tabindex=\"0\"\n                [attr.aria-label]=\"periodButtonLabel\"\n                (click)=\"toggleViews()\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{periodButtonText}}\n\n                <span class=\"owl-dt-control-button-arrow\"\n                      [style.transform]=\"'rotate(' + (isMonthView? 0 : 180) +'deg)'\">\n                    <!-- <editor-fold desc=\"SVG Arrow\"> -->\n                    <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                         width=\"50%\" height=\"50%\" viewBox=\"0 0 292.362 292.362\" style=\"enable-background:new 0 0 292.362 292.362;\"\n                         xml:space=\"preserve\">\n                        <g>\n                            <path d=\"M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424\n                                C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428\n                                s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z\"/>\n                        </g>\n                    </svg>\n                    <!-- </editor-fold> -->\n                </span>\n            </span>\n        </button>\n    </div>\n    <button class=\"owl-dt-control owl-dt-control-button owl-dt-control-arrow-button\"\n            type=\"button\" tabindex=\"0\"\n            [style.visibility]=\"showControlArrows? 'visible': 'hidden'\"\n            [disabled]=\"!nextButtonEnabled()\"\n            [attr.aria-label]=\"nextButtonLabel\"\n            (click)=\"nextClicked()\">\n        <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n            <!-- <editor-fold desc=\"SVG Arrow Right\"> -->\n        <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n                 viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\">\n                <path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                    c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                    c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                    C197.237,120.447,195.534,115.448,191.75,111.689z\"/>\n            </svg>\n            <!-- </editor-fold> -->\n        </span>\n    </button>\n</div>\n<div class=\"owl-dt-calendar-main\" cdkMonitorSubtreeFocus [ngSwitch]=\"currentView\" tabindex=\"-1\">\n    <owl-date-time-month-view\n            *ngSwitchCase=\"DateView.MONTH\"\n            [pickerMoment]=\"pickerMoment\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            [hideOtherMonths]=\"hideOtherMonths\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (selectedChange)=\"dateSelected($event)\"\n            (userSelection)=\"userSelected()\"></owl-date-time-month-view>\n\n    <owl-date-time-year-view\n            *ngSwitchCase=\"DateView.YEAR\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (monthSelected)=\"selectMonthInYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.MONTH)\"></owl-date-time-year-view>\n\n    <owl-date-time-multi-year-view\n            *ngSwitchCase=\"DateView.MULTI_YEARS\"\n            [pickerMoment]=\"pickerMoment\"\n            [selected]=\"selected\"\n            [selecteds]=\"selecteds\"\n            [selectMode]=\"selectMode\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            [dateFilter]=\"dateFilter\"\n            (keyboardEnter)=\"focusActiveCell()\"\n            (pickerMomentChange)=\"handlePickerMomentChange($event)\"\n            (yearSelected)=\"selectYearInMultiYearView($event)\"\n            (change)=\"goToDateInView($event, DateView.YEAR)\"></owl-date-time-multi-year-view>\n</div>\n", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.OwlDateTimeIntl }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [OWL_DATE_TIME_FORMATS]
                }] }]; }, propDecorators: { minDate: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGlja2VyL3NyYy9saWIvZGF0ZS10aW1lL2NhbGVuZGFyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BpY2tlci9zcmMvbGliL2RhdGUtdGltZS9jYWxlbmRhci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFHSCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixNQUFNLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMscUJBQXFCLEVBQXFCLE1BQU0sa0NBQWtDLENBQUM7QUFDM0YsT0FBTyxFQUFDLFFBQVEsRUFBMkIsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRSxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQzs7Ozs7Ozs7O0FBYWxDLE1BQU0sT0FBTyxvQkFBb0I7SUFpSjdCLFlBQ1ksTUFBa0IsRUFDbEIsVUFBMkIsRUFDM0IsTUFBYyxFQUNkLEtBQXdCLEVBQ1osZUFBbUMsRUFHL0MsZUFBbUM7UUFQbkMsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUNsQixlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQUMzQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDWixvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7UUFHL0Msb0JBQWUs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cUJBQXFCLFFBR3pCO3dCQUNGLHlCQUF5QixFQUFFLG9CQUFvQjtxQkFDbEQsdUJBQ29CLEtBQUssbUJBQ1QsdUJBQXVCLENBQUMsTUFBTTs7MEJBd0oxQyxRQUFROzswQkFDUixRQUFROzswQkFDUixNQUFNOzJCQUFDLHFCQUFxQjs0Q0FsSjdCLE9BQU87c0JBRFYsS0FBSztnQkFtQkYsT0FBTztzQkFEVixLQUFLO2dCQW1CRixZQUFZO3NCQURmLEtBQUs7Z0JBWUYsUUFBUTtzQkFEWCxLQUFLO2dCQVdGLFNBQVM7c0JBRFosS0FBSztnQkFzR04sVUFBVTtzQkFEVCxLQUFLO2dCQU9OLGNBQWM7c0JBRGIsS0FBSztnQkFhTixVQUFVO3NCQURULEtBQUs7Z0JBWU4sU0FBUztzQkFEUixLQUFLO2dCQU9OLFFBQVE7c0JBRFAsS0FBSztnQkFPTixhQUFhO3NCQURaLEtBQUs7Z0JBT04sZUFBZTtzQkFEZCxLQUFLO2dCQUtOLGtCQUFrQjtzQkFEakIsTUFBTTtnQkFLRSxXQUFXO3NCQURuQixNQUFNO2dCQUtFLGNBQWM7c0JBRHRCLE1BQU07Z0JBS0UsYUFBYTtzQkFEckIsTUFBTTtnQkFPRSxZQUFZO3NCQURwQixNQUFNO2dCQU9FLGFBQWE7c0JBRHJCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGNhbGVuZGFyLmNvbXBvbmVudFxuICovXG5cbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdDaGVja2VkLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgTmdab25lLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3B0aW9uYWwsXG4gICAgT3V0cHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPd2xEYXRlVGltZUludGx9IGZyb20gJy4vZGF0ZS10aW1lLXBpY2tlci1pbnRsLnNlcnZpY2UnO1xuaW1wb3J0IHtEYXRlVGltZUFkYXB0ZXJ9IGZyb20gJy4vYWRhcHRlci9kYXRlLXRpbWUtYWRhcHRlci5jbGFzcyc7XG5pbXBvcnQge09XTF9EQVRFX1RJTUVfRk9STUFUUywgT3dsRGF0ZVRpbWVGb3JtYXRzfSBmcm9tICcuL2FkYXB0ZXIvZGF0ZS10aW1lLWZvcm1hdC5jbGFzcyc7XG5pbXBvcnQge0RhdGVWaWV3LCBEYXRlVmlld1R5cGUsIFNlbGVjdE1vZGV9IGZyb20gJy4vZGF0ZS10aW1lLmNsYXNzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ293bC1kYXRlLXRpbWUtY2FsZW5kYXInLFxuICAgIGV4cG9ydEFzOiAnb3dsRGF0ZVRpbWVDYWxlbmRhcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NhbGVuZGFyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jYWxlbmRhci5jb21wb25lbnQuc2NzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1tjbGFzcy5vd2wtZHQtY2FsZW5kYXJdJzogJ293bERUQ2FsZW5kYXJDbGFzcydcbiAgICB9LFxuICAgIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE93bENhbGVuZGFyQ29tcG9uZW50PFQ+XG4gICAgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG5cbiAgICBEYXRlVmlldyA9IERhdGVWaWV3O1xuXG4gICAgQElucHV0KClcbiAgICBnZXQgbWluRGF0ZSgpOiBUIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9taW5EYXRlO1xuICAgIH1cblxuICAgIHNldCBtaW5EYXRlKHZhbHVlOiBUIHwgbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5fbWluRGF0ZSA9IHZhbHVlXG4gICAgICAgICAgICA/IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNyZWF0ZURhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcih2YWx1ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0TW9udGgodmFsdWUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldERhdGUodmFsdWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBnZXQgbWF4RGF0ZSgpOiBUIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICAgIH1cblxuICAgIHNldCBtYXhEYXRlKHZhbHVlOiBUIHwgbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5fbWF4RGF0ZSA9IHZhbHVlXG4gICAgICAgICAgICA/IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNyZWF0ZURhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcih2YWx1ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0TW9udGgodmFsdWUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldERhdGUodmFsdWUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBnZXQgcGlja2VyTW9tZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGlja2VyTW9tZW50O1xuICAgIH1cblxuICAgIHNldCBwaWNrZXJNb21lbnQodmFsdWU6IFQpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3BpY2tlck1vbWVudCA9XG4gICAgICAgICAgICB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSkgfHwgdGhpcy5kYXRlVGltZUFkYXB0ZXIubm93KCk7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBnZXQgc2VsZWN0ZWQoKTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgc2V0IHNlbGVjdGVkKHZhbHVlOiBUIHwgbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBnZXQgc2VsZWN0ZWRzKCk6IFRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZHM7XG4gICAgfVxuXG4gICAgc2V0IHNlbGVjdGVkcyh2YWx1ZXM6IFRbXSkge1xuICAgICAgICB0aGlzLl9zZWxlY3RlZHMgPSB2YWx1ZXMubWFwKHYgPT4ge1xuICAgICAgICAgICAgdiA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHYpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsaWREYXRlKHYpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgcGVyaW9kQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01vbnRoVmlld1xuICAgICAgICAgICAgPyB0aGlzLmRhdGVUaW1lQWRhcHRlci5mb3JtYXQoXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXJNb21lbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUZvcm1hdHMubW9udGhZZWFyTGFiZWxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhck5hbWUodGhpcy5waWNrZXJNb21lbnQpO1xuICAgIH1cblxuICAgIGdldCBwZXJpb2RCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pc01vbnRoVmlld1xuICAgICAgICAgICAgPyB0aGlzLnBpY2tlckludGwuc3dpdGNoVG9NdWx0aVllYXJWaWV3TGFiZWxcbiAgICAgICAgICAgIDogdGhpcy5waWNrZXJJbnRsLnN3aXRjaFRvTW9udGhWaWV3TGFiZWw7XG4gICAgfVxuXG4gICAgZ2V0IHByZXZCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFZpZXcgPT09IERhdGVWaWV3Lk1PTlRIKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLnByZXZNb250aExhYmVsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlVmlldy5ZRUFSKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLnByZXZZZWFyTGFiZWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBuZXh0QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlVmlldy5NT05USCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGlja2VySW50bC5uZXh0TW9udGhMYWJlbDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyZW50VmlldyA9PT0gRGF0ZVZpZXcuWUVBUikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGlja2VySW50bC5uZXh0WWVhckxhYmVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY3VycmVudFZpZXcoKTogRGF0ZVZpZXdUeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3O1xuICAgIH1cblxuICAgIHNldCBjdXJyZW50Vmlldyh2aWV3OiBEYXRlVmlld1R5cGUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFZpZXcgPSB2aWV3O1xuICAgICAgICB0aGlzLm1vdmVGb2N1c09uTmV4dFRpY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldCBpc0luU2luZ2xlTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0TW9kZSA9PT0gJ3NpbmdsZSc7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5SYW5nZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdE1vZGUgPT09ICdyYW5nZScgfHxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0TW9kZSA9PT0gJ3JhbmdlRnJvbScgfHxcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0TW9kZSA9PT0gJ3JhbmdlVG8nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dDb250cm9sQXJyb3dzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFZpZXcgIT09IERhdGVWaWV3Lk1VTFRJX1lFQVJTO1xuICAgIH1cblxuICAgIGdldCBpc01vbnRoVmlldygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlVmlldy5NT05USDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kIGNsYXNzICdvd2wtZHQtY2FsZW5kYXInIHRvIGhvc3RcbiAgICAgKiAqL1xuICAgIGdldCBvd2xEVENhbGVuZGFyQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGVsbVJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSBwaWNrZXJJbnRsOiBPd2xEYXRlVGltZUludGwsXG4gICAgICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRhdGVUaW1lQWRhcHRlcjogRGF0ZVRpbWVBZGFwdGVyPFQ+LFxuICAgICAgICBAT3B0aW9uYWwoKVxuICAgICAgICBASW5qZWN0KE9XTF9EQVRFX1RJTUVfRk9STUFUUylcbiAgICAgICAgcHJpdmF0ZSBkYXRlVGltZUZvcm1hdHM6IE93bERhdGVUaW1lRm9ybWF0c1xuICAgICkge1xuICAgICAgICB0aGlzLmludGxDaGFuZ2VzU3ViID0gdGhpcy5waWNrZXJJbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2RSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERhdGUgZmlsdGVyIGZvciB0aGUgbW9udGggYW5kIHllYXIgdmlld1xuICAgICAqICovXG4gICAgQElucHV0KClcbiAgICBkYXRlRmlsdGVyOiAoZGF0ZTogVCkgPT4gYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgZmlyc3QgZGF5IG9mIHdlZWtcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cbiAgICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICAgIHByaXZhdGUgX21pbkRhdGU6IFQgfCBudWxsO1xuXG4gICAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgICBwcml2YXRlIF9tYXhEYXRlOiBUIHwgbnVsbDtcblxuICAgIC8qKiBUaGUgY3VycmVudCBwaWNrZXIgbW9tZW50ICovXG4gICAgcHJpdmF0ZSBfcGlja2VyTW9tZW50OiBUO1xuXG4gICAgQElucHV0KClcbiAgICBzZWxlY3RNb2RlOiBTZWxlY3RNb2RlO1xuXG4gICAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgbW9tZW50LiAqL1xuICAgIHByaXZhdGUgX3NlbGVjdGVkOiBUIHwgbnVsbDtcblxuICAgIHByaXZhdGUgX3NlbGVjdGVkczogVFtdID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzdGFydFZpZXc6IERhdGVWaWV3VHlwZSA9IERhdGVWaWV3Lk1PTlRIO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBzaG91bGQgb25seSB0aGUgeWVhciBhbmQgbXVsdGkteWVhciB2aWV3cy5cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHllYXJPbmx5ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHNob3VsZCBvbmx5IHRoZSBtdWx0aS15ZWFyIHZpZXcuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBtdWx0aXllYXJPbmx5ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGhpZGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGF0IHRoZSBzdGFydCBvciBlbmQgb2YgdGhlIGN1cnJlbnQgbW9udGguXG4gICAgICogKi9cbiAgICBASW5wdXQoKVxuICAgIGhpZGVPdGhlck1vbnRoczogYm9vbGVhbjtcblxuICAgIC8qKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50bHkgcGlja2VyIG1vbWVudCBjaGFuZ2VzLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHBpY2tlck1vbWVudENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIC8qKiBFbWl0cyB3aGVuIHRoZSBzZWxlY3RlZCBkYXRlIGNoYW5nZXMuICovXG4gICAgQE91dHB1dCgpXG4gICAgcmVhZG9ubHkgZGF0ZUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KCk7XG5cbiAgICAvKiogRW1pdHMgd2hlbiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUgY2hhbmdlcy4gKi9cbiAgICBAT3V0cHV0KClcbiAgICByZWFkb25seSBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIC8qKiBFbWl0cyB3aGVuIGFueSBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHJlYWRvbmx5IHVzZXJTZWxlY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhci4gVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlXG4gICAgICogKi9cbiAgICBAT3V0cHV0KClcbiAgICByZWFkb25seSB5ZWFyU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyB0aGUgc2VsZWN0ZWQgbW9udGguIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZVxuICAgICAqICovXG4gICAgQE91dHB1dCgpXG4gICAgcmVhZG9ubHkgbW9udGhTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIHByaXZhdGUgX2N1cnJlbnRWaWV3OiBEYXRlVmlld1R5cGU7XG5cbiAgICBwcml2YXRlIGludGxDaGFuZ2VzU3ViID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gICAgLyoqXG4gICAgICogVXNlZCBmb3Igc2NoZWR1bGluZyB0aGF0IGZvY3VzIHNob3VsZCBiZSBtb3ZlZCB0byB0aGUgYWN0aXZlIGNlbGwgb24gdGhlIG5leHQgdGljay5cbiAgICAgKiBXZSBuZWVkIHRvIHNjaGVkdWxlIGl0LCByYXRoZXIgdGhhbiBkbyBpdCBpbW1lZGlhdGVseSwgYmVjYXVzZSB3ZSBoYXZlIHRvIHdhaXRcbiAgICAgKiBmb3IgQW5ndWxhciB0byByZS1ldmFsdWF0ZSB0aGUgdmlldyBjaGlsZHJlbi5cbiAgICAgKi9cbiAgICBwcml2YXRlIG1vdmVGb2N1c09uTmV4dFRpY2sgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIERhdGUgZmlsdGVyIGZvciB0aGUgbW9udGggYW5kIHllYXIgdmlld1xuICAgICAqL1xuICAgIHB1YmxpYyBkYXRlRmlsdGVyRm9yVmlld3MgPSAoZGF0ZTogVCkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgISFkYXRlICYmXG4gICAgICAgICAgICAoIXRoaXMuZGF0ZUZpbHRlciB8fCB0aGlzLmRhdGVGaWx0ZXIoZGF0ZSkpICYmXG4gICAgICAgICAgICAoIXRoaXMubWluRGF0ZSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNvbXBhcmUoZGF0ZSwgdGhpcy5taW5EYXRlKSA+PSAwKSAmJlxuICAgICAgICAgICAgKCF0aGlzLm1heERhdGUgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5jb21wYXJlKGRhdGUsIHRoaXMubWF4RGF0ZSkgPD0gMClcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRWaWV3ID0gdGhpcy5zdGFydFZpZXc7XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMubW92ZUZvY3VzT25OZXh0VGljaykge1xuICAgICAgICAgICAgdGhpcy5tb3ZlRm9jdXNPbk5leHRUaWNrID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmludGxDaGFuZ2VzU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIGJldHdlZW4gbW9udGggdmlldyBhbmQgeWVhciB2aWV3XG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZVZpZXdzKCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV4dFZpZXcgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFZpZXcgPT09IERhdGVWaWV3Lk1PTlRIKSB7XG4gICAgICAgICAgICBuZXh0VmlldyA9IERhdGVWaWV3Lk1VTFRJX1lFQVJTO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMubXVsdGl5ZWFyT25seSkge1xuICAgICAgICAgICAgICAgIG5leHRWaWV3ID0gRGF0ZVZpZXcuTVVMVElfWUVBUlM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMueWVhck9ubHkpIHtcbiAgICAgICAgICAgICAgICBuZXh0VmlldyA9IHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlVmlldy5ZRUFSID8gRGF0ZVZpZXcuTVVMVElfWUVBUlMgOiBEYXRlVmlldy5ZRUFSO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0VmlldyA9IERhdGVWaWV3Lk1PTlRIO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSBuZXh0VmlldztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHVzZXIgY2xpY2tzIG9uIHRoZSBwcmV2aW91cyBidXR0b24uXG4gICAgICogKi9cbiAgICBwdWJsaWMgcHJldmlvdXNDbGlja2VkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBpY2tlck1vbWVudCA9IHRoaXMuaXNNb250aFZpZXdcbiAgICAgICAgICAgID8gdGhpcy5kYXRlVGltZUFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5waWNrZXJNb21lbnQsIC0xKVxuICAgICAgICAgICAgOiB0aGlzLmRhdGVUaW1lQWRhcHRlci5hZGRDYWxlbmRhclllYXJzKHRoaXMucGlja2VyTW9tZW50LCAtMSk7XG5cbiAgICAgICAgdGhpcy5waWNrZXJNb21lbnRDaGFuZ2UuZW1pdCh0aGlzLnBpY2tlck1vbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB1c2VyIGNsaWNrcyBvbiB0aGUgbmV4dCBidXR0b24uXG4gICAgICogKi9cbiAgICBwdWJsaWMgbmV4dENsaWNrZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGlja2VyTW9tZW50ID0gdGhpcy5pc01vbnRoVmlld1xuICAgICAgICAgICAgPyB0aGlzLmRhdGVUaW1lQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLnBpY2tlck1vbWVudCwgMSlcbiAgICAgICAgICAgIDogdGhpcy5kYXRlVGltZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLnBpY2tlck1vbWVudCwgMSk7XG5cbiAgICAgICAgdGhpcy5waWNrZXJNb21lbnRDaGFuZ2UuZW1pdCh0aGlzLnBpY2tlck1vbWVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRhdGVTZWxlY3RlZChkYXRlOiBUKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5kYXRlRmlsdGVyRm9yVmlld3MoZGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGF0ZUNsaWNrZWQuZW1pdChkYXRlKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KGRhdGUpO1xuXG4gICAgICAgIC8qaWYgKCh0aGlzLmlzSW5TaW5nbGVNb2RlICYmICF0aGlzLmRhdGVUaW1lQWRhcHRlci5pc1NhbWVEYXkoZGF0ZSwgdGhpcy5zZWxlY3RlZCkpIHx8XG4gICAgICAgICAgICB0aGlzLmlzSW5SYW5nZU1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChkYXRlKTtcbiAgICAgICAgfSovXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBwaWNrZXJNb21lbnQgdmFsdWUgYW5kIHN3aXRjaCB0byBhIHNwZWNpZmljIHZpZXdcbiAgICAgKi9cbiAgICBwdWJsaWMgZ29Ub0RhdGVJblZpZXcoXG4gICAgICAgIGRhdGU6IFQsXG4gICAgICAgIHZpZXc6IERhdGVWaWV3VHlwZVxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLmhhbmRsZVBpY2tlck1vbWVudENoYW5nZShkYXRlKTtcbiAgICAgICAgaWYgKCghdGhpcy55ZWFyT25seSAmJiAhdGhpcy5tdWx0aXllYXJPbmx5KSB8fFxuICAgICAgICAgICAgKHRoaXMubXVsdGl5ZWFyT25seSAmJiAodmlldyAhPT0gRGF0ZVZpZXcuTU9OVEggJiYgdmlldyAhPT0gRGF0ZVZpZXcuWUVBUikpIHx8XG4gICAgICAgICAgICAodGhpcy55ZWFyT25seSAmJiB2aWV3ICE9PSBEYXRlVmlldy5NT05USCkpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB2aWV3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHBpY2tlck1vbWVudCB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVQaWNrZXJNb21lbnRDaGFuZ2UoZGF0ZTogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBpY2tlck1vbWVudCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNsYW1wRGF0ZShcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICB0aGlzLm1pbkRhdGUsXG4gICAgICAgICAgICB0aGlzLm1heERhdGVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5waWNrZXJNb21lbnRDaGFuZ2UuZW1pdCh0aGlzLnBpY2tlck1vbWVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXNlclNlbGVjdGVkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVzZXJTZWxlY3Rpb24uZW1pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIHByZXZpb3VzIHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcHJldkJ1dHRvbkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAhdGhpcy5taW5EYXRlIHx8ICF0aGlzLmlzU2FtZVZpZXcodGhpcy5waWNrZXJNb21lbnQsIHRoaXMubWluRGF0ZSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBuZXh0IHBlcmlvZCBidXR0b24gaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmV4dEJ1dHRvbkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAhdGhpcy5tYXhEYXRlIHx8ICF0aGlzLmlzU2FtZVZpZXcodGhpcy5waWNrZXJNb21lbnQsIHRoaXMubWF4RGF0ZSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb2N1cyB0byB0aGUgaG9zdCBlbGVtZW50XG4gICAgICogKi9cbiAgICBwdWJsaWMgZm9jdXNBY3RpdmVDZWxsKCkge1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5vblN0YWJsZVxuICAgICAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxtUmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCcub3dsLWR0LWNhbGVuZGFyLWNlbGwtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0WWVhckluTXVsdGlZZWFyVmlldyhub3JtYWxpemVkWWVhcjogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRZZWFyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VsZWN0TW9udGhJblllYXJWaWV3KG5vcm1hbGl6ZWRNb250aDogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vbnRoU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkTW9udGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIHR3byBkYXRlcyByZXByZXNlbnQgdGhlIHNhbWUgdmlldyBpbiB0aGUgY3VycmVudCB2aWV3IG1vZGUgKG1vbnRoIG9yIHllYXIpLlxuICAgICAqL1xuICAgIHByaXZhdGUgaXNTYW1lVmlldyhkYXRlMTogVCwgZGF0ZTI6IFQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRWaWV3ID09PSBEYXRlVmlldy5NT05USCkge1xuICAgICAgICAgICAgcmV0dXJuICEhKFxuICAgICAgICAgICAgICAgIGRhdGUxICYmXG4gICAgICAgICAgICAgICAgZGF0ZTIgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKGRhdGUxKSA9PT1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKGRhdGUyKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1vbnRoKGRhdGUxKSA9PT1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNb250aChkYXRlMilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VycmVudFZpZXcgPT09IERhdGVWaWV3LllFQVIpIHtcbiAgICAgICAgICAgIHJldHVybiAhIShcbiAgICAgICAgICAgICAgICBkYXRlMSAmJlxuICAgICAgICAgICAgICAgIGRhdGUyICYmXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMSkgPT09XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcihkYXRlMilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSB2YWxpZCBkYXRlIG9iamVjdFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VmFsaWREYXRlKG9iajogYW55KTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJlxuICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5pc1ZhbGlkKG9iailcbiAgICAgICAgICAgID8gb2JqXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm93bC1kdC1jYWxlbmRhci1jb250cm9sXCI+XG4gICAgPCEtLSBmb2N1cyB3aGVuIGtleWJvYXJkIHRhYiAoaHR0cDovL2tpenUucnUvZW4vYmxvZy9rZXlib2FyZC1vbmx5LWZvY3VzLyN4KSAtLT5cbiAgICA8YnV0dG9uIGNsYXNzPVwib3dsLWR0LWNvbnRyb2wgb3dsLWR0LWNvbnRyb2wtYnV0dG9uIG93bC1kdC1jb250cm9sLWFycm93LWJ1dHRvblwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgIFtzdHlsZS52aXNpYmlsaXR5XT1cInNob3dDb250cm9sQXJyb3dzPyAndmlzaWJsZSc6ICdoaWRkZW4nXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCIhcHJldkJ1dHRvbkVuYWJsZWQoKVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInByZXZCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAoY2xpY2spPVwicHJldmlvdXNDbGlja2VkKClcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1jb250ZW50IG93bC1kdC1jb250cm9sLWJ1dHRvbi1jb250ZW50XCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgPCEtLSA8ZWRpdG9yLWZvbGQgZGVzYz1cIlNWRyBBcnJvdyBMZWZ0XCI+IC0tPlxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICAgICAgICAgICB2ZXJzaW9uPVwiMS4xXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDI1MC43MzggMjUwLjczOFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNTAuNzM4IDI1MC43Mzg7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIlxuICAgICAgICAgICAgICAgICB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggc3R5bGU9XCJmaWxsLXJ1bGU6IGV2ZW5vZGQ7IGNsaXAtcnVsZTogZXZlbm9kZDtcIiBkPVwiTTk2LjYzMywxMjUuMzY5bDk1LjA1My05NC41MzNjNy4xMDEtNy4wNTUsNy4xMDEtMTguNDkyLDAtMjUuNTQ2ICAgYy03LjEtNy4wNTQtMTguNjEzLTcuMDU0LTI1LjcxNCwwTDU4Ljk4OSwxMTEuNjg5Yy0zLjc4NCwzLjc1OS01LjQ4Nyw4Ljc1OS01LjIzOCwxMy42OGMtMC4yNDksNC45MjIsMS40NTQsOS45MjEsNS4yMzgsMTMuNjgxICAgbDEwNi45ODMsMTA2LjM5OGM3LjEwMSw3LjA1NSwxOC42MTMsNy4wNTUsMjUuNzE0LDBjNy4xMDEtNy4wNTQsNy4xMDEtMTguNDkxLDAtMjUuNTQ0TDk2LjYzMywxMjUuMzY5elwiLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPCEtLSA8L2VkaXRvci1mb2xkPiAtLT5cbiAgICAgICAgPC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICAgIDxkaXYgY2xhc3M9XCJvd2wtZHQtY2FsZW5kYXItY29udHJvbC1jb250ZW50XCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJvd2wtZHQtY29udHJvbCBvd2wtZHQtY29udHJvbC1idXR0b24gb3dsLWR0LWNvbnRyb2wtcGVyaW9kLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJwZXJpb2RCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZVZpZXdzKClcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwib3dsLWR0LWNvbnRyb2wtY29udGVudCBvd2wtZHQtY29udHJvbC1idXR0b24tY29udGVudFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAgICAgICB7e3BlcmlvZEJ1dHRvblRleHR9fVxuXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1idXR0b24tYXJyb3dcIlxuICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwiJ3JvdGF0ZSgnICsgKGlzTW9udGhWaWV3PyAwIDogMTgwKSArJ2RlZyknXCI+XG4gICAgICAgICAgICAgICAgICAgIDwhLS0gPGVkaXRvci1mb2xkIGRlc2M9XCJTVkcgQXJyb3dcIj4gLS0+XG4gICAgICAgICAgICAgICAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCI1MCVcIiBoZWlnaHQ9XCI1MCVcIiB2aWV3Qm94PVwiMCAwIDI5Mi4zNjIgMjkyLjM2MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyOTIuMzYyIDI5Mi4zNjI7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0yODYuOTM1LDY5LjM3N2MtMy42MTQtMy42MTctNy44OTgtNS40MjQtMTIuODQ4LTUuNDI0SDE4LjI3NGMtNC45NTIsMC05LjIzMywxLjgwNy0xMi44NSw1LjQyNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDMS44MDcsNzIuOTk4LDAsNzcuMjc5LDAsODIuMjI4YzAsNC45NDgsMS44MDcsOS4yMjksNS40MjQsMTIuODQ3bDEyNy45MDcsMTI3LjkwN2MzLjYyMSwzLjYxNyw3LjkwMiw1LjQyOCwxMi44NSw1LjQyOFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzOS4yMzMtMS44MTEsMTIuODQ3LTUuNDI4TDI4Ni45MzUsOTUuMDc0YzMuNjEzLTMuNjE3LDUuNDI3LTcuODk4LDUuNDI3LTEyLjg0N0MyOTIuMzYyLDc3LjI3OSwyOTAuNTQ4LDcyLjk5OCwyODYuOTM1LDY5LjM3N3pcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICA8IS0tIDwvZWRpdG9yLWZvbGQ+IC0tPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPGJ1dHRvbiBjbGFzcz1cIm93bC1kdC1jb250cm9sIG93bC1kdC1jb250cm9sLWJ1dHRvbiBvd2wtZHQtY29udHJvbC1hcnJvdy1idXR0b25cIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICBbc3R5bGUudmlzaWJpbGl0eV09XCJzaG93Q29udHJvbEFycm93cz8gJ3Zpc2libGUnOiAnaGlkZGVuJ1wiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiIW5leHRCdXR0b25FbmFibGVkKClcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJuZXh0QnV0dG9uTGFiZWxcIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm5leHRDbGlja2VkKClcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1jb250ZW50IG93bC1kdC1jb250cm9sLWJ1dHRvbi1jb250ZW50XCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgPCEtLSA8ZWRpdG9yLWZvbGQgZGVzYz1cIlNWRyBBcnJvdyBSaWdodFwiPiAtLT5cbiAgICAgICAgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcbiAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNTAuNzM4IDI1MC43MzhcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4O1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgICAgICAgICAgPHBhdGggc3R5bGU9XCJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtcIiBkPVwiTTE5MS43NSwxMTEuNjg5TDg0Ljc2Niw1LjI5MWMtNy4xLTcuMDU1LTE4LjYxMy03LjA1NS0yNS43MTMsMFxuICAgICAgICAgICAgICAgICAgICBjLTcuMTAxLDcuMDU0LTcuMTAxLDE4LjQ5LDAsMjUuNTQ0bDk1LjA1Myw5NC41MzRsLTk1LjA1Myw5NC41MzNjLTcuMTAxLDcuMDU0LTcuMTAxLDE4LjQ5MSwwLDI1LjU0NVxuICAgICAgICAgICAgICAgICAgICBjNy4xLDcuMDU0LDE4LjYxMyw3LjA1NCwyNS43MTMsMEwxOTEuNzUsMTM5LjA1YzMuNzg0LTMuNzU5LDUuNDg3LTguNzU5LDUuMjM4LTEzLjY4MVxuICAgICAgICAgICAgICAgICAgICBDMTk3LjIzNywxMjAuNDQ3LDE5NS41MzQsMTE1LjQ0OCwxOTEuNzUsMTExLjY4OXpcIi8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwhLS0gPC9lZGl0b3ItZm9sZD4gLS0+XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cIm93bC1kdC1jYWxlbmRhci1tYWluXCIgY2RrTW9uaXRvclN1YnRyZWVGb2N1cyBbbmdTd2l0Y2hdPVwiY3VycmVudFZpZXdcIiB0YWJpbmRleD1cIi0xXCI+XG4gICAgPG93bC1kYXRlLXRpbWUtbW9udGgtdmlld1xuICAgICAgICAgICAgKm5nU3dpdGNoQ2FzZT1cIkRhdGVWaWV3Lk1PTlRIXCJcbiAgICAgICAgICAgIFtwaWNrZXJNb21lbnRdPVwicGlja2VyTW9tZW50XCJcbiAgICAgICAgICAgIFtmaXJzdERheU9mV2Vla109XCJmaXJzdERheU9mV2Vla1wiXG4gICAgICAgICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgICAgICAgW3NlbGVjdGVkc109XCJzZWxlY3RlZHNcIlxuICAgICAgICAgICAgW3NlbGVjdE1vZGVdPVwic2VsZWN0TW9kZVwiXG4gICAgICAgICAgICBbbWluRGF0ZV09XCJtaW5EYXRlXCJcbiAgICAgICAgICAgIFttYXhEYXRlXT1cIm1heERhdGVcIlxuICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgICAgICAgICBbaGlkZU90aGVyTW9udGhzXT1cImhpZGVPdGhlck1vbnRoc1wiXG4gICAgICAgICAgICAocGlja2VyTW9tZW50Q2hhbmdlKT1cImhhbmRsZVBpY2tlck1vbWVudENoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIChzZWxlY3RlZENoYW5nZSk9XCJkYXRlU2VsZWN0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgICAodXNlclNlbGVjdGlvbik9XCJ1c2VyU2VsZWN0ZWQoKVwiPjwvb3dsLWRhdGUtdGltZS1tb250aC12aWV3PlxuXG4gICAgPG93bC1kYXRlLXRpbWUteWVhci12aWV3XG4gICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiRGF0ZVZpZXcuWUVBUlwiXG4gICAgICAgICAgICBbcGlja2VyTW9tZW50XT1cInBpY2tlck1vbWVudFwiXG4gICAgICAgICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgICAgICAgW3NlbGVjdGVkc109XCJzZWxlY3RlZHNcIlxuICAgICAgICAgICAgW3NlbGVjdE1vZGVdPVwic2VsZWN0TW9kZVwiXG4gICAgICAgICAgICBbbWluRGF0ZV09XCJtaW5EYXRlXCJcbiAgICAgICAgICAgIFttYXhEYXRlXT1cIm1heERhdGVcIlxuICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZUZpbHRlclwiXG4gICAgICAgICAgICAoa2V5Ym9hcmRFbnRlcik9XCJmb2N1c0FjdGl2ZUNlbGwoKVwiXG4gICAgICAgICAgICAocGlja2VyTW9tZW50Q2hhbmdlKT1cImhhbmRsZVBpY2tlck1vbWVudENoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIChtb250aFNlbGVjdGVkKT1cInNlbGVjdE1vbnRoSW5ZZWFyVmlldygkZXZlbnQpXCJcbiAgICAgICAgICAgIChjaGFuZ2UpPVwiZ29Ub0RhdGVJblZpZXcoJGV2ZW50LCBEYXRlVmlldy5NT05USClcIj48L293bC1kYXRlLXRpbWUteWVhci12aWV3PlxuXG4gICAgPG93bC1kYXRlLXRpbWUtbXVsdGkteWVhci12aWV3XG4gICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiRGF0ZVZpZXcuTVVMVElfWUVBUlNcIlxuICAgICAgICAgICAgW3BpY2tlck1vbWVudF09XCJwaWNrZXJNb21lbnRcIlxuICAgICAgICAgICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICAgICAgICAgIFtzZWxlY3RlZHNdPVwic2VsZWN0ZWRzXCJcbiAgICAgICAgICAgIFtzZWxlY3RNb2RlXT1cInNlbGVjdE1vZGVcIlxuICAgICAgICAgICAgW21pbkRhdGVdPVwibWluRGF0ZVwiXG4gICAgICAgICAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICAgICAgICAgIFtkYXRlRmlsdGVyXT1cImRhdGVGaWx0ZXJcIlxuICAgICAgICAgICAgKGtleWJvYXJkRW50ZXIpPVwiZm9jdXNBY3RpdmVDZWxsKClcIlxuICAgICAgICAgICAgKHBpY2tlck1vbWVudENoYW5nZSk9XCJoYW5kbGVQaWNrZXJNb21lbnRDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICAoeWVhclNlbGVjdGVkKT1cInNlbGVjdFllYXJJbk11bHRpWWVhclZpZXcoJGV2ZW50KVwiXG4gICAgICAgICAgICAoY2hhbmdlKT1cImdvVG9EYXRlSW5WaWV3KCRldmVudCwgRGF0ZVZpZXcuWUVBUilcIj48L293bC1kYXRlLXRpbWUtbXVsdGkteWVhci12aWV3PlxuPC9kaXY+XG4iXX0=