/**
 * timer.component
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Optional, Output } from '@angular/core';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./date-time-picker-intl.service";
import * as i2 from "./adapter/date-time-adapter.class";
import * as i3 from "./timer-box.component";
import * as i4 from "@angular/common";
export class OwlTimerComponent {
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
OwlTimerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlTimerComponent, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i1.OwlDateTimeIntl }, { token: i0.ChangeDetectorRef }, { token: i2.DateTimeAdapter, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlTimerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlTimerComponent, selector: "owl-date-time-timer", inputs: { pickerMoment: "pickerMoment", minDateTime: "minDateTime", maxDateTime: "maxDateTime", showSecondsTimer: "showSecondsTimer", hour12Timer: "hour12Timer", stepHour: "stepHour", stepMinute: "stepMinute", stepSecond: "stepSecond" }, outputs: { selectedChange: "selectedChange" }, host: { properties: { "class.owl-dt-timer": "owlDTTimerClass", "attr.tabindex": "owlDTTimeTabIndex" } }, exportAs: ["owlDateTimeTimer"], ngImport: i0, template: "<owl-date-time-timer-box\n        [upBtnAriaLabel]=\"upHourButtonLabel\"\n        [downBtnAriaLabel]=\"downHourButtonLabel\"\n        [upBtnDisabled]=\"!upHourEnabled()\"\n        [downBtnDisabled]=\"!downHourEnabled()\"\n        [boxValue]=\"hourBoxValue\"\n        [value]=\"hourValue\" [min]=\"0\" [max]=\"23\"\n        [step]=\"stepHour\" [inputLabel]=\"'Hour'\"\n        (inputChange)=\"setHourValueViaInput($event)\"\n        (valueChange)=\"setHourValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upMinuteButtonLabel\"\n        [downBtnAriaLabel]=\"downMinuteButtonLabel\"\n        [upBtnDisabled]=\"!upMinuteEnabled()\"\n        [downBtnDisabled]=\"!downMinuteEnabled()\"\n        [value]=\"minuteValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepMinute\" [inputLabel]=\"'Minute'\"\n        (inputChange)=\"setMinuteValue($event)\"\n        (valueChange)=\"setMinuteValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        *ngIf=\"showSecondsTimer\"\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upSecondButtonLabel\"\n        [downBtnAriaLabel]=\"downSecondButtonLabel\"\n        [upBtnDisabled]=\"!upSecondEnabled()\"\n        [downBtnDisabled]=\"!downSecondEnabled()\"\n        [value]=\"secondValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepSecond\" [inputLabel]=\"'Second'\"\n        (inputChange)=\"setSecondValue($event)\"\n        (valueChange)=\"setSecondValue($event)\"></owl-date-time-timer-box>\n\n<div *ngIf=\"hour12Timer\" class=\"owl-dt-timer-hour12\">\n    <button class=\"owl-dt-control-button owl-dt-timer-hour12-box\"\n            type=\"button\" tabindex=\"0\"\n            (click)=\"setMeridiem($event)\">\n        <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n            {{hour12ButtonLabel}}\n        </span>\n    </button>\n</div>\n", styles: [""], components: [{ type: i3.OwlTimerBoxComponent, selector: "owl-date-time-timer-box", inputs: ["showDivider", "upBtnAriaLabel", "upBtnDisabled", "downBtnAriaLabel", "downBtnDisabled", "boxValue", "value", "min", "max", "step", "inputLabel"], outputs: ["valueChange", "inputChange"], exportAs: ["owlDateTimeTimerBox"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlTimerComponent, decorators: [{
            type: Component,
            args: [{ exportAs: 'owlDateTimeTimer', selector: 'owl-date-time-timer', preserveWhitespaces: false, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class.owl-dt-timer]': 'owlDTTimerClass',
                        '[attr.tabindex]': 'owlDTTimeTabIndex'
                    }, template: "<owl-date-time-timer-box\n        [upBtnAriaLabel]=\"upHourButtonLabel\"\n        [downBtnAriaLabel]=\"downHourButtonLabel\"\n        [upBtnDisabled]=\"!upHourEnabled()\"\n        [downBtnDisabled]=\"!downHourEnabled()\"\n        [boxValue]=\"hourBoxValue\"\n        [value]=\"hourValue\" [min]=\"0\" [max]=\"23\"\n        [step]=\"stepHour\" [inputLabel]=\"'Hour'\"\n        (inputChange)=\"setHourValueViaInput($event)\"\n        (valueChange)=\"setHourValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upMinuteButtonLabel\"\n        [downBtnAriaLabel]=\"downMinuteButtonLabel\"\n        [upBtnDisabled]=\"!upMinuteEnabled()\"\n        [downBtnDisabled]=\"!downMinuteEnabled()\"\n        [value]=\"minuteValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepMinute\" [inputLabel]=\"'Minute'\"\n        (inputChange)=\"setMinuteValue($event)\"\n        (valueChange)=\"setMinuteValue($event)\"></owl-date-time-timer-box>\n<owl-date-time-timer-box\n        *ngIf=\"showSecondsTimer\"\n        [showDivider]=\"true\"\n        [upBtnAriaLabel]=\"upSecondButtonLabel\"\n        [downBtnAriaLabel]=\"downSecondButtonLabel\"\n        [upBtnDisabled]=\"!upSecondEnabled()\"\n        [downBtnDisabled]=\"!downSecondEnabled()\"\n        [value]=\"secondValue\" [min]=\"0\" [max]=\"59\"\n        [step]=\"stepSecond\" [inputLabel]=\"'Second'\"\n        (inputChange)=\"setSecondValue($event)\"\n        (valueChange)=\"setSecondValue($event)\"></owl-date-time-timer-box>\n\n<div *ngIf=\"hour12Timer\" class=\"owl-dt-timer-hour12\">\n    <button class=\"owl-dt-control-button owl-dt-timer-hour12-box\"\n            type=\"button\" tabindex=\"0\"\n            (click)=\"setMeridiem($event)\">\n        <span class=\"owl-dt-control-button-content\" tabindex=\"-1\">\n            {{hour12ButtonLabel}}\n        </span>\n    </button>\n</div>\n", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i1.OwlDateTimeIntl }, { type: i0.ChangeDetectorRef }, { type: i2.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { pickerMoment: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvcGlja2VyL3NyYy9saWIvZGF0ZS10aW1lL3RpbWVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BpY2tlci9zcmMvbGliL2RhdGUtdGltZS90aW1lci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFDSCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7O0FBY3RDLE1BQU0sT0FBTyxpQkFBaUI7SUFzSjFCLFlBQ1ksTUFBYyxFQUNkLE1BQWtCLEVBQ2xCLFVBQTJCLEVBQzNCLEtBQXdCLEVBQ1osZUFBbUM7UUFKL0MsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFdBQU0sR0FBTixNQUFNLENBQVk7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUFDM0IsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDWixvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7UUFySG5ELFNBQUksR0FBRyxLQUFLLENBQUMsQ0FBQywyREFBMkQ7UUFjakY7O1dBRUc7UUFFSCxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWI7O1dBRUc7UUFFSCxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRWY7O1dBRUc7UUFFSCxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBd0VmLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVB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c0NvbnRlbnQiOlsiLyoqXG4gKiB0aW1lci5jb21wb25lbnRcbiAqL1xuXG5pbXBvcnQge1xuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbnB1dCxcbiAgICBOZ1pvbmUsXG4gICAgT25Jbml0LFxuICAgIE9wdGlvbmFsLFxuICAgIE91dHB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE93bERhdGVUaW1lSW50bCB9IGZyb20gJy4vZGF0ZS10aW1lLXBpY2tlci1pbnRsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZVRpbWVBZGFwdGVyIH0gZnJvbSAnLi9hZGFwdGVyL2RhdGUtdGltZS1hZGFwdGVyLmNsYXNzJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBDb21wb25lbnQoe1xuICAgIGV4cG9ydEFzOiAnb3dsRGF0ZVRpbWVUaW1lcicsXG4gICAgc2VsZWN0b3I6ICdvd2wtZGF0ZS10aW1lLXRpbWVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdGltZXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL3RpbWVyLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgaG9zdDoge1xuICAgICAgICAnW2NsYXNzLm93bC1kdC10aW1lcl0nOiAnb3dsRFRUaW1lckNsYXNzJyxcbiAgICAgICAgJ1thdHRyLnRhYmluZGV4XSc6ICdvd2xEVFRpbWVUYWJJbmRleCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE93bFRpbWVyQ29tcG9uZW50PFQ+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICAvKiogVGhlIGN1cnJlbnQgcGlja2VyIG1vbWVudCAqL1xuICAgIHByaXZhdGUgX3BpY2tlck1vbWVudDogVDtcbiAgICBASW5wdXQoKVxuICAgIGdldCBwaWNrZXJNb21lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9waWNrZXJNb21lbnQ7XG4gICAgfVxuXG4gICAgc2V0IHBpY2tlck1vbWVudCh2YWx1ZTogVCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fcGlja2VyTW9tZW50ID1cbiAgICAgICAgICAgIHRoaXMuZ2V0VmFsaWREYXRlKHZhbHVlKSB8fCB0aGlzLmRhdGVUaW1lQWRhcHRlci5ub3coKTtcbiAgICB9XG5cbiAgICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlIHRpbWUuICovXG4gICAgcHJpdmF0ZSBfbWluRGF0ZVRpbWU6IFQgfCBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IG1pbkRhdGVUaW1lKCk6IFQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbkRhdGVUaW1lO1xuICAgIH1cblxuICAgIHNldCBtaW5EYXRlVGltZSh2YWx1ZTogVCB8IG51bGwpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX21pbkRhdGVUaW1lID0gdGhpcy5nZXRWYWxpZERhdGUodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUgdGltZS4gKi9cbiAgICBwcml2YXRlIF9tYXhEYXRlVGltZTogVCB8IG51bGw7XG4gICAgQElucHV0KClcbiAgICBnZXQgbWF4RGF0ZVRpbWUoKTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4RGF0ZVRpbWU7XG4gICAgfVxuXG4gICAgc2V0IG1heERhdGVUaW1lKHZhbHVlOiBUIHwgbnVsbCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fbWF4RGF0ZVRpbWUgPSB0aGlzLmdldFZhbGlkRGF0ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1BNID0gZmFsc2U7IC8vIGEgZmxhZyBpbmRpY2F0ZXMgdGhlIGN1cnJlbnQgdGltZXIgbW9tZW50IGlzIGluIFBNIG9yIEFNXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHNob3cgdGhlIHNlY29uZCdzIHRpbWVyXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzaG93U2Vjb25kc1RpbWVyOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgdGltZXIgaXMgaW4gaG91cjEyIGZvcm1hdFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgaG91cjEyVGltZXI6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBIb3VycyB0byBjaGFuZ2UgcGVyIHN0ZXBcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHN0ZXBIb3VyID0gMTtcblxuICAgIC8qKlxuICAgICAqIE1pbnV0ZXMgdG8gY2hhbmdlIHBlciBzdGVwXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzdGVwTWludXRlID0gMTtcblxuICAgIC8qKlxuICAgICAqIFNlY29uZHMgdG8gY2hhbmdlIHBlciBzdGVwXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzdGVwU2Vjb25kID0gMTtcblxuICAgIGdldCBob3VyVmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldEhvdXJzKHRoaXMucGlja2VyTW9tZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgd291bGQgYmUgZGlzcGxheWVkIGluIGhvdXJCb3guXG4gICAgICogV2UgbmVlZCB0aGlzIGJlY2F1c2UgdGhlIHZhbHVlIGRpc3BsYXllZCBpbiBob3VyQm94IGl0IG5vdFxuICAgICAqIHRoZSBzYW1lIGFzIHRoZSBob3VyVmFsdWUgd2hlbiB0aGUgdGltZXIgaXMgaW4gaG91cjEyVGltZXIgbW9kZS5cbiAgICAgKiAqL1xuICAgIGdldCBob3VyQm94VmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGhvdXJzID0gdGhpcy5ob3VyVmFsdWU7XG5cbiAgICAgICAgaWYgKCF0aGlzLmhvdXIxMlRpbWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gaG91cnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaG91cnMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBob3VycyA9IDEyO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNQTSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChob3VycyA+IDAgJiYgaG91cnMgPCAxMikge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNQTSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChob3VycyA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUE0gPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChob3VycyA+IDEyICYmIGhvdXJzIDwgMjQpIHtcbiAgICAgICAgICAgICAgICBob3VycyA9IGhvdXJzIC0gMTI7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1BNID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGhvdXJzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IG1pbnV0ZVZhbHVlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRNaW51dGVzKHRoaXMucGlja2VyTW9tZW50KTtcbiAgICB9XG5cbiAgICBnZXQgc2Vjb25kVmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldFNlY29uZHModGhpcy5waWNrZXJNb21lbnQpO1xuICAgIH1cblxuICAgIGdldCB1cEhvdXJCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLnVwSG91ckxhYmVsO1xuICAgIH1cblxuICAgIGdldCBkb3duSG91ckJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnBpY2tlckludGwuZG93bkhvdXJMYWJlbDtcbiAgICB9XG5cbiAgICBnZXQgdXBNaW51dGVCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLnVwTWludXRlTGFiZWw7XG4gICAgfVxuXG4gICAgZ2V0IGRvd25NaW51dGVCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLmRvd25NaW51dGVMYWJlbDtcbiAgICB9XG5cbiAgICBnZXQgdXBTZWNvbmRCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLnVwU2Vjb25kTGFiZWw7XG4gICAgfVxuXG4gICAgZ2V0IGRvd25TZWNvbmRCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJJbnRsLmRvd25TZWNvbmRMYWJlbDtcbiAgICB9XG5cbiAgICBnZXQgaG91cjEyQnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNQTVxuICAgICAgICAgICAgPyB0aGlzLnBpY2tlckludGwuaG91cjEyUE1MYWJlbFxuICAgICAgICAgICAgOiB0aGlzLnBpY2tlckludGwuaG91cjEyQU1MYWJlbDtcbiAgICB9XG5cbiAgICBAT3V0cHV0KClcbiAgICBzZWxlY3RlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIGdldCBvd2xEVFRpbWVyQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBvd2xEVFRpbWVUYWJJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgIHByaXZhdGUgZWxtUmVmOiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIHBpY2tlckludGw6IE93bERhdGVUaW1lSW50bCxcbiAgICAgICAgcHJpdmF0ZSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZGF0ZVRpbWVBZGFwdGVyOiBEYXRlVGltZUFkYXB0ZXI8VD5cbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7fVxuXG4gICAgLyoqXG4gICAgICogRm9jdXMgdG8gdGhlIGhvc3QgZWxlbWVudFxuICAgICAqICovXG4gICAgcHVibGljIGZvY3VzKCkge1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5vblN0YWJsZVxuICAgICAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxtUmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBob3VyIHZhbHVlIHZpYSB0eXBpbmcgaW50byB0aW1lciBib3ggaW5wdXRcbiAgICAgKiBXZSBuZWVkIHRoaXMgdG8gaGFuZGxlIHRoZSBob3VyIHZhbHVlIHdoZW4gdGhlIHRpbWVyIGlzIGluIGhvdXIxMiBtb2RlXG4gICAgICogKi9cbiAgICBwdWJsaWMgc2V0SG91clZhbHVlVmlhSW5wdXQoaG91cnM6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5ob3VyMTJUaW1lciAmJiB0aGlzLmlzUE0gJiYgaG91cnMgPj0gMSAmJiBob3VycyA8PSAxMSkge1xuICAgICAgICAgICAgaG91cnMgPSBob3VycyArIDEyO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaG91cjEyVGltZXIgJiYgIXRoaXMuaXNQTSAmJiBob3VycyA9PT0gMTIpIHtcbiAgICAgICAgICAgIGhvdXJzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0SG91clZhbHVlKGhvdXJzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0SG91clZhbHVlKGhvdXJzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLnNldEhvdXJzKHRoaXMucGlja2VyTW9tZW50LCBob3Vycyk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChtKTtcbiAgICAgICAgdGhpcy5jZFJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TWludXRlVmFsdWUobWludXRlczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG0gPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5zZXRNaW51dGVzKHRoaXMucGlja2VyTW9tZW50LCBtaW51dGVzKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYW5nZS5lbWl0KG0pO1xuICAgICAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRTZWNvbmRWYWx1ZShzZWNvbmRzOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbSA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLnNldFNlY29uZHModGhpcy5waWNrZXJNb21lbnQsIHNlY29uZHMpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQobSk7XG4gICAgICAgIHRoaXMuY2RSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1lcmlkaWVtKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc1BNID0gIXRoaXMuaXNQTTtcblxuICAgICAgICBsZXQgaG91cnMgPSB0aGlzLmhvdXJWYWx1ZTtcbiAgICAgICAgaWYgKHRoaXMuaXNQTSkge1xuICAgICAgICAgICAgaG91cnMgPSBob3VycyArIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaG91cnMgPSBob3VycyAtIDEyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhvdXJzID49IDAgJiYgaG91cnMgPD0gMjMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SG91clZhbHVlKGhvdXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2RSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHVwIGhvdXIgYnV0dG9uIGlzIGVuYWJsZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBIb3VyRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICF0aGlzLm1heERhdGVUaW1lIHx8XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVIb3Vycyh0aGlzLnN0ZXBIb3VyLCB0aGlzLm1heERhdGVUaW1lKSA8IDFcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZG93biBob3VyIGJ1dHRvbiBpcyBlbmFibGVkXG4gICAgICovXG4gICAgcHVibGljIGRvd25Ib3VyRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICF0aGlzLm1pbkRhdGVUaW1lIHx8XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVIb3VycygtdGhpcy5zdGVwSG91ciwgdGhpcy5taW5EYXRlVGltZSkgPiAtMVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSB1cCBtaW51dGUgYnV0dG9uIGlzIGVuYWJsZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBNaW51dGVFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIXRoaXMubWF4RGF0ZVRpbWUgfHxcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZU1pbnV0ZXModGhpcy5zdGVwTWludXRlLCB0aGlzLm1heERhdGVUaW1lKSA8IDFcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZG93biBtaW51dGUgYnV0dG9uIGlzIGVuYWJsZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZG93bk1pbnV0ZUVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAhdGhpcy5taW5EYXRlVGltZSB8fFxuICAgICAgICAgICAgdGhpcy5jb21wYXJlTWludXRlcygtdGhpcy5zdGVwTWludXRlLCB0aGlzLm1pbkRhdGVUaW1lKSA+IC0xXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHVwIHNlY29uZCBidXR0b24gaXMgZW5hYmxlZFxuICAgICAqL1xuICAgIHB1YmxpYyB1cFNlY29uZEVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAhdGhpcy5tYXhEYXRlVGltZSB8fFxuICAgICAgICAgICAgdGhpcy5jb21wYXJlU2Vjb25kcyh0aGlzLnN0ZXBTZWNvbmQsIHRoaXMubWF4RGF0ZVRpbWUpIDwgMVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBkb3duIHNlY29uZCBidXR0b24gaXMgZW5hYmxlZFxuICAgICAqL1xuICAgIHB1YmxpYyBkb3duU2Vjb25kRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICF0aGlzLm1pbkRhdGVUaW1lIHx8XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVTZWNvbmRzKC10aGlzLnN0ZXBTZWNvbmQsIHRoaXMubWluRGF0ZVRpbWUpID4gLTFcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrZXJNb21lbnQncyBob3VyIHZhbHVlICsvLSBjZXJ0YWluIGFtb3VudCBhbmQgY29tcGFyZSBpdCB0byB0aGUgZ2l2ZSBkYXRlXG4gICAgICogMSBpcyBhZnRlciB0aGUgY29tcGFyZWREYXRlXG4gICAgICogLTEgaXMgYmVmb3JlIHRoZSBjb21wYXJlZERhdGVcbiAgICAgKiAwIGlzIGVxdWFsIHRoZSBjb21wYXJlZERhdGVcbiAgICAgKiAqL1xuICAgIHByaXZhdGUgY29tcGFyZUhvdXJzKGFtb3VudDogbnVtYmVyLCBjb21wYXJlZERhdGU6IFQpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBob3VycyA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldEhvdXJzKHRoaXMucGlja2VyTW9tZW50KSArIGFtb3VudDtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuc2V0SG91cnModGhpcy5waWNrZXJNb21lbnQsIGhvdXJzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNvbXBhcmUocmVzdWx0LCBjb21wYXJlZERhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tlck1vbWVudCdzIG1pbnV0ZSB2YWx1ZSArLy0gY2VydGFpbiBhbW91bnQgYW5kIGNvbXBhcmUgaXQgdG8gdGhlIGdpdmUgZGF0ZVxuICAgICAqIDEgaXMgYWZ0ZXIgdGhlIGNvbXBhcmVkRGF0ZVxuICAgICAqIC0xIGlzIGJlZm9yZSB0aGUgY29tcGFyZWREYXRlXG4gICAgICogMCBpcyBlcXVhbCB0aGUgY29tcGFyZWREYXRlXG4gICAgICogKi9cbiAgICBwcml2YXRlIGNvbXBhcmVNaW51dGVzKGFtb3VudDogbnVtYmVyLCBjb21wYXJlZERhdGU6IFQpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBtaW51dGVzID1cbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmdldE1pbnV0ZXModGhpcy5waWNrZXJNb21lbnQpICsgYW1vdW50O1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5zZXRNaW51dGVzKFxuICAgICAgICAgICAgdGhpcy5waWNrZXJNb21lbnQsXG4gICAgICAgICAgICBtaW51dGVzXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGVUaW1lQWRhcHRlci5jb21wYXJlKHJlc3VsdCwgY29tcGFyZWREYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrZXJNb21lbnQncyBzZWNvbmQgdmFsdWUgKy8tIGNlcnRhaW4gYW1vdW50IGFuZCBjb21wYXJlIGl0IHRvIHRoZSBnaXZlIGRhdGVcbiAgICAgKiAxIGlzIGFmdGVyIHRoZSBjb21wYXJlZERhdGVcbiAgICAgKiAtMSBpcyBiZWZvcmUgdGhlIGNvbXBhcmVkRGF0ZVxuICAgICAqIDAgaXMgZXF1YWwgdGhlIGNvbXBhcmVkRGF0ZVxuICAgICAqICovXG4gICAgcHJpdmF0ZSBjb21wYXJlU2Vjb25kcyhhbW91bnQ6IG51bWJlciwgY29tcGFyZWREYXRlOiBUKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc2Vjb25kcyA9XG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5nZXRTZWNvbmRzKHRoaXMucGlja2VyTW9tZW50KSArIGFtb3VudDtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIuc2V0U2Vjb25kcyhcbiAgICAgICAgICAgIHRoaXMucGlja2VyTW9tZW50LFxuICAgICAgICAgICAgc2Vjb25kc1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZShyZXN1bHQsIGNvbXBhcmVkRGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgdmFsaWQgZGF0ZSBvYmplY3RcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFZhbGlkRGF0ZShvYmo6IGFueSk6IFQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzRGF0ZUluc3RhbmNlKG9iaikgJiZcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzVmFsaWQob2JqKVxuICAgICAgICAgICAgPyBvYmpcbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9XG59XG4iLCI8b3dsLWRhdGUtdGltZS10aW1lci1ib3hcbiAgICAgICAgW3VwQnRuQXJpYUxhYmVsXT1cInVwSG91ckJ1dHRvbkxhYmVsXCJcbiAgICAgICAgW2Rvd25CdG5BcmlhTGFiZWxdPVwiZG93bkhvdXJCdXR0b25MYWJlbFwiXG4gICAgICAgIFt1cEJ0bkRpc2FibGVkXT1cIiF1cEhvdXJFbmFibGVkKClcIlxuICAgICAgICBbZG93bkJ0bkRpc2FibGVkXT1cIiFkb3duSG91ckVuYWJsZWQoKVwiXG4gICAgICAgIFtib3hWYWx1ZV09XCJob3VyQm94VmFsdWVcIlxuICAgICAgICBbdmFsdWVdPVwiaG91clZhbHVlXCIgW21pbl09XCIwXCIgW21heF09XCIyM1wiXG4gICAgICAgIFtzdGVwXT1cInN0ZXBIb3VyXCIgW2lucHV0TGFiZWxdPVwiJ0hvdXInXCJcbiAgICAgICAgKGlucHV0Q2hhbmdlKT1cInNldEhvdXJWYWx1ZVZpYUlucHV0KCRldmVudClcIlxuICAgICAgICAodmFsdWVDaGFuZ2UpPVwic2V0SG91clZhbHVlKCRldmVudClcIj48L293bC1kYXRlLXRpbWUtdGltZXItYm94PlxuPG93bC1kYXRlLXRpbWUtdGltZXItYm94XG4gICAgICAgIFtzaG93RGl2aWRlcl09XCJ0cnVlXCJcbiAgICAgICAgW3VwQnRuQXJpYUxhYmVsXT1cInVwTWludXRlQnV0dG9uTGFiZWxcIlxuICAgICAgICBbZG93bkJ0bkFyaWFMYWJlbF09XCJkb3duTWludXRlQnV0dG9uTGFiZWxcIlxuICAgICAgICBbdXBCdG5EaXNhYmxlZF09XCIhdXBNaW51dGVFbmFibGVkKClcIlxuICAgICAgICBbZG93bkJ0bkRpc2FibGVkXT1cIiFkb3duTWludXRlRW5hYmxlZCgpXCJcbiAgICAgICAgW3ZhbHVlXT1cIm1pbnV0ZVZhbHVlXCIgW21pbl09XCIwXCIgW21heF09XCI1OVwiXG4gICAgICAgIFtzdGVwXT1cInN0ZXBNaW51dGVcIiBbaW5wdXRMYWJlbF09XCInTWludXRlJ1wiXG4gICAgICAgIChpbnB1dENoYW5nZSk9XCJzZXRNaW51dGVWYWx1ZSgkZXZlbnQpXCJcbiAgICAgICAgKHZhbHVlQ2hhbmdlKT1cInNldE1pbnV0ZVZhbHVlKCRldmVudClcIj48L293bC1kYXRlLXRpbWUtdGltZXItYm94PlxuPG93bC1kYXRlLXRpbWUtdGltZXItYm94XG4gICAgICAgICpuZ0lmPVwic2hvd1NlY29uZHNUaW1lclwiXG4gICAgICAgIFtzaG93RGl2aWRlcl09XCJ0cnVlXCJcbiAgICAgICAgW3VwQnRuQXJpYUxhYmVsXT1cInVwU2Vjb25kQnV0dG9uTGFiZWxcIlxuICAgICAgICBbZG93bkJ0bkFyaWFMYWJlbF09XCJkb3duU2Vjb25kQnV0dG9uTGFiZWxcIlxuICAgICAgICBbdXBCdG5EaXNhYmxlZF09XCIhdXBTZWNvbmRFbmFibGVkKClcIlxuICAgICAgICBbZG93bkJ0bkRpc2FibGVkXT1cIiFkb3duU2Vjb25kRW5hYmxlZCgpXCJcbiAgICAgICAgW3ZhbHVlXT1cInNlY29uZFZhbHVlXCIgW21pbl09XCIwXCIgW21heF09XCI1OVwiXG4gICAgICAgIFtzdGVwXT1cInN0ZXBTZWNvbmRcIiBbaW5wdXRMYWJlbF09XCInU2Vjb25kJ1wiXG4gICAgICAgIChpbnB1dENoYW5nZSk9XCJzZXRTZWNvbmRWYWx1ZSgkZXZlbnQpXCJcbiAgICAgICAgKHZhbHVlQ2hhbmdlKT1cInNldFNlY29uZFZhbHVlKCRldmVudClcIj48L293bC1kYXRlLXRpbWUtdGltZXItYm94PlxuXG48ZGl2ICpuZ0lmPVwiaG91cjEyVGltZXJcIiBjbGFzcz1cIm93bC1kdC10aW1lci1ob3VyMTJcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwib3dsLWR0LWNvbnRyb2wtYnV0dG9uIG93bC1kdC10aW1lci1ob3VyMTItYm94XCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInNldE1lcmlkaWVtKCRldmVudClcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY29udHJvbC1idXR0b24tY29udGVudFwiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICAgIHt7aG91cjEyQnV0dG9uTGFiZWx9fVxuICAgICAgICA8L3NwYW4+XG4gICAgPC9idXR0b24+XG48L2Rpdj5cbiJdfQ==