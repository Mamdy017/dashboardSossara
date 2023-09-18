/**
 * date-time-inline.component
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OwlDateTime } from './date-time.class';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';
import * as i0 from "@angular/core";
import * as i1 from "./adapter/date-time-adapter.class";
import * as i2 from "./date-time-picker-container.component";
export const OWL_DATETIME_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwlDateTimeInlineComponent),
    multi: true
};
export class OwlDateTimeInlineComponent extends OwlDateTime {
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
OwlDateTimeInlineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInlineComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.DateTimeAdapter, optional: true }, { token: OWL_DATE_TIME_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
OwlDateTimeInlineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.5", type: OwlDateTimeInlineComponent, selector: "owl-date-time-inline", inputs: { pickerType: "pickerType", disabled: "disabled", selectMode: "selectMode", startAt: "startAt", endAt: "endAt", dateTimeFilter: ["owlDateTimeFilter", "dateTimeFilter"], minDateTime: ["min", "minDateTime"], maxDateTime: ["max", "maxDateTime"], value: "value", values: "values" }, outputs: { yearSelected: "yearSelected", monthSelected: "monthSelected", dateSelected: "dateSelected" }, host: { properties: { "class.owl-dt-inline": "owlDTInlineClass" } }, providers: [OWL_DATETIME_VALUE_ACCESSOR], viewQueries: [{ propertyName: "container", first: true, predicate: OwlDateTimeContainerComponent, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<owl-date-time-container></owl-date-time-container>", styles: [""], components: [{ type: i2.OwlDateTimeContainerComponent, selector: "owl-date-time-container", exportAs: ["owlDateTimeContainer"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: OwlDateTimeInlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'owl-date-time-inline', host: {
                        '[class.owl-dt-inline]': 'owlDTInlineClass'
                    }, changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, providers: [OWL_DATETIME_VALUE_ACCESSOR], template: "<owl-date-time-container></owl-date-time-container>", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.DateTimeAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [OWL_DATE_TIME_FORMATS]
                }] }]; }, propDecorators: { container: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLWlubGluZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kYXRlLXRpbWUvZGF0ZS10aW1lLWlubGluZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kYXRlLXRpbWUvZGF0ZS10aW1lLWlubGluZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFDSCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFBRSxZQUFZLEVBQ3ZCLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RCxPQUFPLEVBQ0gsV0FBVyxFQUlkLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3BFLE9BQU8sRUFDSCxxQkFBcUIsRUFFeEIsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7OztBQUV2RixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBUTtJQUM1QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQTBCLENBQUM7SUFDekQsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBYUYsTUFBTSxPQUFPLDBCQUE4QixTQUFRLFdBQWM7SUFtUDdELFlBQ2MsY0FBaUMsRUFDckIsZUFBbUMsRUFHL0MsZUFBbUM7UUFFN0MsS0FBSyxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQU45QixtQkFBYyxHQUFkLGNBQWMsQ0FBbUI7UUFDckIsb0JBQWUsR0FBZixlQUFlLENBQW9CO1FBRy9DLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQW5QakQ7Ozs7O1dBS0c7UUFDSyxnQkFBVyxHQUFlLE1BQU0sQ0FBQztRQVlqQyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBVWxCLGdCQUFXLEdBQWUsUUFBUSxDQUFDO1FBMEhuQyxZQUFPLEdBQVEsRUFBRSxDQUFDO1FBcUIxQjs7O2FBR0s7UUFFTCxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFLLENBQUM7UUFFckM7OzthQUdLO1FBRUwsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBSyxDQUFDO1FBRXRDOzthQUVLO1FBRUwsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBSyxDQUFDO1FBWTdCLGVBQVUsR0FBUSxFQUFFLENBQUM7UUFrQ3JCLGtCQUFhLEdBQWEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLG1CQUFjLEdBQWEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBVTdDLENBQUM7SUEvT0QsSUFDSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLFVBQVUsQ0FBQyxHQUFlO1FBQzFCLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBR0QsSUFDSSxRQUFRO1FBQ1IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsS0FBYztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFHRCxJQUNJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLElBQWdCO1FBQzNCLElBQ0ksSUFBSSxLQUFLLFFBQVE7WUFDakIsSUFBSSxLQUFLLE9BQU87WUFDaEIsSUFBSSxLQUFLLFdBQVc7WUFDcEIsSUFBSSxLQUFLLFNBQVMsRUFDcEI7WUFDRSxNQUFNLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUlELElBQ0ksT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN4QjtRQUVELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztTQUM3QjthQUFNLElBQ0gsSUFBSSxDQUFDLFVBQVUsS0FBSyxPQUFPO1lBQzNCLElBQUksQ0FBQyxVQUFVLEtBQUssV0FBVyxFQUNqQztZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7U0FDakM7YUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7U0FDakM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsSUFBYztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUN6QyxDQUFDO0lBQ04sQ0FBQztJQUlELElBQ0ksS0FBSztRQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0QjtRQUVELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztTQUM3QjthQUFNLElBQ0gsSUFBSSxDQUFDLFVBQVUsS0FBSyxPQUFPO1lBQzNCLElBQUksQ0FBQyxVQUFVLEtBQUssV0FBVyxFQUNqQztZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7U0FDakM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsSUFBYztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQzNCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUN6QyxDQUFDO0lBQ04sQ0FBQztJQUdELElBQ0ksY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxjQUFjLENBQUMsTUFBbUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7SUFDbEMsQ0FBQztJQUtELElBQUksV0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQ0ksV0FBVyxDQUFDLEtBQWU7UUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBS0QsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFDSSxXQUFXLENBQUMsS0FBZTtRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFHRCxJQUNJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQWU7UUFDckIsS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFHRCxJQUNJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLE1BQVc7UUFDbEIsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQXVCRCxJQUFJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLEtBQWU7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBR0QsSUFBSSxTQUFTO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxNQUFXO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2QsT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLFFBQVEsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2IsT0FBTyxDQUNILElBQUksQ0FBQyxXQUFXLEtBQUssT0FBTztZQUM1QixJQUFJLENBQUMsV0FBVyxLQUFLLFdBQVc7WUFDaEMsSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQ2pDLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDaEIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQWVNLFFBQVE7UUFDWCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDakMsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFVO1FBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7U0FDdkM7YUFBTTtZQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ3JDLENBQUM7U0FDTDtJQUNMLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxFQUFPO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxFQUFPO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRU0sTUFBTSxDQUFDLElBQWE7UUFDdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsT0FBTztTQUNWO1FBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNyQjtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7U0FFSztJQUNFLFVBQVUsQ0FBQyxjQUFpQjtRQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7O1NBRUs7SUFDRSxXQUFXLENBQUMsZUFBa0I7UUFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOztTQUVLO0lBQ0csVUFBVSxDQUFDLGNBQWlCO1FBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7O3VIQTFUUSwwQkFBMEIsa0dBdVB2QixxQkFBcUI7MkdBdlB4QiwwQkFBMEIsNGZBRnhCLENBQUMsMkJBQTJCLENBQUMscUVBSTdCLDZCQUE2QixxRkNsRDVDLHFEQUFtRDsyRkRnRHRDLDBCQUEwQjtrQkFYdEMsU0FBUzsrQkFDSSxzQkFBc0IsUUFHMUI7d0JBQ0YsdUJBQXVCLEVBQUUsa0JBQWtCO3FCQUM5QyxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSx1QkFDMUIsS0FBSyxhQUNmLENBQUMsMkJBQTJCLENBQUM7OzBCQXVQbkMsUUFBUTs7MEJBQ1IsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxxQkFBcUI7NENBcFBqQyxTQUFTO3NCQURSLFNBQVM7dUJBQUMsNkJBQTZCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQVd0RCxVQUFVO3NCQURiLEtBQUs7Z0JBYUYsUUFBUTtzQkFEWCxLQUFLO2dCQVdGLFVBQVU7c0JBRGIsS0FBSztnQkFxQkYsT0FBTztzQkFEVixLQUFLO2dCQTZCRixLQUFLO3NCQURSLEtBQUs7Z0JBMEJGLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMsbUJBQW1CO2dCQWlCdEIsV0FBVztzQkFEZCxLQUFLO3VCQUFDLEtBQUs7Z0JBY1IsV0FBVztzQkFEZCxLQUFLO3VCQUFDLEtBQUs7Z0JBUVIsS0FBSztzQkFEUixLQUFLO2dCQWNGLE1BQU07c0JBRFQsS0FBSztnQkF5Qk4sWUFBWTtzQkFEWCxNQUFNO2dCQVFQLGFBQWE7c0JBRFosTUFBTTtnQkFPUCxZQUFZO3NCQURYLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGRhdGUtdGltZS1pbmxpbmUuY29tcG9uZW50XG4gKi9cblxuaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsIEV2ZW50RW1pdHRlcixcbiAgICBmb3J3YXJkUmVmLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBPbkluaXQsXG4gICAgT3B0aW9uYWwsXG4gICAgT3V0cHV0LFxuICAgIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICAgIE93bERhdGVUaW1lLFxuICAgIFBpY2tlck1vZGUsXG4gICAgUGlja2VyVHlwZSxcbiAgICBTZWxlY3RNb2RlXG59IGZyb20gJy4vZGF0ZS10aW1lLmNsYXNzJztcbmltcG9ydCB7IERhdGVUaW1lQWRhcHRlciB9IGZyb20gJy4vYWRhcHRlci9kYXRlLXRpbWUtYWRhcHRlci5jbGFzcyc7XG5pbXBvcnQge1xuICAgIE9XTF9EQVRFX1RJTUVfRk9STUFUUyxcbiAgICBPd2xEYXRlVGltZUZvcm1hdHNcbn0gZnJvbSAnLi9hZGFwdGVyL2RhdGUtdGltZS1mb3JtYXQuY2xhc3MnO1xuaW1wb3J0IHsgT3dsRGF0ZVRpbWVDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGUtdGltZS1waWNrZXItY29udGFpbmVyLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBPV0xfREFURVRJTUVfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPd2xEYXRlVGltZUlubGluZUNvbXBvbmVudCksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnb3dsLWRhdGUtdGltZS1pbmxpbmUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kYXRlLXRpbWUtaW5saW5lLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9kYXRlLXRpbWUtaW5saW5lLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnW2NsYXNzLm93bC1kdC1pbmxpbmVdJzogJ293bERUSW5saW5lQ2xhc3MnXG4gICAgfSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgICBwcm92aWRlcnM6IFtPV0xfREFURVRJTUVfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE93bERhdGVUaW1lSW5saW5lQ29tcG9uZW50PFQ+IGV4dGVuZHMgT3dsRGF0ZVRpbWU8VD5cbiAgICBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIEBWaWV3Q2hpbGQoT3dsRGF0ZVRpbWVDb250YWluZXJDb21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pXG4gICAgY29udGFpbmVyOiBPd2xEYXRlVGltZUNvbnRhaW5lckNvbXBvbmVudDxUPjtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdHlwZSBvZiB0aGUgZGF0ZVRpbWUgcGlja2VyXG4gICAgICogICAgICAnYm90aCcgLS0gc2hvdyBib3RoIGNhbGVuZGFyIGFuZCB0aW1lclxuICAgICAqICAgICAgJ2NhbGVuZGFyJyAtLSBzaG93IG9ubHkgY2FsZW5kYXJcbiAgICAgKiAgICAgICd0aW1lcicgLS0gc2hvdyBvbmx5IHRpbWVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBfcGlja2VyVHlwZTogUGlja2VyVHlwZSA9ICdib3RoJztcbiAgICBASW5wdXQoKVxuICAgIGdldCBwaWNrZXJUeXBlKCk6IFBpY2tlclR5cGUge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGlja2VyVHlwZTtcbiAgICB9XG5cbiAgICBzZXQgcGlja2VyVHlwZSh2YWw6IFBpY2tlclR5cGUpIHtcbiAgICAgICAgaWYgKHZhbCAhPT0gdGhpcy5fcGlja2VyVHlwZSkge1xuICAgICAgICAgICAgdGhpcy5fcGlja2VyVHlwZSA9IHZhbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2Rpc2FibGVkO1xuICAgIH1cblxuICAgIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2VsZWN0TW9kZTogU2VsZWN0TW9kZSA9ICdzaW5nbGUnO1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHNlbGVjdE1vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RNb2RlO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RNb2RlKG1vZGU6IFNlbGVjdE1vZGUpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgbW9kZSAhPT0gJ3NpbmdsZScgJiZcbiAgICAgICAgICAgIG1vZGUgIT09ICdyYW5nZScgJiZcbiAgICAgICAgICAgIG1vZGUgIT09ICdyYW5nZUZyb20nICYmXG4gICAgICAgICAgICBtb2RlICE9PSAncmFuZ2VUbydcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignT3dsRGF0ZVRpbWUgRXJyb3I6IGludmFsaWQgc2VsZWN0TW9kZSB2YWx1ZSEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3NlbGVjdE1vZGUgPSBtb2RlO1xuICAgIH1cblxuICAgIC8qKiBUaGUgZGF0ZSB0byBvcGVuIHRoZSBjYWxlbmRhciB0byBpbml0aWFsbHkuICovXG4gICAgcHJpdmF0ZSBfc3RhcnRBdDogVCB8IG51bGw7XG4gICAgQElucHV0KClcbiAgICBnZXQgc3RhcnRBdCgpOiBUIHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydEF0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRBdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSB8fCBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2UnIHx8XG4gICAgICAgICAgICB0aGlzLnNlbGVjdE1vZGUgPT09ICdyYW5nZUZyb20nXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzWzBdIHx8IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2VUbycpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlc1sxXSB8fCBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgc3RhcnRBdChkYXRlOiBUIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9zdGFydEF0ID0gdGhpcy5nZXRWYWxpZERhdGUoXG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZShkYXRlKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKiBUaGUgZGF0ZSB0byBvcGVuIGZvciByYW5nZSBjYWxlbmRhci4gKi9cbiAgICBwcml2YXRlIF9lbmRBdDogVCB8IG51bGw7XG4gICAgQElucHV0KClcbiAgICBnZXQgZW5kQXQoKTogVCB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy5fZW5kQXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmRBdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdE1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSB8fCBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2UnIHx8XG4gICAgICAgICAgICB0aGlzLnNlbGVjdE1vZGUgPT09ICdyYW5nZUZyb20nXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzWzFdIHx8IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBlbmRBdChkYXRlOiBUIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9lbmRBdCA9IHRoaXMuZ2V0VmFsaWREYXRlKFxuICAgICAgICAgICAgdGhpcy5kYXRlVGltZUFkYXB0ZXIuZGVzZXJpYWxpemUoZGF0ZSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kYXRlVGltZUZpbHRlcjogKGRhdGU6IFQgfCBudWxsKSA9PiBib29sZWFuO1xuICAgIEBJbnB1dCgnb3dsRGF0ZVRpbWVGaWx0ZXInKVxuICAgIGdldCBkYXRlVGltZUZpbHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGVUaW1lRmlsdGVyO1xuICAgIH1cblxuICAgIHNldCBkYXRlVGltZUZpbHRlcihmaWx0ZXI6IChkYXRlOiBUIHwgbnVsbCkgPT4gYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kYXRlVGltZUZpbHRlciA9IGZpbHRlcjtcbiAgICB9XG5cbiAgICAvKiogVGhlIG1pbmltdW0gdmFsaWQgZGF0ZS4gKi9cbiAgICBwcml2YXRlIF9taW46IFQgfCBudWxsO1xuXG4gICAgZ2V0IG1pbkRhdGVUaW1lKCk6IFQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pbiB8fCBudWxsO1xuICAgIH1cblxuICAgIEBJbnB1dCgnbWluJylcbiAgICBzZXQgbWluRGF0ZVRpbWUodmFsdWU6IFQgfCBudWxsKSB7XG4gICAgICAgIHRoaXMuX21pbiA9IHRoaXMuZ2V0VmFsaWREYXRlKHRoaXMuZGF0ZVRpbWVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgLyoqIFRoZSBtYXhpbXVtIHZhbGlkIGRhdGUuICovXG4gICAgcHJpdmF0ZSBfbWF4OiBUIHwgbnVsbDtcblxuICAgIGdldCBtYXhEYXRlVGltZSgpOiBUIHwgbnVsbCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXggfHwgbnVsbDtcbiAgICB9XG5cbiAgICBASW5wdXQoJ21heCcpXG4gICAgc2V0IG1heERhdGVUaW1lKHZhbHVlOiBUIHwgbnVsbCkge1xuICAgICAgICB0aGlzLl9tYXggPSB0aGlzLmdldFZhbGlkRGF0ZSh0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3ZhbHVlOiBUIHwgbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2YWx1ZTogVCB8IG51bGwpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRWYWxpZERhdGUodmFsdWUpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnNlbGVjdGVkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdmFsdWVzOiBUW10gPSBbXTtcbiAgICBASW5wdXQoKVxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZXM7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlcyh2YWx1ZXM6IFRbXSkge1xuICAgICAgICBpZiAodmFsdWVzICYmIHZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMubWFwKHYgPT4ge1xuICAgICAgICAgICAgICAgIHYgPSB0aGlzLmRhdGVUaW1lQWRhcHRlci5kZXNlcmlhbGl6ZSh2KTtcbiAgICAgICAgICAgICAgICB2ID0gdGhpcy5nZXRWYWxpZERhdGUodik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPyB0aGlzLmRhdGVUaW1lQWRhcHRlci5jbG9uZSh2KSA6IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IFsuLi52YWx1ZXNdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZHMgPSBbLi4udmFsdWVzXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZHMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVtaXRzIHNlbGVjdGVkIHllYXIgaW4gbXVsdGkteWVhciB2aWV3XG4gICAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgICAqICovXG4gICAgQE91dHB1dCgpXG4gICAgeWVhclNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxUPigpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgc2VsZWN0ZWQgbW9udGggaW4geWVhciB2aWV3XG4gICAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgICAqICovXG4gICAgQE91dHB1dCgpXG4gICAgbW9udGhTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIC8qKlxuICAgICAqIEVtaXRzIHNlbGVjdGVkIGRhdGVcbiAgICAgKiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGRhdGVTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAgIHByaXZhdGUgX3NlbGVjdGVkOiBUIHwgbnVsbDtcbiAgICBnZXQgc2VsZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0ZWQodmFsdWU6IFQgfCBudWxsKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2VsZWN0ZWRzOiBUW10gPSBbXTtcbiAgICBnZXQgc2VsZWN0ZWRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRzO1xuICAgIH1cblxuICAgIHNldCBzZWxlY3RlZHModmFsdWVzOiBUW10pIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRzID0gdmFsdWVzO1xuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGdldCBvcGVuZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBwaWNrZXJNb2RlKCk6IFBpY2tlck1vZGUge1xuICAgICAgICByZXR1cm4gJ2lubGluZSc7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5TaW5nbGVNb2RlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3NpbmdsZSc7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5SYW5nZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RNb2RlID09PSAncmFuZ2UnIHx8XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RNb2RlID09PSAncmFuZ2VGcm9tJyB8fFxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0TW9kZSA9PT0gJ3JhbmdlVG8nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZ2V0IG93bERUSW5saW5lQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7IH07XG4gICAgcHJpdmF0ZSBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7IH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGRhdGVUaW1lQWRhcHRlcjogRGF0ZVRpbWVBZGFwdGVyPFQ+LFxuICAgICAgICBAT3B0aW9uYWwoKVxuICAgICAgICBASW5qZWN0KE9XTF9EQVRFX1RJTUVfRk9STUFUUylcbiAgICAgICAgcHJvdGVjdGVkIGRhdGVUaW1lRm9ybWF0czogT3dsRGF0ZVRpbWVGb3JtYXRzXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGRhdGVUaW1lQWRhcHRlciwgZGF0ZVRpbWVGb3JtYXRzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnBpY2tlciA9IHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0luU2luZ2xlTW9kZSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIucGlja2VyTW9tZW50ID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIucGlja2VyTW9tZW50ID0gdGhpcy5fdmFsdWVzW1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFjdGl2ZVNlbGVjdGVkSW5kZXhcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3QoZGF0ZTogVFtdIHwgVCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzID0gWy4uLmRhdGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKGRhdGUpO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW1pdHMgdGhlIHNlbGVjdGVkIHllYXIgaW4gbXVsdGkteWVhciB2aWV3XG4gICAgICogKi9cbiAgICBwdWJsaWMgc2VsZWN0WWVhcihub3JtYWxpemVkWWVhcjogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRZZWFyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyBzZWxlY3RlZCBtb250aCBpbiB5ZWFyIHZpZXdcbiAgICAgKiAqL1xuICAgIHB1YmxpYyBzZWxlY3RNb250aChub3JtYWxpemVkTW9udGg6IFQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb250aFNlbGVjdGVkLmVtaXQobm9ybWFsaXplZE1vbnRoKTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogRW1pdHMgdGhlIHNlbGVjdGVkIGRhdGVcbiAgICAgKiAqL1xuICAgICBwdWJsaWMgc2VsZWN0RGF0ZShub3JtYWxpemVkRGF0ZTogVCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGVTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWREYXRlKTtcbiAgICB9XG59XG4iLCI8b3dsLWRhdGUtdGltZS1jb250YWluZXI+PC9vd2wtZGF0ZS10aW1lLWNvbnRhaW5lcj4iXX0=