import { Directive, Host, Input } from '@angular/core';
import { WizardStep } from '../util/wizard-step.interface';
/**
 * The `awOptionalStep` directive can be used to define an optional `wizard-step`.
 * An optional wizard step is a [[WizardStep]] that doesn't need to be completed to transition to later wizard steps.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-step awOptionalStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-step stepTitle="Second step" awOptionalStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
export class OptionalStepDirective {
    /**
     * Constructor
     *
     * @param wizardStep The wizard step, which contains this [[OptionalStepDirective]]
     */
    constructor(wizardStep) {
        this.wizardStep = wizardStep;
        // tslint:disable-next-line:no-input-rename
        this.optional = true;
    }
    /**
     * Initialization work
     */
    ngOnInit() {
        // The input receives '' when specified in the template without a value.  In this case, apply the default value (`true`).
        this.wizardStep.optional = this.optional || this.optional === '';
    }
}
OptionalStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awOptionalStep]'
            },] }
];
OptionalStepDirective.ctorParameters = () => [
    { type: WizardStep, decorators: [{ type: Host }] }
];
OptionalStepDirective.propDecorators = {
    optional: [{ type: Input, args: ['awOptionalStep',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uYWwtc3RlcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvb3B0aW9uYWwtc3RlcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUV6RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBSUgsTUFBTSxPQUFPLHFCQUFxQjtJQU1oQzs7OztPQUlHO0lBQ0gsWUFBNEIsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVRsRCwyQ0FBMkM7UUFFcEMsYUFBUSxHQUFHLElBQUksQ0FBQztJQVF2QixDQUFDO0lBRUQ7O09BRUc7SUFDSSxRQUFRO1FBQ2IseUhBQXlIO1FBQ3pILElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQWUsS0FBSyxFQUFFLENBQUM7SUFDMUUsQ0FBQzs7O1lBdkJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2FBQzdCOzs7WUExQk8sVUFBVSx1QkFzQ0gsSUFBSTs7O3VCQVJoQixLQUFLLFNBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIEhvc3QsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXaXphcmRTdGVwfSBmcm9tICcuLi91dGlsL3dpemFyZC1zdGVwLmludGVyZmFjZSc7XG5cbi8qKlxuICogVGhlIGBhd09wdGlvbmFsU3RlcGAgZGlyZWN0aXZlIGNhbiBiZSB1c2VkIHRvIGRlZmluZSBhbiBvcHRpb25hbCBgd2l6YXJkLXN0ZXBgLlxuICogQW4gb3B0aW9uYWwgd2l6YXJkIHN0ZXAgaXMgYSBbW1dpemFyZFN0ZXBdXSB0aGF0IGRvZXNuJ3QgbmVlZCB0byBiZSBjb21wbGV0ZWQgdG8gdHJhbnNpdGlvbiB0byBsYXRlciB3aXphcmQgc3RlcHMuXG4gKlxuICogIyMjIFN5bnRheFxuICpcbiAqIGBgYGh0bWxcbiAqIDxhdy13aXphcmQtc3RlcCBhd09wdGlvbmFsU3RlcD5cbiAqICAgICAuLi5cbiAqIDwvYXctd2l6YXJkLXN0ZXA+XG4gKiBgYGBcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxhdy13aXphcmQtc3RlcCBzdGVwVGl0bGU9XCJTZWNvbmQgc3RlcFwiIGF3T3B0aW9uYWxTdGVwPlxuICogICAgIC4uLlxuICogPC9hdy13aXphcmQtc3RlcD5cbiAqIGBgYFxuICpcbiAqIEBhdXRob3IgTWFyYyBBcm5kdFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYXdPcHRpb25hbFN0ZXBdJ1xufSlcbmV4cG9ydCBjbGFzcyBPcHRpb25hbFN0ZXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnB1dC1yZW5hbWVcbiAgQElucHV0KCdhd09wdGlvbmFsU3RlcCcpXG4gIHB1YmxpYyBvcHRpb25hbCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB3aXphcmRTdGVwIFRoZSB3aXphcmQgc3RlcCwgd2hpY2ggY29udGFpbnMgdGhpcyBbW09wdGlvbmFsU3RlcERpcmVjdGl2ZV1dXG4gICAqL1xuICBjb25zdHJ1Y3RvcihASG9zdCgpIHByaXZhdGUgd2l6YXJkU3RlcDogV2l6YXJkU3RlcCkge1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemF0aW9uIHdvcmtcbiAgICovXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBUaGUgaW5wdXQgcmVjZWl2ZXMgJycgd2hlbiBzcGVjaWZpZWQgaW4gdGhlIHRlbXBsYXRlIHdpdGhvdXQgYSB2YWx1ZS4gIEluIHRoaXMgY2FzZSwgYXBwbHkgdGhlIGRlZmF1bHQgdmFsdWUgKGB0cnVlYCkuXG4gICAgdGhpcy53aXphcmRTdGVwLm9wdGlvbmFsID0gdGhpcy5vcHRpb25hbCB8fCB0aGlzLm9wdGlvbmFsIGFzIGFueSA9PT0gJyc7XG4gIH1cbn1cbiJdfQ==