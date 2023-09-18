import { Component, ContentChildren, HostBinding, Input, } from '@angular/core';
import { WizardStep } from '../util/wizard-step.interface';
import { MovingDirection } from '../util/moving-direction.enum';
import { ConfigurableNavigationMode } from '../navigation/configurable-navigation-mode';
/**
 * The `aw-wizard` component defines the root component of a wizard.
 * Through the setting of input parameters for the `aw-wizard` component it's possible to change the location and size
 * of its navigation bar.
 *
 * ### Syntax
 * ```html
 * <aw-wizard [navBarLocation]="location of navigation bar" [navBarLayout]="layout of navigation bar">
 *     ...
 * </aw-wizard>
 * ```
 *
 * ### Example
 *
 * Without completion step:
 *
 * ```html
 * <aw-wizard navBarLocation="top" navBarLayout="small">
 *     <aw-wizard-step>...</aw-wizard-step>
 *     <aw-wizard-step>...</aw-wizard-step>
 * </aw-wizard>
 * ```
 *
 * With completion step:
 *
 * ```html
 * <aw-wizard navBarLocation="top" navBarLayout="small">
 *     <aw-wizard-step>...</aw-wizard-step>
 *     <aw-wizard-step>...</aw-wizard-step>
 *     <aw-wizard-completion-step>...</aw-wizard-completion-step>
 * </aw-wizard>
 * ```
 *
 * @author Marc Arndt
 */
export class WizardComponent {
    /**
     * Constructor
     */
    constructor() {
        /**
         * The location of the navigation bar inside the wizard.
         * This location can be either top, bottom, left or right
         */
        this.navBarLocation = 'top';
        /**
         * The layout of the navigation bar inside the wizard.
         * The layout can be either small, large-filled, large-empty or large-symbols
         */
        this.navBarLayout = 'small';
        /**
         * The direction in which the steps inside the navigation bar should be shown.
         * The direction can be either `left-to-right` or `right-to-left`
         */
        this.navBarDirection = 'left-to-right';
        this._defaultStepIndex = 0;
        /**
         * True, if the navigation bar shouldn't be used for navigating
         */
        this.disableNavigationBar = false;
        /**
         * The navigation mode used to navigate inside the wizard
         *
         * For outside access, use the [[navigation]] getter.
         */
        this._navigation = new ConfigurableNavigationMode();
        /**
         * An array representation of all wizard steps belonging to this model
         *
         * For outside access, use the [[wizardSteps]] getter.
         */
        this._wizardSteps = [];
        /**
         * The index of the currently visible and selected step inside the wizardSteps QueryList.
         * If this wizard contains no steps, currentStepIndex is -1
         *
         * Note: Do not modify this field directly.  Instead, use navigation methods:
         * [[goToStep]], [[goToPreviousStep]], [[goToNextStep]].
         */
        this.currentStepIndex = -1;
    }
    /**
     * The initially selected step, represented by its index
     * Beware: This initial default is only used if no wizard step has been enhanced with the `selected` directive
     */
    get defaultStepIndex() {
        // This value can be either:
        // - the index of a wizard step with a `selected` directive, or
        // - the default step index, set in the [[WizardComponent]]
        const foundDefaultStep = this.wizardSteps.find(step => step.defaultSelected);
        if (foundDefaultStep) {
            return this.getIndexOfStep(foundDefaultStep);
        }
        else {
            return this._defaultStepIndex;
        }
    }
    set defaultStepIndex(defaultStepIndex) {
        this._defaultStepIndex = defaultStepIndex;
    }
    /**
     * Returns true if this wizard uses a horizontal orientation.
     * The wizard uses a horizontal orientation, iff the navigation bar is shown at the top or bottom of this wizard
     *
     * @returns True if this wizard uses a horizontal orientation
     */
    get horizontalOrientation() {
        return this.navBarLocation === 'top' || this.navBarLocation === 'bottom';
    }
    /**
     * Returns true if this wizard uses a vertical orientation.
     * The wizard uses a vertical orientation, iff the navigation bar is shown at the left or right of this wizard
     *
     * @returns True if this wizard uses a vertical orientation
     */
    get verticalOrientation() {
        return this.navBarLocation === 'left' || this.navBarLocation === 'right';
    }
    /**
     * Initialization work
     */
    ngAfterContentInit() {
        // add a subscriber to the wizard steps QueryList to listen to changes in the DOM
        this.wizardStepsQueryList.changes.subscribe(changedWizardSteps => {
            this.updateWizardSteps(changedWizardSteps.toArray());
        });
        // initialize the model
        this.updateWizardSteps(this.wizardStepsQueryList.toArray());
        // finally reset the whole wizard component
        setTimeout(() => this.reset());
    }
    /**
     * The WizardStep object belonging to the currently visible and selected step.
     * The currentStep is always the currently selected wizard step.
     * The currentStep can be either completed, if it was visited earlier,
     * or not completed, if it is visited for the first time or its state is currently out of date.
     *
     * If this wizard contains no steps, currentStep is null
     */
    get currentStep() {
        if (this.hasStep(this.currentStepIndex)) {
            return this.wizardSteps[this.currentStepIndex];
        }
        else {
            return null;
        }
    }
    /**
     * The completeness of the wizard.
     * If the wizard has been completed, i.e. all steps are either completed or optional, this value is true, otherwise it is false
     */
    get completed() {
        return this.wizardSteps.every(step => step.completed || step.optional);
    }
    /**
     * An array representation of all wizard steps belonging to this model
     */
    get wizardSteps() {
        return this._wizardSteps;
    }
    /**
     * Updates the wizard steps to the new array
     *
     * @param wizardSteps The updated wizard steps
     */
    updateWizardSteps(wizardSteps) {
        // the wizard is currently not in the initialization phase
        if (this.wizardSteps.length > 0 && this.currentStepIndex > -1) {
            this.currentStepIndex = wizardSteps.indexOf(this.wizardSteps[this.currentStepIndex]);
        }
        this._wizardSteps = wizardSteps;
    }
    /**
     * The navigation mode used to navigate inside the wizard
     */
    get navigation() {
        return this._navigation;
    }
    /**
     * Updates the navigation mode for this wizard component
     *
     * @param navigation The updated navigation mode
     */
    set navigation(navigation) {
        this._navigation = navigation;
    }
    /**
     * Checks if a given index `stepIndex` is inside the range of possible wizard steps inside this wizard
     *
     * @param stepIndex The to be checked index of a step inside this wizard
     * @returns True if the given `stepIndex` is contained inside this wizard, false otherwise
     */
    hasStep(stepIndex) {
        return this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
    }
    /**
     * Checks if this wizard has a previous step, compared to the current step
     *
     * @returns True if this wizard has a previous step before the current step
     */
    hasPreviousStep() {
        return this.hasStep(this.currentStepIndex - 1);
    }
    /**
     * Checks if this wizard has a next step, compared to the current step
     *
     * @returns True if this wizard has a next step after the current step
     */
    hasNextStep() {
        return this.hasStep(this.currentStepIndex + 1);
    }
    /**
     * Checks if this wizard is currently inside its last step
     *
     * @returns True if the wizard is currently inside its last step
     */
    isLastStep() {
        return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
    }
    /**
     * Finds the [[WizardStep]] at the given index `stepIndex`.
     * If no [[WizardStep]] exists at the given index an Error is thrown
     *
     * @param stepIndex The given index
     * @returns The found [[WizardStep]] at the given index `stepIndex`
     * @throws An `Error` is thrown, if the given index `stepIndex` doesn't exist
     */
    getStepAtIndex(stepIndex) {
        if (!this.hasStep(stepIndex)) {
            throw new Error(`Expected a known step, but got stepIndex: ${stepIndex}.`);
        }
        return this.wizardSteps[stepIndex];
    }
    /**
     * Finds the index of the step with the given `stepId`.
     * If no step with the given `stepId` exists, `-1` is returned
     *
     * @param stepId The given step id
     * @returns The found index of a step with the given step id, or `-1` if no step with the given id is included in the wizard
     */
    getIndexOfStepWithId(stepId) {
        return this.wizardSteps.findIndex(step => step.stepId === stepId);
    }
    /**
     * Finds the index of the given [[WizardStep]] `step`.
     * If the given [[WizardStep]] is not contained inside this wizard, `-1` is returned
     *
     * @param step The given [[WizardStep]]
     * @returns The found index of `step` or `-1` if the step is not included in the wizard
     */
    getIndexOfStep(step) {
        return this.wizardSteps.indexOf(step);
    }
    /**
     * Calculates the correct [[MovingDirection]] value for a given `destinationStep` compared to the `currentStepIndex`.
     *
     * @param destinationStep The given destination step
     * @returns The calculated [[MovingDirection]]
     */
    getMovingDirection(destinationStep) {
        let movingDirection;
        if (destinationStep > this.currentStepIndex) {
            movingDirection = MovingDirection.Forwards;
        }
        else if (destinationStep < this.currentStepIndex) {
            movingDirection = MovingDirection.Backwards;
        }
        else {
            movingDirection = MovingDirection.Stay;
        }
        return movingDirection;
    }
    /**
     * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
     *
     * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
     * Navigation by navigation bar is governed by [[isNavigable]].
     *
     * @param destinationIndex The index of the destination step
     * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
     */
    canGoToStep(destinationIndex) {
        return this.navigation.canGoToStep(this, destinationIndex);
    }
    /**
     * Tries to transition to the wizard step, as denoted by the given destination index.
     *
     * Note: You do not have to call [[canGoToStep]] before calling [[goToStep]].
     * The [[canGoToStep]] method will be called automatically.
     *
     * @param destinationIndex The index of the destination wizard step, which should be entered
     * @param preFinalize An event emitter, to be called before the step has been transitioned
     * @param postFinalize An event emitter, to be called after the step has been transitioned
     */
    goToStep(destinationIndex, preFinalize, postFinalize) {
        return this.navigation.goToStep(this, destinationIndex, preFinalize, postFinalize);
    }
    /**
     * Tries to transition the wizard to the previous step
     *
     * @param preFinalize An event emitter, to be called before the step has been transitioned
     * @param postFinalize An event emitter, to be called after the step has been transitioned
     */
    goToPreviousStep(preFinalize, postFinalize) {
        return this.navigation.goToStep(this, this.currentStepIndex - 1, preFinalize, postFinalize);
    }
    /**
     * Tries to transition the wizard to the next step
     *
     * @param preFinalize An event emitter, to be called before the step has been transitioned
     * @param postFinalize An event emitter, to be called after the step has been transitioned
     */
    goToNextStep(preFinalize, postFinalize) {
        return this.navigation.goToStep(this, this.currentStepIndex + 1, preFinalize, postFinalize);
    }
    /**
     * Checks, whether the wizard step, located at the given index, can be navigated to using the navigation bar.
     *
     * @param destinationIndex The index of the destination step
     * @returns True if the step can be navigated to, false otherwise
     */
    isNavigable(destinationIndex) {
        return this.navigation.isNavigable(this, destinationIndex);
    }
    /**
     * Resets the state of this wizard.
     */
    reset() {
        this.navigation.reset(this);
    }
}
WizardComponent.decorators = [
    { type: Component, args: [{
                selector: 'aw-wizard',
                template: "<aw-wizard-navigation-bar\n  *ngIf=\"navBarLocation == 'top' || navBarLocation == 'left'\"\n  [ngClass]=\"{\n    'vertical': navBarLocation == 'left',\n    'horizontal': navBarLocation == 'top',\n    'small': navBarLayout == 'small',\n    'large-filled': navBarLayout == 'large-filled',\n    'large-filled-symbols': navBarLayout == 'large-filled-symbols',\n    'large-empty': navBarLayout == 'large-empty',\n    'large-empty-symbols': navBarLayout == 'large-empty-symbols'\n  }\">\n</aw-wizard-navigation-bar>\n\n<div [ngClass]=\"{\n  'wizard-steps': true,\n  'vertical': navBarLocation == 'left' || navBarLocation == 'right',\n  'horizontal': navBarLocation == 'top' || navBarLocation == 'bottom'\n}\">\n  <ng-content></ng-content>\n</div>\n\n<aw-wizard-navigation-bar\n  *ngIf=\"navBarLocation == 'bottom' || navBarLocation == 'right'\"\n  [ngClass]=\"{\n    'vertical': navBarLocation == 'right',\n    'horizontal': navBarLocation == 'bottom',\n    'small': navBarLayout == 'small',\n    'large-filled': navBarLayout == 'large-filled',\n    'large-filled-symbols': navBarLayout == 'large-filled-symbols',\n    'large-empty': navBarLayout == 'large-empty',\n    'large-empty-symbols': navBarLayout == 'large-empty-symbols'\n  }\">\n</aw-wizard-navigation-bar>\n"
            },] }
];
WizardComponent.ctorParameters = () => [];
WizardComponent.propDecorators = {
    wizardStepsQueryList: [{ type: ContentChildren, args: [WizardStep, { descendants: true },] }],
    navBarLocation: [{ type: Input }],
    navBarLayout: [{ type: Input }],
    navBarDirection: [{ type: Input }],
    defaultStepIndex: [{ type: Input }],
    disableNavigationBar: [{ type: Input }],
    horizontalOrientation: [{ type: HostBinding, args: ['class.horizontal',] }],
    verticalOrientation: [{ type: HostBinding, args: ['class.vertical',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy93aXphcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFdBQVcsRUFDWCxLQUFLLEdBR04sTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUV0Rjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUtILE1BQU0sT0FBTyxlQUFlO0lBZ0YxQjs7T0FFRztJQUNIO1FBNUVBOzs7V0FHRztRQUVJLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRTlCOzs7V0FHRztRQUVJLGlCQUFZLEdBQUcsT0FBTyxDQUFDO1FBRTlCOzs7V0FHRztRQUVJLG9CQUFlLEdBQUcsZUFBZSxDQUFDO1FBdUJqQyxzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFFOUI7O1dBRUc7UUFFSSx5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFFcEM7Ozs7V0FJRztRQUNLLGdCQUFXLEdBQW1CLElBQUksMEJBQTBCLEVBQUUsQ0FBQztRQUV2RTs7OztXQUlHO1FBQ0ssaUJBQVksR0FBaUIsRUFBRSxDQUFDO1FBRXhDOzs7Ozs7V0FNRztRQUNJLHFCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBTTdCLENBQUM7SUF4REQ7OztPQUdHO0lBQ0gsSUFDVyxnQkFBZ0I7UUFDekIsNEJBQTRCO1FBQzVCLCtEQUErRDtRQUMvRCwyREFBMkQ7UUFFM0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU3RSxJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFDRCxJQUFXLGdCQUFnQixDQUFDLGdCQUF3QjtRQUNsRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7SUFDNUMsQ0FBQztJQXNDRDs7Ozs7T0FLRztJQUNILElBQ1cscUJBQXFCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLGNBQWMsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxRQUFRLENBQUM7SUFDM0UsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFDVyxtQkFBbUI7UUFDNUIsT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLE9BQU8sQ0FBQztJQUMzRSxDQUFDO0lBRUQ7O09BRUc7SUFDSSxrQkFBa0I7UUFDdkIsaUZBQWlGO1FBQ2pGLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDL0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRTVELDJDQUEyQztRQUMzQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFXLFdBQVc7UUFDcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNoRDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsV0FBVztRQUNwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxpQkFBaUIsQ0FBQyxXQUF5QjtRQUNqRCwwREFBMEQ7UUFDMUQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzdELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUN0RjtRQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFXLFVBQVUsQ0FBQyxVQUEwQjtRQUM5QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxPQUFPLENBQUMsU0FBaUI7UUFDOUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDOUYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxlQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxXQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxVQUFVO1FBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGNBQWMsQ0FBQyxTQUFpQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQzVFO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxvQkFBb0IsQ0FBQyxNQUFjO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxjQUFjLENBQUMsSUFBZ0I7UUFDcEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxrQkFBa0IsQ0FBQyxlQUF1QjtRQUMvQyxJQUFJLGVBQWdDLENBQUM7UUFFckMsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzNDLGVBQWUsR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDO1NBQzVDO2FBQU0sSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ2xELGVBQWUsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDO1NBQzdDO2FBQU07WUFDTCxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQztTQUN4QztRQUVELE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLFdBQVcsQ0FBQyxnQkFBd0I7UUFDekMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksUUFBUSxDQUFDLGdCQUF3QixFQUFFLFdBQWdDLEVBQUUsWUFBaUM7UUFDM0csT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLGdCQUFnQixDQUFDLFdBQWdDLEVBQUUsWUFBaUM7UUFDekYsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksWUFBWSxDQUFDLFdBQWdDLEVBQUUsWUFBaUM7UUFDckYsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLGdCQUF3QjtRQUN6QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7WUExVkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxXQUFXO2dCQUNyQiwydkNBQW9DO2FBQ3JDOzs7O21DQUtFLGVBQWUsU0FBQyxVQUFVLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFOzZCQU9qRCxLQUFLOzJCQU9MLEtBQUs7OEJBT0wsS0FBSzsrQkFPTCxLQUFLO21DQXNCTCxLQUFLO29DQXNDTCxXQUFXLFNBQUMsa0JBQWtCO2tDQVc5QixXQUFXLFNBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgUXVlcnlMaXN0LFxuICBFdmVudEVtaXR0ZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOYXZpZ2F0aW9uTW9kZX0gZnJvbSAnLi4vbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLW1vZGUuaW50ZXJmYWNlJztcbmltcG9ydCB7V2l6YXJkU3RlcH0gZnJvbSAnLi4vdXRpbC93aXphcmQtc3RlcC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtNb3ZpbmdEaXJlY3Rpb259IGZyb20gJy4uL3V0aWwvbW92aW5nLWRpcmVjdGlvbi5lbnVtJztcbmltcG9ydCB7Q29uZmlndXJhYmxlTmF2aWdhdGlvbk1vZGV9IGZyb20gJy4uL25hdmlnYXRpb24vY29uZmlndXJhYmxlLW5hdmlnYXRpb24tbW9kZSc7XG5cbi8qKlxuICogVGhlIGBhdy13aXphcmRgIGNvbXBvbmVudCBkZWZpbmVzIHRoZSByb290IGNvbXBvbmVudCBvZiBhIHdpemFyZC5cbiAqIFRocm91Z2ggdGhlIHNldHRpbmcgb2YgaW5wdXQgcGFyYW1ldGVycyBmb3IgdGhlIGBhdy13aXphcmRgIGNvbXBvbmVudCBpdCdzIHBvc3NpYmxlIHRvIGNoYW5nZSB0aGUgbG9jYXRpb24gYW5kIHNpemVcbiAqIG9mIGl0cyBuYXZpZ2F0aW9uIGJhci5cbiAqXG4gKiAjIyMgU3ludGF4XG4gKiBgYGBodG1sXG4gKiA8YXctd2l6YXJkIFtuYXZCYXJMb2NhdGlvbl09XCJsb2NhdGlvbiBvZiBuYXZpZ2F0aW9uIGJhclwiIFtuYXZCYXJMYXlvdXRdPVwibGF5b3V0IG9mIG5hdmlnYXRpb24gYmFyXCI+XG4gKiAgICAgLi4uXG4gKiA8L2F3LXdpemFyZD5cbiAqIGBgYFxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogV2l0aG91dCBjb21wbGV0aW9uIHN0ZXA6XG4gKlxuICogYGBgaHRtbFxuICogPGF3LXdpemFyZCBuYXZCYXJMb2NhdGlvbj1cInRvcFwiIG5hdkJhckxheW91dD1cInNtYWxsXCI+XG4gKiAgICAgPGF3LXdpemFyZC1zdGVwPi4uLjwvYXctd2l6YXJkLXN0ZXA+XG4gKiAgICAgPGF3LXdpemFyZC1zdGVwPi4uLjwvYXctd2l6YXJkLXN0ZXA+XG4gKiA8L2F3LXdpemFyZD5cbiAqIGBgYFxuICpcbiAqIFdpdGggY29tcGxldGlvbiBzdGVwOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxhdy13aXphcmQgbmF2QmFyTG9jYXRpb249XCJ0b3BcIiBuYXZCYXJMYXlvdXQ9XCJzbWFsbFwiPlxuICogICAgIDxhdy13aXphcmQtc3RlcD4uLi48L2F3LXdpemFyZC1zdGVwPlxuICogICAgIDxhdy13aXphcmQtc3RlcD4uLi48L2F3LXdpemFyZC1zdGVwPlxuICogICAgIDxhdy13aXphcmQtY29tcGxldGlvbi1zdGVwPi4uLjwvYXctd2l6YXJkLWNvbXBsZXRpb24tc3RlcD5cbiAqIDwvYXctd2l6YXJkPlxuICogYGBgXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2F3LXdpemFyZCcsXG4gIHRlbXBsYXRlVXJsOiAnd2l6YXJkLmNvbXBvbmVudC5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIC8qKlxuICAgKiBBIFF1ZXJ5TGlzdCBjb250YWluaW5nIGFsbCBbW1dpemFyZFN0ZXBdXXMgaW5zaWRlIHRoaXMgd2l6YXJkXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKFdpemFyZFN0ZXAsIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgcHVibGljIHdpemFyZFN0ZXBzUXVlcnlMaXN0OiBRdWVyeUxpc3Q8V2l6YXJkU3RlcD47XG5cbiAgLyoqXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgbmF2aWdhdGlvbiBiYXIgaW5zaWRlIHRoZSB3aXphcmQuXG4gICAqIFRoaXMgbG9jYXRpb24gY2FuIGJlIGVpdGhlciB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodFxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIG5hdkJhckxvY2F0aW9uID0gJ3RvcCc7XG5cbiAgLyoqXG4gICAqIFRoZSBsYXlvdXQgb2YgdGhlIG5hdmlnYXRpb24gYmFyIGluc2lkZSB0aGUgd2l6YXJkLlxuICAgKiBUaGUgbGF5b3V0IGNhbiBiZSBlaXRoZXIgc21hbGwsIGxhcmdlLWZpbGxlZCwgbGFyZ2UtZW1wdHkgb3IgbGFyZ2Utc3ltYm9sc1xuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIG5hdkJhckxheW91dCA9ICdzbWFsbCc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rpb24gaW4gd2hpY2ggdGhlIHN0ZXBzIGluc2lkZSB0aGUgbmF2aWdhdGlvbiBiYXIgc2hvdWxkIGJlIHNob3duLlxuICAgKiBUaGUgZGlyZWN0aW9uIGNhbiBiZSBlaXRoZXIgYGxlZnQtdG8tcmlnaHRgIG9yIGByaWdodC10by1sZWZ0YFxuICAgKi9cbiAgQElucHV0KClcbiAgcHVibGljIG5hdkJhckRpcmVjdGlvbiA9ICdsZWZ0LXRvLXJpZ2h0JztcblxuICAvKipcbiAgICogVGhlIGluaXRpYWxseSBzZWxlY3RlZCBzdGVwLCByZXByZXNlbnRlZCBieSBpdHMgaW5kZXhcbiAgICogQmV3YXJlOiBUaGlzIGluaXRpYWwgZGVmYXVsdCBpcyBvbmx5IHVzZWQgaWYgbm8gd2l6YXJkIHN0ZXAgaGFzIGJlZW4gZW5oYW5jZWQgd2l0aCB0aGUgYHNlbGVjdGVkYCBkaXJlY3RpdmVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBnZXQgZGVmYXVsdFN0ZXBJbmRleCgpOiBudW1iZXIge1xuICAgIC8vIFRoaXMgdmFsdWUgY2FuIGJlIGVpdGhlcjpcbiAgICAvLyAtIHRoZSBpbmRleCBvZiBhIHdpemFyZCBzdGVwIHdpdGggYSBgc2VsZWN0ZWRgIGRpcmVjdGl2ZSwgb3JcbiAgICAvLyAtIHRoZSBkZWZhdWx0IHN0ZXAgaW5kZXgsIHNldCBpbiB0aGUgW1tXaXphcmRDb21wb25lbnRdXVxuXG4gICAgY29uc3QgZm91bmREZWZhdWx0U3RlcCA9IHRoaXMud2l6YXJkU3RlcHMuZmluZChzdGVwID0+IHN0ZXAuZGVmYXVsdFNlbGVjdGVkKTtcblxuICAgIGlmIChmb3VuZERlZmF1bHRTdGVwKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJbmRleE9mU3RlcChmb3VuZERlZmF1bHRTdGVwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRTdGVwSW5kZXg7XG4gICAgfVxuICB9XG4gIHB1YmxpYyBzZXQgZGVmYXVsdFN0ZXBJbmRleChkZWZhdWx0U3RlcEluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLl9kZWZhdWx0U3RlcEluZGV4ID0gZGVmYXVsdFN0ZXBJbmRleDtcbiAgfVxuICBwcml2YXRlIF9kZWZhdWx0U3RlcEluZGV4ID0gMDtcblxuICAvKipcbiAgICogVHJ1ZSwgaWYgdGhlIG5hdmlnYXRpb24gYmFyIHNob3VsZG4ndCBiZSB1c2VkIGZvciBuYXZpZ2F0aW5nXG4gICAqL1xuICBASW5wdXQoKVxuICBwdWJsaWMgZGlzYWJsZU5hdmlnYXRpb25CYXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIG5hdmlnYXRpb24gbW9kZSB1c2VkIHRvIG5hdmlnYXRlIGluc2lkZSB0aGUgd2l6YXJkXG4gICAqXG4gICAqIEZvciBvdXRzaWRlIGFjY2VzcywgdXNlIHRoZSBbW25hdmlnYXRpb25dXSBnZXR0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uTW9kZSA9IG5ldyBDb25maWd1cmFibGVOYXZpZ2F0aW9uTW9kZSgpO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSByZXByZXNlbnRhdGlvbiBvZiBhbGwgd2l6YXJkIHN0ZXBzIGJlbG9uZ2luZyB0byB0aGlzIG1vZGVsXG4gICAqXG4gICAqIEZvciBvdXRzaWRlIGFjY2VzcywgdXNlIHRoZSBbW3dpemFyZFN0ZXBzXV0gZ2V0dGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfd2l6YXJkU3RlcHM6IFdpemFyZFN0ZXBbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnRseSB2aXNpYmxlIGFuZCBzZWxlY3RlZCBzdGVwIGluc2lkZSB0aGUgd2l6YXJkU3RlcHMgUXVlcnlMaXN0LlxuICAgKiBJZiB0aGlzIHdpemFyZCBjb250YWlucyBubyBzdGVwcywgY3VycmVudFN0ZXBJbmRleCBpcyAtMVxuICAgKlxuICAgKiBOb3RlOiBEbyBub3QgbW9kaWZ5IHRoaXMgZmllbGQgZGlyZWN0bHkuICBJbnN0ZWFkLCB1c2UgbmF2aWdhdGlvbiBtZXRob2RzOlxuICAgKiBbW2dvVG9TdGVwXV0sIFtbZ29Ub1ByZXZpb3VzU3RlcF1dLCBbW2dvVG9OZXh0U3RlcF1dLlxuICAgKi9cbiAgcHVibGljIGN1cnJlbnRTdGVwSW5kZXggPSAtMTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHdpemFyZCB1c2VzIGEgaG9yaXpvbnRhbCBvcmllbnRhdGlvbi5cbiAgICogVGhlIHdpemFyZCB1c2VzIGEgaG9yaXpvbnRhbCBvcmllbnRhdGlvbiwgaWZmIHRoZSBuYXZpZ2F0aW9uIGJhciBpcyBzaG93biBhdCB0aGUgdG9wIG9yIGJvdHRvbSBvZiB0aGlzIHdpemFyZFxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgd2l6YXJkIHVzZXMgYSBob3Jpem9udGFsIG9yaWVudGF0aW9uXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmhvcml6b250YWwnKVxuICBwdWJsaWMgZ2V0IGhvcml6b250YWxPcmllbnRhdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYXZCYXJMb2NhdGlvbiA9PT0gJ3RvcCcgfHwgdGhpcy5uYXZCYXJMb2NhdGlvbiA9PT0gJ2JvdHRvbSc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgd2l6YXJkIHVzZXMgYSB2ZXJ0aWNhbCBvcmllbnRhdGlvbi5cbiAgICogVGhlIHdpemFyZCB1c2VzIGEgdmVydGljYWwgb3JpZW50YXRpb24sIGlmZiB0aGUgbmF2aWdhdGlvbiBiYXIgaXMgc2hvd24gYXQgdGhlIGxlZnQgb3IgcmlnaHQgb2YgdGhpcyB3aXphcmRcbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIHdpemFyZCB1c2VzIGEgdmVydGljYWwgb3JpZW50YXRpb25cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MudmVydGljYWwnKVxuICBwdWJsaWMgZ2V0IHZlcnRpY2FsT3JpZW50YXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2QmFyTG9jYXRpb24gPT09ICdsZWZ0JyB8fCB0aGlzLm5hdkJhckxvY2F0aW9uID09PSAncmlnaHQnO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemF0aW9uIHdvcmtcbiAgICovXG4gIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgLy8gYWRkIGEgc3Vic2NyaWJlciB0byB0aGUgd2l6YXJkIHN0ZXBzIFF1ZXJ5TGlzdCB0byBsaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgRE9NXG4gICAgdGhpcy53aXphcmRTdGVwc1F1ZXJ5TGlzdC5jaGFuZ2VzLnN1YnNjcmliZShjaGFuZ2VkV2l6YXJkU3RlcHMgPT4ge1xuICAgICAgdGhpcy51cGRhdGVXaXphcmRTdGVwcyhjaGFuZ2VkV2l6YXJkU3RlcHMudG9BcnJheSgpKTtcbiAgICB9KTtcblxuICAgIC8vIGluaXRpYWxpemUgdGhlIG1vZGVsXG4gICAgdGhpcy51cGRhdGVXaXphcmRTdGVwcyh0aGlzLndpemFyZFN0ZXBzUXVlcnlMaXN0LnRvQXJyYXkoKSk7XG5cbiAgICAvLyBmaW5hbGx5IHJlc2V0IHRoZSB3aG9sZSB3aXphcmQgY29tcG9uZW50XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2V0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBXaXphcmRTdGVwIG9iamVjdCBiZWxvbmdpbmcgdG8gdGhlIGN1cnJlbnRseSB2aXNpYmxlIGFuZCBzZWxlY3RlZCBzdGVwLlxuICAgKiBUaGUgY3VycmVudFN0ZXAgaXMgYWx3YXlzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgd2l6YXJkIHN0ZXAuXG4gICAqIFRoZSBjdXJyZW50U3RlcCBjYW4gYmUgZWl0aGVyIGNvbXBsZXRlZCwgaWYgaXQgd2FzIHZpc2l0ZWQgZWFybGllcixcbiAgICogb3Igbm90IGNvbXBsZXRlZCwgaWYgaXQgaXMgdmlzaXRlZCBmb3IgdGhlIGZpcnN0IHRpbWUgb3IgaXRzIHN0YXRlIGlzIGN1cnJlbnRseSBvdXQgb2YgZGF0ZS5cbiAgICpcbiAgICogSWYgdGhpcyB3aXphcmQgY29udGFpbnMgbm8gc3RlcHMsIGN1cnJlbnRTdGVwIGlzIG51bGxcbiAgICovXG4gIHB1YmxpYyBnZXQgY3VycmVudFN0ZXAoKTogV2l6YXJkU3RlcCB7XG4gICAgaWYgKHRoaXMuaGFzU3RlcCh0aGlzLmN1cnJlbnRTdGVwSW5kZXgpKSB7XG4gICAgICByZXR1cm4gdGhpcy53aXphcmRTdGVwc1t0aGlzLmN1cnJlbnRTdGVwSW5kZXhdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNvbXBsZXRlbmVzcyBvZiB0aGUgd2l6YXJkLlxuICAgKiBJZiB0aGUgd2l6YXJkIGhhcyBiZWVuIGNvbXBsZXRlZCwgaS5lLiBhbGwgc3RlcHMgYXJlIGVpdGhlciBjb21wbGV0ZWQgb3Igb3B0aW9uYWwsIHRoaXMgdmFsdWUgaXMgdHJ1ZSwgb3RoZXJ3aXNlIGl0IGlzIGZhbHNlXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbXBsZXRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy53aXphcmRTdGVwcy5ldmVyeShzdGVwID0+IHN0ZXAuY29tcGxldGVkIHx8IHN0ZXAub3B0aW9uYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIGFsbCB3aXphcmQgc3RlcHMgYmVsb25naW5nIHRvIHRoaXMgbW9kZWxcbiAgICovXG4gIHB1YmxpYyBnZXQgd2l6YXJkU3RlcHMoKTogV2l6YXJkU3RlcFtdIHtcbiAgICByZXR1cm4gdGhpcy5fd2l6YXJkU3RlcHM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgd2l6YXJkIHN0ZXBzIHRvIHRoZSBuZXcgYXJyYXlcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZFN0ZXBzIFRoZSB1cGRhdGVkIHdpemFyZCBzdGVwc1xuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVXaXphcmRTdGVwcyh3aXphcmRTdGVwczogV2l6YXJkU3RlcFtdKTogdm9pZCB7XG4gICAgLy8gdGhlIHdpemFyZCBpcyBjdXJyZW50bHkgbm90IGluIHRoZSBpbml0aWFsaXphdGlvbiBwaGFzZVxuICAgIGlmICh0aGlzLndpemFyZFN0ZXBzLmxlbmd0aCA+IDAgJiYgdGhpcy5jdXJyZW50U3RlcEluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuY3VycmVudFN0ZXBJbmRleCA9IHdpemFyZFN0ZXBzLmluZGV4T2YodGhpcy53aXphcmRTdGVwc1t0aGlzLmN1cnJlbnRTdGVwSW5kZXhdKTtcbiAgICB9XG5cbiAgICB0aGlzLl93aXphcmRTdGVwcyA9IHdpemFyZFN0ZXBzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYXZpZ2F0aW9uIG1vZGUgdXNlZCB0byBuYXZpZ2F0ZSBpbnNpZGUgdGhlIHdpemFyZFxuICAgKi9cbiAgcHVibGljIGdldCBuYXZpZ2F0aW9uKCk6IE5hdmlnYXRpb25Nb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fbmF2aWdhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBuYXZpZ2F0aW9uIG1vZGUgZm9yIHRoaXMgd2l6YXJkIGNvbXBvbmVudFxuICAgKlxuICAgKiBAcGFyYW0gbmF2aWdhdGlvbiBUaGUgdXBkYXRlZCBuYXZpZ2F0aW9uIG1vZGVcbiAgICovXG4gIHB1YmxpYyBzZXQgbmF2aWdhdGlvbihuYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uTW9kZSkge1xuICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGdpdmVuIGluZGV4IGBzdGVwSW5kZXhgIGlzIGluc2lkZSB0aGUgcmFuZ2Ugb2YgcG9zc2libGUgd2l6YXJkIHN0ZXBzIGluc2lkZSB0aGlzIHdpemFyZFxuICAgKlxuICAgKiBAcGFyYW0gc3RlcEluZGV4IFRoZSB0byBiZSBjaGVja2VkIGluZGV4IG9mIGEgc3RlcCBpbnNpZGUgdGhpcyB3aXphcmRcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgZ2l2ZW4gYHN0ZXBJbmRleGAgaXMgY29udGFpbmVkIGluc2lkZSB0aGlzIHdpemFyZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBwdWJsaWMgaGFzU3RlcChzdGVwSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLndpemFyZFN0ZXBzLmxlbmd0aCA+IDAgJiYgMCA8PSBzdGVwSW5kZXggJiYgc3RlcEluZGV4IDwgdGhpcy53aXphcmRTdGVwcy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoaXMgd2l6YXJkIGhhcyBhIHByZXZpb3VzIHN0ZXAsIGNvbXBhcmVkIHRvIHRoZSBjdXJyZW50IHN0ZXBcbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIHdpemFyZCBoYXMgYSBwcmV2aW91cyBzdGVwIGJlZm9yZSB0aGUgY3VycmVudCBzdGVwXG4gICAqL1xuICBwdWJsaWMgaGFzUHJldmlvdXNTdGVwKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhhc1N0ZXAodGhpcy5jdXJyZW50U3RlcEluZGV4IC0gMSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoaXMgd2l6YXJkIGhhcyBhIG5leHQgc3RlcCwgY29tcGFyZWQgdG8gdGhlIGN1cnJlbnQgc3RlcFxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgd2l6YXJkIGhhcyBhIG5leHQgc3RlcCBhZnRlciB0aGUgY3VycmVudCBzdGVwXG4gICAqL1xuICBwdWJsaWMgaGFzTmV4dFN0ZXAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaGFzU3RlcCh0aGlzLmN1cnJlbnRTdGVwSW5kZXggKyAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhpcyB3aXphcmQgaXMgY3VycmVudGx5IGluc2lkZSBpdHMgbGFzdCBzdGVwXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHdpemFyZCBpcyBjdXJyZW50bHkgaW5zaWRlIGl0cyBsYXN0IHN0ZXBcbiAgICovXG4gIHB1YmxpYyBpc0xhc3RTdGVwKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLndpemFyZFN0ZXBzLmxlbmd0aCA+IDAgJiYgdGhpcy5jdXJyZW50U3RlcEluZGV4ID09PSB0aGlzLndpemFyZFN0ZXBzLmxlbmd0aCAtIDE7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgdGhlIFtbV2l6YXJkU3RlcF1dIGF0IHRoZSBnaXZlbiBpbmRleCBgc3RlcEluZGV4YC5cbiAgICogSWYgbm8gW1tXaXphcmRTdGVwXV0gZXhpc3RzIGF0IHRoZSBnaXZlbiBpbmRleCBhbiBFcnJvciBpcyB0aHJvd25cbiAgICpcbiAgICogQHBhcmFtIHN0ZXBJbmRleCBUaGUgZ2l2ZW4gaW5kZXhcbiAgICogQHJldHVybnMgVGhlIGZvdW5kIFtbV2l6YXJkU3RlcF1dIGF0IHRoZSBnaXZlbiBpbmRleCBgc3RlcEluZGV4YFxuICAgKiBAdGhyb3dzIEFuIGBFcnJvcmAgaXMgdGhyb3duLCBpZiB0aGUgZ2l2ZW4gaW5kZXggYHN0ZXBJbmRleGAgZG9lc24ndCBleGlzdFxuICAgKi9cbiAgcHVibGljIGdldFN0ZXBBdEluZGV4KHN0ZXBJbmRleDogbnVtYmVyKTogV2l6YXJkU3RlcCB7XG4gICAgaWYgKCF0aGlzLmhhc1N0ZXAoc3RlcEluZGV4KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhIGtub3duIHN0ZXAsIGJ1dCBnb3Qgc3RlcEluZGV4OiAke3N0ZXBJbmRleH0uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMud2l6YXJkU3RlcHNbc3RlcEluZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgaW5kZXggb2YgdGhlIHN0ZXAgd2l0aCB0aGUgZ2l2ZW4gYHN0ZXBJZGAuXG4gICAqIElmIG5vIHN0ZXAgd2l0aCB0aGUgZ2l2ZW4gYHN0ZXBJZGAgZXhpc3RzLCBgLTFgIGlzIHJldHVybmVkXG4gICAqXG4gICAqIEBwYXJhbSBzdGVwSWQgVGhlIGdpdmVuIHN0ZXAgaWRcbiAgICogQHJldHVybnMgVGhlIGZvdW5kIGluZGV4IG9mIGEgc3RlcCB3aXRoIHRoZSBnaXZlbiBzdGVwIGlkLCBvciBgLTFgIGlmIG5vIHN0ZXAgd2l0aCB0aGUgZ2l2ZW4gaWQgaXMgaW5jbHVkZWQgaW4gdGhlIHdpemFyZFxuICAgKi9cbiAgcHVibGljIGdldEluZGV4T2ZTdGVwV2l0aElkKHN0ZXBJZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53aXphcmRTdGVwcy5maW5kSW5kZXgoc3RlcCA9PiBzdGVwLnN0ZXBJZCA9PT0gc3RlcElkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgaW5kZXggb2YgdGhlIGdpdmVuIFtbV2l6YXJkU3RlcF1dIGBzdGVwYC5cbiAgICogSWYgdGhlIGdpdmVuIFtbV2l6YXJkU3RlcF1dIGlzIG5vdCBjb250YWluZWQgaW5zaWRlIHRoaXMgd2l6YXJkLCBgLTFgIGlzIHJldHVybmVkXG4gICAqXG4gICAqIEBwYXJhbSBzdGVwIFRoZSBnaXZlbiBbW1dpemFyZFN0ZXBdXVxuICAgKiBAcmV0dXJucyBUaGUgZm91bmQgaW5kZXggb2YgYHN0ZXBgIG9yIGAtMWAgaWYgdGhlIHN0ZXAgaXMgbm90IGluY2x1ZGVkIGluIHRoZSB3aXphcmRcbiAgICovXG4gIHB1YmxpYyBnZXRJbmRleE9mU3RlcChzdGVwOiBXaXphcmRTdGVwKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53aXphcmRTdGVwcy5pbmRleE9mKHN0ZXApO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNvcnJlY3QgW1tNb3ZpbmdEaXJlY3Rpb25dXSB2YWx1ZSBmb3IgYSBnaXZlbiBgZGVzdGluYXRpb25TdGVwYCBjb21wYXJlZCB0byB0aGUgYGN1cnJlbnRTdGVwSW5kZXhgLlxuICAgKlxuICAgKiBAcGFyYW0gZGVzdGluYXRpb25TdGVwIFRoZSBnaXZlbiBkZXN0aW5hdGlvbiBzdGVwXG4gICAqIEByZXR1cm5zIFRoZSBjYWxjdWxhdGVkIFtbTW92aW5nRGlyZWN0aW9uXV1cbiAgICovXG4gIHB1YmxpYyBnZXRNb3ZpbmdEaXJlY3Rpb24oZGVzdGluYXRpb25TdGVwOiBudW1iZXIpOiBNb3ZpbmdEaXJlY3Rpb24ge1xuICAgIGxldCBtb3ZpbmdEaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbjtcblxuICAgIGlmIChkZXN0aW5hdGlvblN0ZXAgPiB0aGlzLmN1cnJlbnRTdGVwSW5kZXgpIHtcbiAgICAgIG1vdmluZ0RpcmVjdGlvbiA9IE1vdmluZ0RpcmVjdGlvbi5Gb3J3YXJkcztcbiAgICB9IGVsc2UgaWYgKGRlc3RpbmF0aW9uU3RlcCA8IHRoaXMuY3VycmVudFN0ZXBJbmRleCkge1xuICAgICAgbW92aW5nRGlyZWN0aW9uID0gTW92aW5nRGlyZWN0aW9uLkJhY2t3YXJkcztcbiAgICB9IGVsc2Uge1xuICAgICAgbW92aW5nRGlyZWN0aW9uID0gTW92aW5nRGlyZWN0aW9uLlN0YXk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmluZ0RpcmVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MsIHdoZXRoZXIgYSB3aXphcmQgc3RlcCwgYXMgZGVmaW5lZCBieSB0aGUgZ2l2ZW4gZGVzdGluYXRpb24gaW5kZXgsIGNhbiBiZSB0cmFuc2l0aW9uZWQgdG8uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNvbnRyb2xzIG5hdmlnYXRpb24gYnkgW1tnb1RvU3RlcF1dLCBbW2dvVG9QcmV2aW91c1N0ZXBdXSwgYW5kIFtbZ29Ub05leHRTdGVwXV0gZGlyZWN0aXZlcy5cbiAgICogTmF2aWdhdGlvbiBieSBuYXZpZ2F0aW9uIGJhciBpcyBnb3Zlcm5lZCBieSBbW2lzTmF2aWdhYmxlXV0uXG4gICAqXG4gICAqIEBwYXJhbSBkZXN0aW5hdGlvbkluZGV4IFRoZSBpbmRleCBvZiB0aGUgZGVzdGluYXRpb24gc3RlcFxuICAgKiBAcmV0dXJucyBBIFtbUHJvbWlzZV1dIGNvbnRhaW5pbmcgYHRydWVgLCBpZiB0aGUgZGVzdGluYXRpb24gc3RlcCBjYW4gYmUgdHJhbnNpdGlvbmVkIHRvIGFuZCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHB1YmxpYyBjYW5Hb1RvU3RlcChkZXN0aW5hdGlvbkluZGV4OiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0aW9uLmNhbkdvVG9TdGVwKHRoaXMsIGRlc3RpbmF0aW9uSW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWVzIHRvIHRyYW5zaXRpb24gdG8gdGhlIHdpemFyZCBzdGVwLCBhcyBkZW5vdGVkIGJ5IHRoZSBnaXZlbiBkZXN0aW5hdGlvbiBpbmRleC5cbiAgICpcbiAgICogTm90ZTogWW91IGRvIG5vdCBoYXZlIHRvIGNhbGwgW1tjYW5Hb1RvU3RlcF1dIGJlZm9yZSBjYWxsaW5nIFtbZ29Ub1N0ZXBdXS5cbiAgICogVGhlIFtbY2FuR29Ub1N0ZXBdXSBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQHBhcmFtIGRlc3RpbmF0aW9uSW5kZXggVGhlIGluZGV4IG9mIHRoZSBkZXN0aW5hdGlvbiB3aXphcmQgc3RlcCwgd2hpY2ggc2hvdWxkIGJlIGVudGVyZWRcbiAgICogQHBhcmFtIHByZUZpbmFsaXplIEFuIGV2ZW50IGVtaXR0ZXIsIHRvIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHN0ZXAgaGFzIGJlZW4gdHJhbnNpdGlvbmVkXG4gICAqIEBwYXJhbSBwb3N0RmluYWxpemUgQW4gZXZlbnQgZW1pdHRlciwgdG8gYmUgY2FsbGVkIGFmdGVyIHRoZSBzdGVwIGhhcyBiZWVuIHRyYW5zaXRpb25lZFxuICAgKi9cbiAgcHVibGljIGdvVG9TdGVwKGRlc3RpbmF0aW9uSW5kZXg6IG51bWJlciwgcHJlRmluYWxpemU/OiBFdmVudEVtaXR0ZXI8dm9pZD4sIHBvc3RGaW5hbGl6ZT86IEV2ZW50RW1pdHRlcjx2b2lkPik6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLm5hdmlnYXRpb24uZ29Ub1N0ZXAodGhpcywgZGVzdGluYXRpb25JbmRleCwgcHJlRmluYWxpemUsIHBvc3RGaW5hbGl6ZSk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZXMgdG8gdHJhbnNpdGlvbiB0aGUgd2l6YXJkIHRvIHRoZSBwcmV2aW91cyBzdGVwXG4gICAqXG4gICAqIEBwYXJhbSBwcmVGaW5hbGl6ZSBBbiBldmVudCBlbWl0dGVyLCB0byBiZSBjYWxsZWQgYmVmb3JlIHRoZSBzdGVwIGhhcyBiZWVuIHRyYW5zaXRpb25lZFxuICAgKiBAcGFyYW0gcG9zdEZpbmFsaXplIEFuIGV2ZW50IGVtaXR0ZXIsIHRvIGJlIGNhbGxlZCBhZnRlciB0aGUgc3RlcCBoYXMgYmVlbiB0cmFuc2l0aW9uZWRcbiAgICovXG4gIHB1YmxpYyBnb1RvUHJldmlvdXNTdGVwKHByZUZpbmFsaXplPzogRXZlbnRFbWl0dGVyPHZvaWQ+LCBwb3N0RmluYWxpemU/OiBFdmVudEVtaXR0ZXI8dm9pZD4pOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0aW9uLmdvVG9TdGVwKHRoaXMsIHRoaXMuY3VycmVudFN0ZXBJbmRleCAtIDEsIHByZUZpbmFsaXplLCBwb3N0RmluYWxpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWVzIHRvIHRyYW5zaXRpb24gdGhlIHdpemFyZCB0byB0aGUgbmV4dCBzdGVwXG4gICAqXG4gICAqIEBwYXJhbSBwcmVGaW5hbGl6ZSBBbiBldmVudCBlbWl0dGVyLCB0byBiZSBjYWxsZWQgYmVmb3JlIHRoZSBzdGVwIGhhcyBiZWVuIHRyYW5zaXRpb25lZFxuICAgKiBAcGFyYW0gcG9zdEZpbmFsaXplIEFuIGV2ZW50IGVtaXR0ZXIsIHRvIGJlIGNhbGxlZCBhZnRlciB0aGUgc3RlcCBoYXMgYmVlbiB0cmFuc2l0aW9uZWRcbiAgICovXG4gIHB1YmxpYyBnb1RvTmV4dFN0ZXAocHJlRmluYWxpemU/OiBFdmVudEVtaXR0ZXI8dm9pZD4sIHBvc3RGaW5hbGl6ZT86IEV2ZW50RW1pdHRlcjx2b2lkPik6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLm5hdmlnYXRpb24uZ29Ub1N0ZXAodGhpcywgdGhpcy5jdXJyZW50U3RlcEluZGV4ICsgMSwgcHJlRmluYWxpemUsIHBvc3RGaW5hbGl6ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzLCB3aGV0aGVyIHRoZSB3aXphcmQgc3RlcCwgbG9jYXRlZCBhdCB0aGUgZ2l2ZW4gaW5kZXgsIGNhbiBiZSBuYXZpZ2F0ZWQgdG8gdXNpbmcgdGhlIG5hdmlnYXRpb24gYmFyLlxuICAgKlxuICAgKiBAcGFyYW0gZGVzdGluYXRpb25JbmRleCBUaGUgaW5kZXggb2YgdGhlIGRlc3RpbmF0aW9uIHN0ZXBcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgc3RlcCBjYW4gYmUgbmF2aWdhdGVkIHRvLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIHB1YmxpYyBpc05hdmlnYWJsZShkZXN0aW5hdGlvbkluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0aW9uLmlzTmF2aWdhYmxlKHRoaXMsIGRlc3RpbmF0aW9uSW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgc3RhdGUgb2YgdGhpcyB3aXphcmQuXG4gICAqL1xuICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5uYXZpZ2F0aW9uLnJlc2V0KHRoaXMpO1xuICB9XG59XG4iXX0=