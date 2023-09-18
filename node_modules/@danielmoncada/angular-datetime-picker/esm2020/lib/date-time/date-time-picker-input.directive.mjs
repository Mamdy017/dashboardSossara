/**
 * date-time-picker-input.directive
 */
import { Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Output, Renderer2 } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import * as i0 from "@angular/core";
import * as i1 from "./adapter/date-time-adapter.class";
export const OWL_DATETIME_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwlDateTimeInputDirective),
    multi: true
};
export const OWL_DATETIME_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => OwlDateTimeInputDirective),
    multi: true
};
export class OwlDateTimeInputDirective {
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
OwlDateTimeInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInputDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
OwlDateTimeInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeInputDirective, selector: "input[owlDateTime]", inputs: { required: "required", owlDateTime: "owlDateTime", owlDateTimeFilter: "owlDateTimeFilter", _disabled: "_disabled", min: "min", max: "max", selectMode: "selectMode", rangeSeparator: "rangeSeparator", value: "value", values: "values" }, outputs: { dateTimeChange: "dateTimeChange", dateTimeInput: "dateTimeInput" }, host: { listeners: { "keydown": "handleKeydownOnHost($event)", "blur": "handleBlurOnHost($event)", "input": "handleInputOnHost($event)", "change": "handleChangeOnHost($event)" }, properties: { "attr.aria-haspopup": "owlDateTimeInputAriaHaspopup", "attr.aria-owns": "owlDateTimeInputAriaOwns", "attr.min": "minIso8601", "attr.max": "maxIso8601", "disabled": "owlDateTimeInputDisabled" } }, providers: [
        OWL_DATETIME_VALUE_ACCESSOR,
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
                        OWL_DATETIME_VALUE_ACCESSOR,
                        OWL_DATETIME_VALIDATORS,
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [OWL_DATE_TIME_FORMATS]
                }] }]; }, propDecorators: { required: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXBpY2tlci1pbnB1dC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kYXRlLXRpbWUvZGF0ZS10aW1lLXBpY2tlci1pbnB1dC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxPQUFPLEVBRUgsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdILGFBQWEsRUFDYixpQkFBaUIsRUFJakIsVUFBVSxFQUNiLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNwRSxPQUFPLEVBQ0gscUJBQXFCLEVBRXhCLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVwQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBRTlELE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFRO0lBQzVDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztJQUN4RCxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBUTtJQUN4QyxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixD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QjtRQUMzQix1QkFBdUI7S0FDMUI7MkZBRVEseUJBQXlCO2tCQW5CckMsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixJQUFJLEVBQUU7d0JBQ0YsV0FBVyxFQUFFLDZCQUE2Qjt3QkFDMUMsUUFBUSxFQUFFLDBCQUEwQjt3QkFDcEMsU0FBUyxFQUFFLDJCQUEyQjt3QkFDdEMsVUFBVSxFQUFFLDRCQUE0Qjt3QkFDeEMsc0JBQXNCLEVBQUUsOEJBQThCO3dCQUN0RCxrQkFBa0IsRUFBRSwwQkFBMEI7d0JBQzlDLFlBQVksRUFBRSxZQUFZO3dCQUMxQixZQUFZLEVBQUUsWUFBWTt3QkFDMUIsWUFBWSxFQUFFLDBCQUEwQjtxQkFDM0M7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQLDJCQUEyQjt3QkFDM0IsdUJBQXVCO3FCQUMxQjtpQkFDSjs7MEJBc1lRLFFBQVE7OzBCQUVSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQXpYekMsUUFBUTtzQkFEWCxLQUFLO2dCQWNGLFdBQVc7c0JBRGQsS0FBSztnQkFTRixpQkFBaUI7c0JBRHBCLEtBQUs7Z0JBYUUsU0FBUztzQkFEaEIsS0FBSztnQkEyQkYsR0FBRztzQkFETixLQUFLO2dCQWFGLEdBQUc7c0JBRE4sS0FBSztnQkFlRixVQUFVO3NCQURiLEtBQUs7Z0JBc0JOLGNBQWM7c0JBRGIsS0FBSztnQkFLRixLQUFLO3NCQURSLEtBQUs7Z0JBdUJGLE1BQU07c0JBRFQsS0FBSztnQkErQk4sY0FBYztzQkFEYixNQUFNO2dCQU9QLGFBQWE7c0JBRFosTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZGF0ZS10aW1lLXBpY2tlci1pbnB1dC5kaXJlY3RpdmVcbiAqL1xuXG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgRGlyZWN0aXZlLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIGZvcndhcmRSZWYsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3B0aW9uYWwsXG4gICAgT3V0cHV0LFxuICAgIFJlbmRlcmVyMlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQWJzdHJhY3RDb250cm9sLFxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE5HX1ZBTElEQVRPUlMsXG4gICAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgVmFsaWRhdGlvbkVycm9ycyxcbiAgICBWYWxpZGF0b3IsXG4gICAgVmFsaWRhdG9yRm4sXG4gICAgVmFsaWRhdG9yc1xufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBET1dOX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IE93bERhdGVUaW1lQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEYXRlVGltZUFkYXB0ZXIgfSBmcm9tICcuL2FkYXB0ZXIvZGF0ZS10aW1lLWFkYXB0ZXIuY2xhc3MnO1xuaW1wb3J0IHtcbiAgICBPV0xfREFURV9USU1FX0ZPUk1BVFMsXG4gICAgT3dsRGF0ZVRpbWVGb3JtYXRzXG59IGZyb20gJy4vYWRhcHRlci9kYXRlLXRpbWUtZm9ybWF0LmNsYXNzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU2VsZWN0TW9kZSB9IGZyb20gJy4vZGF0ZS10aW1lLmNsYXNzJztcbmltcG9ydCB7IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbmV4cG9ydCBjb25zdCBPV0xfREFURVRJTUVfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPd2xEYXRlVGltZUlucHV0RGlyZWN0aXZlKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IE9XTF9EQVRFVElNRV9WQUxJREFUT1JTOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPd2xEYXRlVGltZUlucHV0RGlyZWN0aXZlKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdpbnB1dFtvd2xEYXRlVGltZV0nLFxuICAgIGV4cG9ydEFzOiAnb3dsRGF0ZVRpbWVJbnB1dCcsXG4gICAgaG9zdDoge1xuICAgICAgICAnKGtleWRvd24pJzogJ2hhbmRsZUtleWRvd25Pbkhvc3QoJGV2ZW50KScsXG4gICAgICAgICcoYmx1ciknOiAnaGFuZGxlQmx1ck9uSG9zdCgkZXZlbnQpJyxcbiAgICAgICAgJyhpbnB1dCknOiAnaGFuZGxlSW5wdXRPbkhvc3QoJGV2ZW50KScsXG4gICAgICAgICcoY2hhbmdlKSc6ICdoYW5kbGVDaGFuZ2VPbkhvc3QoJGV2ZW50KScsXG4gICAgICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdvd2xEYXRlVGltZUlucHV0QXJpYUhhc3BvcHVwJyxcbiAgICAgICAgJ1thdHRyLmFyaWEtb3duc10nOiAnb3dsRGF0ZVRpbWVJbnB1dEFyaWFPd25zJyxcbiAgICAgICAgJ1thdHRyLm1pbl0nOiAnbWluSXNvODYwMScsXG4gICAgICAgICdbYXR0ci5tYXhdJzogJ21heElzbzg2MDEnLFxuICAgICAgICAnW2Rpc2FibGVkXSc6ICdvd2xEYXRlVGltZUlucHV0RGlzYWJsZWQnXG4gICAgfSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgT1dMX0RBVEVUSU1FX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgICBPV0xfREFURVRJTUVfVkFMSURBVE9SUyxcbiAgICBdLFxufSlcbmV4cG9ydCBjbGFzcyBPd2xEYXRlVGltZUlucHV0RGlyZWN0aXZlPFQ+XG4gICAgaW1wbGVtZW50c1xuICAgICAgICBPbkluaXQsXG4gICAgICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgICAgIE9uRGVzdHJveSxcbiAgICAgICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgICAgIFZhbGlkYXRvciB7XG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFufCcnO1xuXG4gICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIGZsYWcgdG8gYmUgdXNlZCBmb3IgcmFuZ2Ugb2YgW251bGwsIG51bGxdXG4gICAgICogKi9cbiAgICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbjtcbiAgICBASW5wdXQoKVxuICAgIGdldCByZXF1aXJlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xuICAgIH1cblxuICAgIHNldCByZXF1aXJlZCh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3JlcXVpcmVkID0gdmFsdWUgPT09ICcnIHx8IHZhbHVlO1xuICAgICAgICB0aGlzLnZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGRhdGUgdGltZSBwaWNrZXIgdGhhdCB0aGlzIGlucHV0IGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAgICAgKiAqL1xuICAgIEBJbnB1dCgpXG4gICAgc2V0IG93bERhdGVUaW1lKHZhbHVlOiBPd2xEYXRlVGltZUNvbXBvbmVudDxUPikge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRGF0ZVRpbWVQaWNrZXIodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdG8gZmlsdGVyIGRhdGUgdGltZVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgc2V0IG93bERhdGVUaW1lRmlsdGVyKGZpbHRlcjogKGRhdGU6IFQgfCBudWxsKSA9PiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2RhdGVUaW1lRmlsdGVyID0gZmlsdGVyO1xuICAgICAgICB0aGlzLnZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZGF0ZVRpbWVGaWx0ZXI6IChkYXRlOiBUIHwgbnVsbCkgPT4gYm9vbGVhbjtcbiAgICBnZXQgZGF0ZVRpbWVGaWx0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRlVGltZUZpbHRlcjtcbiAgICB9XG5cbiAgICAvKiogV2hldGhlciB0aGUgZGF0ZSB0aW1lIHBpY2tlcidzIGlucHV0IGlzIGRpc2FibGVkLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgZ2V0IGRpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbG1SZWYubmF0aXZlRWxlbWVudDtcblxuICAgICAgICBpZiAodGhpcy5fZGlzYWJsZWQgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZENoYW5nZS5lbWl0KG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gbnVsbCBjaGVjayB0aGUgYGJsdXJgIG1ldGhvZCwgYmVjYXVzZSBpdCdzIHVuZGVmaW5lZCBkdXJpbmcgU1NSLlxuICAgICAgICBpZiAobmV3VmFsdWUgJiYgZWxlbWVudC5ibHVyKSB7XG4gICAgICAgICAgICAvLyBOb3JtYWxseSwgbmF0aXZlIGlucHV0IGVsZW1lbnRzIGF1dG9tYXRpY2FsbHkgYmx1ciBpZiB0aGV5IHR1cm4gZGlzYWJsZWQuIFRoaXMgYmVoYXZpb3JcbiAgICAgICAgICAgIC8vIGlzIHByb2JsZW1hdGljLCBiZWNhdXNlIGl0IHdvdWxkIG1lYW4gdGhhdCBpdCB0cmlnZ2VycyBhbm90aGVyIGNoYW5nZSBkZXRlY3Rpb24gY3ljbGUsXG4gICAgICAgICAgICAvLyB3aGljaCB0aGVuIGNhdXNlcyBhIGNoYW5nZWQgYWZ0ZXIgY2hlY2tlZCBlcnJvciBpZiB0aGUgaW5wdXQgZWxlbWVudCB3YXMgZm9jdXNlZCBiZWZvcmUuXG4gICAgICAgICAgICBlbGVtZW50LmJsdXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBUaGUgbWluaW11bSB2YWxpZCBkYXRlLiAqL1xuICAgIHByaXZhdGUgX21pbjogVCB8IG51bGw7XG4gICAgQElucHV0KClcbiAgICBnZXQgbWluKCk6IFQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbjtcbiAgICB9XG5cbiAgICBzZXQgbWluKHZhbHVlOiBUIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9taW4gPSB0aGlzLmdldFZhbGlkRGF0ZSh0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgICAgICB0aGlzLnZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgLyoqIFRoZSBtYXhpbXVtIHZhbGlkIGRhdGUuICovXG4gICAgcHJpdmF0ZSBfbWF4OiBUIHwgbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGdldCBtYXgoKTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWF4O1xuICAgIH1cblxuICAgIHNldCBtYXgodmFsdWU6IFQgfCBudWxsKSB7XG4gICAgICAgIHRoaXMuX21heCA9IHRoaXMuZ2V0VmFsaWREYXRlKHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yT25DaGFuZ2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGlja2VyJ3Mgc2VsZWN0IG1vZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIF9zZWxlY3RNb2RlOiBTZWxlY3RNb2RlID0gJ3NpbmdsZSc7XG4gICAgQElucHV0KClcbiAgICBnZXQgc2VsZWN0TW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdE1vZGU7XG4gICAgfVxuXG4gICAgc2V0IHNlbGVjdE1vZGUobW9kZTogU2VsZWN0TW9kZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBtb2RlICE9PSAnc2luZ2xlJyAmJlxuICAgICAgICAgICAgbW9kZSAhPT0gJ3JhbmdlJyAmJlxuICAgICAgICAgICAgbW9kZSAhPT0gJ3JhbmdlRnJvbScgJiZcbiAgICAgICAgICAgIG1vZGUgIT09ICdyYW5nZVRvJ1xuICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdPd2xEYXRlVGltZSBFcnJvcjogaW52YWxpZCBzZWxlY3RNb2RlIHZhbHVlIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2VsZWN0TW9kZSA9IG1vZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXJhY3RlciB0byBzZXBhcmF0ZSB0aGUgJ2Zyb20nIGFuZCAndG8nIGluIGlucHV0IHZhbHVlXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICByYW5nZVNlcGFyYXRvciA9ICctJztcblxuICAgIHByaXZhdGUgX3ZhbHVlOiBUIHwgbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2YWx1ZTogVCB8IG51bGwpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMubGFzdFZhbHVlVmFsaWQgPSAhdmFsdWUgfHwgdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNWYWxpZCh2YWx1ZSk7XG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRWYWxpZERhdGUodmFsdWUpO1xuICAgICAgICBjb25zdCBvbGREYXRlID0gdGhpcy5fdmFsdWU7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgLy8gc2V0IHRoZSBpbnB1dCBwcm9wZXJ0eSAndmFsdWUnXG4gICAgICAgIHRoaXMuZm9ybWF0TmF0aXZlSW5wdXRWYWx1ZSgpO1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSBpbnB1dCB2YWx1ZSBjaGFuZ2VkXG4gICAgICAgIGlmICghdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNFcXVhbChvbGREYXRlLCB2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF92YWx1ZXM6IFRbXSA9IFtdO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlcztcbiAgICB9XG5cbiAgICBzZXQgdmFsdWVzKHZhbHVlczogVFtdKSB7XG4gICAgICAgIGlmICh2YWx1ZXMgJiYgdmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IHZhbHVlcy5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgdiA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHYpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhbGlkRGF0ZSh2KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5sYXN0VmFsdWVWYWxpZCA9XG4gICAgICAgICAgICAgICAgKCF0aGlzLl92YWx1ZXNbMF0gfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNWYWxpZCh0aGlzLl92YWx1ZXNbMF0pKSAmJlxuICAgICAgICAgICAgICAgICghdGhpcy5fdmFsdWVzWzFdIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzVmFsaWQodGhpcy5fdmFsdWVzWzFdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMubGFzdFZhbHVlVmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IHRoZSBpbnB1dCBwcm9wZXJ0eSAndmFsdWUnXG4gICAgICAgIHRoaXMuZm9ybWF0TmF0aXZlSW5wdXRWYWx1ZSgpO1xuXG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLl92YWx1ZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIGBjaGFuZ2VgIGV2ZW50IGlzIGZpcmVkIG9uIHRoaXMgYDxpbnB1dD5gXG4gICAgICogKi9cbiAgICBAT3V0cHV0KClcbiAgICBkYXRlVGltZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gYW4gYGlucHV0YCBldmVudCBpcyBmaXJlZCBvbiB0aGlzIGA8aW5wdXQ+YC5cbiAgICAgKiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGRhdGVUaW1lSW5wdXQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIGdldCBlbGVtZW50UmVmKCk6IEVsZW1lbnRSZWYge1xuICAgICAgICByZXR1cm4gdGhpcy5lbG1SZWY7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5TaW5nbGVNb2RlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3NpbmdsZSc7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5SYW5nZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RNb2RlID09PSAncmFuZ2UnIHx8XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RNb2RlID09PSAncmFuZ2VGcm9tJyB8fFxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3JhbmdlVG8nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIFRoZSBkYXRlLXRpbWUtcGlja2VyIHRoYXQgdGhpcyBpbnB1dCBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gICAgcHVibGljIGR0UGlja2VyOiBPd2xEYXRlVGltZUNvbXBvbmVudDxUPjtcblxuICAgIHByaXZhdGUgZHRQaWNrZXJTdWI6IFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICBwcml2YXRlIGxvY2FsZVN1YjogU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gICAgcHJpdmF0ZSBsYXN0VmFsdWVWYWxpZCA9IHRydWU7XG5cbiAgICBwcml2YXRlIG9uTW9kZWxDaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG4gICAgcHJpdmF0ZSBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBwcml2YXRlIHZhbGlkYXRvck9uQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB3aGV0aGVyIHRoZSBpbnB1dCBwYXJzZXMuICovXG4gICAgcHJpdmF0ZSBwYXJzZVZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0VmFsdWVWYWxpZFxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHsgb3dsRGF0ZVRpbWVQYXJzZTogeyB0ZXh0OiB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50LnZhbHVlIH0gfTtcbiAgICB9XG5cbiAgICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtaW4gZGF0ZS4gKi9cbiAgICBwcml2YXRlIG1pblZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoXG4gICAgICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbFxuICAgICk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNJblNpbmdsZU1vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLm1pbiB8fFxuICAgICAgICAgICAgICAgICFjb250cm9sVmFsdWUgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5jb21wYXJlKHRoaXMubWluLCBjb250cm9sVmFsdWUpIDw9IDBcbiAgICAgICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgICAgICA6IHsgb3dsRGF0ZVRpbWVNaW46IHsgbWluOiB0aGlzLm1pbiwgYWN0dWFsOiBjb250cm9sVmFsdWUgfSB9O1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJblJhbmdlTW9kZSAmJiBjb250cm9sLnZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sVmFsdWVGcm9tID0gdGhpcy5nZXRWYWxpZERhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZVswXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sVmFsdWVUbyA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWVbMV0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLm1pbiB8fFxuICAgICAgICAgICAgICAgICFjb250cm9sVmFsdWVGcm9tIHx8XG4gICAgICAgICAgICAgICAgIWNvbnRyb2xWYWx1ZVRvIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZSh0aGlzLm1pbiwgY29udHJvbFZhbHVlRnJvbSkgPD0gMFxuICAgICAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgIG93bERhdGVUaW1lTWluOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogdGhpcy5taW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogW2NvbnRyb2xWYWx1ZUZyb20sIGNvbnRyb2xWYWx1ZVRvXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtYXggZGF0ZS4gKi9cbiAgICBwcml2YXRlIG1heFZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoXG4gICAgICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbFxuICAgICk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNJblNpbmdsZU1vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLm1heCB8fFxuICAgICAgICAgICAgICAgICFjb250cm9sVmFsdWUgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5jb21wYXJlKHRoaXMubWF4LCBjb250cm9sVmFsdWUpID49IDBcbiAgICAgICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgICAgICA6IHsgb3dsRGF0ZVRpbWVNYXg6IHsgbWF4OiB0aGlzLm1heCwgYWN0dWFsOiBjb250cm9sVmFsdWUgfSB9O1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJblJhbmdlTW9kZSAmJiBjb250cm9sLnZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sVmFsdWVGcm9tID0gdGhpcy5nZXRWYWxpZERhdGUoXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZVswXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sVmFsdWVUbyA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWVbMV0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLm1heCB8fFxuICAgICAgICAgICAgICAgICFjb250cm9sVmFsdWVGcm9tIHx8XG4gICAgICAgICAgICAgICAgIWNvbnRyb2xWYWx1ZVRvIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuY29tcGFyZSh0aGlzLm1heCwgY29udHJvbFZhbHVlVG8pID49IDBcbiAgICAgICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICBvd2xEYXRlVGltZU1heDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXg6IHRoaXMubWF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IFtjb250cm9sVmFsdWVGcm9tLCBjb250cm9sVmFsdWVUb11cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgZGF0ZSBmaWx0ZXIuICovXG4gICAgcHJpdmF0ZSBmaWx0ZXJWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKFxuICAgICAgICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2xcbiAgICApOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9kYXRlVGltZUZpbHRlciB8fFxuICAgICAgICAgICAgIWNvbnRyb2xWYWx1ZSB8fFxuICAgICAgICAgICAgdGhpcy5fZGF0ZVRpbWVGaWx0ZXIoY29udHJvbFZhbHVlKVxuICAgICAgICAgICAgPyBudWxsXG4gICAgICAgICAgICA6IHsgb3dsRGF0ZVRpbWVGaWx0ZXI6IHRydWUgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIHJhbmdlLlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlICdiZWZvcmUnIHZhbHVlIGlzIGJlZm9yZSB0aGUgJ3RvJyB2YWx1ZVxuICAgICAqICovXG4gICAgcHJpdmF0ZSByYW5nZVZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoXG4gICAgICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbFxuICAgICk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNJblNpbmdsZU1vZGUgfHwgIWNvbnRyb2wudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udHJvbFZhbHVlRnJvbSA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZVswXSlcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgY29udHJvbFZhbHVlVG8gPSB0aGlzLmdldFZhbGlkRGF0ZShcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWVbMV0pXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuICFjb250cm9sVmFsdWVGcm9tIHx8XG4gICAgICAgICAgICAhY29udHJvbFZhbHVlVG8gfHxcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNvbXBhcmUoY29udHJvbFZhbHVlRnJvbSwgY29udHJvbFZhbHVlVG8pIDw9IDBcbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiB7IG93bERhdGVUaW1lUmFuZ2U6IHRydWUgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIHJhbmdlIHdoZW4gcmVxdWlyZWQuXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgJ2JlZm9yZScgYW5kICd0bycgdmFsdWVzIGFyZSBwcmVzZW50XG4gICAgICogKi9cbiAgICBwcml2YXRlIHJlcXVpcmVkUmFuZ2VWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKFxuICAgICAgICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2xcbiAgICApOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5TaW5nbGVNb2RlIHx8ICFjb250cm9sLnZhbHVlIHx8ICF0aGlzLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbnRyb2xWYWx1ZUZyb20gPSB0aGlzLmdldFZhbGlkRGF0ZShcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWVbMF0pXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xWYWx1ZVRvID0gdGhpcy5nZXRWYWxpZERhdGUoXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlWzFdKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiAhY29udHJvbFZhbHVlRnJvbSB8fFxuICAgICAgICAgICAgIWNvbnRyb2xWYWx1ZVRvXG4gICAgICAgICAgICA/IHsgb3dsUmVxdWlyZWREYXRlVGltZVJhbmdlOiBbY29udHJvbFZhbHVlRnJvbSwgY29udHJvbFZhbHVlVG9dIH1cbiAgICAgICAgICAgIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKiogVGhlIGNvbWJpbmVkIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoaXMgaW5wdXQuICovXG4gICAgcHJpdmF0ZSB2YWxpZGF0b3I6IFZhbGlkYXRvckZuIHwgbnVsbCA9IFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgIHRoaXMucGFyc2VWYWxpZGF0b3IsXG4gICAgICAgIHRoaXMubWluVmFsaWRhdG9yLFxuICAgICAgICB0aGlzLm1heFZhbGlkYXRvcixcbiAgICAgICAgdGhpcy5maWx0ZXJWYWxpZGF0b3IsXG4gICAgICAgIHRoaXMucmFuZ2VWYWxpZGF0b3IsXG4gICAgICAgIHRoaXMucmVxdWlyZWRSYW5nZVZhbGlkYXRvclxuICAgIF0pO1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgKGVpdGhlciBkdWUgdG8gdXNlciBpbnB1dCBvciBwcm9ncmFtbWF0aWMgY2hhbmdlKS4gKi9cbiAgICBwdWJsaWMgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXSB8IFQgfCBudWxsPigpO1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gdGhlIGRpc2FibGVkIHN0YXRlIGhhcyBjaGFuZ2VkICovXG4gICAgcHVibGljIGRpc2FibGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gICAgZ2V0IG93bERhdGVUaW1lSW5wdXRBcmlhSGFzcG9wdXAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBvd2xEYXRlVGltZUlucHV0QXJpYU93bnMoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmR0UGlja2VyLm9wZW5lZCAmJiB0aGlzLmR0UGlja2VyLmlkKSB8fCBudWxsO1xuICAgIH1cblxuICAgIGdldCBtaW5Jc284NjAxKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbiA/IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLnRvSXNvODYwMSh0aGlzLm1pbikgOiBudWxsO1xuICAgIH1cblxuICAgIGdldCBtYXhJc284NjAxKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1heCA/IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLnRvSXNvODYwMSh0aGlzLm1heCkgOiBudWxsO1xuICAgIH1cblxuICAgIGdldCBvd2xEYXRlVGltZUlucHV0RGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGVsbVJlZjogRWxlbWVudFJlZixcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBAT3B0aW9uYWwoKVxuICAgICAgICBwcml2YXRlIGRhdGVUaW1lQWRhcHRlcjogRGF0ZVRpbWVBZGFwdGVyPFQ+LFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE9XTF9EQVRFX1RJTUVfRk9STUFUUylcbiAgICAgICAgcHJpdmF0ZSBkYXRlVGltZUZvcm1hdHM6IE93bERhdGVUaW1lRm9ybWF0cyApIHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGVUaW1lQWRhcHRlcikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICAgYE93bERhdGVUaW1lUGlja2VyOiBObyBwcm92aWRlciBmb3VuZCBmb3IgRGF0ZVRpbWVQaWNrZXIuIFlvdSBtdXN0IGltcG9ydCBvbmUgb2YgdGhlIGZvbGxvd2luZyBgICtcbiAgICAgICAgICAgICAgICAgICAgYG1vZHVsZXMgYXQgeW91ciBhcHBsaWNhdGlvbiByb290OiBPd2xOYXRpdmVEYXRlVGltZU1vZHVsZSwgT3dsTW9tZW50RGF0ZVRpbWVNb2R1bGUsIG9yIHByb3ZpZGUgYSBgICtcbiAgICAgICAgICAgICAgICAgICAgYGN1c3RvbSBpbXBsZW1lbnRhdGlvbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmRhdGVUaW1lRm9ybWF0cykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAgICAgYE93bERhdGVUaW1lUGlja2VyOiBObyBwcm92aWRlciBmb3VuZCBmb3IgT1dMX0RBVEVfVElNRV9GT1JNQVRTLiBZb3UgbXVzdCBpbXBvcnQgb25lIG9mIHRoZSBmb2xsb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgIGBtb2R1bGVzIGF0IHlvdXIgYXBwbGljYXRpb24gcm9vdDogT3dsTmF0aXZlRGF0ZVRpbWVNb2R1bGUsIE93bE1vbWVudERhdGVUaW1lTW9kdWxlLCBvciBwcm92aWRlIGEgYCArXG4gICAgICAgICAgICAgICAgICAgIGBjdXN0b20gaW1wbGVtZW50YXRpb24uYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9jYWxlU3ViID0gdGhpcy5kYXRlVGltZUFkYXB0ZXIubG9jYWxlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmR0UGlja2VyKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICAgICBgT3dsRGF0ZVRpbWVQaWNrZXI6IHRoZSBwaWNrZXIgaW5wdXQgZG9lc24ndCBoYXZlIGFueSBhc3NvY2lhdGVkIG93bC1kYXRlLXRpbWUgY29tcG9uZW50YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHRQaWNrZXJTdWIgPSB0aGlzLmR0UGlja2VyLmNvbmZpcm1TZWxlY3RlZENoYW5nZS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoc2VsZWN0ZWRzOiBUW10gfCBUKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0ZWRzKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlcyA9IHNlbGVjdGVkcztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gc2VsZWN0ZWRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShzZWxlY3RlZHMpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzZWxlY3RlZHMsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlVGltZUlucHV0LmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzZWxlY3RlZHMsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmR0UGlja2VyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMubG9jYWxlU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuY29tcGxldGUoKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlZENoYW5nZS5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJblNpbmdsZU1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIH1cblxuICAgIHB1YmxpYyB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yID8gdGhpcy52YWxpZGF0b3IoYykgOiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsaWRhdG9yT25DaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIHRoZSBwaWNrZXIgd2hlbiB1c2VyIGhvbGQgYWx0ICsgRE9XTl9BUlJPV1xuICAgICAqICovXG4gICAgcHVibGljIGhhbmRsZUtleWRvd25Pbkhvc3QoZXZlbnQ6IEtleWJvYXJkRXZlbnQgKTogdm9pZCB7XG4gICAgICAgIGlmIChldmVudC5hbHRLZXkgJiYgZXZlbnQua2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgICAgICAgdGhpcy5kdFBpY2tlci5vcGVuKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUJsdXJPbkhvc3QoZXZlbnQ6IEV2ZW50ICk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUlucHV0T25Ib3N0KGV2ZW50OiBhbnkgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlSW5wdXRJblNpbmdsZU1vZGUodmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3NlbGVjdE1vZGUgPT09ICdyYW5nZScpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlSW5wdXRJblJhbmdlTW9kZSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUlucHV0SW5SYW5nZUZyb21Ub01vZGUodmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUNoYW5nZU9uSG9zdChldmVudDogYW55ICk6IHZvaWQge1xuXG4gICAgICAgIGxldCB2O1xuICAgICAgICBpZiAodGhpcy5pc0luU2luZ2xlTW9kZSkge1xuICAgICAgICAgICAgdiA9IHRoaXMudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luUmFuZ2VNb2RlKSB7XG4gICAgICAgICAgICB2ID0gdGhpcy52YWx1ZXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGVUaW1lQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgICAgICAgdmFsdWU6IHYsXG4gICAgICAgICAgICBpbnB1dDogdGhpcy5lbG1SZWYubmF0aXZlRWxlbWVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG5hdGl2ZSBpbnB1dCBwcm9wZXJ0eSAndmFsdWUnXG4gICAgICovXG4gICAgcHVibGljIGZvcm1hdE5hdGl2ZUlucHV0VmFsdWUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5TaW5nbGVNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KFxuICAgICAgICAgICAgICAgIHRoaXMuZWxtUmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmZvcm1hdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHRQaWNrZXIuZm9ybWF0U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICA6ICcnXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJblJhbmdlTW9kZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlcyAmJiB0aGlzLnZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuX3ZhbHVlc1swXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IHRoaXMuX3ZhbHVlc1sxXTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21Gb3JtYXR0ZWQgPSBmcm9tXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZm9ybWF0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmR0UGlja2VyLmZvcm1hdFN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgOiAnJztcbiAgICAgICAgICAgICAgICBjb25zdCB0b0Zvcm1hdHRlZCA9IHRvXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5kYXRlVGltZUFkYXB0ZXIuZm9ybWF0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0byxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kdFBpY2tlci5mb3JtYXRTdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIDogJyc7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZyb21Gb3JtYXR0ZWQgJiYgIXRvRm9ybWF0dGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3JhbmdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbUZvcm1hdHRlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VTZXBhcmF0b3IgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0Zvcm1hdHRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zZWxlY3RNb2RlID09PSAncmFuZ2VGcm9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbUZvcm1hdHRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zZWxlY3RNb2RlID09PSAncmFuZ2VUbycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbG1SZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvRm9ybWF0dGVkXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsbVJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAnJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgdGhlIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHRoaXMgaW5wdXQgYW5kIGl0cyBwaWNrZXIgY29tcG9uZW50XG4gICAgICovXG4gICAgcHJpdmF0ZSByZWdpc3RlckRhdGVUaW1lUGlja2VyKHBpY2tlcjogT3dsRGF0ZVRpbWVDb21wb25lbnQ8VD4pIHtcbiAgICAgICAgaWYgKHBpY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kdFBpY2tlciA9IHBpY2tlcjtcbiAgICAgICAgICAgIHRoaXMuZHRQaWNrZXIucmVnaXN0ZXJJbnB1dCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSBnaXZlbiBvYmogdG8gYSB2YWxpZCBkYXRlIG9iamVjdFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VmFsaWREYXRlKG9iajogYW55KTogVCB8IG51bGwge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJlxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNWYWxpZChvYmopXG4gICAgICAgICAgICA/IG9ialxuICAgICAgICAgICAgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSB0aW1lIHN0cmluZyB0byBhIGRhdGUtdGltZSBzdHJpbmdcbiAgICAgKiBXaGVuIHBpY2tlclR5cGUgaXMgJ3RpbWVyJywgdGhlIHZhbHVlIGluIHRoZSBwaWNrZXIncyBpbnB1dCBpcyBhIHRpbWUgc3RyaW5nLlxuICAgICAqIFRoZSBkYXRlVGltZUFkYXB0ZXIgcGFyc2UgZm4gY291bGQgbm90IHBhcnNlIGEgdGltZSBzdHJpbmcgdG8gYSBEYXRlIE9iamVjdC5cbiAgICAgKiBUaGVyZWZvcmUgd2UgbmVlZCB0aGlzIGZuIHRvIGNvbnZlcnQgYSB0aW1lIHN0cmluZyB0byBhIGRhdGUtdGltZSBzdHJpbmcuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjb252ZXJ0VGltZVN0cmluZ1RvRGF0ZVRpbWVTdHJpbmcoXG4gICAgICAgIHRpbWVTdHJpbmc6IHN0cmluZyxcbiAgICAgICAgZGF0ZVRpbWU6IFRcbiAgICApOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgaWYgKHRpbWVTdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBkYXRlVGltZSB8fCB0aGlzLmRhdGVUaW1lQWRhcHRlci5ub3coKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5mb3JtYXQoXG4gICAgICAgICAgICAgICAgdixcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lRm9ybWF0cy5kYXRlUGlja2VySW5wdXRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZVN0cmluZyArICcgJyArIHRpbWVTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBpbnB1dCBjaGFuZ2UgaW4gc2luZ2xlIG1vZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYW5nZUlucHV0SW5TaW5nbGVNb2RlKGlucHV0VmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dFZhbHVlO1xuICAgICAgICBpZiAodGhpcy5kdFBpY2tlci5waWNrZXJUeXBlID09PSAndGltZXInKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29udmVydFRpbWVTdHJpbmdUb0RhdGVUaW1lU3RyaW5nKHZhbHVlLCB0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5wYXJzZShcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUZvcm1hdHMucGFyc2VJbnB1dFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmxhc3RWYWx1ZVZhbGlkID0gIXJlc3VsdCB8fCB0aGlzLmRhdGVUaW1lQWRhcHRlci5pc1ZhbGlkKHJlc3VsdCk7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuZ2V0VmFsaWREYXRlKHJlc3VsdCk7XG5cbiAgICAgICAgLy8gaWYgdGhlIG5ld1ZhbHVlIGlzIHRoZSBzYW1lIGFzIHRoZSBvbGRWYWx1ZSwgd2UgaW50ZW5kIHRvIG5vdCBmaXJlIHRoZSB2YWx1ZUNoYW5nZSBldmVudFxuICAgICAgICAvLyByZXN1bHQgZXF1YWxzIHRvIG51bGwgbWVhbnMgdGhlcmUgaXMgaW5wdXQgZXZlbnQsIGJ1dCB0aGUgaW5wdXQgdmFsdWUgaXMgaW52YWxpZFxuICAgICAgICBpZiAoIXRoaXMuaXNTYW1lVmFsdWUocmVzdWx0LCB0aGlzLl92YWx1ZSkgfHwgcmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChyZXN1bHQpO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHJlc3VsdCk7XG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lSW5wdXQuZW1pdCh7XG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHRoaXMuZWxtUmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGlucHV0IGNoYW5nZSBpbiByYW5nZUZyb20gb3IgcmFuZ2VUbyBtb2RlXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGFuZ2VJbnB1dEluUmFuZ2VGcm9tVG9Nb2RlKGlucHV0VmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID1cbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdE1vZGUgPT09ICdyYW5nZUZyb20nXG4gICAgICAgICAgICAgICAgPyB0aGlzLl92YWx1ZXNbMF1cbiAgICAgICAgICAgICAgICA6IHRoaXMuX3ZhbHVlc1sxXTtcblxuICAgICAgICBpZiAodGhpcy5kdFBpY2tlci5waWNrZXJUeXBlID09PSAndGltZXInKSB7XG4gICAgICAgICAgICBpbnB1dFZhbHVlID0gdGhpcy5jb252ZXJ0VGltZVN0cmluZ1RvRGF0ZVRpbWVTdHJpbmcoXG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLnBhcnNlKFxuICAgICAgICAgICAgaW5wdXRWYWx1ZSxcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVGb3JtYXRzLnBhcnNlSW5wdXRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5sYXN0VmFsdWVWYWxpZCA9ICFyZXN1bHQgfHwgdGhpcy5kYXRlVGltZUFkYXB0ZXIuaXNWYWxpZChyZXN1bHQpO1xuICAgICAgICByZXN1bHQgPSB0aGlzLmdldFZhbGlkRGF0ZShyZXN1bHQpO1xuXG4gICAgICAgIC8vIGlmIHRoZSBuZXdWYWx1ZSBpcyB0aGUgc2FtZSBhcyB0aGUgb2xkVmFsdWUsIHdlIGludGVuZCB0byBub3QgZmlyZSB0aGUgdmFsdWVDaGFuZ2UgZXZlbnRcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKHRoaXMuX3NlbGVjdE1vZGUgPT09ICdyYW5nZUZyb20nICYmXG4gICAgICAgICAgICAgICAgdGhpcy5pc1NhbWVWYWx1ZShyZXN1bHQsIHRoaXMuX3ZhbHVlc1swXSkgJiZcbiAgICAgICAgICAgICAgICByZXN1bHQpIHx8XG4gICAgICAgICAgICAodGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3JhbmdlVG8nICYmXG4gICAgICAgICAgICAgICAgdGhpcy5pc1NhbWVWYWx1ZShyZXN1bHQsIHRoaXMuX3ZhbHVlc1sxXSkgJiZcbiAgICAgICAgICAgICAgICByZXN1bHQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmFsdWVzID1cbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdE1vZGUgPT09ICdyYW5nZUZyb20nXG4gICAgICAgICAgICAgICAgPyBbcmVzdWx0LCB0aGlzLl92YWx1ZXNbMV1dXG4gICAgICAgICAgICAgICAgOiBbdGhpcy5fdmFsdWVzWzBdLCByZXN1bHRdO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy5fdmFsdWVzKTtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMuX3ZhbHVlcyk7XG4gICAgICAgIHRoaXMuZGF0ZVRpbWVJbnB1dC5lbWl0KHtcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLl92YWx1ZXMsXG4gICAgICAgICAgICBpbnB1dDogdGhpcy5lbG1SZWYubmF0aXZlRWxlbWVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgaW5wdXQgY2hhbmdlIGluIHJhbmdlIG1vZGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoYW5nZUlucHV0SW5SYW5nZU1vZGUoaW5wdXRWYWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkcyA9IGlucHV0VmFsdWUuc3BsaXQodGhpcy5yYW5nZVNlcGFyYXRvcik7XG4gICAgICAgIGxldCBmcm9tU3RyaW5nID0gc2VsZWN0ZWRzWzBdO1xuICAgICAgICBsZXQgdG9TdHJpbmcgPSBzZWxlY3RlZHNbMV07XG5cbiAgICAgICAgaWYgKHRoaXMuZHRQaWNrZXIucGlja2VyVHlwZSA9PT0gJ3RpbWVyJykge1xuICAgICAgICAgICAgZnJvbVN0cmluZyA9IHRoaXMuY29udmVydFRpbWVTdHJpbmdUb0RhdGVUaW1lU3RyaW5nKFxuICAgICAgICAgICAgICAgIGZyb21TdHJpbmcsXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbMF1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0b1N0cmluZyA9IHRoaXMuY29udmVydFRpbWVTdHJpbmdUb0RhdGVUaW1lU3RyaW5nKFxuICAgICAgICAgICAgICAgIHRvU3RyaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzWzFdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZyb20gPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5wYXJzZShcbiAgICAgICAgICAgIGZyb21TdHJpbmcsXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lRm9ybWF0cy5wYXJzZUlucHV0XG4gICAgICAgICk7XG4gICAgICAgIGxldCB0byA9IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLnBhcnNlKFxuICAgICAgICAgICAgdG9TdHJpbmcsXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lRm9ybWF0cy5wYXJzZUlucHV0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubGFzdFZhbHVlVmFsaWQgPVxuICAgICAgICAgICAgKCFmcm9tIHx8IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzVmFsaWQoZnJvbSkpICYmXG4gICAgICAgICAgICAoIXRvIHx8IHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmlzVmFsaWQodG8pKTtcbiAgICAgICAgZnJvbSA9IHRoaXMuZ2V0VmFsaWREYXRlKGZyb20pO1xuICAgICAgICB0byA9IHRoaXMuZ2V0VmFsaWREYXRlKHRvKTtcblxuICAgICAgICAvLyBpZiB0aGUgbmV3VmFsdWUgaXMgdGhlIHNhbWUgYXMgdGhlIG9sZFZhbHVlLCB3ZSBpbnRlbmQgdG8gbm90IGZpcmUgdGhlIHZhbHVlQ2hhbmdlIGV2ZW50XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmlzU2FtZVZhbHVlKGZyb20sIHRoaXMuX3ZhbHVlc1swXSkgfHxcbiAgICAgICAgICAgICF0aGlzLmlzU2FtZVZhbHVlKHRvLCB0aGlzLl92YWx1ZXNbMV0pIHx8XG4gICAgICAgICAgICAoZnJvbSA9PT0gbnVsbCAmJiB0byA9PT0gbnVsbClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBbZnJvbSwgdG9dO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMuX3ZhbHVlcyk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5fdmFsdWVzKTtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVJbnB1dC5lbWl0KHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX3ZhbHVlcyxcbiAgICAgICAgICAgICAgICBpbnB1dDogdGhpcy5lbG1SZWYubmF0aXZlRWxlbWVudFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgdHdvIHZhbHVlIGlzIHRoZSBzYW1lXG4gICAgICovXG4gICAgcHJpdmF0ZSBpc1NhbWVWYWx1ZShmaXJzdDogVCB8IG51bGwsIHNlY29uZDogVCB8IG51bGwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGZpcnN0ICYmIHNlY29uZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmNvbXBhcmUoZmlyc3QsIHNlY29uZCkgPT09IDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlyc3QgPT09IHNlY29uZDtcbiAgICB9XG59XG4iXX0=