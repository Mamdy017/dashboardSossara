import { BaseNavigationMode } from './base-navigation-mode.interface';
import { WizardCompletionStep } from '../util/wizard-completion-step.interface';
/**
 * The default navigation mode used by [[WizardComponent]] and [[NavigationModeDirective]].
 *
 * It is parameterized with two navigation policies passed to constructor:
 *
 * - [[navigateBackward]] policy controls whether wizard steps before the current step are navigable:
 *
 *   - `"deny"` -- the steps are not navigable
 *   - `"allow"` -- the steps are navigable
 *   - If the corresponding constructor argument is omitted or is `null` or `undefined`,
 *     then the default value is applied which is `"deny"`
 *
 * - [[navigateForward]] policy controls whether wizard steps after the current step are navigable:
 *
 *   - `"deny"` -- the steps are not navigable
 *   - `"allow"` -- the steps are navigable
 *   - `"visited"` -- a step is navigable iff it was already visited before
 *   - If the corresponding constructor argument is omitted or is `null` or `undefined`,
 *     then the default value is applied which is `"allow"`
 */
export class ConfigurableNavigationMode extends BaseNavigationMode {
    /**
     * Constructor
     *
     * @param navigateBackward Controls whether wizard steps before the current step are navigable
     * @param navigateForward Controls whether wizard steps before the current step are navigable
     */
    constructor(navigateBackward = null, navigateForward = null) {
        super();
        this.navigateBackward = navigateBackward;
        this.navigateForward = navigateForward;
        this.navigateBackward = this.navigateBackward || 'allow';
        this.navigateForward = this.navigateForward || 'deny';
    }
    /**
     * @inheritDoc
     */
    canTransitionToStep(wizard, destinationIndex) {
        // if the destination step can be navigated to using the navigation bar,
        // it should be accessible with [goToStep] as well
        if (this.isNavigable(wizard, destinationIndex)) {
            return true;
        }
        // navigation with [goToStep] is permitted if all previous steps
        // to the destination step have been completed or are optional
        return wizard.wizardSteps
            .filter((step, index) => index < destinationIndex && index !== wizard.currentStepIndex)
            .every(step => step.completed || step.optional);
    }
    /**
     * @inheritDoc
     */
    transition(wizard, destinationIndex) {
        if (this.navigateForward === 'deny') {
            // set all steps after the destination step to incomplete
            wizard.wizardSteps
                .filter((step, index) => wizard.currentStepIndex > destinationIndex && index > destinationIndex)
                .forEach(step => step.completed = false);
        }
        super.transition(wizard, destinationIndex);
    }
    /**
     * @inheritDoc
     */
    isNavigable(wizard, destinationIndex) {
        // Check if the destination step can be navigated to
        const destinationStep = wizard.getStepAtIndex(destinationIndex);
        if (destinationStep instanceof WizardCompletionStep) {
            // A completion step can only be entered, if all previous steps have been completed, are optional, or selected
            const previousStepsCompleted = wizard.wizardSteps
                .filter((step, index) => index < destinationIndex)
                .every(step => step.completed || step.optional || step.selected);
            if (!previousStepsCompleted) {
                return false;
            }
        }
        // Apply navigation pocicies
        if (destinationIndex < wizard.currentStepIndex) {
            // If the destination step is before current, apply the `navigateBackward` policy
            switch (this.navigateBackward) {
                case 'allow': return true;
                case 'deny': return false;
                default:
                    throw new Error(`Invalid value for navigateBackward: ${this.navigateBackward}`);
            }
        }
        else if (destinationIndex > wizard.currentStepIndex) {
            // If the destination step is after current, apply the `navigateForward` policy
            switch (this.navigateForward) {
                case 'allow': return true;
                case 'deny': return false;
                case 'visited': return destinationStep.completed;
                default:
                    throw new Error(`Invalid value for navigateForward: ${this.navigateForward}`);
            }
        }
        else {
            // Re-entering the current step is not allowed
            return false;
        }
    }
    /**
     * @inheritDoc
     */
    ensureCanReset(wizard) {
        super.ensureCanReset(wizard);
        // the default step is a completion step and the wizard contains more than one step
        const defaultWizardStep = wizard.getStepAtIndex(wizard.defaultStepIndex);
        const defaultCompletionStep = defaultWizardStep instanceof WizardCompletionStep;
        if (defaultCompletionStep && wizard.wizardSteps.length !== 1) {
            throw new Error(`The default step index ${wizard.defaultStepIndex} references a completion step`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhYmxlLW5hdmlnYXRpb24tbW9kZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJsaWIvbmF2aWdhdGlvbi9jb25maWd1cmFibGUtbmF2aWdhdGlvbi1tb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBRXBFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBRTlFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsTUFBTSxPQUFPLDBCQUEyQixTQUFRLGtCQUFrQjtJQUVoRTs7Ozs7T0FLRztJQUNILFlBQ1UsbUJBQXdDLElBQUksRUFDNUMsa0JBQWlELElBQUk7UUFFN0QsS0FBSyxFQUFFLENBQUM7UUFIQSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTRCO1FBQzVDLG9CQUFlLEdBQWYsZUFBZSxDQUFzQztRQUc3RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQztRQUN6RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDO0lBQ3hELENBQUM7SUFFRDs7T0FFRztJQUNPLG1CQUFtQixDQUFDLE1BQXVCLEVBQUUsZ0JBQXdCO1FBQzdFLHdFQUF3RTtRQUN4RSxrREFBa0Q7UUFDbEQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxnRUFBZ0U7UUFDaEUsOERBQThEO1FBQzlELE9BQU8sTUFBTSxDQUFDLFdBQVc7YUFDcEIsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLGdCQUFnQixJQUFJLEtBQUssS0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7YUFDdEYsS0FB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Q0FBQywwQkFBMEIsTUFBTSxDQUFDLGdCQUFnQiwrQkFBK0IsQ0FBQyxDQUFDO1NBQ25HO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCYXNlTmF2aWdhdGlvbk1vZGV9IGZyb20gJy4vYmFzZS1uYXZpZ2F0aW9uLW1vZGUuaW50ZXJmYWNlJztcbmltcG9ydCB7V2l6YXJkQ29tcG9uZW50fSBmcm9tICcuLi9jb21wb25lbnRzL3dpemFyZC5jb21wb25lbnQnO1xuaW1wb3J0IHtXaXphcmRDb21wbGV0aW9uU3RlcH0gZnJvbSAnLi4vdXRpbC93aXphcmQtY29tcGxldGlvbi1zdGVwLmludGVyZmFjZSc7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgbmF2aWdhdGlvbiBtb2RlIHVzZWQgYnkgW1tXaXphcmRDb21wb25lbnRdXSBhbmQgW1tOYXZpZ2F0aW9uTW9kZURpcmVjdGl2ZV1dLlxuICpcbiAqIEl0IGlzIHBhcmFtZXRlcml6ZWQgd2l0aCB0d28gbmF2aWdhdGlvbiBwb2xpY2llcyBwYXNzZWQgdG8gY29uc3RydWN0b3I6XG4gKlxuICogLSBbW25hdmlnYXRlQmFja3dhcmRdXSBwb2xpY3kgY29udHJvbHMgd2hldGhlciB3aXphcmQgc3RlcHMgYmVmb3JlIHRoZSBjdXJyZW50IHN0ZXAgYXJlIG5hdmlnYWJsZTpcbiAqXG4gKiAgIC0gYFwiZGVueVwiYCAtLSB0aGUgc3RlcHMgYXJlIG5vdCBuYXZpZ2FibGVcbiAqICAgLSBgXCJhbGxvd1wiYCAtLSB0aGUgc3RlcHMgYXJlIG5hdmlnYWJsZVxuICogICAtIElmIHRoZSBjb3JyZXNwb25kaW5nIGNvbnN0cnVjdG9yIGFyZ3VtZW50IGlzIG9taXR0ZWQgb3IgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLFxuICogICAgIHRoZW4gdGhlIGRlZmF1bHQgdmFsdWUgaXMgYXBwbGllZCB3aGljaCBpcyBgXCJkZW55XCJgXG4gKlxuICogLSBbW25hdmlnYXRlRm9yd2FyZF1dIHBvbGljeSBjb250cm9scyB3aGV0aGVyIHdpemFyZCBzdGVwcyBhZnRlciB0aGUgY3VycmVudCBzdGVwIGFyZSBuYXZpZ2FibGU6XG4gKlxuICogICAtIGBcImRlbnlcImAgLS0gdGhlIHN0ZXBzIGFyZSBub3QgbmF2aWdhYmxlXG4gKiAgIC0gYFwiYWxsb3dcImAgLS0gdGhlIHN0ZXBzIGFyZSBuYXZpZ2FibGVcbiAqICAgLSBgXCJ2aXNpdGVkXCJgIC0tIGEgc3RlcCBpcyBuYXZpZ2FibGUgaWZmIGl0IHdhcyBhbHJlYWR5IHZpc2l0ZWQgYmVmb3JlXG4gKiAgIC0gSWYgdGhlIGNvcnJlc3BvbmRpbmcgY29uc3RydWN0b3IgYXJndW1lbnQgaXMgb21pdHRlZCBvciBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsXG4gKiAgICAgdGhlbiB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBhcHBsaWVkIHdoaWNoIGlzIGBcImFsbG93XCJgXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25maWd1cmFibGVOYXZpZ2F0aW9uTW9kZSBleHRlbmRzIEJhc2VOYXZpZ2F0aW9uTW9kZSB7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSBuYXZpZ2F0ZUJhY2t3YXJkIENvbnRyb2xzIHdoZXRoZXIgd2l6YXJkIHN0ZXBzIGJlZm9yZSB0aGUgY3VycmVudCBzdGVwIGFyZSBuYXZpZ2FibGVcbiAgICogQHBhcmFtIG5hdmlnYXRlRm9yd2FyZCBDb250cm9scyB3aGV0aGVyIHdpemFyZCBzdGVwcyBiZWZvcmUgdGhlIGN1cnJlbnQgc3RlcCBhcmUgbmF2aWdhYmxlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5hdmlnYXRlQmFja3dhcmQ6ICdhbGxvdyd8J2RlbnknfG51bGwgPSBudWxsLFxuICAgIHByaXZhdGUgbmF2aWdhdGVGb3J3YXJkOiAnYWxsb3cnfCdkZW55J3wndmlzaXRlZCd8bnVsbCA9IG51bGwsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYXZpZ2F0ZUJhY2t3YXJkID0gdGhpcy5uYXZpZ2F0ZUJhY2t3YXJkIHx8ICdhbGxvdyc7XG4gICAgdGhpcy5uYXZpZ2F0ZUZvcndhcmQgPSB0aGlzLm5hdmlnYXRlRm9yd2FyZCB8fCAnZGVueSc7XG4gIH1cblxuICAvKipcbiAgICogQGluaGVyaXREb2NcbiAgICovXG4gIHByb3RlY3RlZCBjYW5UcmFuc2l0aW9uVG9TdGVwKHdpemFyZDogV2l6YXJkQ29tcG9uZW50LCBkZXN0aW5hdGlvbkluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAvLyBpZiB0aGUgZGVzdGluYXRpb24gc3RlcCBjYW4gYmUgbmF2aWdhdGVkIHRvIHVzaW5nIHRoZSBuYXZpZ2F0aW9uIGJhcixcbiAgICAvLyBpdCBzaG91bGQgYmUgYWNjZXNzaWJsZSB3aXRoIFtnb1RvU3RlcF0gYXMgd2VsbFxuICAgIGlmICh0aGlzLmlzTmF2aWdhYmxlKHdpemFyZCwgZGVzdGluYXRpb25JbmRleCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIG5hdmlnYXRpb24gd2l0aCBbZ29Ub1N0ZXBdIGlzIHBlcm1pdHRlZCBpZiBhbGwgcHJldmlvdXMgc3RlcHNcbiAgICAvLyB0byB0aGUgZGVzdGluYXRpb24gc3RlcCBoYXZlIGJlZW4gY29tcGxldGVkIG9yIGFyZSBvcHRpb25hbFxuICAgIHJldHVybiB3aXphcmQud2l6YXJkU3RlcHNcbiAgICAgICAgLmZpbHRlcigoc3RlcCwgaW5kZXgpID0+IGluZGV4IDwgZGVzdGluYXRpb25JbmRleCAmJiBpbmRleCAhPT0gd2l6YXJkLmN1cnJlbnRTdGVwSW5kZXgpXG4gICAgICAgIC5ldmVyeShzdGVwID0+IHN0ZXAuY29tcGxldGVkIHx8IHN0ZXAub3B0aW9uYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbmhlcml0RG9jXG4gICAqL1xuICBwcm90ZWN0ZWQgdHJhbnNpdGlvbih3aXphcmQ6IFdpemFyZENvbXBvbmVudCwgZGVzdGluYXRpb25JbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubmF2aWdhdGVGb3J3YXJkID09PSAnZGVueScpIHtcbiAgICAgIC8vIHNldCBhbGwgc3RlcHMgYWZ0ZXIgdGhlIGRlc3RpbmF0aW9uIHN0ZXAgdG8gaW5jb21wbGV0ZVxuICAgICAgd2l6YXJkLndpemFyZFN0ZXBzXG4gICAgICAgIC5maWx0ZXIoKHN0ZXAsIGluZGV4KSA9PiB3aXphcmQuY3VycmVudFN0ZXBJbmRleCA+IGRlc3RpbmF0aW9uSW5kZXggJiYgaW5kZXggPiBkZXN0aW5hdGlvbkluZGV4KVxuICAgICAgICAuZm9yRWFjaChzdGVwID0+IHN0ZXAuY29tcGxldGVkID0gZmFsc2UpO1xuICAgIH1cblxuICAgIHN1cGVyLnRyYW5zaXRpb24od2l6YXJkLCBkZXN0aW5hdGlvbkluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW5oZXJpdERvY1xuICAgKi9cbiAgcHVibGljIGlzTmF2aWdhYmxlKHdpemFyZDogV2l6YXJkQ29tcG9uZW50LCBkZXN0aW5hdGlvbkluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgZGVzdGluYXRpb24gc3RlcCBjYW4gYmUgbmF2aWdhdGVkIHRvXG4gICAgY29uc3QgZGVzdGluYXRpb25TdGVwID0gd2l6YXJkLmdldFN0ZXBBdEluZGV4KGRlc3RpbmF0aW9uSW5kZXgpO1xuICAgIGlmIChkZXN0aW5hdGlvblN0ZXAgaW5zdGFuY2VvZiBXaXphcmRDb21wbGV0aW9uU3RlcCkge1xuICAgICAgLy8gQSBjb21wbGV0aW9uIHN0ZXAgY2FuIG9ubHkgYmUgZW50ZXJlZCwgaWYgYWxsIHByZXZpb3VzIHN0ZXBzIGhhdmUgYmVlbiBjb21wbGV0ZWQsIGFyZSBvcHRpb25hbCwgb3Igc2VsZWN0ZWRcbiAgICAgIGNvbnN0IHByZXZpb3VzU3RlcHNDb21wbGV0ZWQgPSB3aXphcmQud2l6YXJkU3RlcHNcbiAgICAgICAgLmZpbHRlcigoc3RlcCwgaW5kZXgpID0+IGluZGV4IDwgZGVzdGluYXRpb25JbmRleClcbiAgICAgICAgLmV2ZXJ5KHN0ZXAgPT4gc3RlcC5jb21wbGV0ZWQgfHwgc3RlcC5vcHRpb25hbCB8fCBzdGVwLnNlbGVjdGVkKTtcbiAgICAgIGlmICghcHJldmlvdXNTdGVwc0NvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgbmF2aWdhdGlvbiBwb2NpY2llc1xuICAgIGlmIChkZXN0aW5hdGlvbkluZGV4IDwgd2l6YXJkLmN1cnJlbnRTdGVwSW5kZXgpIHtcbiAgICAgIC8vIElmIHRoZSBkZXN0aW5hdGlvbiBzdGVwIGlzIGJlZm9yZSBjdXJyZW50LCBhcHBseSB0aGUgYG5hdmlnYXRlQmFja3dhcmRgIHBvbGljeVxuICAgICAgc3dpdGNoICh0aGlzLm5hdmlnYXRlQmFja3dhcmQpIHtcbiAgICAgICAgY2FzZSAnYWxsb3cnOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSAnZGVueSc6IHJldHVybiBmYWxzZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIG5hdmlnYXRlQmFja3dhcmQ6ICR7dGhpcy5uYXZpZ2F0ZUJhY2t3YXJkfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb25JbmRleCA+IHdpemFyZC5jdXJyZW50U3RlcEluZGV4KSB7XG4gICAgICAvLyBJZiB0aGUgZGVzdGluYXRpb24gc3RlcCBpcyBhZnRlciBjdXJyZW50LCBhcHBseSB0aGUgYG5hdmlnYXRlRm9yd2FyZGAgcG9saWN5XG4gICAgICBzd2l0Y2ggKHRoaXMubmF2aWdhdGVGb3J3YXJkKSB7XG4gICAgICAgIGNhc2UgJ2FsbG93JzogcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgJ2RlbnknOiByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNhc2UgJ3Zpc2l0ZWQnOiByZXR1cm4gZGVzdGluYXRpb25TdGVwLmNvbXBsZXRlZDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIG5hdmlnYXRlRm9yd2FyZDogJHt0aGlzLm5hdmlnYXRlRm9yd2FyZH1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUtZW50ZXJpbmcgdGhlIGN1cnJlbnQgc3RlcCBpcyBub3QgYWxsb3dlZFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaW5oZXJpdERvY1xuICAgKi9cbiAgcHJvdGVjdGVkIGVuc3VyZUNhblJlc2V0KHdpemFyZDogV2l6YXJkQ29tcG9uZW50KTogdm9pZCB7XG4gICAgc3VwZXIuZW5zdXJlQ2FuUmVzZXQod2l6YXJkKTtcblxuICAgIC8vIHRoZSBkZWZhdWx0IHN0ZXAgaXMgYSBjb21wbGV0aW9uIHN0ZXAgYW5kIHRoZSB3aXphcmQgY29udGFpbnMgbW9yZSB0aGFuIG9uZSBzdGVwXG4gICAgY29uc3QgZGVmYXVsdFdpemFyZFN0ZXAgPSB3aXphcmQuZ2V0U3RlcEF0SW5kZXgod2l6YXJkLmRlZmF1bHRTdGVwSW5kZXgpO1xuICAgIGNvbnN0IGRlZmF1bHRDb21wbGV0aW9uU3RlcCA9IGRlZmF1bHRXaXphcmRTdGVwIGluc3RhbmNlb2YgV2l6YXJkQ29tcGxldGlvblN0ZXA7XG4gICAgaWYgKGRlZmF1bHRDb21wbGV0aW9uU3RlcCAmJiB3aXphcmQud2l6YXJkU3RlcHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBkZWZhdWx0IHN0ZXAgaW5kZXggJHt3aXphcmQuZGVmYXVsdFN0ZXBJbmRleH0gcmVmZXJlbmNlcyBhIGNvbXBsZXRpb24gc3RlcGApO1xuICAgIH1cbiAgfVxufVxuIl19