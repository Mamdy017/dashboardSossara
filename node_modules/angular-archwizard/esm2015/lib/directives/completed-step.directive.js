import { Directive, Host, Input } from '@angular/core';
import { WizardStep } from '../util/wizard-step.interface';
/**
 * The `awCompletedStep` directive can be used to make a wizard step initially completed.
 *
 * Initially completed steps are shown as completed when the wizard is presented to the user.
 *
 * A typical use case is to make a step initially completed if it is automatically filled with some derived/predefined information.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-step awCompletedStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * An optional boolean condition can be specified:
 *
 * ```html
 * <aw-wizard-step [awCompletedStep]="shouldBeCompleted">
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-step stepTitle="First step" [awCompletedStep]="firstStepPrefilled">
 *     ...
 * </aw-wizard-step>
 * ```
 */
export class CompletedStepDirective {
    /**
     * Constructor
     *
     * @param wizardStep The wizard step, which contains this [[CompletedStepDirective]]
     */
    constructor(wizardStep) {
        this.wizardStep = wizardStep;
        // tslint:disable-next-line:no-input-rename
        this.initiallyCompleted = true;
    }
    /**
     * Initialization work
     */
    ngOnInit() {
        // The input receives '' when specified in the template without a value.  In this case, apply the default value (`true`).
        this.wizardStep.initiallyCompleted = this.initiallyCompleted || this.initiallyCompleted === '';
    }
}
CompletedStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awCompletedStep]'
            },] }
];
CompletedStepDirective.ctorParameters = () => [
    { type: WizardStep, decorators: [{ type: Host }] }
];
CompletedStepDirective.propDecorators = {
    initiallyCompleted: [{ type: Input, args: ['awCompletedStep',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGVkLXN0ZXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL2NvbXBsZXRlZC1zdGVwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRXpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFJSCxNQUFNLE9BQU8sc0JBQXNCO0lBTWpDOzs7O09BSUc7SUFDSCxZQUE0QixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBVGxELDJDQUEyQztRQUVwQyx1QkFBa0IsR0FBRyxJQUFJLENBQUM7SUFRakMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLHlIQUF5SDtRQUN6SCxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsa0JBQXlCLEtBQUssRUFBRSxDQUFDO0lBQ3hHLENBQUM7OztZQXZCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjthQUM5Qjs7O1lBbkNPLFVBQVUsdUJBK0NILElBQUk7OztpQ0FSaEIsS0FBSyxTQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlyZWN0aXZlLCBIb3N0LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2l6YXJkU3RlcH0gZnJvbSAnLi4vdXRpbC93aXphcmQtc3RlcC5pbnRlcmZhY2UnO1xuXG4vKipcbiAqIFRoZSBgYXdDb21wbGV0ZWRTdGVwYCBkaXJlY3RpdmUgY2FuIGJlIHVzZWQgdG8gbWFrZSBhIHdpemFyZCBzdGVwIGluaXRpYWxseSBjb21wbGV0ZWQuXG4gKlxuICogSW5pdGlhbGx5IGNvbXBsZXRlZCBzdGVwcyBhcmUgc2hvd24gYXMgY29tcGxldGVkIHdoZW4gdGhlIHdpemFyZCBpcyBwcmVzZW50ZWQgdG8gdGhlIHVzZXIuXG4gKlxuICogQSB0eXBpY2FsIHVzZSBjYXNlIGlzIHRvIG1ha2UgYSBzdGVwIGluaXRpYWxseSBjb21wbGV0ZWQgaWYgaXQgaXMgYXV0b21hdGljYWxseSBmaWxsZWQgd2l0aCBzb21lIGRlcml2ZWQvcHJlZGVmaW5lZCBpbmZvcm1hdGlvbi5cbiAqXG4gKiAjIyMgU3ludGF4XG4gKlxuICogYGBgaHRtbFxuICogPGF3LXdpemFyZC1zdGVwIGF3Q29tcGxldGVkU3RlcD5cbiAqICAgICAuLi5cbiAqIDwvYXctd2l6YXJkLXN0ZXA+XG4gKiBgYGBcbiAqXG4gKiBBbiBvcHRpb25hbCBib29sZWFuIGNvbmRpdGlvbiBjYW4gYmUgc3BlY2lmaWVkOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxhdy13aXphcmQtc3RlcCBbYXdDb21wbGV0ZWRTdGVwXT1cInNob3VsZEJlQ29tcGxldGVkXCI+XG4gKiAgICAgLi4uXG4gKiA8L2F3LXdpemFyZC1zdGVwPlxuICogYGBgXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBodG1sXG4gKiA8YXctd2l6YXJkLXN0ZXAgc3RlcFRpdGxlPVwiRmlyc3Qgc3RlcFwiIFthd0NvbXBsZXRlZFN0ZXBdPVwiZmlyc3RTdGVwUHJlZmlsbGVkXCI+XG4gKiAgICAgLi4uXG4gKiA8L2F3LXdpemFyZC1zdGVwPlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thd0NvbXBsZXRlZFN0ZXBdJ1xufSlcbmV4cG9ydCBjbGFzcyBDb21wbGV0ZWRTdGVwRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXG4gIEBJbnB1dCgnYXdDb21wbGV0ZWRTdGVwJylcbiAgcHVibGljIGluaXRpYWxseUNvbXBsZXRlZCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB3aXphcmRTdGVwIFRoZSB3aXphcmQgc3RlcCwgd2hpY2ggY29udGFpbnMgdGhpcyBbW0NvbXBsZXRlZFN0ZXBEaXJlY3RpdmVdXVxuICAgKi9cbiAgY29uc3RydWN0b3IoQEhvc3QoKSBwcml2YXRlIHdpemFyZFN0ZXA6IFdpemFyZFN0ZXApIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXphdGlvbiB3b3JrXG4gICAqL1xuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gVGhlIGlucHV0IHJlY2VpdmVzICcnIHdoZW4gc3BlY2lmaWVkIGluIHRoZSB0ZW1wbGF0ZSB3aXRob3V0IGEgdmFsdWUuICBJbiB0aGlzIGNhc2UsIGFwcGx5IHRoZSBkZWZhdWx0IHZhbHVlIChgdHJ1ZWApLlxuICAgIHRoaXMud2l6YXJkU3RlcC5pbml0aWFsbHlDb21wbGV0ZWQgPSB0aGlzLmluaXRpYWxseUNvbXBsZXRlZCB8fCB0aGlzLmluaXRpYWxseUNvbXBsZXRlZCBhcyBhbnkgPT09ICcnO1xuICB9XG59XG4iXX0=