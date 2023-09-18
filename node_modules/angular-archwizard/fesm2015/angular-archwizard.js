import { Directive, TemplateRef, EventEmitter, ContentChild, Input, Output, HostBinding, Component, forwardRef, ContentChildren, Host, Optional, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * The `awWizardStepSymbol` directive can be used as an alternative to the `navigationSymbol` input of a [[WizardStep]]
 * to define the step symbol inside the navigation bar.  This way step symbol may contain arbitrary content.
 *
 * ### Syntax
 *
 * ```html
 * <ng-template awWizardStepSymbol>
 *     ...
 * </ng-template>
 * ```
 */
class WizardStepSymbolDirective {
    /**
     * Constructor
     *
     * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepSymbolDirective]]
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
WizardStepSymbolDirective.decorators = [
    { type: Directive, args: [{
                selector: 'ng-template[awStepSymbol], ng-template[awWizardStepSymbol]'
            },] }
];
WizardStepSymbolDirective.ctorParameters = () => [
    { type: TemplateRef }
];

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
class WizardStepTitleDirective {
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

/**
 * Basic functionality every type of wizard step needs to provide
 *
 * @author Marc Arndt
 */
/* tslint:disable-next-line directive-class-suffix */
class WizardStep {
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

/**
 * Basic functionality every wizard completion step needs to provide
 *
 * @author Marc Arndt
 */
/* tslint:disable-next-line directive-class-suffix */
class WizardCompletionStep extends WizardStep {
    constructor() {
        super(...arguments);
        /**
         * @inheritDoc
         */
        this.stepExit = new EventEmitter();
        /**
         * @inheritDoc
         */
        this.canExit = false;
    }
    /**
     * @inheritDoc
     */
    enter(direction) {
        this.completed = true;
        this.stepEnter.emit(direction);
    }
    /**
     * @inheritDoc
     */
    exit(direction) {
        // set this completion step as incomplete (unless it happens to be initiallyCompleted)
        this.completed = this.initiallyCompleted;
        this.stepExit.emit(direction);
    }
}
WizardCompletionStep.decorators = [
    { type: Directive }
];

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
class WizardCompletionStepComponent extends WizardCompletionStep {
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

/**
 * The direction in which a step transition was made
 *
 * @author Marc Arndt
 */
/**
 * This enum contains the different possible moving directions in which a wizard can be traversed
 *
 * @author Marc Arndt
 */
var MovingDirection;
(function (MovingDirection) {
    /**
     * A forward step transition
     */
    MovingDirection[MovingDirection["Forwards"] = 0] = "Forwards";
    /**
     * A backward step transition
     */
    MovingDirection[MovingDirection["Backwards"] = 1] = "Backwards";
    /**
     * No step transition was done
     */
    MovingDirection[MovingDirection["Stay"] = 2] = "Stay";
})(MovingDirection || (MovingDirection = {}));

/**
 * Base implementation of [[NavigationMode]]
 *
 * Note: Built-in [[NavigationMode]] classes should be stateless, allowing the library user to easily create
 * an instance of a particular [[NavigationMode]] class and pass it to `<aw-wizard [navigationMode]="...">`.
 *
 * @author Marc Arndt
 */
class BaseNavigationMode {
    /**
     * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
     *
     * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
     * Navigation by navigation bar is governed by [[isNavigable]].
     *
     * In this implementation, a destination wizard step can be entered if:
     * - it exists
     * - the current step can be exited in the direction of the destination step
     * - the destination step can be entered in the direction from the current step
     *
     * Subclasses can impose additional restrictions, see [[canTransitionToStep]].
     *
     * @param wizard The wizard component to operate on
     * @param destinationIndex The index of the destination step
     * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and `false` otherwise
     */
    canGoToStep(wizard, destinationIndex) {
        const hasStep = wizard.hasStep(destinationIndex);
        const movingDirection = wizard.getMovingDirection(destinationIndex);
        const canExitCurrentStep = (previous) => {
            return previous && wizard.currentStep.canExitStep(movingDirection);
        };
        const canEnterDestinationStep = (previous) => {
            return previous && wizard.getStepAtIndex(destinationIndex).canEnterStep(movingDirection);
        };
        const canTransitionToStep = (previous) => {
            return previous && this.canTransitionToStep(wizard, destinationIndex);
        };
        return Promise.resolve(hasStep)
            .then(canTransitionToStep)
            // Apply user-defined checks at the end.  They can involve user interaction
            // which is better to be avoided if navigation mode does not actually allow the transition
            // (`canTransitionToStep` returns `false`).
            .then(canExitCurrentStep)
            .then(canEnterDestinationStep);
    }
    /**
     * Imposes additional restrictions for `canGoToStep` in current navigation mode.
     *
     * The base implementation allows transition iff the given step is navigable from the navigation bar (see `isNavigable`).
     * However, in some navigation modes `canTransitionToStep` can be more relaxed to allow navigation to certain steps
     * by previous/next buttons, but not using the navigation bar.
     *
     * @param wizard The wizard component to operate on
     * @param destinationIndex The index of the destination step
     * @returns `true`, if the destination step can be transitioned to and `false` otherwise
     */
    canTransitionToStep(wizard, destinationIndex) {
        return this.isNavigable(wizard, destinationIndex);
    }
    /**
     * Tries to transition to the wizard step, as denoted by the given destination index.
     *
     * When entering the destination step, the following actions are done:
     * - the old current step is set as completed
     * - the old current step is set as unselected
     * - the old current step is exited
     * - the destination step is set as selected
     * - the destination step is entered
     *
     * When the destination step couldn't be entered, the following actions are done:
     * - the current step is exited and entered in the direction `MovingDirection.Stay`
     *
     * @param wizard The wizard component to operate on
     * @param destinationIndex The index of the destination wizard step, which should be entered
     * @param preFinalize An event emitter, to be called before the step has been transitioned
     * @param postFinalize An event emitter, to be called after the step has been transitioned
     */
    goToStep(wizard, destinationIndex, preFinalize, postFinalize) {
        this.canGoToStep(wizard, destinationIndex).then(navigationAllowed => {
            if (navigationAllowed) {
                // the current step can be exited in the given direction
                const movingDirection = wizard.getMovingDirection(destinationIndex);
                /* istanbul ignore if */
                if (preFinalize) {
                    preFinalize.emit();
                }
                // leave current step
                wizard.currentStep.completed = true;
                wizard.currentStep.exit(movingDirection);
                wizard.currentStep.editing = false;
                wizard.currentStep.selected = false;
                this.transition(wizard, destinationIndex);
                // remember if the next step is already completed before entering it to properly set `editing` flag
                const wasCompleted = wizard.completed || wizard.currentStep.completed;
                // go to next step
                wizard.currentStep.enter(movingDirection);
                wizard.currentStep.selected = true;
                if (wasCompleted) {
                    wizard.currentStep.editing = true;
                }
                /* istanbul ignore if */
                if (postFinalize) {
                    postFinalize.emit();
                }
            }
            else {
                // if the current step can't be left, reenter the current step
                wizard.currentStep.exit(MovingDirection.Stay);
                wizard.currentStep.enter(MovingDirection.Stay);
            }
        });
    }
    /**
     * Transitions the wizard to the given step index.
     *
     * Can perform additional actions in particular navigation mode implementations.
     *
     * @param wizard The wizard component to operate on
     * @param destinationIndex The index of the destination wizard step
     */
    transition(wizard, destinationIndex) {
        wizard.currentStepIndex = destinationIndex;
    }
    /**
     * Resets the state of this wizard.
     *
     * A reset transitions the wizard automatically to the first step and sets all steps as incomplete.
     * In addition the whole wizard is set as incomplete.
     *
     * @param wizard The wizard component to operate on
     */
    reset(wizard) {
        this.ensureCanReset(wizard);
        // reset the step internal state
        wizard.wizardSteps.forEach(step => {
            step.completed = step.initiallyCompleted;
            step.selected = false;
            step.editing = false;
        });
        // set the first step as the current step
        wizard.currentStepIndex = wizard.defaultStepIndex;
        wizard.currentStep.selected = true;
        wizard.currentStep.enter(MovingDirection.Forwards);
    }
    /**
     * Checks if wizard configuration allows to perform reset.
     *
     * A check failure is indicated by throwing an `Error` with the message discribing the discovered misconfiguration issue.
     *
     * Can include additional checks in particular navigation mode implementations.
     *
     * @param wizard The wizard component to operate on
     * @throws An `Error` is thrown, if a micconfiguration issue is discovered.
     */
    ensureCanReset(wizard) {
        // the wizard doesn't contain a step with the default step index
        if (!wizard.hasStep(wizard.defaultStepIndex)) {
            throw new Error(`The wizard doesn't contain a step with index ${wizard.defaultStepIndex}`);
        }
    }
}

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
class ConfigurableNavigationMode extends BaseNavigationMode {
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
class WizardComponent {
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

/**
 * The `aw-wizard-navigation-bar` component contains the navigation bar inside a [[WizardComponent]].
 * To correctly display the navigation bar, it's required to set the right css classes for the navigation bar,
 * otherwise it will look like a normal `ul` component.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-navigation-bar></aw-wizard-navigation-bar>
 * ```
 *
 * @author Marc Arndt
 */
class WizardNavigationBarComponent {
    /**
     * Constructor
     *
     * @param wizard The state the wizard currently resides in
     */
    constructor(wizard) {
        this.wizard = wizard;
    }
    /**
     * Returns all [[WizardStep]]s contained in the wizard
     *
     * @returns An array containing all [[WizardStep]]s
     */
    get wizardSteps() {
        switch (this.wizard.navBarDirection) {
            case 'right-to-left':
                return this.wizard.wizardSteps.slice().reverse();
            case 'left-to-right':
            default:
                return this.wizard.wizardSteps;
        }
    }
    /**
     * Returns the number of wizard steps, that need to be displaced in the navigation bar
     *
     * @returns The number of wizard steps to be displayed
     */
    get numberOfWizardSteps() {
        return this.wizard.wizardSteps.length;
    }
    /**
     * Checks, whether a [[WizardStep]] can be marked as `current` in the navigation bar
     *
     * @param wizardStep The wizard step to be checked
     * @returns True if the step can be marked as `current`
     */
    isCurrent(wizardStep) {
        return wizardStep.selected;
    }
    /**
     * Checks, whether a [[WizardStep]] can be marked as `editing` in the navigation bar
     *
     * @param wizardStep The wizard step to be checked
     * @returns True if the step can be marked as `editing`
     */
    isEditing(wizardStep) {
        return wizardStep.editing;
    }
    /**
     * Checks, whether a [[WizardStep]] can be marked as `done` in the navigation bar
     *
     * @param wizardStep The wizard step to be checked
     * @returns True if the step can be marked as `done`
     */
    isDone(wizardStep) {
        return wizardStep.completed;
    }
    /**
     * Checks, whether a [[WizardStep]] can be marked as `optional` in the navigation bar
     *
     * @param wizardStep The wizard step to be checked
     * @returns True if the step can be marked as `optional`
     */
    isOptional(wizardStep) {
        return wizardStep.optional;
    }
    /**
     * Checks, whether a [[WizardStep]] can be marked as `completed` in the navigation bar.
     *
     * The `completed` class is only applied to completion steps.
     *
     * @param wizardStep The wizard step to be checked
     * @returns True if the step can be marked as `completed`
     */
    isCompleted(wizardStep) {
        return wizardStep instanceof WizardCompletionStep && this.wizard.completed;
    }
    /**
     * Checks, whether a [[WizardStep]] can be marked as `navigable` in the navigation bar.
     * A wizard step can be navigated to if:
     * - the step is currently not selected
     * - the navigation bar isn't disabled
     * - the navigation mode allows navigation to the step
     *
     * @param wizardStep The wizard step to be checked
     * @returns True if the step can be marked as navigable
     */
    isNavigable(wizardStep) {
        return !wizardStep.selected && !this.wizard.disableNavigationBar &&
            this.wizard.isNavigable(this.wizard.getIndexOfStep(wizardStep));
    }
}
WizardNavigationBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'aw-wizard-navigation-bar',
                template: "<ul class=\"steps-indicator steps-{{numberOfWizardSteps}}\">\n  <li [attr.id]=\"step.stepId\" *ngFor=\"let step of wizardSteps\" [ngClass]=\"{\n        'current': isCurrent(step),\n        'editing': isEditing(step),\n        'done': isDone(step),\n        'optional': isOptional(step),\n        'completed': isCompleted(step),\n        'navigable': isNavigable(step)\n  }\">\n    <a [awGoToStep]=\"step\">\n      <div class=\"label\">\n        <ng-container *ngIf=\"step.stepTitleTemplate\" [ngTemplateOutlet]=\"step.stepTitleTemplate.templateRef\"\n          [ngTemplateOutletContext]=\"{wizardStep: step}\"></ng-container>\n        <ng-container *ngIf=\"!step.stepTitleTemplate\">{{step.stepTitle}}</ng-container>\n      </div>\n      <div class=\"step-indicator\"\n        [ngStyle]=\"{ 'font-family': step.stepSymbolTemplate ? '' : step.navigationSymbol.fontFamily }\">\n        <ng-container *ngIf=\"step.stepSymbolTemplate\" [ngTemplateOutlet]=\"step.stepSymbolTemplate.templateRef\"\n          [ngTemplateOutletContext]=\"{wizardStep: step}\"></ng-container>\n        <ng-container *ngIf=\"!step.stepSymbolTemplate\">{{step.navigationSymbol.symbol}}</ng-container>\n      </div>\n    </a>\n  </li>\n</ul>\n"
            },] }
];
WizardNavigationBarComponent.ctorParameters = () => [
    { type: WizardComponent }
];

/**
 * The `aw-wizard-step` component is used to define a normal step inside a wizard.
 *
 * ### Syntax
 *
 * With `stepTitle` and `navigationSymbol` inputs:
 *
 * ```html
 * <aw-wizard-step [stepTitle]="step title" [navigationSymbol]="{ symbol: 'symbol', fontFamily: 'font-family' }"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    ...
 * </aw-wizard-step>
 * ```
 *
 * With `awWizardStepTitle` and `awWizardStepSymbol` directives:
 *
 * ```html
 * <aw-wizard-step"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    <ng-template awWizardStepTitle>
 *        step title
 *    </ng-template>
 *    <ng-template awWizardStepSymbol>
 *        symbol
 *    </ng-template>
 *    ...
 * </aw-wizard-step>
 * ```
 *
 * ### Example
 *
 * With `stepTitle` and `navigationSymbol` inputs:
 *
 * ```html
 * <aw-wizard-step stepTitle="Address information" [navigationSymbol]="{ symbol: '&#xf1ba;', fontFamily: 'FontAwesome' }">
 *    ...
 * </aw-wizard-step>
 * ```
 *
 * With `awWizardStepTitle` and `awWizardStepSymbol` directives:
 *
 * ```html
 * <aw-wizard-step>
 *    <ng-template awWizardStepTitle>
 *        Address information
 *    </ng-template>
 *    <ng-template awWizardStepSymbol>
 *        <i class="fa fa-taxi"></i>
 *    </ng-template>
 * </aw-wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
class WizardStepComponent extends WizardStep {
}
WizardStepComponent.decorators = [
    { type: Component, args: [{
                selector: 'aw-wizard-step',
                template: "<ng-content></ng-content>\n",
                providers: [
                    { provide: WizardStep, useExisting: forwardRef(() => WizardStepComponent) }
                ]
            },] }
];

/**
 * The `awEnableBackLinks` directive can be used to allow the user to leave a [[WizardCompletionStep]] after is has been entered.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-completion-step awEnableBackLinks (stepExit)="exit function">
 *     ...
 * </aw-wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-completion-step stepTitle="Final step" awEnableBackLinks>
 *     ...
 * </aw-wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
class EnableBackLinksDirective {
    /**
     * Constructor
     *
     * @param completionStep The wizard completion step, which should be exitable
     */
    constructor(completionStep) {
        this.completionStep = completionStep;
        /**
         * This EventEmitter is called when the step is exited.
         * The bound method can be used to do cleanup work.
         */
        this.stepExit = new EventEmitter();
    }
    /**
     * Initialization work
     */
    ngOnInit() {
        this.completionStep.canExit = true;
        this.completionStep.stepExit = this.stepExit;
    }
}
EnableBackLinksDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awEnableBackLinks]'
            },] }
];
EnableBackLinksDirective.ctorParameters = () => [
    { type: WizardCompletionStep, decorators: [{ type: Host }] }
];
EnableBackLinksDirective.propDecorators = {
    stepExit: [{ type: Output }]
};

/**
 * Checks whether the given `value` implements the interface [[StepId]].
 *
 * @param value The value to be checked
 * @returns True if the given value implements [[StepId]] and false otherwise
 */
function isStepId(value) {
    return value.hasOwnProperty('stepId') && !(value instanceof WizardStep);
}

/**
 * Checks whether the given `value` implements the interface [[StepIndex]].
 *
 * @param value The value to be checked
 * @returns True if the given value implements [[StepIndex]] and false otherwise
 */
function isStepIndex(value) {
    return value.hasOwnProperty('stepIndex');
}

/**
 * Checks whether the given `value` implements the interface [[StepOffset]].
 *
 * @param value The value to be checked
 * @returns True if the given value implements [[StepOffset]] and false otherwise
 */
function isStepOffset(value) {
    return value.hasOwnProperty('stepOffset');
}

/**
 * The `awGoToStep` directive can be used to navigate to a given step.
 * This step can be defined in one of multiple formats
 *
 * ### Syntax
 *
 * With absolute step index:
 *
 * ```html
 * <button [awGoToStep]="{ stepIndex: absolute step index }" (finalize)="finalize method">...</button>
 * ```
 *
 * With unique step id:
 *
 * ```html
 * <button [awGoToStep]="{ stepId: 'step id of destination step' }" (finalize)="finalize method">...</button>
 * ```
 *
 * With a wizard step object:
 *
 * ```html
 * <button [awGoToStep]="wizard step object" (finalize)="finalize method">...</button>
 * ```
 *
 * With an offset to the defining step:
 *
 * ```html
 * <button [awGoToStep]="{ stepOffset: offset }" (finalize)="finalize method">...</button>
 * ```
 *
 * @author Marc Arndt
 */
class GoToStepDirective {
    /**
     * Constructor
     *
     * @param wizard The wizard component
     * @param wizardStep The wizard step, which contains this [[GoToStepDirective]]
     */
    constructor(wizard, wizardStep) {
        this.wizard = wizard;
        this.wizardStep = wizardStep;
        /**
         * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
         */
        this.preFinalize = new EventEmitter();
        /**
         * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
         */
        this.postFinalize = new EventEmitter();
    }
    /**
     * A convenience field for `preFinalize`
     */
    get finalize() {
        return this.preFinalize;
    }
    /**
     * A convenience name for `preFinalize`
     *
     * @param emitter The [[EventEmitter]] to be set
     */
    set finalize(emitter) {
        /* istanbul ignore next */
        this.preFinalize = emitter;
    }
    /**
     * Returns the destination step of this directive as an absolute step index inside the wizard
     *
     * @returns The index of the destination step
     * @throws If `targetStep` is of an unknown type an `Error` is thrown
     */
    get destinationStep() {
        let destinationStep;
        if (isStepIndex(this.targetStep)) {
            destinationStep = this.targetStep.stepIndex;
        }
        else if (isStepId(this.targetStep)) {
            destinationStep = this.wizard.getIndexOfStepWithId(this.targetStep.stepId);
        }
        else if (isStepOffset(this.targetStep) && this.wizardStep !== null) {
            destinationStep = this.wizard.getIndexOfStep(this.wizardStep) + this.targetStep.stepOffset;
        }
        else if (this.targetStep instanceof WizardStep) {
            destinationStep = this.wizard.getIndexOfStep(this.targetStep);
        }
        else {
            throw new Error(`Input 'targetStep' is neither a WizardStep, StepOffset, StepIndex or StepId`);
        }
        return destinationStep;
    }
    /**
     * Listener method for `click` events on the component with this directive.
     * After this method is called the wizard will try to transition to the `destinationStep`
     */
    onClick() {
        this.wizard.goToStep(this.destinationStep, this.preFinalize, this.postFinalize);
    }
}
GoToStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awGoToStep]'
            },] }
];
GoToStepDirective.ctorParameters = () => [
    { type: WizardComponent },
    { type: WizardStep, decorators: [{ type: Optional }] }
];
GoToStepDirective.propDecorators = {
    preFinalize: [{ type: Output }],
    postFinalize: [{ type: Output }],
    targetStep: [{ type: Input, args: ['awGoToStep',] }],
    finalize: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }]
};

/**
 * The `awNextStep` directive can be used to navigate to the next step.
 *
 * ### Syntax
 *
 * ```html
 * <button awNextStep (finalize)="finalize method">...</button>
 * ```
 *
 * @author Marc Arndt
 */
class NextStepDirective {
    /**
     * Constructor
     *
     * @param wizard The state of the wizard
     */
    constructor(wizard) {
        this.wizard = wizard;
        /**
         * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
         */
        this.preFinalize = new EventEmitter();
        /**
         * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
         */
        this.postFinalize = new EventEmitter();
    }
    /**
     * A convenience field for `preFinalize`
     */
    get finalize() {
        return this.preFinalize;
    }
    /**
     * A convenience name for `preFinalize`
     *
     * @param emitter The [[EventEmitter]] to be set
     */
    set finalize(emitter) {
        this.preFinalize = emitter;
    }
    /**
     * Listener method for `click` events on the component with this directive.
     * After this method is called the wizard will try to transition to the next step
     */
    onClick() {
        this.wizard.goToNextStep(this.preFinalize, this.postFinalize);
    }
}
NextStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awNextStep]'
            },] }
];
NextStepDirective.ctorParameters = () => [
    { type: WizardComponent }
];
NextStepDirective.propDecorators = {
    preFinalize: [{ type: Output }],
    postFinalize: [{ type: Output }],
    finalize: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }]
};

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
class OptionalStepDirective {
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

/**
 * The `awPreviousStep` directive can be used to navigate to the previous step.
 * Compared to the [[NextStepDirective]] it's important to note, that this directive doesn't contain a `finalize` output method.
 *
 * ### Syntax
 *
 * ```html
 * <button awPreviousStep>...</button>
 * ```
 *
 * @author Marc Arndt
 */
class PreviousStepDirective {
    /**
     * Constructor
     *
     * @param wizard The state of the wizard
     */
    constructor(wizard) {
        this.wizard = wizard;
        /**
         * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
         */
        this.preFinalize = new EventEmitter();
        /**
         * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
         */
        this.postFinalize = new EventEmitter();
    }
    /**
     * A convenience field for `preFinalize`
     */
    get finalize() {
        return this.preFinalize;
    }
    /**
     * A convenience field for `preFinalize`
     *
     * @param emitter The [[EventEmitter]] to be set
     */
    set finalize(emitter) {
        /* istanbul ignore next */
        this.preFinalize = emitter;
    }
    /**
     * Listener method for `click` events on the component with this directive.
     * After this method is called the wizard will try to transition to the previous step
     */
    onClick() {
        this.wizard.goToPreviousStep(this.preFinalize, this.postFinalize);
    }
}
PreviousStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awPreviousStep]'
            },] }
];
PreviousStepDirective.ctorParameters = () => [
    { type: WizardComponent }
];
PreviousStepDirective.propDecorators = {
    preFinalize: [{ type: Output }],
    postFinalize: [{ type: Output }],
    finalize: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }]
};

/**
 * The `awResetWizard` directive can be used to reset the wizard to its initial state.
 * This directive accepts an output, which can be used to specify some custom cleanup work during the reset process.
 *
 * ### Syntax
 *
 * ```html
 * <button awResetWizard (finalize)="custom reset task">...</button>
 * ```
 *
 * @author Marc Arndt
 */
class ResetWizardDirective {
    /**
     * Constructor
     *
     * @param wizard The wizard component
     */
    constructor(wizard) {
        this.wizard = wizard;
        /**
         * An [[EventEmitter]] containing some tasks to be done, directly before the wizard is being reset
         */
        this.finalize = new EventEmitter();
    }
    /**
     * Resets the wizard
     */
    onClick() {
        // do some optional cleanup work
        this.finalize.emit();
        // reset the wizard to its initial state
        this.wizard.reset();
    }
}
ResetWizardDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awResetWizard]'
            },] }
];
ResetWizardDirective.ctorParameters = () => [
    { type: WizardComponent }
];
ResetWizardDirective.propDecorators = {
    finalize: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }]
};

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
class SelectedStepDirective {
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

/**
 * The `awWizardCompletionStep` directive can be used to define a completion/success step at the end of your wizard
 * After a [[WizardCompletionStep]] has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a [[WizardCompletionStep]] automatically sets the `wizard`, and all steps inside the `wizard`,
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <div awWizardCompletionStep [stepTitle]="title of the wizard step"
 *    [navigationSymbol]="{ symbol: 'navigation symbol', fontFamily: 'font-family' }"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </div>
 * ```
 *
 * ### Example
 *
 * ```html
 * <div awWizardCompletionStep stepTitle="Step 1" [navigationSymbol]="{ symbol: '1' }">
 *    ...
 * </div>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <div awWizardCompletionStep stepTitle="Step 1" [navigationSymbol]="{ symbol: '&#xf1ba;', fontFamily: 'FontAwesome' }">
 *    ...
 * </div>
 * ```
 *
 * @author Marc Arndt
 */
class WizardCompletionStepDirective extends WizardCompletionStep {
}
WizardCompletionStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awWizardCompletionStep]',
                providers: [
                    { provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepDirective) },
                    { provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepDirective) }
                ]
            },] }
];

/**
 * The `awWizardStep` directive can be used to define a normal step inside a wizard.
 *
 * ### Syntax
 *
 * With `stepTitle` and `navigationSymbol` inputs:
 *
 * ```html
 * <div awWizardStep [stepTitle]="step title" [navigationSymbol]="{ symbol: 'symbol', fontFamily: 'font-family' }"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    ...
 * </div>
 * ```
 *
 * With `awWizardStepTitle` and `awWizardStepSymbol` directives:
 *
 * ```html
 * <div awWizardStep [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    <ng-template awWizardStepTitle>
 *        step title
 *    </ng-template>
 *    <ng-template awWizardStepSymbol>
 *        symbol
 *    </ng-template>
 *    ...
 * </div>
 * ```
 *
 * ### Example
 *
 * With `stepTitle` and `navigationSymbol` inputs:
 *
 * ```html
 * <div awWizardStep stepTitle="Address information" [navigationSymbol]="{ symbol: '&#xf1ba;', fontFamily: 'FontAwesome' }">
 *    ...
 * </div>
 * ```
 *
 * With `awWizardStepTitle` and `awWizardStepSymbol` directives:
 *
 * ```html
 * <div awWizardStep>
 *    <ng-template awWizardStepTitle>
 *        Address information
 *    </ng-template>
 *    <ng-template awWizardStepSymbol>
 *        <i class="fa fa-taxi"></i>
 *    </ng-template>
 * </div>
 * ```
 *
 * @author Marc Arndt
 */
class WizardStepDirective extends WizardStep {
}
WizardStepDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awWizardStep]',
                providers: [
                    { provide: WizardStep, useExisting: forwardRef(() => WizardStepDirective) }
                ]
            },] }
];

/**
 * The [[awNavigationMode]] directive can be used to customize wizard'd navigation mode.
 *
 * There are several usage options:
 *
 * ### Option 1. Customize the default navigation mode with [[navigateBackward]] and/or [[navigateForward]] inputs.
 *
 * ```html
 * <aw-wizard [awNavigationMode] navigateBackward="deny" navigateForward="allow">...</aw-wizard>
 * ```
 *
 * ### Option 2. Pass in a custom navigation mode
 *
 * ```typescript
 * import { BaseNavigationMode } from 'angular-archwizard'
 *
 * class CustomNavigationMode extends BaseNavigationMode {
 *
 *   // ...
 * }
 * ```
 *
 * ```typescript
 * @Component({
 *   // ...
 * })
 * class MyComponent {
 *
 *   navigationMode = new CustomNavigationMode();
 * }
 * ```
 *
 * ```html
 * <aw-wizard [awNavigationMode]="navigationMode">...</aw-wizard>
 * ```
 *
 * ### Additional Notes
 *
 * - Specifying a custom navigation mode takes priority over [[navigateBackward]] and [[navigateForward]] inputs
 *
 * - Omitting the [[awNavigationMode]] directive or, equally, specifying just [[awNavigationMode]] without
 *   any inputs or parameters causes the wizard to use the default "strict" navigation mode equivalent to
 *
 * ```html
 * <aw-wizard [awNavigationMode] navigateBackward="deny" navigateForward="allow">...</aw-wizard>
 * ````
 */
class NavigationModeDirective {
    constructor(wizard) {
        this.wizard = wizard;
    }
    ngOnChanges(changes) {
        this.wizard.navigation = this.getNavigationMode();
    }
    getNavigationMode() {
        if (this.awNavigationMode) {
            return this.awNavigationMode;
        }
        return new ConfigurableNavigationMode(this.navigateBackward, this.navigateForward);
    }
}
NavigationModeDirective.decorators = [
    { type: Directive, args: [{
                selector: '[awNavigationMode]',
            },] }
];
NavigationModeDirective.ctorParameters = () => [
    { type: WizardComponent }
];
NavigationModeDirective.propDecorators = {
    awNavigationMode: [{ type: Input }],
    navigateBackward: [{ type: Input }],
    navigateForward: [{ type: Input }]
};

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
class CompletedStepDirective {
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

/**
 * The module defining all the content inside `angular-archwizard`
 *
 * @author Marc Arndt
 */
class ArchwizardModule {
    /* istanbul ignore next */
    static forRoot() {
        return {
            ngModule: ArchwizardModule,
            providers: [
            // Nothing here yet
            ]
        };
    }
}
ArchwizardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    WizardComponent,
                    WizardStepComponent,
                    WizardNavigationBarComponent,
                    WizardCompletionStepComponent,
                    GoToStepDirective,
                    NextStepDirective,
                    PreviousStepDirective,
                    OptionalStepDirective,
                    WizardStepSymbolDirective,
                    WizardStepTitleDirective,
                    EnableBackLinksDirective,
                    WizardStepDirective,
                    WizardCompletionStepDirective,
                    SelectedStepDirective,
                    ResetWizardDirective,
                    NavigationModeDirective,
                    CompletedStepDirective,
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    WizardComponent,
                    WizardStepComponent,
                    WizardNavigationBarComponent,
                    WizardCompletionStepComponent,
                    GoToStepDirective,
                    NextStepDirective,
                    PreviousStepDirective,
                    OptionalStepDirective,
                    WizardStepSymbolDirective,
                    WizardStepTitleDirective,
                    EnableBackLinksDirective,
                    WizardStepDirective,
                    WizardCompletionStepDirective,
                    SelectedStepDirective,
                    ResetWizardDirective,
                    NavigationModeDirective,
                    CompletedStepDirective,
                ]
            },] }
];

// export the components

/**
 * Generated bundle index. Do not edit.
 */

export { ArchwizardModule, BaseNavigationMode, CompletedStepDirective, ConfigurableNavigationMode, EnableBackLinksDirective, GoToStepDirective, MovingDirection, NavigationModeDirective, NextStepDirective, OptionalStepDirective, PreviousStepDirective, ResetWizardDirective, SelectedStepDirective, WizardCompletionStep, WizardCompletionStepComponent, WizardCompletionStepDirective, WizardComponent, WizardNavigationBarComponent, WizardStep, WizardStepComponent, WizardStepDirective, WizardStepSymbolDirective, WizardStepTitleDirective, isStepId, isStepIndex, isStepOffset };
//# sourceMappingURL=angular-archwizard.js.map
