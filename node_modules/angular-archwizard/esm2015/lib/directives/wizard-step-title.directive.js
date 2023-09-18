import { Directive, TemplateRef } from '@angular/core';
/**
 * The `awWizardStepTitle` directive can be used as an alternative to the `stepTitle` input of a [[WizardStep]]
 * to define the content of a step title inside the navigation bar.
 * This step title can be freely created and can contain more than only plain text
 *
 * ### Syntax
 *
 * ```html
 * <ng-template awWizardStepTitle>
 *     ...
 * </ng-template>
 * ```
 *
 * @author Marc Arndt
 */
export class WizardStepTitleDirective {
    /**
     * Constructor
     *
     * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepTitleDirective]]
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
WizardStepTitleDirective.decorators = [
    { type: Directive, args: [{
                selector: 'ng-template[awStepTitle], ng-template[awWizardStepTitle]'
            },] }
];
WizardStepTitleDirective.ctorParameters = () => [
    { type: TemplateRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXN0ZXAtdGl0bGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL3dpemFyZC1zdGVwLXRpdGxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVyRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUlILE1BQU0sT0FBTyx3QkFBd0I7SUFDbkM7Ozs7T0FJRztJQUNILFlBQW1CLFdBQTZCO1FBQTdCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtJQUNoRCxDQUFDOzs7WUFWRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBEQUEwRDthQUNyRTs7O1lBbkJrQixXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBUaGUgYGF3V2l6YXJkU3RlcFRpdGxlYCBkaXJlY3RpdmUgY2FuIGJlIHVzZWQgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGBzdGVwVGl0bGVgIGlucHV0IG9mIGEgW1tXaXphcmRTdGVwXV1cbiAqIHRvIGRlZmluZSB0aGUgY29udGVudCBvZiBhIHN0ZXAgdGl0bGUgaW5zaWRlIHRoZSBuYXZpZ2F0aW9uIGJhci5cbiAqIFRoaXMgc3RlcCB0aXRsZSBjYW4gYmUgZnJlZWx5IGNyZWF0ZWQgYW5kIGNhbiBjb250YWluIG1vcmUgdGhhbiBvbmx5IHBsYWluIHRleHRcbiAqXG4gKiAjIyMgU3ludGF4XG4gKlxuICogYGBgaHRtbFxuICogPG5nLXRlbXBsYXRlIGF3V2l6YXJkU3RlcFRpdGxlPlxuICogICAgIC4uLlxuICogPC9uZy10ZW1wbGF0ZT5cbiAqIGBgYFxuICpcbiAqIEBhdXRob3IgTWFyYyBBcm5kdFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVthd1N0ZXBUaXRsZV0sIG5nLXRlbXBsYXRlW2F3V2l6YXJkU3RlcFRpdGxlXSdcbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkU3RlcFRpdGxlRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZVJlZiBBIHJlZmVyZW5jZSB0byB0aGUgY29udGVudCBvZiB0aGUgYG5nLXRlbXBsYXRlYCB0aGF0IGNvbnRhaW5zIHRoaXMgW1tXaXphcmRTdGVwVGl0bGVEaXJlY3RpdmVdXVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7XG4gIH1cbn1cbiJdfQ==