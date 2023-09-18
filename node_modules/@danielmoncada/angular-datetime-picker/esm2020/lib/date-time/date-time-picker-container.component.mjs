/**
 * date-time-picker-container.component
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Optional, ViewChild } from '@angular/core';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { OwlCalendarComponent } from './calendar.component';
import { OwlTimerComponent } from './timer.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { Subject } from 'rxjs';
import { owlDateTimePickerAnimations } from './date-time-picker.animations';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import * as i0 from "@angular/core";
import * as i1 from "./date-time-picker-intl.service";
import * as i2 from "./adapter/date-time-adapter.class";
import * as i3 from "./calendar.component";
import * as i4 from "./timer.component";
import * as i5 from "@angular/cdk/a11y";
import * as i6 from "@angular/common";
export class OwlDateTimeContainerComponent {
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
OwlDateTimeContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeContainerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.OwlDateTimeIntl }, { token: i2.DateTimeAdapter, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDateTimeContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeContainerComponent, selector: "owl-date-time-container", host: { listeners: { "@transformPicker.done": "handleContainerAnimationDone($event)" }, properties: { "class.owl-dt-container": "owlDTContainerClass", "class.owl-dt-popup-container": "owlDTPopupContainerClass", "class.owl-dt-dialog-container": "owlDTDialogContainerClass", "class.owl-dt-inline-container": "owlDTInlineContainerClass", "class.owl-dt-container-disabled": "owlDTContainerDisabledClass", "attr.id": "owlDTContainerId", "@transformPicker": "owlDTContainerAnimation" } }, viewQueries: [{ propertyName: "calendar", first: true, predicate: OwlCalendarComponent, descendants: true }, { propertyName: "timer", first: true, predicate: OwlTimerComponent, descendants: true }], exportAs: ["owlDateTimeContainer"], ngImport: i0, template: "<div [cdkTrapFocus]=\"picker.pickerMode !== 'inline'\"\n     [@fadeInPicker]=\"picker.pickerMode === 'inline'? '' : 'enter'\"\n     class=\"owl-dt-container-inner\">\n\n    <owl-date-time-calendar\n            *ngIf=\"pickerType === 'both' || pickerType === 'calendar'\"\n            class=\"owl-dt-container-row\"\n            [firstDayOfWeek]=\"picker.firstDayOfWeek\"\n            [(pickerMoment)]=\"pickerMoment\"\n            [selected]=\"picker.selected\"\n            [selecteds]=\"picker.selecteds\"\n            [selectMode]=\"picker.selectMode\"\n            [minDate]=\"picker.minDateTime\"\n            [maxDate]=\"picker.maxDateTime\"\n            [dateFilter]=\"picker.dateTimeFilter\"\n            [startView]=\"picker.startView\"\n            [yearOnly]=\"picker.yearOnly\"\n            [multiyearOnly]=\"picker.multiyearOnly\"\n            [hideOtherMonths]=\"picker.hideOtherMonths\"\n            (yearSelected)=\"picker.selectYear($event)\"\n            (monthSelected)=\"picker.selectMonth($event)\"\n            (dateClicked)=\"picker.selectDate($event)\"\n            (selectedChange)=\"dateSelected($event)\"></owl-date-time-calendar>\n\n    <owl-date-time-timer\n            *ngIf=\"pickerType === 'both' || pickerType === 'timer'\"\n            class=\"owl-dt-container-row\"\n            [pickerMoment]=\"pickerMoment\"\n            [minDateTime]=\"picker.minDateTime\"\n            [maxDateTime]=\"picker.maxDateTime\"\n            [showSecondsTimer]=\"picker.showSecondsTimer\"\n            [hour12Timer]=\"picker.hour12Timer\"\n            [stepHour]=\"picker.stepHour\"\n            [stepMinute]=\"picker.stepMinute\"\n            [stepSecond]=\"picker.stepSecond\"\n            (selectedChange)=\"timeSelected($event)\"></owl-date-time-timer>\n\n    <div *ngIf=\"picker.isInRangeMode\"\n         role=\"radiogroup\"\n         class=\"owl-dt-container-info owl-dt-container-row\">\n        <div role=\"radio\" [tabindex]=\"activeSelectedIndex === 0 ? 0 : -1\"\n             [attr.aria-checked]=\"activeSelectedIndex === 0\"\n             class=\"owl-dt-control owl-dt-container-range owl-dt-container-from\"\n             [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 0}\"\n             (click)=\"handleClickOnInfoGroup($event, 0)\"\n             (keydown)=\"handleKeydownOnInfoGroup($event, to, 0)\" #from>\n            <span class=\"owl-dt-control-content owl-dt-container-range-content\" tabindex=\"-1\">\n                <span class=\"owl-dt-container-info-label\">{{fromLabel}}:</span>\n                <span class=\"owl-dt-container-info-value\">{{fromFormattedValue}}</span>\n            </span>\n        </div>\n        <div role=\"radio\" [tabindex]=\"activeSelectedIndex === 1 ? 0 : -1\"\n             [attr.aria-checked]=\"activeSelectedIndex === 1\"\n             class=\"owl-dt-control owl-dt-container-range owl-dt-container-to\"\n             [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 1}\"\n             (click)=\"handleClickOnInfoGroup($event, 1)\"\n             (keydown)=\"handleKeydownOnInfoGroup($event, from, 1)\" #to>\n            <span class=\"owl-dt-control-content owl-dt-container-range-content\" tabindex=\"-1\">\n                <span class=\"owl-dt-container-info-label\">{{toLabel}}:</span>\n                <span class=\"owl-dt-container-info-value\">{{toFormattedValue}}</span>\n            </span>\n        </div>\n    </div>\n\n    <div *ngIf=\"showControlButtons\" class=\"owl-dt-container-buttons owl-dt-container-row\">\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-container-control-button\"\n                type=\"button\" tabindex=\"0\"\n                (click)=\"onCancelClicked($event)\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{cancelLabel}}\n            </span>\n        </button>\n        <button class=\"owl-dt-control owl-dt-control-button owl-dt-container-control-button\"\n                type=\"button\" tabindex=\"0\"\n                (click)=\"onSetClicked($event)\">\n            <span class=\"owl-dt-control-content owl-dt-control-button-content\" tabindex=\"-1\">\n                {{setLabel}}\n            </span>\n        </button>\n    </div>\n</div>\n", styles: [""], components: [{ type: i3.OwlCalendarComponent, selector: "owl-date-time-calendar", inputs: ["minDate", "maxDate", "pickerMoment", "selected", "selecteds", "dateFilter", "firstDayOfWeek", "selectMode", "startView", "yearOnly", "multiyearOnly", "hideOtherMonths"], outputs: ["pickerMomentChange", "dateClicked", "selectedChange", "userSelection", "yearSelected", "monthSelected"], exportAs: ["owlDateTimeCalendar"] }, { type: i4.OwlTimerComponent, selector: "owl-date-time-timer", inputs: ["pickerMoment", "minDateTime", "maxDateTime", "showSecondsTimer", "hour12Timer", "stepHour", "stepMinute", "stepSecond"], outputs: ["selectedChange"], exportAs: ["owlDateTimeTimer"] }], directives: [{ type: i5.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [
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
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.OwlDateTimeIntl }, { type: i2.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { calendar: [{
                type: ViewChild,
                args: [OwlCalendarComponent]
            }], timer: [{
                type: ViewChild,
                args: [OwlTimerComponent]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXBpY2tlci1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGlja2VyL3NyYy9saWIvZGF0ZS10aW1lL2RhdGUtdGltZS1waWNrZXItY29udGFpbmVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BpY2tlci9zcmMvbGliL2RhdGUtdGltZS9kYXRlLXRpbWUtcGlja2VyLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFHSCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBRVYsUUFBUSxFQUNSLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXBFLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDNUUsT0FBTyxFQUNILFVBQVUsRUFDVixVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEVBQ1gsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7Ozs7QUF3Qi9CLE1BQU0sT0FBTyw2QkFBNkI7SUFzSnRDLFlBQXFCLEtBQXdCLEVBQ3ZCLE1BQWtCLEVBQ2xCLFVBQTJCLEVBQ2hCLGVBQW1DO1FBSC9DLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3ZCLFdBQU0sR0FBTixNQUFNLENBQVk7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDaEIsb0JBQWUsR0FBZixlQUFlLENBQW9CO1FBako3RCx3QkFBbUIsR0FBRyxDQUFDLENBQUMsQ0FBQyw2RUFBNkU7UUFNN0c7O2FBRUs7UUFDRyxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFNekM7O2FBRUs7UUFDRyxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBTXRDLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztJQTBIM0MsQ0FBQztJQXZJRCxJQUFJLGdCQUFnQjtRQUNoQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQU9ELElBQUkscUJBQXFCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFJRCxJQUFJLGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQVFELElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJLFlBQVksQ0FBQyxLQUFRO1FBQ3JCLElBQUksS0FBSyxFQUFFO1lBQ1AsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUNuRCxLQUFLLEVBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUMxQixDQUFDO1NBQ0w7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7U0FFSztJQUNMLElBQUksU0FBUztRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDMUMsQ0FBQztJQUVEOztTQUVLO0lBQ0wsSUFBSSxPQUFPO1FBQ1AsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQztJQUN4QyxDQUFDO0lBRUQ7O1NBRUs7SUFDTCxJQUFJLGtCQUFrQjtRQUNsQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLEtBQUs7WUFDUixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQzlELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDYixDQUFDO0lBRUQ7O1NBRUs7SUFDTCxJQUFJLGdCQUFnQjtRQUNoQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxPQUFPLEtBQUs7WUFDUixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQzlELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7U0FJSztJQUNMLElBQUksa0JBQWtCO1FBQ2xCLE9BQU8sQ0FDSCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxRQUFRO1lBQ25DLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssVUFBVTtnQkFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQzNDLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxtQkFBbUI7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELElBQUksd0JBQXdCO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0lBQzlDLENBQUM7SUFFRCxJQUFJLHlCQUF5QjtRQUN6QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSx5QkFBeUI7UUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksMkJBQTJCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksZ0JBQWdCO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksdUJBQXVCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM5RCxDQUFDO0lBUU0sUUFBUTtRQUNYLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssT0FBTyxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvRTtZQUNELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3RTtTQUNKO0lBQ0wsQ0FBQztJQUVNLGtCQUFrQjtRQUNyQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLGVBQWU7UUFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSw0QkFBNEIsQ0FBQyxLQUFxQjtRQUNyRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzlCLElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRTtZQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFPO1FBQ3ZCLElBQUksTUFBTSxDQUFDO1FBRVgsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLElBQUksTUFBTSxFQUFFO2dCQUNSLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO2dCQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM5QjtpQkFBTTtnQkFDSCxzRUFBc0U7Z0JBQ3RFLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMvQjthQUNKO1lBQ0QsT0FBTztTQUNWO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtZQUMzQixNQUFNLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQUksTUFBTSxFQUFFO2dCQUNSLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM5QjtTQUNKO0lBQ0wsQ0FBQztJQUVNLFlBQVksQ0FBQyxJQUFPO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNqRCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0QyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQzNCLE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTdDLDREQUE0RDtZQUM1RCwrREFBK0Q7WUFDL0QsSUFDSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxDQUFDO2dCQUMzQixTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUN4QixJQUFJLENBQUMsWUFBWSxFQUNqQixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQ2YsS0FBSyxDQUFDLENBQUM7Z0JBQ1osQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEtBQUssQ0FBQztvQkFDM0IsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FDeEIsSUFBSSxDQUFDLFlBQVksRUFDakIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUNmLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDZjtnQkFDRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDakMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDcEM7aUJBQU07Z0JBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDM0Q7WUFFRCxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDZCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25FO1lBQ0QsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqRTtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksZUFBZSxDQUFDLEtBQVU7UUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLE9BQU87SUFDWCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxZQUFZLENBQUMsS0FBVTtRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixPQUFPO0lBQ1gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksc0JBQXNCLENBQUMsS0FBVSxFQUFFLEtBQWE7UUFDbkQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksd0JBQXdCLENBQzNCLEtBQVUsRUFDVixJQUFTLEVBQ1QsS0FBYTtRQUViLFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNuQixLQUFLLFVBQVUsQ0FBQztZQUNoQixLQUFLLFdBQVcsQ0FBQztZQUNqQixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssVUFBVTtnQkFDWCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN4QixNQUFNO1lBRVYsS0FBSyxLQUFLO2dCQUNOLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU07WUFFVjtnQkFDSSxPQUFPO1NBQ2Q7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxzQkFBc0IsQ0FBQyxLQUFhO1FBQ3hDLElBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssT0FBTztZQUNsQyxJQUFJLENBQUMsbUJBQW1CLEtBQUssS0FBSyxFQUNwQztZQUNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7WUFFakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxRQUFRLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDNUQ7U0FDSjtRQUNELE9BQU87SUFDWCxDQUFDO0lBRU8sVUFBVTtRQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0RSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssd0JBQXdCLENBQUMsSUFBTztRQUNwQyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzVELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7O09BRUc7SUFDSyx1QkFBdUIsQ0FBQyxJQUFPO1FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELHlEQUF5RDtRQUN6RCw2QkFBNkI7UUFDN0IsbURBQW1EO1FBQ25ELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssT0FBTyxFQUFFO1lBQ3BDLElBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO2dCQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNO2dCQUM1QixDQUFDLEVBQUU7Z0JBQ0gsSUFBSTtnQkFDSixJQUFJLENBQUMsZUFBZSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ2xFO2dCQUNFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUMxQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQ2hDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQ2xELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDM0Q7cUJBQU0sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUMzQixFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQ2hDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFDakQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUNuRCxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDNUQ7cUJBQU07b0JBQ0gsRUFBRSxHQUFHLE1BQU0sQ0FBQztpQkFDZjtnQkFDRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO2FBQ2hDO2lCQUFNO2dCQUNILElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQ2xDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQ2xELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQ3BELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQ3ZELENBQUM7aUJBQ0w7cUJBQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUM3QixJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQ2xDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFDbkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUNyRCxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztpQkFDOUQ7cUJBQU07b0JBQ0gsSUFBSSxHQUFHLE1BQU0sQ0FBQztpQkFDakI7Z0JBQ0QsRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDVixJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0o7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFdBQVcsRUFBRTtZQUMvQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1lBRWQsb0VBQW9FO1lBQ3BFLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xELEVBQUUsR0FBRyxJQUFJLENBQUM7YUFDYjtTQUNKO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDN0MsRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUVaLHNFQUFzRTtZQUN0RSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwRCxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUVELE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLDBCQUEwQixDQUFDLElBQU87UUFDdEMsSUFBSSxNQUFNLENBQUM7UUFFWCxpRUFBaUU7UUFDakUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxNQUFNLEVBQUU7WUFDbkMsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQ25DLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFDbEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUNyRCxDQUFDO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUNuQyxNQUFNLEVBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUMxQixDQUFDO1NBQ0w7YUFBTTtZQUNILE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QztRQUVELDZCQUE2QjtRQUM3QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMvRCxDQUFDO0lBRUQ7O1NBRUs7SUFDRyxXQUFXO1FBQ2YsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyxRQUFRLEVBQUU7WUFDckMsT0FBTztTQUNWO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNuQzthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQzs7MEhBdGVRLDZCQUE2Qjs4R0FBN0IsNkJBQTZCLDRrQkFFM0Isb0JBQW9CLHdFQUVwQixpQkFBaUIsb0ZDekRoQyxzc0lBaUZBLCsrQkQzQ2dCO1FBQ1IsMkJBQTJCLENBQUMsZUFBZTtRQUMzQywyQkFBMkIsQ0FBQyxZQUFZO0tBQzNDOzJGQVlRLDZCQUE2QjtrQkF0QnpDLFNBQVM7K0JBQ0ksc0JBQXNCLFlBQ3RCLHlCQUF5QixtQkFHbEIsdUJBQXVCLENBQUMsTUFBTSx1QkFDMUIsS0FBSyxjQUNkO3dCQUNSLDJCQUEyQixDQUFDLGVBQWU7d0JBQzNDLDJCQUEyQixDQUFDLFlBQVk7cUJBQzNDLFFBQ0s7d0JBQ0YseUJBQXlCLEVBQUUsc0NBQXNDO3dCQUNqRSwwQkFBMEIsRUFBRSxxQkFBcUI7d0JBQ2pELGdDQUFnQyxFQUFFLDBCQUEwQjt3QkFDNUQsaUNBQWlDLEVBQUUsMkJBQTJCO3dCQUM5RCxpQ0FBaUMsRUFBRSwyQkFBMkI7d0JBQzlELG1DQUFtQyxFQUFFLDZCQUE2Qjt3QkFDbEUsV0FBVyxFQUFFLGtCQUFrQjt3QkFDL0Isb0JBQW9CLEVBQUUseUJBQXlCO3FCQUNsRDs7MEJBMkphLFFBQVE7NENBdEp0QixRQUFRO3NCQURQLFNBQVM7dUJBQUMsb0JBQW9CO2dCQUcvQixLQUFLO3NCQURKLFNBQVM7dUJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBkYXRlLXRpbWUtcGlja2VyLWNvbnRhaW5lci5jb21wb25lbnRcbiAqL1xuXG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBPbkluaXQsXG4gICAgT3B0aW9uYWwsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IE93bERhdGVUaW1lSW50bCB9IGZyb20gJy4vZGF0ZS10aW1lLXBpY2tlci1pbnRsLnNlcnZpY2UnO1xuaW1wb3J0IHsgT3dsQ2FsZW5kYXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPd2xUaW1lckNvbXBvbmVudCB9IGZyb20gJy4vdGltZXIuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVUaW1lQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlci9kYXRlLXRpbWUtYWRhcHRlci5jbGFzcyc7XG5pbXBvcnQgeyBPd2xEYXRlVGltZSwgUGlja2VyVHlwZSB9IGZyb20gJy4vZGF0ZS10aW1lLmNsYXNzJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG93bERhdGVUaW1lUGlja2VyQW5pbWF0aW9ucyB9IGZyb20gJy4vZGF0ZS10aW1lLXBpY2tlci5hbmltYXRpb25zJztcbmltcG9ydCB7XG4gICAgRE9XTl9BUlJPVyxcbiAgICBMRUZUX0FSUk9XLFxuICAgIFJJR0hUX0FSUk9XLFxuICAgIFNQQUNFLFxuICAgIFVQX0FSUk9XXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIGV4cG9ydEFzOiAnb3dsRGF0ZVRpbWVDb250YWluZXInLFxuICAgIHNlbGVjdG9yOiAnb3dsLWRhdGUtdGltZS1jb250YWluZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kYXRlLXRpbWUtcGlja2VyLWNvbnRhaW5lci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZGF0ZS10aW1lLXBpY2tlci1jb250YWluZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIG93bERhdGVUaW1lUGlja2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1QaWNrZXIsXG4gICAgICAgIG93bERhdGVUaW1lUGlja2VyQW5pbWF0aW9ucy5mYWRlSW5QaWNrZXJcbiAgICBdLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJyhAdHJhbnNmb3JtUGlja2VyLmRvbmUpJzogJ2hhbmRsZUNvbnRhaW5lckFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gICAgICAgICdbY2xhc3Mub3dsLWR0LWNvbnRhaW5lcl0nOiAnb3dsRFRDb250YWluZXJDbGFzcycsXG4gICAgICAgICdbY2xhc3Mub3dsLWR0LXBvcHVwLWNvbnRhaW5lcl0nOiAnb3dsRFRQb3B1cENvbnRhaW5lckNsYXNzJyxcbiAgICAgICAgJ1tjbGFzcy5vd2wtZHQtZGlhbG9nLWNvbnRhaW5lcl0nOiAnb3dsRFREaWFsb2dDb250YWluZXJDbGFzcycsXG4gICAgICAgICdbY2xhc3Mub3dsLWR0LWlubGluZS1jb250YWluZXJdJzogJ293bERUSW5saW5lQ29udGFpbmVyQ2xhc3MnLFxuICAgICAgICAnW2NsYXNzLm93bC1kdC1jb250YWluZXItZGlzYWJsZWRdJzogJ293bERUQ29udGFpbmVyRGlzYWJsZWRDbGFzcycsXG4gICAgICAgICdbYXR0ci5pZF0nOiAnb3dsRFRDb250YWluZXJJZCcsXG4gICAgICAgICdbQHRyYW5zZm9ybVBpY2tlcl0nOiAnb3dsRFRDb250YWluZXJBbmltYXRpb24nLFxuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgT3dsRGF0ZVRpbWVDb250YWluZXJDb21wb25lbnQ8VD5cbiAgICBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgQFZpZXdDaGlsZChPd2xDYWxlbmRhckNvbXBvbmVudClcbiAgICBjYWxlbmRhcjogT3dsQ2FsZW5kYXJDb21wb25lbnQ8VD47XG4gICAgQFZpZXdDaGlsZChPd2xUaW1lckNvbXBvbmVudClcbiAgICB0aW1lcjogT3dsVGltZXJDb21wb25lbnQ8VD47XG5cbiAgICBwdWJsaWMgcGlja2VyOiBPd2xEYXRlVGltZTxUPjtcbiAgICBwdWJsaWMgYWN0aXZlU2VsZWN0ZWRJbmRleCA9IDA7IC8vIFRoZSBjdXJyZW50IGFjdGl2ZSBTZWxlY3RlZEluZGV4IGluIHJhbmdlIHNlbGVjdCBtb2RlICgwOiAnZnJvbScsIDE6ICd0bycpXG5cbiAgICAvLyByZXRhaW4gc3RhcnQgYW5kIGVuZCB0aW1lXG4gICAgcHJpdmF0ZSByZXRhaW5TdGFydFRpbWU6IFQ7XG4gICAgcHJpdmF0ZSByZXRhaW5FbmRUaW1lOiBUO1xuICAgIFxuICAgIC8qKlxuICAgICAqIFN0cmVhbSBlbWl0cyB3aGVuIHRyeSB0byBoaWRlIHBpY2tlclxuICAgICAqICovXG4gICAgcHJpdmF0ZSBoaWRlUGlja2VyJCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIGdldCBoaWRlUGlja2VyU3RyZWFtKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpZGVQaWNrZXIkLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0cmVhbSBlbWl0cyB3aGVuIHRyeSB0byBjb25maXJtIHRoZSBzZWxlY3RlZCB2YWx1ZVxuICAgICAqICovXG4gICAgcHJpdmF0ZSBjb25maXJtU2VsZWN0ZWQkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgZ2V0IGNvbmZpcm1TZWxlY3RlZFN0cmVhbSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maXJtU2VsZWN0ZWQkLmFzT2JzZXJ2YWJsZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGlja2VyT3BlbmVkJCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIGdldCBwaWNrZXJPcGVuZWRTdHJlYW0oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja2VyT3BlbmVkJC5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCBwaWNrZXIgbW9tZW50LiBUaGlzIGRldGVybWluZXMgd2hpY2ggdGltZSBwZXJpb2QgaXMgc2hvd24gYW5kIHdoaWNoIGRhdGUgaXNcbiAgICAgKiBoaWdobGlnaHRlZCB3aGVuIHVzaW5nIGtleWJvYXJkIG5hdmlnYXRpb24uXG4gICAgICovXG4gICAgcHJpdmF0ZSBfY2xhbVBpY2tlck1vbWVudDogVDtcblxuICAgIGdldCBwaWNrZXJNb21lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGFtUGlja2VyTW9tZW50O1xuICAgIH1cblxuICAgIHNldCBwaWNrZXJNb21lbnQodmFsdWU6IFQpIHtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGFtUGlja2VyTW9tZW50ID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY2xhbXBEYXRlKFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyLm1pbkRhdGVUaW1lLFxuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyLm1heERhdGVUaW1lXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgZ2V0IHBpY2tlclR5cGUoKTogUGlja2VyVHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlci5waWNrZXJUeXBlO1xuICAgIH1cblxuICAgIGdldCBjYW5jZWxMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLmNhbmNlbEJ0bkxhYmVsO1xuICAgIH1cblxuICAgIGdldCBzZXRMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLnNldEJ0bkxhYmVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSByYW5nZSAnZnJvbScgbGFiZWxcbiAgICAgKiAqL1xuICAgIGdldCBmcm9tTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja2VySW50bC5yYW5nZUZyb21MYWJlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmFuZ2UgJ3RvJyBsYWJlbFxuICAgICAqICovXG4gICAgZ2V0IHRvTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja2VySW50bC5yYW5nZVRvTGFiZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHJhbmdlICdmcm9tJyBmb3JtYXR0ZWQgdmFsdWVcbiAgICAgKiAqL1xuICAgIGdldCBmcm9tRm9ybWF0dGVkVmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBpY2tlci5zZWxlY3RlZHNbMF07XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgICAgPyB0aGlzLmRhdGVUaW1lQWRhcHRlci5mb3JtYXQodmFsdWUsIHRoaXMucGlja2VyLmZvcm1hdFN0cmluZylcbiAgICAgICAgICAgIDogJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHJhbmdlICd0bycgZm9ybWF0dGVkIHZhbHVlXG4gICAgICogKi9cbiAgICBnZXQgdG9Gb3JtYXR0ZWRWYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGlja2VyLnNlbGVjdGVkc1sxXTtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICA/IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmZvcm1hdCh2YWx1ZSwgdGhpcy5waWNrZXIuZm9ybWF0U3RyaW5nKVxuICAgICAgICAgICAgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYXNlcyBpbiB3aGljaCB0aGUgY29udHJvbCBidXR0b25zIHNob3cgaW4gdGhlIHBpY2tlclxuICAgICAqIDEpIHBpY2tlciBtb2RlIGlzICdkaWFsb2cnXG4gICAgICogMikgcGlja2VyIHR5cGUgaXMgTk9UICdjYWxlbmRhcicgYW5kIHRoZSBwaWNrZXIgbW9kZSBpcyBOT1QgJ2lubGluZSdcbiAgICAgKiAqL1xuICAgIGdldCBzaG93Q29udHJvbEJ1dHRvbnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnBpY2tlci5waWNrZXJNb2RlID09PSAnZGlhbG9nJyB8fFxuICAgICAgICAgICAgKHRoaXMucGlja2VyLnBpY2tlclR5cGUgIT09ICdjYWxlbmRhcicgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlci5waWNrZXJNb2RlICE9PSAnaW5saW5lJylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgY29udGFpbmVyRWxtKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxtUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZ2V0IG93bERUQ29udGFpbmVyQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBvd2xEVFBvcHVwQ29udGFpbmVyQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlci5waWNrZXJNb2RlID09PSAncG9wdXAnO1xuICAgIH1cblxuICAgIGdldCBvd2xEVERpYWxvZ0NvbnRhaW5lckNsYXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXIucGlja2VyTW9kZSA9PT0gJ2RpYWxvZyc7XG4gICAgfVxuXG4gICAgZ2V0IG93bERUSW5saW5lQ29udGFpbmVyQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlci5waWNrZXJNb2RlID09PSAnaW5saW5lJztcbiAgICB9XG5cbiAgICBnZXQgb3dsRFRDb250YWluZXJEaXNhYmxlZENsYXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXIuZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgZ2V0IG93bERUQ29udGFpbmVySWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja2VyLmlkO1xuICAgIH1cblxuICAgIGdldCBvd2xEVENvbnRhaW5lckFuaW1hdGlvbigpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXIucGlja2VyTW9kZSA9PT0gJ2lubGluZScgPyAnJyA6ICdlbnRlcic7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBlbG1SZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgICAgICBwcml2YXRlIHBpY2tlckludGw6IE93bERhdGVUaW1lSW50bCxcbiAgICAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkYXRlVGltZUFkYXB0ZXI6IERhdGVUaW1lQWRhcHRlcjxUPiApIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnBpY2tlci5zZWxlY3RNb2RlID09PSAncmFuZ2UnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5waWNrZXIuc2VsZWN0ZWRzWzBdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXRhaW5TdGFydFRpbWUgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5jbG9uZSh0aGlzLnBpY2tlci5zZWxlY3RlZHNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VyLnNlbGVjdGVkc1sxXSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmV0YWluRW5kVGltZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNsb25lKHRoaXMucGlja2VyLnNlbGVjdGVkc1sxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmluaXRQaWNrZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvY3VzUGlja2VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUNvbnRhaW5lckFuaW1hdGlvbkRvbmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRvU3RhdGUgPSBldmVudC50b1N0YXRlO1xuICAgICAgICBpZiAodG9TdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgICAgICAgdGhpcy5waWNrZXJPcGVuZWQkLm5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBkYXRlU2VsZWN0ZWQoZGF0ZTogVCk6IHZvaWQge1xuICAgICAgICBsZXQgcmVzdWx0O1xuXG4gICAgICAgIGlmICh0aGlzLnBpY2tlci5pc0luU2luZ2xlTW9kZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5kYXRlU2VsZWN0ZWRJblNpbmdsZU1vZGUoZGF0ZSk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXJNb21lbnQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXIuc2VsZWN0KHJlc3VsdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHdlIGNsb3NlIHRoZSBwaWNrZXIgd2hlbiByZXN1bHQgaXMgbnVsbCBhbmQgcGlja2VyVHlwZSBpcyBjYWxlbmRhci5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5waWNrZXJUeXBlID09PSAnY2FsZW5kYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZVBpY2tlciQubmV4dChudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5waWNrZXIuaXNJblJhbmdlTW9kZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5kYXRlU2VsZWN0ZWRJblJhbmdlTW9kZShkYXRlKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlck1vbWVudCA9IHJlc3VsdFt0aGlzLmFjdGl2ZVNlbGVjdGVkSW5kZXhdO1xuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyLnNlbGVjdChyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHRpbWVTZWxlY3RlZCh0aW1lOiBUKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGlja2VyTW9tZW50ID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY2xvbmUodGltZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnBpY2tlci5kYXRlVGltZUNoZWNrZXIodGhpcy5waWNrZXJNb21lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5waWNrZXIuaXNJblNpbmdsZU1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMucGlja2VyLnNlbGVjdCh0aGlzLnBpY2tlck1vbWVudCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5waWNrZXIuaXNJblJhbmdlTW9kZSkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRzID0gWy4uLnRoaXMucGlja2VyLnNlbGVjdGVkc107XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSAnZnJvbScgaXMgYWZ0ZXIgJ3RvJyBvciAndG8naXMgYmVmb3JlICdmcm9tJ1xuICAgICAgICAgICAgLy8gSW4gdGhpcyBjYXNlLCB3ZSBzZXQgYm90aCB0aGUgJ2Zyb20nIGFuZCAndG8nIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKHRoaXMuYWN0aXZlU2VsZWN0ZWRJbmRleCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZHNbMV0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRzWzFdXG4gICAgICAgICAgICAgICAgICAgICkgPT09IDEpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuYWN0aXZlU2VsZWN0ZWRJbmRleCA9PT0gMSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZHNbMF0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRzWzBdXG4gICAgICAgICAgICAgICAgICAgICkgPT09IC0xKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRzWzBdID0gdGhpcy5waWNrZXJNb21lbnQ7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRzWzFdID0gdGhpcy5waWNrZXJNb21lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkc1t0aGlzLmFjdGl2ZVNlbGVjdGVkSW5kZXhdID0gdGhpcy5waWNrZXJNb21lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxlY3RlZHNbMF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJldGFpblN0YXJ0VGltZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNsb25lKHNlbGVjdGVkc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRzWzFdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXRhaW5FbmRUaW1lID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY2xvbmUoc2VsZWN0ZWRzWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGlja2VyLnNlbGVjdChzZWxlY3RlZHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNsaWNrIG9uIGNhbmNlbCBidXR0b25cbiAgICAgKi9cbiAgICBwdWJsaWMgb25DYW5jZWxDbGlja2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oaWRlUGlja2VyJC5uZXh0KG51bGwpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNsaWNrIG9uIHNldCBidXR0b25cbiAgICAgKi9cbiAgICBwdWJsaWMgb25TZXRDbGlja2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnBpY2tlci5kYXRlVGltZUNoZWNrZXIodGhpcy5waWNrZXJNb21lbnQpKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVQaWNrZXIkLm5leHQobnVsbCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maXJtU2VsZWN0ZWQkLm5leHQoZXZlbnQpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNsaWNrIG9uIGluZm9ybSByYWRpbyBncm91cFxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVDbGlja09uSW5mb0dyb3VwKGV2ZW50OiBhbnksIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRBY3RpdmVTZWxlY3RlZEluZGV4KGluZGV4KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNsaWNrIG9uIGluZm9ybSByYWRpbyBncm91cFxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVLZXlkb3duT25JbmZvR3JvdXAoXG4gICAgICAgIGV2ZW50OiBhbnksXG4gICAgICAgIG5leHQ6IGFueSxcbiAgICAgICAgaW5kZXg6IG51bWJlclxuICAgICk6IHZvaWQge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgRE9XTl9BUlJPVzpcbiAgICAgICAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICAgICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVNlbGVjdGVkSW5kZXgoaW5kZXggPT09IDAgPyAxIDogMCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVNlbGVjdGVkSW5kZXgoaW5kZXgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB2YWx1ZSBvZiBhY3RpdmVTZWxlY3RlZEluZGV4XG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRBY3RpdmVTZWxlY3RlZEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5waWNrZXIuc2VsZWN0TW9kZSA9PT0gJ3JhbmdlJyAmJlxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTZWxlY3RlZEluZGV4ICE9PSBpbmRleFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMucGlja2VyLnNlbGVjdGVkc1t0aGlzLmFjdGl2ZVNlbGVjdGVkSW5kZXhdO1xuICAgICAgICAgICAgaWYgKHRoaXMucGlja2VyLnNlbGVjdGVkcyAmJiBzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50ID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY2xvbmUoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRQaWNrZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGlja2VyTW9tZW50ID0gdGhpcy5waWNrZXIuc3RhcnRBdCB8fCB0aGlzLmRhdGVUaW1lQWRhcHRlci5ub3coKTtcbiAgICAgICAgdGhpcy5hY3RpdmVTZWxlY3RlZEluZGV4ID0gdGhpcy5waWNrZXIuc2VsZWN0TW9kZSA9PT0gJ3JhbmdlVG8nID8gMSA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IGNhbGVuZGFyIGRhdGUgaW4gc2luZ2xlIG1vZGUsXG4gICAgICogaXQgcmV0dXJucyBudWxsIHdoZW4gZGF0ZSBpcyBub3Qgc2VsZWN0ZWQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkYXRlU2VsZWN0ZWRJblNpbmdsZU1vZGUoZGF0ZTogVCk6IFQgfCBudWxsIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzU2FtZURheShkYXRlLCB0aGlzLnBpY2tlci5zZWxlY3RlZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlQW5kQ2hlY2tDYWxlbmRhckRhdGUoZGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VsZWN0IGRhdGVzIGluIHJhbmdlIE1vZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGRhdGVTZWxlY3RlZEluUmFuZ2VNb2RlKGRhdGU6IFQpOiBUW10gfCBudWxsIHtcbiAgICAgICAgbGV0IGZyb20gPSB0aGlzLnBpY2tlci5zZWxlY3RlZHNbMF07XG4gICAgICAgIGxldCB0byA9IHRoaXMucGlja2VyLnNlbGVjdGVkc1sxXTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnVwZGF0ZUFuZENoZWNrQ2FsZW5kYXJEYXRlKGRhdGUpO1xuXG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBnaXZlbiBjYWxlbmRhciBkYXkgaXMgYWZ0ZXIgb3IgZXF1YWwgdG8gJ2Zyb20nLFxuICAgICAgICAvLyBzZXQgdGhzIGdpdmVuIGRhdGUgYXMgJ3RvJ1xuICAgICAgICAvLyBvdGhlcndpc2UsIHNldCBpdCBhcyAnZnJvbScgYW5kIHNldCAndG8nIHRvIG51bGxcbiAgICAgICAgaWYgKHRoaXMucGlja2VyLnNlbGVjdE1vZGUgPT09ICdyYW5nZScpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlci5zZWxlY3RlZHMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnBpY2tlci5zZWxlY3RlZHMubGVuZ3RoICYmXG4gICAgICAgICAgICAgICAgIXRvICYmXG4gICAgICAgICAgICAgICAgZnJvbSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRpZmZlcmVuY2VJbkNhbGVuZGFyRGF5cyhyZXN1bHQsIGZyb20pID49IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBpY2tlci5lbmRBdCAmJiAhdGhpcy5yZXRhaW5FbmRUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY3JlYXRlRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFllYXIocmVzdWx0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1vbnRoKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXREYXRlKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRIb3Vycyh0aGlzLnBpY2tlci5lbmRBdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNaW51dGVzKHRoaXMucGlja2VyLmVuZEF0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFNlY29uZHModGhpcy5waWNrZXIuZW5kQXQpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmV0YWluRW5kVGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0byA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNyZWF0ZURhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRZZWFyKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNb250aChyZXN1bHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0RGF0ZShyZXN1bHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0SG91cnModGhpcy5yZXRhaW5FbmRUaW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1pbnV0ZXModGhpcy5yZXRhaW5FbmRUaW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFNlY29uZHModGhpcy5yZXRhaW5FbmRUaW1lKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG8gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlU2VsZWN0ZWRJbmRleCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBpY2tlci5zdGFydEF0ICYmICF0aGlzLnJldGFpblN0YXJ0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY3JlYXRlRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFllYXIocmVzdWx0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1vbnRoKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXREYXRlKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRIb3Vycyh0aGlzLnBpY2tlci5zdGFydEF0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1pbnV0ZXModGhpcy5waWNrZXIuc3RhcnRBdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRTZWNvbmRzKHRoaXMucGlja2VyLnN0YXJ0QXQpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJldGFpblN0YXJ0VGltZSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY3JlYXRlRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFllYXIocmVzdWx0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1vbnRoKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXREYXRlKHJlc3VsdCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRIb3Vycyh0aGlzLnJldGFpblN0YXJ0VGltZSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNaW51dGVzKHRoaXMucmV0YWluU3RhcnRUaW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFNlY29uZHModGhpcy5yZXRhaW5TdGFydFRpbWUpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcm9tID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0byA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVTZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBpY2tlci5zZWxlY3RNb2RlID09PSAncmFuZ2VGcm9tJykge1xuICAgICAgICAgICAgZnJvbSA9IHJlc3VsdDtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGZyb20gdmFsdWUgaXMgYWZ0ZXIgdGhlIHRvIHZhbHVlLCBzZXQgdGhlIHRvIHZhbHVlIGFzIG51bGxcbiAgICAgICAgICAgIGlmICh0byAmJiB0aGlzLmRhdGVUaW1lQWRhcHRlci5jb21wYXJlKGZyb20sIHRvKSA+IDApIHtcbiAgICAgICAgICAgICAgICB0byA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5waWNrZXIuc2VsZWN0TW9kZSA9PT0gJ3JhbmdlVG8nKSB7XG4gICAgICAgICAgICB0byA9IHJlc3VsdDtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGZyb20gdmFsdWUgaXMgYWZ0ZXIgdGhlIHRvIHZhbHVlLCBzZXQgdGhlIGZyb20gdmFsdWUgYXMgbnVsbFxuICAgICAgICAgICAgaWYgKGZyb20gJiYgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZShmcm9tLCB0bykgPiAwKSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW2Zyb20sIHRvXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIGdpdmVuIGNhbGVuZGFyIGRhdGUncyB0aW1lIGFuZCBjaGVjayBpZiBpdCBpcyB2YWxpZFxuICAgICAqIEJlY2F1c2UgdGhlIGNhbGVuZGFyIGRhdGUgaGFzIDAwOjAwOjAwIGFzIGRlZmF1bHQgdGltZSwgaWYgdGhlIHBpY2tlciB0eXBlIGlzICdib3RoJyxcbiAgICAgKiB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgZ2l2ZW4gY2FsZW5kYXIgZGF0ZSdzIHRpbWUgYmVmb3JlIHNlbGVjdGluZyBpdC5cbiAgICAgKiBpZiBpdCBpcyB2YWxpZCwgcmV0dXJuIHRoZSB1cGRhdGVkIGRhdGVUaW1lXG4gICAgICogaWYgaXQgaXMgbm90IHZhbGlkLCByZXR1cm4gbnVsbFxuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlQW5kQ2hlY2tDYWxlbmRhckRhdGUoZGF0ZTogVCk6IFQge1xuICAgICAgICBsZXQgcmVzdWx0O1xuXG4gICAgICAgIC8vIGlmIHRoZSBwaWNrZXIgaXMgJ2JvdGgnLCB1cGRhdGUgdGhlIGNhbGVuZGFyIGRhdGUncyB0aW1lIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnBpY2tlci5waWNrZXJUeXBlID09PSAnYm90aCcpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNyZWF0ZURhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZ2V0WWVhcihkYXRlKSxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNb250aChkYXRlKSxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXREYXRlKGRhdGUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldEhvdXJzKHRoaXMucGlja2VyTW9tZW50KSxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNaW51dGVzKHRoaXMucGlja2VyTW9tZW50KSxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRTZWNvbmRzKHRoaXMucGlja2VyTW9tZW50KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNsYW1wRGF0ZShcbiAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXIubWluRGF0ZVRpbWUsXG4gICAgICAgICAgICAgICAgdGhpcy5waWNrZXIubWF4RGF0ZVRpbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5jbG9uZShkYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHRoZSB1cGRhdGVkIGRhdGVUaW1lXG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlci5kYXRlVGltZUNoZWNrZXIocmVzdWx0KSA/IHJlc3VsdCA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRm9jdXMgdG8gdGhlIHBpY2tlclxuICAgICAqICovXG4gICAgcHJpdmF0ZSBmb2N1c1BpY2tlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGlja2VyLnBpY2tlck1vZGUgPT09ICdpbmxpbmUnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jYWxlbmRhcikge1xuICAgICAgICAgICAgdGhpcy5jYWxlbmRhci5mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCI8ZGl2IFtjZGtUcmFwRm9jdXNdPVwicGlja2VyLnBpY2tlck1vZGUgIT09ICdpbmxpbmUnXCJcbiAgICAgW0BmYWRlSW5QaWNrZXJdPVwicGlja2VyLnBpY2tlck1vZGUgPT09ICdpbmxpbmUnPyAnJyA6ICdlbnRlcidcIlxuICAgICBjbGFzcz1cIm93bC1kdC1jb250YWluZXItaW5uZXJcIj5cblxuICAgIDxvd2wtZGF0ZS10aW1lLWNhbGVuZGFyXG4gICAgICAgICAgICAqbmdJZj1cInBpY2tlclR5cGUgPT09ICdib3RoJyB8fCBwaWNrZXJUeXBlID09PSAnY2FsZW5kYXInXCJcbiAgICAgICAgICAgIGNsYXNzPVwib3dsLWR0LWNvbnRhaW5lci1yb3dcIlxuICAgICAgICAgICAgW2ZpcnN0RGF5T2ZXZWVrXT1cInBpY2tlci5maXJzdERheU9mV2Vla1wiXG4gICAgICAgICAgICBbKHBpY2tlck1vbWVudCldPVwicGlja2VyTW9tZW50XCJcbiAgICAgICAgICAgIFtzZWxlY3RlZF09XCJwaWNrZXIuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgW3NlbGVjdGVkc109XCJwaWNrZXIuc2VsZWN0ZWRzXCJcbiAgICAgICAgICAgIFtzZWxlY3RNb2RlXT1cInBpY2tlci5zZWxlY3RNb2RlXCJcbiAgICAgICAgICAgIFttaW5EYXRlXT1cInBpY2tlci5taW5EYXRlVGltZVwiXG4gICAgICAgICAgICBbbWF4RGF0ZV09XCJwaWNrZXIubWF4RGF0ZVRpbWVcIlxuICAgICAgICAgICAgW2RhdGVGaWx0ZXJdPVwicGlja2VyLmRhdGVUaW1lRmlsdGVyXCJcbiAgICAgICAgICAgIFtzdGFydFZpZXddPVwicGlja2VyLnN0YXJ0Vmlld1wiXG4gICAgICAgICAgICBbeWVhck9ubHldPVwicGlja2VyLnllYXJPbmx5XCJcbiAgICAgICAgICAgIFttdWx0aXllYXJPbmx5XT1cInBpY2tlci5tdWx0aXllYXJPbmx5XCJcbiAgICAgICAgICAgIFtoaWRlT3RoZXJNb250aHNdPVwicGlja2VyLmhpZGVPdGhlck1vbnRoc1wiXG4gICAgICAgICAgICAoeWVhclNlbGVjdGVkKT1cInBpY2tlci5zZWxlY3RZZWFyKCRldmVudClcIlxuICAgICAgICAgICAgKG1vbnRoU2VsZWN0ZWQpPVwicGlja2VyLnNlbGVjdE1vbnRoKCRldmVudClcIlxuICAgICAgICAgICAgKGRhdGVDbGlja2VkKT1cInBpY2tlci5zZWxlY3REYXRlKCRldmVudClcIlxuICAgICAgICAgICAgKHNlbGVjdGVkQ2hhbmdlKT1cImRhdGVTZWxlY3RlZCgkZXZlbnQpXCI+PC9vd2wtZGF0ZS10aW1lLWNhbGVuZGFyPlxuXG4gICAgPG93bC1kYXRlLXRpbWUtdGltZXJcbiAgICAgICAgICAgICpuZ0lmPVwicGlja2VyVHlwZSA9PT0gJ2JvdGgnIHx8IHBpY2tlclR5cGUgPT09ICd0aW1lcidcIlxuICAgICAgICAgICAgY2xhc3M9XCJvd2wtZHQtY29udGFpbmVyLXJvd1wiXG4gICAgICAgICAgICBbcGlja2VyTW9tZW50XT1cInBpY2tlck1vbWVudFwiXG4gICAgICAgICAgICBbbWluRGF0ZVRpbWVdPVwicGlja2VyLm1pbkRhdGVUaW1lXCJcbiAgICAgICAgICAgIFttYXhEYXRlVGltZV09XCJwaWNrZXIubWF4RGF0ZVRpbWVcIlxuICAgICAgICAgICAgW3Nob3dTZWNvbmRzVGltZXJdPVwicGlja2VyLnNob3dTZWNvbmRzVGltZXJcIlxuICAgICAgICAgICAgW2hvdXIxMlRpbWVyXT1cInBpY2tlci5ob3VyMTJUaW1lclwiXG4gICAgICAgICAgICBbc3RlcEhvdXJdPVwicGlja2VyLnN0ZXBIb3VyXCJcbiAgICAgICAgICAgIFtzdGVwTWludXRlXT1cInBpY2tlci5zdGVwTWludXRlXCJcbiAgICAgICAgICAgIFtzdGVwU2Vjb25kXT1cInBpY2tlci5zdGVwU2Vjb25kXCJcbiAgICAgICAgICAgIChzZWxlY3RlZENoYW5nZSk9XCJ0aW1lU2VsZWN0ZWQoJGV2ZW50KVwiPjwvb3dsLWRhdGUtdGltZS10aW1lcj5cblxuICAgIDxkaXYgKm5nSWY9XCJwaWNrZXIuaXNJblJhbmdlTW9kZVwiXG4gICAgICAgICByb2xlPVwicmFkaW9ncm91cFwiXG4gICAgICAgICBjbGFzcz1cIm93bC1kdC1jb250YWluZXItaW5mbyBvd2wtZHQtY29udGFpbmVyLXJvd1wiPlxuICAgICAgICA8ZGl2IHJvbGU9XCJyYWRpb1wiIFt0YWJpbmRleF09XCJhY3RpdmVTZWxlY3RlZEluZGV4ID09PSAwID8gMCA6IC0xXCJcbiAgICAgICAgICAgICBbYXR0ci5hcmlhLWNoZWNrZWRdPVwiYWN0aXZlU2VsZWN0ZWRJbmRleCA9PT0gMFwiXG4gICAgICAgICAgICAgY2xhc3M9XCJvd2wtZHQtY29udHJvbCBvd2wtZHQtY29udGFpbmVyLXJhbmdlIG93bC1kdC1jb250YWluZXItZnJvbVwiXG4gICAgICAgICAgICAgW25nQ2xhc3NdPVwieydvd2wtZHQtY29udGFpbmVyLWluZm8tYWN0aXZlJzogYWN0aXZlU2VsZWN0ZWRJbmRleCA9PT0gMH1cIlxuICAgICAgICAgICAgIChjbGljayk9XCJoYW5kbGVDbGlja09uSW5mb0dyb3VwKCRldmVudCwgMClcIlxuICAgICAgICAgICAgIChrZXlkb3duKT1cImhhbmRsZUtleWRvd25PbkluZm9Hcm91cCgkZXZlbnQsIHRvLCAwKVwiICNmcm9tPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1jb250ZW50IG93bC1kdC1jb250YWluZXItcmFuZ2UtY29udGVudFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm93bC1kdC1jb250YWluZXItaW5mby1sYWJlbFwiPnt7ZnJvbUxhYmVsfX06PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwib3dsLWR0LWNvbnRhaW5lci1pbmZvLXZhbHVlXCI+e3tmcm9tRm9ybWF0dGVkVmFsdWV9fTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgcm9sZT1cInJhZGlvXCIgW3RhYmluZGV4XT1cImFjdGl2ZVNlbGVjdGVkSW5kZXggPT09IDEgPyAwIDogLTFcIlxuICAgICAgICAgICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJhY3RpdmVTZWxlY3RlZEluZGV4ID09PSAxXCJcbiAgICAgICAgICAgICBjbGFzcz1cIm93bC1kdC1jb250cm9sIG93bC1kdC1jb250YWluZXItcmFuZ2Ugb3dsLWR0LWNvbnRhaW5lci10b1wiXG4gICAgICAgICAgICAgW25nQ2xhc3NdPVwieydvd2wtZHQtY29udGFpbmVyLWluZm8tYWN0aXZlJzogYWN0aXZlU2VsZWN0ZWRJbmRleCA9PT0gMX1cIlxuICAgICAgICAgICAgIChjbGljayk9XCJoYW5kbGVDbGlja09uSW5mb0dyb3VwKCRldmVudCwgMSlcIlxuICAgICAgICAgICAgIChrZXlkb3duKT1cImhhbmRsZUtleWRvd25PbkluZm9Hcm91cCgkZXZlbnQsIGZyb20sIDEpXCIgI3RvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1jb250ZW50IG93bC1kdC1jb250YWluZXItcmFuZ2UtY29udGVudFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm93bC1kdC1jb250YWluZXItaW5mby1sYWJlbFwiPnt7dG9MYWJlbH19Ojwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm93bC1kdC1jb250YWluZXItaW5mby12YWx1ZVwiPnt7dG9Gb3JtYXR0ZWRWYWx1ZX19PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgKm5nSWY9XCJzaG93Q29udHJvbEJ1dHRvbnNcIiBjbGFzcz1cIm93bC1kdC1jb250YWluZXItYnV0dG9ucyBvd2wtZHQtY29udGFpbmVyLXJvd1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwib3dsLWR0LWNvbnRyb2wgb3dsLWR0LWNvbnRyb2wtYnV0dG9uIG93bC1kdC1jb250YWluZXItY29udHJvbC1idXR0b25cIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkNhbmNlbENsaWNrZWQoJGV2ZW50KVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1jb250ZW50IG93bC1kdC1jb250cm9sLWJ1dHRvbi1jb250ZW50XCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgICAgICAgIHt7Y2FuY2VsTGFiZWx9fVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm93bC1kdC1jb250cm9sIG93bC1kdC1jb250cm9sLWJ1dHRvbiBvd2wtZHQtY29udGFpbmVyLWNvbnRyb2wtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25TZXRDbGlja2VkKCRldmVudClcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwib3dsLWR0LWNvbnRyb2wtY29udGVudCBvd2wtZHQtY29udHJvbC1idXR0b24tY29udGVudFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAgICAgICB7e3NldExhYmVsfX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==