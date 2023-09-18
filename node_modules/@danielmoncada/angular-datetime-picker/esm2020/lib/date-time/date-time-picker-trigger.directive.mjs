/**
 * date-time-picker-trigger.directive
 */
import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { merge, of as observableOf, Subscription } from 'rxjs';
import * as i0 from "@angular/core";
export class OwlDateTimeTriggerDirective {
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
            this.dtPicker.dtInput.disabledChange : observableOf();
        const pickerDisabled = this.dtPicker ?
            this.dtPicker.disabledChange : observableOf();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXBpY2tlci10cmlnZ2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3BpY2tlci9zcmMvbGliL2RhdGUtdGltZS9kYXRlLXRpbWUtcGlja2VyLXRyaWdnZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBR0gsT0FBTyxFQUVILGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUtSLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBUy9ELE1BQU0sT0FBTywyQkFBMkI7SUFvQnBDLFlBQXVCLGNBQWlDO1FBQWpDLG1CQUFjLEdBQWQsY0FBYyxDQUFtQjtRQUZoRCxpQkFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFHMUMsQ0FBQztJQWhCRCxJQUNJLFFBQVE7UUFDUixPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDcEYsQ0FBQztJQUVELElBQUksUUFBUSxDQUFFLEtBQWM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUkseUJBQXlCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBT00sUUFBUTtJQUNmLENBQUM7SUFFTSxXQUFXLENBQUUsT0FBc0I7UUFDdEMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztJQUVNLGtCQUFrQjtRQUNyQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sV0FBVztRQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVNLGlCQUFpQixDQUFFLEtBQVk7UUFDbEMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDM0I7SUFDTCxDQUFDO0lBRU8saUJBQWlCO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFMUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVsRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDO2FBQ25ELFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7d0hBNURRLDJCQUEyQjs0R0FBM0IsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBUHZDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFO3dCQUNGLFNBQVMsRUFBRSwyQkFBMkI7d0JBQ3RDLGlDQUFpQyxFQUFFLDJCQUEyQjtxQkFDakU7aUJBQ0o7d0dBR2dDLFFBQVE7c0JBQXBDLEtBQUs7dUJBQUMsb0JBQW9CO2dCQUl2QixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGRhdGUtdGltZS1waWNrZXItdHJpZ2dlci5kaXJlY3RpdmVcbiAqL1xuXG5cbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBEaXJlY3RpdmUsXG4gICAgSW5wdXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE93bERhdGVUaW1lQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbb3dsRGF0ZVRpbWVUcmlnZ2VyXScsXG4gICAgaG9zdDoge1xuICAgICAgICAnKGNsaWNrKSc6ICdoYW5kbGVDbGlja09uSG9zdCgkZXZlbnQpJyxcbiAgICAgICAgJ1tjbGFzcy5vd2wtZHQtdHJpZ2dlci1kaXNhYmxlZF0nOiAnb3dsRFRUcmlnZ2VyRGlzYWJsZWRDbGFzcydcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE93bERhdGVUaW1lVHJpZ2dlckRpcmVjdGl2ZTxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCdvd2xEYXRlVGltZVRyaWdnZXInKSBkdFBpY2tlcjogT3dsRGF0ZVRpbWVDb21wb25lbnQ8VD47XG5cbiAgICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcbiAgICBASW5wdXQoKVxuICAgIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgPyB0aGlzLmR0UGlja2VyLmRpc2FibGVkIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBzZXQgZGlzYWJsZWQoIHZhbHVlOiBib29sZWFuICkge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCBvd2xEVFRyaWdnZXJEaXNhYmxlZENsYXNzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRlQ2hhbmdlcyA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAgIGNvbnN0cnVjdG9yKCBwcm90ZWN0ZWQgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmICkge1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoIGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMgKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzLmRhdGVwaWNrZXIpIHtcbiAgICAgICAgICAgIHRoaXMud2F0Y2hTdGF0ZUNoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMud2F0Y2hTdGF0ZUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUNsaWNrT25Ib3N0KCBldmVudDogRXZlbnQgKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmR0UGlja2VyKSB7XG4gICAgICAgICAgICB0aGlzLmR0UGlja2VyLm9wZW4oKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3YXRjaFN0YXRlQ2hhbmdlcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcblxuICAgICAgICBjb25zdCBpbnB1dERpc2FibGVkID0gdGhpcy5kdFBpY2tlciAmJiB0aGlzLmR0UGlja2VyLmR0SW5wdXQgP1xuICAgICAgICAgICAgdGhpcy5kdFBpY2tlci5kdElucHV0LmRpc2FibGVkQ2hhbmdlIDogb2JzZXJ2YWJsZU9mKCk7XG5cbiAgICAgICAgY29uc3QgcGlja2VyRGlzYWJsZWQgPSB0aGlzLmR0UGlja2VyID9cbiAgICAgICAgICAgIHRoaXMuZHRQaWNrZXIuZGlzYWJsZWRDaGFuZ2UgOiBvYnNlcnZhYmxlT2YoKTtcblxuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcyA9IG1lcmdlKHBpY2tlckRpc2FibGVkLCBpbnB1dERpc2FibGVkKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==