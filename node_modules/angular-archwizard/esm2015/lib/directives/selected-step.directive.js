import { Directive, Host } from '@angular/core';
import { WizardStep } from '../util/wizard-step.interface';
/**
 * The `awSelectedStep` directive can be used on a [[WizardStep]] to set it as selected after the wizard initialisation or a reset.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-step stepTitle="Step title" awSelectedStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
export class SelectedStepDirective {
    /**
     * Constructor
     *
     * @param wizardStep The wizard step, which should be selected by default
     */
    constructor(wizardStep) {
        this.wizardStep = wizardStep;
    }
    /**
     * Initialization work
     */
    ngOnInit() {
        this.wizardStep.defaultSelected = true;
    }
}
SelectedStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awSelectedStep]'
            },] }
];
SelectedStepDirective.ctorParameters = () => [
    { type: WizardStep, decorators: [{ type: Host }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0ZWQtc3RlcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvc2VsZWN0ZWQtc3RlcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRXpEOzs7Ozs7Ozs7Ozs7R0FZRztBQUlILE1BQU0sT0FBTyxxQkFBcUI7SUFDaEM7Ozs7T0FJRztJQUNILFlBQTRCLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFDbEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUN6QyxDQUFDOzs7WUFqQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7YUFDN0I7OztZQWpCTyxVQUFVLHVCQXdCSCxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIEhvc3QsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dpemFyZFN0ZXB9IGZyb20gJy4uL3V0aWwvd2l6YXJkLXN0ZXAuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBUaGUgYGF3U2VsZWN0ZWRTdGVwYCBkaXJlY3RpdmUgY2FuIGJlIHVzZWQgb24gYSBbW1dpemFyZFN0ZXBdXSB0byBzZXQgaXQgYXMgc2VsZWN0ZWQgYWZ0ZXIgdGhlIHdpemFyZCBpbml0aWFsaXNhdGlvbiBvciBhIHJlc2V0LlxuICpcbiAqICMjIyBTeW50YXhcbiAqXG4gKiBgYGBodG1sXG4gKiA8YXctd2l6YXJkLXN0ZXAgc3RlcFRpdGxlPVwiU3RlcCB0aXRsZVwiIGF3U2VsZWN0ZWRTdGVwPlxuICogICAgIC4uLlxuICogPC9hdy13aXphcmQtc3RlcD5cbiAqIGBgYFxuICpcbiAqIEBhdXRob3IgTWFyYyBBcm5kdFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYXdTZWxlY3RlZFN0ZXBdJ1xufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RlZFN0ZXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZFN0ZXAgVGhlIHdpemFyZCBzdGVwLCB3aGljaCBzaG91bGQgYmUgc2VsZWN0ZWQgYnkgZGVmYXVsdFxuICAgKi9cbiAgY29uc3RydWN0b3IoQEhvc3QoKSBwcml2YXRlIHdpemFyZFN0ZXA6IFdpemFyZFN0ZXApIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXphdGlvbiB3b3JrXG4gICAqL1xuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy53aXphcmRTdGVwLmRlZmF1bHRTZWxlY3RlZCA9IHRydWU7XG4gIH1cbn1cbiJdfQ==