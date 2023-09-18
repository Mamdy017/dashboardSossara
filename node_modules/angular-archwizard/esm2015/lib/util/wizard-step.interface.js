import { ContentChild, EventEmitter, HostBinding, Input, Output, Directive } from '@angular/core';
import { WizardStepSymbolDirective } from '../directives/wizard-step-symbol.directive';
import { WizardStepTitleDirective } from '../directives/wizard-step-title.directive';
/**
 * Basic functionality every type of wizard step needs to provide
 *
 * @author Marc Arndt
 */
/* tslint:disable-next-line directive-class-suffix */
export class WizardStep {
    constructor() {
        /**
         * A symbol property, which contains an optional symbol for the step inside the navigation bar.
         * Takes effect when `stepSymbolTemplate` is not defined or null.
         */
        this.navigationSymbol = { symbol: '' };
        /**
         * A boolean describing if the wizard step is currently selected
         */
        this.selected = false;
        /**
         * A boolean describing if the wizard step has been completed
         */
        this.completed = false;
        /**
         * A boolean describing if the wizard step is shown as completed when the wizard is presented to the user
         *
         * Users will typically use `CompletedStepDirective` to set this flag
         */
        this.initiallyCompleted = false;
        /**
         * A boolean describing if the wizard step is being edited after being competed
         *
         * This flag can only be true when `selected` is true.
         */
        this.editing = false;
        /**
         * A boolean describing, if the wizard step should be selected by default, i.e. after the wizard has been initialized as the initial step
         */
        this.defaultSelected = false;
        /**
         * A boolean describing if the wizard step is an optional step
         */
        this.optional = false;
        /**
         * A function or boolean deciding, if this step can be entered
         */
        this.canEnter = true;
        /**
         * A function or boolean deciding, if this step can be exited
         */
        this.canExit = true;
        /**
         * This [[EventEmitter]] is called when the step is entered.
         * The bound method should be used to do initialization work.
         */
        this.stepEnter = new EventEmitter();
        /**
         * This [[EventEmitter]] is called when the step is exited.
         * The bound method can be used to do cleanup work.
         */
        this.stepExit = new EventEmitter();
    }
    /**
     * Returns true if this wizard step should be visible to the user.
     * If the step should be visible to the user false is returned, otherwise true
     */
    get hidden() {
        return !this.selected;
    }
    /**
     * This method returns true, if this wizard step can be transitioned with a given direction.
     * Transitioned in this case means either entered or exited, depending on the given `condition` parameter.
     *
     * @param condition A condition variable, deciding if the step can be transitioned
     * @param direction The direction in which this step should be transitioned
     * @returns A [[Promise]] containing `true`, if this step can transitioned in the given direction
     * @throws An `Error` is thrown if `condition` is neither a function nor a boolean
     */
    static canTransitionStep(condition, direction) {
        if (typeof (condition) === typeof (true)) {
            return Promise.resolve(condition);
        }
        else if (condition instanceof Function) {
            return Promise.resolve(condition(direction));
        }
        else {
            return Promise.reject(new Error(`Input value '${condition}' is neither a boolean nor a function`));
        }
    }
    /**
     * A function called when the step is entered
     *
     * @param direction The direction in which the step is entered
     */
    enter(direction) {
        this.stepEnter.emit(direction);
    }
    /**
     * A function called when the step is exited
     *
     * @param direction The direction in which the step is exited
     */
    exit(direction) {
        this.stepExit.emit(direction);
    }
    /**
     * This method returns true, if this wizard step can be entered from the given direction.
     * Because this method depends on the value `canEnter`, it will throw an error, if `canEnter` is neither a boolean
     * nor a function.
     *
     * @param direction The direction in which this step should be entered
     * @returns A [[Promise]] containing `true`, if the step can be entered in the given direction, false otherwise
     * @throws An `Error` is thrown if `anEnter` is neither a function nor a boolean
     */
    canEnterStep(direction) {
        return WizardStep.canTransitionStep(this.canEnter, direction);
    }
    /**
     * This method returns true, if this wizard step can be exited into given direction.
     * Because this method depends on the value `canExit`, it will throw an error, if `canExit` is neither a boolean
     * nor a function.
     *
     * @param direction The direction in which this step should be left
     * @returns A [[Promise]] containing `true`, if the step can be exited in the given direction, false otherwise
     * @throws An `Error` is thrown if `canExit` is neither a function nor a boolean
     */
    canExitStep(direction) {
        return WizardStep.canTransitionStep(this.canExit, direction);
    }
}
WizardStep.decorators = [
    { type: Directive }
];
WizardStep.propDecorators = {
    stepTitleTemplate: [{ type: ContentChild, args: [WizardStepTitleDirective,] }],
    stepSymbolTemplate: [{ type: ContentChild, args: [WizardStepSymbolDirective,] }],
    stepId: [{ type: Input }],
    stepTitle: [{ type: Input }],
    navigationSymbol: [{ type: Input }],
    canEnter: [{ type: Input }],
    canExit: [{ type: Input }],
    stepEnter: [{ type: Output }],
    stepExit: [{ type: Output }],
    hidden: [{ type: HostBinding, args: ['hidden',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXN0ZXAuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlsL3dpemFyZC1zdGVwLmludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEcsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFJbkY7Ozs7R0FJRztBQUVILHFEQUFxRDtBQUNyRCxNQUFNLE9BQWdCLFVBQVU7SUFGaEM7UUErQkU7OztXQUdHO1FBRUkscUJBQWdCLEdBQXFCLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBRXpEOztXQUVHO1FBQ0ksYUFBUSxHQUFHLEtBQUssQ0FBQztRQUV4Qjs7V0FFRztRQUNJLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFekI7Ozs7V0FJRztRQUNJLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUVsQzs7OztXQUlHO1FBQ0ksWUFBTyxHQUFHLEtBQUssQ0FBQztRQUV2Qjs7V0FFRztRQUNJLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBRS9COztXQUVHO1FBQ0ksYUFBUSxHQUFHLEtBQUssQ0FBQztRQUV4Qjs7V0FFRztRQUVJLGFBQVEsR0FBNkcsSUFBSSxDQUFDO1FBRWpJOztXQUVHO1FBRUksWUFBTyxHQUE2RyxJQUFJLENBQUM7UUFFaEk7OztXQUdHO1FBRUksY0FBUyxHQUFrQyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUV0Rjs7O1dBR0c7UUFFSSxhQUFRLEdBQWtDLElBQUksWUFBWSxFQUFtQixDQUFDO0lBNEV2RixDQUFDO0lBMUVDOzs7T0FHRztJQUNILElBQ1csTUFBTTtRQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUVTLEVBQ1QsU0FBMEI7UUFDekQsSUFBSSxPQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssT0FBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFvQixDQUFDLENBQUM7U0FDOUM7YUFBTSxJQUFJLFNBQVMsWUFBWSxRQUFRLEVBQUU7WUFDeEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDTCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLFNBQVMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDO1NBQ3BHO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsU0FBMEI7UUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsU0FBMEI7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksWUFBWSxDQUFDLFNBQTBCO1FBQzVDLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksV0FBVyxDQUFDLFNBQTBCO1FBQzNDLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7O1lBM0tGLFNBQVM7OztnQ0FRUCxZQUFZLFNBQUMsd0JBQXdCO2lDQU9yQyxZQUFZLFNBQUMseUJBQXlCO3FCQU10QyxLQUFLO3dCQU9MLEtBQUs7K0JBT0wsS0FBSzt1QkF3Q0wsS0FBSztzQkFNTCxLQUFLO3dCQU9MLE1BQU07dUJBT04sTUFBTTtxQkFPTixXQUFXLFNBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRlbnRDaGlsZCwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSW5wdXQsIE91dHB1dCwgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dpemFyZFN0ZXBTeW1ib2xEaXJlY3RpdmV9IGZyb20gJy4uL2RpcmVjdGl2ZXMvd2l6YXJkLXN0ZXAtc3ltYm9sLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1dpemFyZFN0ZXBUaXRsZURpcmVjdGl2ZX0gZnJvbSAnLi4vZGlyZWN0aXZlcy93aXphcmQtc3RlcC10aXRsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHtNb3ZpbmdEaXJlY3Rpb259IGZyb20gJy4vbW92aW5nLWRpcmVjdGlvbi5lbnVtJztcbmltcG9ydCB7TmF2aWdhdGlvblN5bWJvbH0gZnJvbSAnLi9uYXZpZ2F0aW9uLXN5bWJvbC5pbnRlcmZhY2UnO1xuXG4vKipcbiAqIEJhc2ljIGZ1bmN0aW9uYWxpdHkgZXZlcnkgdHlwZSBvZiB3aXphcmQgc3RlcCBuZWVkcyB0byBwcm92aWRlXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBEaXJlY3RpdmUoKVxuLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIGRpcmVjdGl2ZS1jbGFzcy1zdWZmaXggKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBXaXphcmRTdGVwIHtcbiAgLyoqXG4gICAqIEEgc3RlcCB0aXRsZSBwcm9wZXJ0eSwgd2hpY2ggY29udGFpbnMgdGhlIHZpc2libGUgaGVhZGVyIHRpdGxlIG9mIHRoZSBzdGVwLlxuICAgKiBUaGlzIHRpdGxlIGlzIHRoZW4gc2hvd24gaW5zaWRlIHRoZSBuYXZpZ2F0aW9uIGJhci5cbiAgICogQ29tcGFyZWQgdG8gYHN0ZXBUaXRsZWAgdGhpcyBwcm9wZXJ0eSBjYW4gY29udGFpbiBhbnkgaHRtbCBjb250ZW50IGFuZCBub3Qgb25seSBwbGFpbiB0ZXh0XG4gICAqL1xuICBAQ29udGVudENoaWxkKFdpemFyZFN0ZXBUaXRsZURpcmVjdGl2ZSlcbiAgcHVibGljIHN0ZXBUaXRsZVRlbXBsYXRlOiBXaXphcmRTdGVwVGl0bGVEaXJlY3RpdmU7XG5cbiAgLyoqXG4gICAqIEEgc3RlcCBzeW1ib2wgcHJvcGVydHkgdGhhdCwgaWYgZGVmaW5lZCwgb3ZlcnJpZGVzIGBuYXZpZ2F0aW9uU3ltYm9sYC5cbiAgICogQWxsb3dzIHRvIGRpc3BsYXkgYXJiaXRyYXJ5IGNvbnRlbnQgYXMgYSBzdGVwIHN5bWJvbCBpbnN0ZWFkIG9mIHBsYWluIHRleHQuXG4gICAqL1xuICBAQ29udGVudENoaWxkKFdpemFyZFN0ZXBTeW1ib2xEaXJlY3RpdmUpXG4gIHB1YmxpYyBzdGVwU3ltYm9sVGVtcGxhdGU6IFdpemFyZFN0ZXBTeW1ib2xEaXJlY3RpdmU7XG5cbiAgLyoqXG4gICAqIEEgc3RlcCBpZCwgdW5pcXVlIHRvIHRoZSBzdGVwXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgc3RlcElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgc3RlcCB0aXRsZSBwcm9wZXJ0eSwgd2hpY2ggY29udGFpbnMgdGhlIHZpc2libGUgaGVhZGVyIHRpdGxlIG9mIHRoZSBzdGVwLlxuICAgKiBUaGlzIHRpdGxlIGlzIG9ubHkgc2hvd24gaW5zaWRlIHRoZSBuYXZpZ2F0aW9uIGJhciwgaWYgYHN0ZXBUaXRsZVRlbXBsYXRlYCBpcyBub3QgZGVmaW5lZCBvciBudWxsLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIHN0ZXBUaXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHN5bWJvbCBwcm9wZXJ0eSwgd2hpY2ggY29udGFpbnMgYW4gb3B0aW9uYWwgc3ltYm9sIGZvciB0aGUgc3RlcCBpbnNpZGUgdGhlIG5hdmlnYXRpb24gYmFyLlxuICAgKiBUYWtlcyBlZmZlY3Qgd2hlbiBgc3RlcFN5bWJvbFRlbXBsYXRlYCBpcyBub3QgZGVmaW5lZCBvciBudWxsLlxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIG5hdmlnYXRpb25TeW1ib2w6IE5hdmlnYXRpb25TeW1ib2wgPSB7c3ltYm9sOiAnJ307XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXNjcmliaW5nIGlmIHRoZSB3aXphcmQgc3RlcCBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcbiAgICovXG4gIHB1YmxpYyBzZWxlY3RlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gZGVzY3JpYmluZyBpZiB0aGUgd2l6YXJkIHN0ZXAgaGFzIGJlZW4gY29tcGxldGVkXG4gICAqL1xuICBwdWJsaWMgY29tcGxldGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXNjcmliaW5nIGlmIHRoZSB3aXphcmQgc3RlcCBpcyBzaG93biBhcyBjb21wbGV0ZWQgd2hlbiB0aGUgd2l6YXJkIGlzIHByZXNlbnRlZCB0byB0aGUgdXNlclxuICAgKlxuICAgKiBVc2VycyB3aWxsIHR5cGljYWxseSB1c2UgYENvbXBsZXRlZFN0ZXBEaXJlY3RpdmVgIHRvIHNldCB0aGlzIGZsYWdcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsbHlDb21wbGV0ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBib29sZWFuIGRlc2NyaWJpbmcgaWYgdGhlIHdpemFyZCBzdGVwIGlzIGJlaW5nIGVkaXRlZCBhZnRlciBiZWluZyBjb21wZXRlZFxuICAgKlxuICAgKiBUaGlzIGZsYWcgY2FuIG9ubHkgYmUgdHJ1ZSB3aGVuIGBzZWxlY3RlZGAgaXMgdHJ1ZS5cbiAgICovXG4gIHB1YmxpYyBlZGl0aW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXNjcmliaW5nLCBpZiB0aGUgd2l6YXJkIHN0ZXAgc2hvdWxkIGJlIHNlbGVjdGVkIGJ5IGRlZmF1bHQsIGkuZS4gYWZ0ZXIgdGhlIHdpemFyZCBoYXMgYmVlbiBpbml0aWFsaXplZCBhcyB0aGUgaW5pdGlhbCBzdGVwXG4gICAqL1xuICBwdWJsaWMgZGVmYXVsdFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBkZXNjcmliaW5nIGlmIHRoZSB3aXphcmQgc3RlcCBpcyBhbiBvcHRpb25hbCBzdGVwXG4gICAqL1xuICBwdWJsaWMgb3B0aW9uYWwgPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiBvciBib29sZWFuIGRlY2lkaW5nLCBpZiB0aGlzIHN0ZXAgY2FuIGJlIGVudGVyZWRcbiAgICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjYW5FbnRlcjogKChkaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbikgPT4gYm9vbGVhbikgfCAoKGRpcmVjdGlvbjogTW92aW5nRGlyZWN0aW9uKSA9PiBQcm9taXNlPGJvb2xlYW4+KSB8IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIG9yIGJvb2xlYW4gZGVjaWRpbmcsIGlmIHRoaXMgc3RlcCBjYW4gYmUgZXhpdGVkXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgY2FuRXhpdDogKChkaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbikgPT4gYm9vbGVhbikgfCAoKGRpcmVjdGlvbjogTW92aW5nRGlyZWN0aW9uKSA9PiBQcm9taXNlPGJvb2xlYW4+KSB8IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGlzIFtbRXZlbnRFbWl0dGVyXV0gaXMgY2FsbGVkIHdoZW4gdGhlIHN0ZXAgaXMgZW50ZXJlZC5cbiAgICogVGhlIGJvdW5kIG1ldGhvZCBzaG91bGQgYmUgdXNlZCB0byBkbyBpbml0aWFsaXphdGlvbiB3b3JrLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBzdGVwRW50ZXI6IEV2ZW50RW1pdHRlcjxNb3ZpbmdEaXJlY3Rpb24+ID0gbmV3IEV2ZW50RW1pdHRlcjxNb3ZpbmdEaXJlY3Rpb24+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgW1tFdmVudEVtaXR0ZXJdXSBpcyBjYWxsZWQgd2hlbiB0aGUgc3RlcCBpcyBleGl0ZWQuXG4gICAqIFRoZSBib3VuZCBtZXRob2QgY2FuIGJlIHVzZWQgdG8gZG8gY2xlYW51cCB3b3JrLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBzdGVwRXhpdDogRXZlbnRFbWl0dGVyPE1vdmluZ0RpcmVjdGlvbj4gPSBuZXcgRXZlbnRFbWl0dGVyPE1vdmluZ0RpcmVjdGlvbj4oKTtcblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgd2l6YXJkIHN0ZXAgc2hvdWxkIGJlIHZpc2libGUgdG8gdGhlIHVzZXIuXG4gICAqIElmIHRoZSBzdGVwIHNob3VsZCBiZSB2aXNpYmxlIHRvIHRoZSB1c2VyIGZhbHNlIGlzIHJldHVybmVkLCBvdGhlcndpc2UgdHJ1ZVxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdoaWRkZW4nKVxuICBwdWJsaWMgZ2V0IGhpZGRlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuc2VsZWN0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0cnVlLCBpZiB0aGlzIHdpemFyZCBzdGVwIGNhbiBiZSB0cmFuc2l0aW9uZWQgd2l0aCBhIGdpdmVuIGRpcmVjdGlvbi5cbiAgICogVHJhbnNpdGlvbmVkIGluIHRoaXMgY2FzZSBtZWFucyBlaXRoZXIgZW50ZXJlZCBvciBleGl0ZWQsIGRlcGVuZGluZyBvbiB0aGUgZ2l2ZW4gYGNvbmRpdGlvbmAgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0gY29uZGl0aW9uIEEgY29uZGl0aW9uIHZhcmlhYmxlLCBkZWNpZGluZyBpZiB0aGUgc3RlcCBjYW4gYmUgdHJhbnNpdGlvbmVkXG4gICAqIEBwYXJhbSBkaXJlY3Rpb24gVGhlIGRpcmVjdGlvbiBpbiB3aGljaCB0aGlzIHN0ZXAgc2hvdWxkIGJlIHRyYW5zaXRpb25lZFxuICAgKiBAcmV0dXJucyBBIFtbUHJvbWlzZV1dIGNvbnRhaW5pbmcgYHRydWVgLCBpZiB0aGlzIHN0ZXAgY2FuIHRyYW5zaXRpb25lZCBpbiB0aGUgZ2l2ZW4gZGlyZWN0aW9uXG4gICAqIEB0aHJvd3MgQW4gYEVycm9yYCBpcyB0aHJvd24gaWYgYGNvbmRpdGlvbmAgaXMgbmVpdGhlciBhIGZ1bmN0aW9uIG5vciBhIGJvb2xlYW5cbiAgICovXG4gIHByaXZhdGUgc3RhdGljIGNhblRyYW5zaXRpb25TdGVwKGNvbmRpdGlvbjogKChkaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbikgPT4gYm9vbGVhbikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZGlyZWN0aW9uOiBNb3ZpbmdEaXJlY3Rpb24pID0+IFByb21pc2U8Ym9vbGVhbj4pIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICh0eXBlb2YoY29uZGl0aW9uKSA9PT0gdHlwZW9mKHRydWUpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbmRpdGlvbiBhcyBib29sZWFuKTtcbiAgICB9IGVsc2UgaWYgKGNvbmRpdGlvbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNvbmRpdGlvbihkaXJlY3Rpb24pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgSW5wdXQgdmFsdWUgJyR7Y29uZGl0aW9ufScgaXMgbmVpdGhlciBhIGJvb2xlYW4gbm9yIGEgZnVuY3Rpb25gKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHN0ZXAgaXMgZW50ZXJlZFxuICAgKlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIFRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdGhlIHN0ZXAgaXMgZW50ZXJlZFxuICAgKi9cbiAgcHVibGljIGVudGVyKGRpcmVjdGlvbjogTW92aW5nRGlyZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5zdGVwRW50ZXIuZW1pdChkaXJlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHN0ZXAgaXMgZXhpdGVkXG4gICAqXG4gICAqIEBwYXJhbSBkaXJlY3Rpb24gVGhlIGRpcmVjdGlvbiBpbiB3aGljaCB0aGUgc3RlcCBpcyBleGl0ZWRcbiAgICovXG4gIHB1YmxpYyBleGl0KGRpcmVjdGlvbjogTW92aW5nRGlyZWN0aW9uKSB7XG4gICAgdGhpcy5zdGVwRXhpdC5lbWl0KGRpcmVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0cnVlLCBpZiB0aGlzIHdpemFyZCBzdGVwIGNhbiBiZSBlbnRlcmVkIGZyb20gdGhlIGdpdmVuIGRpcmVjdGlvbi5cbiAgICogQmVjYXVzZSB0aGlzIG1ldGhvZCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBgY2FuRW50ZXJgLCBpdCB3aWxsIHRocm93IGFuIGVycm9yLCBpZiBgY2FuRW50ZXJgIGlzIG5laXRoZXIgYSBib29sZWFuXG4gICAqIG5vciBhIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIFRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdGhpcyBzdGVwIHNob3VsZCBiZSBlbnRlcmVkXG4gICAqIEByZXR1cm5zIEEgW1tQcm9taXNlXV0gY29udGFpbmluZyBgdHJ1ZWAsIGlmIHRoZSBzdGVwIGNhbiBiZSBlbnRlcmVkIGluIHRoZSBnaXZlbiBkaXJlY3Rpb24sIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAdGhyb3dzIEFuIGBFcnJvcmAgaXMgdGhyb3duIGlmIGBhbkVudGVyYCBpcyBuZWl0aGVyIGEgZnVuY3Rpb24gbm9yIGEgYm9vbGVhblxuICAgKi9cbiAgcHVibGljIGNhbkVudGVyU3RlcChkaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBXaXphcmRTdGVwLmNhblRyYW5zaXRpb25TdGVwKHRoaXMuY2FuRW50ZXIsIGRpcmVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0cnVlLCBpZiB0aGlzIHdpemFyZCBzdGVwIGNhbiBiZSBleGl0ZWQgaW50byBnaXZlbiBkaXJlY3Rpb24uXG4gICAqIEJlY2F1c2UgdGhpcyBtZXRob2QgZGVwZW5kcyBvbiB0aGUgdmFsdWUgYGNhbkV4aXRgLCBpdCB3aWxsIHRocm93IGFuIGVycm9yLCBpZiBgY2FuRXhpdGAgaXMgbmVpdGhlciBhIGJvb2xlYW5cbiAgICogbm9yIGEgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBkaXJlY3Rpb24gVGhlIGRpcmVjdGlvbiBpbiB3aGljaCB0aGlzIHN0ZXAgc2hvdWxkIGJlIGxlZnRcbiAgICogQHJldHVybnMgQSBbW1Byb21pc2VdXSBjb250YWluaW5nIGB0cnVlYCwgaWYgdGhlIHN0ZXAgY2FuIGJlIGV4aXRlZCBpbiB0aGUgZ2l2ZW4gZGlyZWN0aW9uLCBmYWxzZSBvdGhlcndpc2VcbiAgICogQHRocm93cyBBbiBgRXJyb3JgIGlzIHRocm93biBpZiBgY2FuRXhpdGAgaXMgbmVpdGhlciBhIGZ1bmN0aW9uIG5vciBhIGJvb2xlYW5cbiAgICovXG4gIHB1YmxpYyBjYW5FeGl0U3RlcChkaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBXaXphcmRTdGVwLmNhblRyYW5zaXRpb25TdGVwKHRoaXMuY2FuRXhpdCwgZGlyZWN0aW9uKTtcbiAgfVxufVxuIl19