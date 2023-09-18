/**
 * calendar-body.component
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class CalendarCell {
    constructor(value, displayValue, ariaLabel, enabled, out = false, cellClass = '') {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.out = out;
        this.cellClass = cellClass;
    }
}
export class OwlCalendarBodyComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kYXRlLXRpbWUvY2FsZW5kYXItYm9keS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9waWNrZXIvc3JjL2xpYi9kYXRlLXRpbWUvY2FsZW5kYXItYm9keS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUVILE9BQU8sRUFDSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFFdEMsTUFBTSxPQUFPLFlBQVk7SUFDckIsWUFDVyxLQUFhLEVBQ2IsWUFBb0IsRUFDcEIsU0FBaUIsRUFDakIsT0FBZ0IsRUFDaEIsTUFBZSxLQUFLLEVBQ3BCLFlBQW9CLEVBQUU7UUFMdEIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQ3BCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixRQUFHLEdBQUgsR0FBRyxDQUFpQjtRQUNwQixjQUFTLEdBQVQsU0FBUyxDQUFhO0lBQzlCLENBQUM7Q0FDUDtBQWFELE1BQU0sT0FBTyx3QkFBd0I7SUFpRWpDLFlBQW9CLE1BQWtCLEVBQVUsTUFBYztRQUExQyxXQUFNLEdBQU4sTUFBTSxDQUFZO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQWhFOUQ7O1dBRUc7UUFFSCxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBUWY7O2FBRUs7UUFFTCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBRVo7O1dBRUc7UUFFSCxjQUFTLEdBQUcsQ0FB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QUFFO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtpQkFDZixZQUFZLEVBQUU7aUJBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDYixTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYTtxQkFDcEIsYUFBYSxDQUFDLDhCQUE4QixDQUFDO3FCQUM3QyxLQUFLLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7cUhBcEpRLHdCQUF3Qjt5R0FBeEIsd0JBQXdCLG1aQ3ZDckMsMjVDQTJCQTsyRkRZYSx3QkFBd0I7a0JBWHBDLFNBQVM7K0JBQ0ksK0JBQStCLFlBQy9CLHlCQUF5QixRQUc3Qjt3QkFDRiw4QkFBOEIsRUFBRSx3QkFBd0I7cUJBQzNELHVCQUNvQixLQUFLLG1CQUNULHVCQUF1QixDQUFDLE1BQU07c0hBTy9DLFVBQVU7c0JBRFQsS0FBSztnQkFPTixJQUFJO3NCQURILEtBQUs7Z0JBT04sT0FBTztzQkFETixLQUFLO2dCQU9OLFNBQVM7c0JBRFIsS0FBSztnQkFPTixVQUFVO3NCQURULEtBQUs7Z0JBT04sY0FBYztzQkFEYixLQUFLO2dCQU9OLFVBQVU7c0JBRFQsS0FBSztnQkFPVSxNQUFNO3NCQURyQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBjYWxlbmRhci1ib2R5LmNvbXBvbmVudFxuICovXG5cbmltcG9ydCB7XG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE5nWm9uZSxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2VsZWN0TW9kZSB9IGZyb20gJy4vZGF0ZS10aW1lLmNsYXNzJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjbGFzcyBDYWxlbmRhckNlbGwge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgdmFsdWU6IG51bWJlcixcbiAgICAgICAgcHVibGljIGRpc3BsYXlWYWx1ZTogc3RyaW5nLFxuICAgICAgICBwdWJsaWMgYXJpYUxhYmVsOiBzdHJpbmcsXG4gICAgICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuLFxuICAgICAgICBwdWJsaWMgb3V0OiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgIHB1YmxpYyBjZWxsQ2xhc3M6IHN0cmluZyA9ICcnXG4gICAgKSB7fVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ1tvd2wtZGF0ZS10aW1lLWNhbGVuZGFyLWJvZHldJyxcbiAgICBleHBvcnRBczogJ293bERhdGVUaW1lQ2FsZW5kYXJCb2R5JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXItYm9keS5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2FsZW5kYXItYm9keS5jb21wb25lbnQuc2NzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ1tjbGFzcy5vd2wtZHQtY2FsZW5kYXItYm9keV0nOiAnb3dsRFRDYWxlbmRhckJvZHlDbGFzcydcbiAgICB9LFxuICAgIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE93bENhbGVuZGFyQm9keUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgLyoqXG4gICAgICogVGhlIGNlbGwgbnVtYmVyIG9mIHRoZSBhY3RpdmUgY2VsbCBpbiB0aGUgdGFibGUuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBhY3RpdmVDZWxsID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjZWxscyB0byBkaXNwbGF5IGluIHRoZSB0YWJsZS5cbiAgICAgKiAqL1xuICAgIEBJbnB1dCgpXG4gICAgcm93czogQ2FsZW5kYXJDZWxsW11bXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgdGFibGUuXG4gICAgICogKi9cbiAgICBASW5wdXQoKVxuICAgIG51bUNvbHMgPSA3O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJhdGlvICh3aWR0aCAvIGhlaWdodCkgdG8gdXNlIGZvciB0aGUgY2VsbHMgaW4gdGhlIHRhYmxlLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgY2VsbFJhdGlvID0gMTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBjb3JyZXNwb25kcyB0byB0b2RheS5cbiAgICAgKiAqL1xuICAgIEBJbnB1dCgpXG4gICAgdG9kYXlWYWx1ZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSB0aGF0IGlzIGN1cnJlbnRseSBzZWxlY3RlZC5cbiAgICAgKiAqL1xuICAgIEBJbnB1dCgpXG4gICAgc2VsZWN0ZWRWYWx1ZXM6IG51bWJlcltdO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCBwaWNrZXIgc2VsZWN0IG1vZGVcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHNlbGVjdE1vZGU6IFNlbGVjdE1vZGU7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0IHdoZW4gYSBjYWxlbmRhciBjZWxsIGlzIHNlbGVjdGVkXG4gICAgICogKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhckNlbGw+KCk7XG5cbiAgICBnZXQgb3dsRFRDYWxlbmRhckJvZHlDbGFzcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZ2V0IGlzSW5TaW5nbGVNb2RlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RNb2RlID09PSAnc2luZ2xlJztcbiAgICB9XG5cbiAgICBnZXQgaXNJblJhbmdlTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0TW9kZSA9PT0gJ3JhbmdlJyB8fFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2VGcm9tJyB8fFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RNb2RlID09PSAncmFuZ2VUbydcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsbVJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSkge31cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHt9XG5cbiAgICBwdWJsaWMgc2VsZWN0Q2VsbChjZWxsOiBDYWxlbmRhckNlbGwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3QuZW1pdChjZWxsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBY3RpdmVDZWxsKHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgY2VsbE51bWJlciA9IHJvd0luZGV4ICogdGhpcy5udW1Db2xzICsgY29sSW5kZXg7XG4gICAgICAgIHJldHVybiBjZWxsTnVtYmVyID09PSB0aGlzLmFjdGl2ZUNlbGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIGNlbGwgaXMgc2VsZWN0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNTZWxlY3RlZCh2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZFZhbHVlcyB8fCB0aGlzLnNlbGVjdGVkVmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNJblNpbmdsZU1vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdGhpcy5zZWxlY3RlZFZhbHVlc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzSW5SYW5nZU1vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21WYWx1ZSA9IHRoaXMuc2VsZWN0ZWRWYWx1ZXNbMF07XG4gICAgICAgICAgICBjb25zdCB0b1ZhbHVlID0gdGhpcy5zZWxlY3RlZFZhbHVlc1sxXTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBmcm9tVmFsdWUgfHwgdmFsdWUgPT09IHRvVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgY2VsbCBpbiB0aGUgcmFuZ2VcbiAgICAgKiAqL1xuICAgIHB1YmxpYyBpc0luUmFuZ2UodmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc0luUmFuZ2VNb2RlKSB7XG4gICAgICAgICAgICBjb25zdCBmcm9tVmFsdWUgPSB0aGlzLnNlbGVjdGVkVmFsdWVzWzBdO1xuICAgICAgICAgICAgY29uc3QgdG9WYWx1ZSA9IHRoaXMuc2VsZWN0ZWRWYWx1ZXNbMV07XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IG51bGwgJiYgdG9WYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA+PSBmcm9tVmFsdWUgJiYgdmFsdWUgPD0gdG9WYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBmcm9tVmFsdWUgfHwgdmFsdWUgPT09IHRvVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgY2VsbCBpcyB0aGUgcmFuZ2UgZnJvbVxuICAgICAqICovXG4gICAgcHVibGljIGlzUmFuZ2VGcm9tKHZhbHVlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJblJhbmdlTW9kZSkge1xuICAgICAgICAgICAgY29uc3QgZnJvbVZhbHVlID0gdGhpcy5zZWxlY3RlZFZhbHVlc1swXTtcbiAgICAgICAgICAgIHJldHVybiBmcm9tVmFsdWUgIT09IG51bGwgJiYgdmFsdWUgPT09IGZyb21WYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBjZWxsIGlzIHRoZSByYW5nZSB0b1xuICAgICAqICovXG4gICAgcHVibGljIGlzUmFuZ2VUbyh2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5SYW5nZU1vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvVmFsdWUgPSB0aGlzLnNlbGVjdGVkVmFsdWVzWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRvVmFsdWUgIT09IG51bGwgJiYgdmFsdWUgPT09IHRvVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb2N1cyB0byBhIGFjdGl2ZSBjZWxsXG4gICAgICogKi9cbiAgICBwdWJsaWMgZm9jdXNBY3RpdmVDZWxsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5nWm9uZS5vblN0YWJsZVxuICAgICAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAgICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxtUmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCcub3dsLWR0LWNhbGVuZGFyLWNlbGwtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCI8dHIgKm5nRm9yPVwibGV0IHJvdyBvZiByb3dzOyBsZXQgcm93SW5kZXggPSBpbmRleFwiIHJvbGU9XCJyb3dcIj5cbiAgICA8dGQgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygcm93OyBsZXQgY29sSW5kZXggPSBpbmRleFwiXG4gICAgICAgIGNsYXNzPVwib3dsLWR0LWNhbGVuZGFyLWNlbGwge3tpdGVtLmNlbGxDbGFzc319XCJcbiAgICAgICAgW3RhYmluZGV4XT1cImlzQWN0aXZlQ2VsbChyb3dJbmRleCwgY29sSW5kZXgpID8gMCA6IC0xXCJcbiAgICAgICAgW2NsYXNzLm93bC1kdC1jYWxlbmRhci1jZWxsLWFjdGl2ZV09XCJpc0FjdGl2ZUNlbGwocm93SW5kZXgsIGNvbEluZGV4KVwiXG4gICAgICAgIFtjbGFzcy5vd2wtZHQtY2FsZW5kYXItY2VsbC1kaXNhYmxlZF09XCIhaXRlbS5lbmFibGVkXCJcbiAgICAgICAgW2NsYXNzLm93bC1kdC1jYWxlbmRhci1jZWxsLWluLXJhbmdlXT1cImlzSW5SYW5nZShpdGVtLnZhbHVlKVwiXG4gICAgICAgIFtjbGFzcy5vd2wtZHQtY2FsZW5kYXItY2VsbC1yYW5nZS1mcm9tXT1cImlzUmFuZ2VGcm9tKGl0ZW0udmFsdWUpXCJcbiAgICAgICAgW2NsYXNzLm93bC1kdC1jYWxlbmRhci1jZWxsLXJhbmdlLXRvXT1cImlzUmFuZ2VUbyhpdGVtLnZhbHVlKVwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiaXRlbS5hcmlhTGFiZWxcIlxuICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cIiFpdGVtLmVuYWJsZWQgfHwgbnVsbFwiXG4gICAgICAgIFthdHRyLmFyaWEtY3VycmVudF09XCJpdGVtLnZhbHVlID09PSB0b2RheVZhbHVlID8gJ2RhdGUnIDogbnVsbFwiXG4gICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZChpdGVtLnZhbHVlKVwiXG4gICAgICAgIFtzdHlsZS53aWR0aC4lXT1cIjEwMCAvIG51bUNvbHNcIlxuICAgICAgICBbc3R5bGUucGFkZGluZ1RvcC4lXT1cIjUwICogY2VsbFJhdGlvIC8gbnVtQ29sc1wiXG4gICAgICAgIFtzdHlsZS5wYWRkaW5nQm90dG9tLiVdPVwiNTAgKiBjZWxsUmF0aW8gLyBudW1Db2xzXCJcbiAgICAgICAgKGNsaWNrKT1cInNlbGVjdENlbGwoaXRlbSlcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJvd2wtZHQtY2FsZW5kYXItY2VsbC1jb250ZW50XCJcbiAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICdvd2wtZHQtY2FsZW5kYXItY2VsbC1vdXQnOiBpdGVtLm91dCxcbiAgICAgICAgICAgICAgICAnb3dsLWR0LWNhbGVuZGFyLWNlbGwtdG9kYXknOiBpdGVtLnZhbHVlID09PSB0b2RheVZhbHVlLFxuICAgICAgICAgICAgICAgICdvd2wtZHQtY2FsZW5kYXItY2VsbC1zZWxlY3RlZCc6IGlzU2VsZWN0ZWQoaXRlbS52YWx1ZSlcbiAgICAgICAgICAgICAgfVwiPlxuICAgICAgICAgICAge3tpdGVtLmRpc3BsYXlWYWx1ZX19XG4gICAgICAgIDwvc3Bhbj5cbiAgICA8L3RkPlxuPC90cj5cbiJdfQ==