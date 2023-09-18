import { Component, forwardRef } from '@angular/core';
import { WizardCompletionStep } from '../util/wizard-completion-step.interface';
import { WizardStep } from '../util/wizard-step.interface';
/**
 * The `aw-wizard-completion-step` component can be used to define a completion/success step at the end of your wizard
 * After a `aw-wizard-completion-step` has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a `aw-wizard-completion-step` automatically sets the `aw-wizard` and all steps inside the `aw-wizard`
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-completion-step [stepTitle]="title of the wizard step"
 *    [navigationSymbol]="{ symbol: 'navigation symbol', fontFamily: 'navigation symbol font family' }"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </aw-wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-completion-step stepTitle="Step 1" [navigationSymbol]="{ symbol: '1' }">
 *    ...
 * </aw-wizard-completion-step>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <aw-wizard-completion-step stepTitle="Step 1" [navigationSymbol]="{ symbol: '&#xf1ba;', fontFamily: 'FontAwesome' }">
 *    ...
 * </aw-wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
export class WizardCompletionStepComponent extends WizardCompletionStep {
}
WizardCompletionStepComponent.decorators = [
    { type: Component, args: [{
                selector: 'aw-wizard-completion-step',
                template: "<ng-content></ng-content>\n",
                providers: [
                    { provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepComponent) },
                    { provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepComponent) }
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLWNvbXBsZXRpb24tc3RlcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvd2l6YXJkLWNvbXBsZXRpb24tc3RlcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDOUUsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRXpEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1DRztBQVNILE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxvQkFBb0I7OztZQVJ0RSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsdUNBQW9EO2dCQUNwRCxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUMsRUFBQztvQkFDbkYsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFDO2lCQUM5RjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXaXphcmRDb21wbGV0aW9uU3RlcH0gZnJvbSAnLi4vdXRpbC93aXphcmQtY29tcGxldGlvbi1zdGVwLmludGVyZmFjZSc7XG5pbXBvcnQge1dpemFyZFN0ZXB9IGZyb20gJy4uL3V0aWwvd2l6YXJkLXN0ZXAuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBUaGUgYGF3LXdpemFyZC1jb21wbGV0aW9uLXN0ZXBgIGNvbXBvbmVudCBjYW4gYmUgdXNlZCB0byBkZWZpbmUgYSBjb21wbGV0aW9uL3N1Y2Nlc3Mgc3RlcCBhdCB0aGUgZW5kIG9mIHlvdXIgd2l6YXJkXG4gKiBBZnRlciBhIGBhdy13aXphcmQtY29tcGxldGlvbi1zdGVwYCBoYXMgYmVlbiBlbnRlcmVkLCBpdCBoYXMgdGhlIGNoYXJhY3RlcmlzdGljIHRoYXQgdGhlIHVzZXIgaXMgYmxvY2tlZCBmcm9tXG4gKiBsZWF2aW5nIGl0IGFnYWluIHRvIGEgcHJldmlvdXMgc3RlcC5cbiAqIEluIGFkZGl0aW9uIGVudGVyaW5nIGEgYGF3LXdpemFyZC1jb21wbGV0aW9uLXN0ZXBgIGF1dG9tYXRpY2FsbHkgc2V0cyB0aGUgYGF3LXdpemFyZGAgYW5kIGFsbCBzdGVwcyBpbnNpZGUgdGhlIGBhdy13aXphcmRgXG4gKiBhcyBjb21wbGV0ZWQuXG4gKlxuICogIyMjIFN5bnRheFxuICpcbiAqIGBgYGh0bWxcbiAqIDxhdy13aXphcmQtY29tcGxldGlvbi1zdGVwIFtzdGVwVGl0bGVdPVwidGl0bGUgb2YgdGhlIHdpemFyZCBzdGVwXCJcbiAqICAgIFtuYXZpZ2F0aW9uU3ltYm9sXT1cInsgc3ltYm9sOiAnbmF2aWdhdGlvbiBzeW1ib2wnLCBmb250RmFtaWx5OiAnbmF2aWdhdGlvbiBzeW1ib2wgZm9udCBmYW1pbHknIH1cIlxuICogICAgKHN0ZXBFbnRlcik9XCJldmVudCBlbWl0dGVyIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB3aXphcmQgc3RlcCBpcyBlbnRlcmVkXCJcbiAqICAgIChzdGVwRXhpdCk9XCJldmVudCBlbWl0dGVyIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB3aXphcmQgc3RlcCBpcyBleGl0ZWRcIj5cbiAqICAgIC4uLlxuICogPC9hdy13aXphcmQtY29tcGxldGlvbi1zdGVwPlxuICogYGBgXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBodG1sXG4gKiA8YXctd2l6YXJkLWNvbXBsZXRpb24tc3RlcCBzdGVwVGl0bGU9XCJTdGVwIDFcIiBbbmF2aWdhdGlvblN5bWJvbF09XCJ7IHN5bWJvbDogJzEnIH1cIj5cbiAqICAgIC4uLlxuICogPC9hdy13aXphcmQtY29tcGxldGlvbi1zdGVwPlxuICogYGBgXG4gKlxuICogV2l0aCBhIG5hdmlnYXRpb24gc3ltYm9sIGZyb20gdGhlIGBmb250LWF3ZXNvbWVgIGZvbnQ6XG4gKlxuICogYGBgaHRtbFxuICogPGF3LXdpemFyZC1jb21wbGV0aW9uLXN0ZXAgc3RlcFRpdGxlPVwiU3RlcCAxXCIgW25hdmlnYXRpb25TeW1ib2xdPVwieyBzeW1ib2w6ICcmI3hmMWJhOycsIGZvbnRGYW1pbHk6ICdGb250QXdlc29tZScgfVwiPlxuICogICAgLi4uXG4gKiA8L2F3LXdpemFyZC1jb21wbGV0aW9uLXN0ZXA+XG4gKiBgYGBcbiAqXG4gKiBAYXV0aG9yIE1hcmMgQXJuZHRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXctd2l6YXJkLWNvbXBsZXRpb24tc3RlcCcsXG4gIHRlbXBsYXRlVXJsOiAnd2l6YXJkLWNvbXBsZXRpb24tc3RlcC5jb21wb25lbnQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBXaXphcmRTdGVwLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBXaXphcmRDb21wbGV0aW9uU3RlcENvbXBvbmVudCl9LFxuICAgIHtwcm92aWRlOiBXaXphcmRDb21wbGV0aW9uU3RlcCwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gV2l6YXJkQ29tcGxldGlvblN0ZXBDb21wb25lbnQpfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFdpemFyZENvbXBsZXRpb25TdGVwQ29tcG9uZW50IGV4dGVuZHMgV2l6YXJkQ29tcGxldGlvblN0ZXAge1xufVxuIl19