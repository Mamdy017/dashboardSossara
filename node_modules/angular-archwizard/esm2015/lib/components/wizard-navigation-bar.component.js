import { Component } from '@angular/core';
import { WizardCompletionStep } from '../util/wizard-completion-step.interface';
import { WizardComponent } from './wizard.component';
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
export class WizardNavigationBarComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLW5hdmlnYXRpb24tYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy93aXphcmQtbmF2aWdhdGlvbi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFFaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJEOzs7Ozs7Ozs7Ozs7R0FZRztBQUtILE1BQU0sT0FBTyw0QkFBNEI7SUFDdkM7Ozs7T0FJRztJQUNILFlBQW1CLE1BQXVCO1FBQXZCLFdBQU0sR0FBTixNQUFNLENBQWlCO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxXQUFXO1FBQ2IsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUNuQyxLQUFLLGVBQWU7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkQsS0FBSyxlQUFlLENBQUM7WUFDckI7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxtQkFBbUI7UUFDckIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDeEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksU0FBUyxDQUFDLFVBQXNCO1FBQ3JDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxTQUFTLENBQUMsVUFBc0I7UUFDckMsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxVQUFzQjtRQUNsQyxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksVUFBVSxDQUFDLFVBQXNCO1FBQ3RDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFdBQVcsQ0FBQyxVQUFzQjtRQUN2QyxPQUFPLFVBQVUsWUFBWSxvQkFBb0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksV0FBVyxDQUFDLFVBQXNCO1FBQ3ZDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0I7WUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDOzs7WUF0R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLDBzQ0FBbUQ7YUFDcEQ7OztZQWxCUSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgV2l6YXJkQ29tcGxldGlvblN0ZXAgfSBmcm9tICcuLi91dGlsL3dpemFyZC1jb21wbGV0aW9uLXN0ZXAuaW50ZXJmYWNlJztcbmltcG9ydCB7IFdpemFyZFN0ZXAgfSBmcm9tICcuLi91dGlsL3dpemFyZC1zdGVwLmludGVyZmFjZSc7XG5pbXBvcnQgeyBXaXphcmRDb21wb25lbnQgfSBmcm9tICcuL3dpemFyZC5jb21wb25lbnQnO1xuXG4vKipcbiAqIFRoZSBgYXctd2l6YXJkLW5hdmlnYXRpb24tYmFyYCBjb21wb25lbnQgY29udGFpbnMgdGhlIG5hdmlnYXRpb24gYmFyIGluc2lkZSBhIFtbV2l6YXJkQ29tcG9uZW50XV0uXG4gKiBUbyBjb3JyZWN0bHkgZGlzcGxheSB0aGUgbmF2aWdhdGlvbiBiYXIsIGl0J3MgcmVxdWlyZWQgdG8gc2V0IHRoZSByaWdodCBjc3MgY2xhc3NlcyBmb3IgdGhlIG5hdmlnYXRpb24gYmFyLFxuICogb3RoZXJ3aXNlIGl0IHdpbGwgbG9vayBsaWtlIGEgbm9ybWFsIGB1bGAgY29tcG9uZW50LlxuICpcbiAqICMjIyBTeW50YXhcbiAqXG4gKiBgYGBodG1sXG4gKiA8YXctd2l6YXJkLW5hdmlnYXRpb24tYmFyPjwvYXctd2l6YXJkLW5hdmlnYXRpb24tYmFyPlxuICogYGBgXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2F3LXdpemFyZC1uYXZpZ2F0aW9uLWJhcicsXG4gIHRlbXBsYXRlVXJsOiAnd2l6YXJkLW5hdmlnYXRpb24tYmFyLmNvbXBvbmVudC5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgV2l6YXJkTmF2aWdhdGlvbkJhckNvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkIFRoZSBzdGF0ZSB0aGUgd2l6YXJkIGN1cnJlbnRseSByZXNpZGVzIGluXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgd2l6YXJkOiBXaXphcmRDb21wb25lbnQpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBbW1dpemFyZFN0ZXBdXXMgY29udGFpbmVkIGluIHRoZSB3aXphcmRcbiAgICpcbiAgICogQHJldHVybnMgQW4gYXJyYXkgY29udGFpbmluZyBhbGwgW1tXaXphcmRTdGVwXV1zXG4gICAqL1xuICBnZXQgd2l6YXJkU3RlcHMoKTogQXJyYXk8V2l6YXJkU3RlcD4ge1xuICAgIHN3aXRjaCAodGhpcy53aXphcmQubmF2QmFyRGlyZWN0aW9uKSB7XG4gICAgICBjYXNlICdyaWdodC10by1sZWZ0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMud2l6YXJkLndpemFyZFN0ZXBzLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgICAgY2FzZSAnbGVmdC10by1yaWdodCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy53aXphcmQud2l6YXJkU3RlcHM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiB3aXphcmQgc3RlcHMsIHRoYXQgbmVlZCB0byBiZSBkaXNwbGFjZWQgaW4gdGhlIG5hdmlnYXRpb24gYmFyXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBudW1iZXIgb2Ygd2l6YXJkIHN0ZXBzIHRvIGJlIGRpc3BsYXllZFxuICAgKi9cbiAgZ2V0IG51bWJlck9mV2l6YXJkU3RlcHMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy53aXphcmQud2l6YXJkU3RlcHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcywgd2hldGhlciBhIFtbV2l6YXJkU3RlcF1dIGNhbiBiZSBtYXJrZWQgYXMgYGN1cnJlbnRgIGluIHRoZSBuYXZpZ2F0aW9uIGJhclxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkU3RlcCBUaGUgd2l6YXJkIHN0ZXAgdG8gYmUgY2hlY2tlZFxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdGVwIGNhbiBiZSBtYXJrZWQgYXMgYGN1cnJlbnRgXG4gICAqL1xuICBwdWJsaWMgaXNDdXJyZW50KHdpemFyZFN0ZXA6IFdpemFyZFN0ZXApOiBib29sZWFuIHtcbiAgICByZXR1cm4gd2l6YXJkU3RlcC5zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MsIHdoZXRoZXIgYSBbW1dpemFyZFN0ZXBdXSBjYW4gYmUgbWFya2VkIGFzIGBlZGl0aW5nYCBpbiB0aGUgbmF2aWdhdGlvbiBiYXJcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZFN0ZXAgVGhlIHdpemFyZCBzdGVwIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgc3RlcCBjYW4gYmUgbWFya2VkIGFzIGBlZGl0aW5nYFxuICAgKi9cbiAgcHVibGljIGlzRWRpdGluZyh3aXphcmRTdGVwOiBXaXphcmRTdGVwKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHdpemFyZFN0ZXAuZWRpdGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MsIHdoZXRoZXIgYSBbW1dpemFyZFN0ZXBdXSBjYW4gYmUgbWFya2VkIGFzIGBkb25lYCBpbiB0aGUgbmF2aWdhdGlvbiBiYXJcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZFN0ZXAgVGhlIHdpemFyZCBzdGVwIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgc3RlcCBjYW4gYmUgbWFya2VkIGFzIGBkb25lYFxuICAgKi9cbiAgcHVibGljIGlzRG9uZSh3aXphcmRTdGVwOiBXaXphcmRTdGVwKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHdpemFyZFN0ZXAuY29tcGxldGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcywgd2hldGhlciBhIFtbV2l6YXJkU3RlcF1dIGNhbiBiZSBtYXJrZWQgYXMgYG9wdGlvbmFsYCBpbiB0aGUgbmF2aWdhdGlvbiBiYXJcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZFN0ZXAgVGhlIHdpemFyZCBzdGVwIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgc3RlcCBjYW4gYmUgbWFya2VkIGFzIGBvcHRpb25hbGBcbiAgICovXG4gIHB1YmxpYyBpc09wdGlvbmFsKHdpemFyZFN0ZXA6IFdpemFyZFN0ZXApOiBib29sZWFuIHtcbiAgICByZXR1cm4gd2l6YXJkU3RlcC5vcHRpb25hbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MsIHdoZXRoZXIgYSBbW1dpemFyZFN0ZXBdXSBjYW4gYmUgbWFya2VkIGFzIGBjb21wbGV0ZWRgIGluIHRoZSBuYXZpZ2F0aW9uIGJhci5cbiAgICpcbiAgICogVGhlIGBjb21wbGV0ZWRgIGNsYXNzIGlzIG9ubHkgYXBwbGllZCB0byBjb21wbGV0aW9uIHN0ZXBzLlxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkU3RlcCBUaGUgd2l6YXJkIHN0ZXAgdG8gYmUgY2hlY2tlZFxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdGVwIGNhbiBiZSBtYXJrZWQgYXMgYGNvbXBsZXRlZGBcbiAgICovXG4gIHB1YmxpYyBpc0NvbXBsZXRlZCh3aXphcmRTdGVwOiBXaXphcmRTdGVwKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHdpemFyZFN0ZXAgaW5zdGFuY2VvZiBXaXphcmRDb21wbGV0aW9uU3RlcCAmJiB0aGlzLndpemFyZC5jb21wbGV0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzLCB3aGV0aGVyIGEgW1tXaXphcmRTdGVwXV0gY2FuIGJlIG1hcmtlZCBhcyBgbmF2aWdhYmxlYCBpbiB0aGUgbmF2aWdhdGlvbiBiYXIuXG4gICAqIEEgd2l6YXJkIHN0ZXAgY2FuIGJlIG5hdmlnYXRlZCB0byBpZjpcbiAgICogLSB0aGUgc3RlcCBpcyBjdXJyZW50bHkgbm90IHNlbGVjdGVkXG4gICAqIC0gdGhlIG5hdmlnYXRpb24gYmFyIGlzbid0IGRpc2FibGVkXG4gICAqIC0gdGhlIG5hdmlnYXRpb24gbW9kZSBhbGxvd3MgbmF2aWdhdGlvbiB0byB0aGUgc3RlcFxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkU3RlcCBUaGUgd2l6YXJkIHN0ZXAgdG8gYmUgY2hlY2tlZFxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdGVwIGNhbiBiZSBtYXJrZWQgYXMgbmF2aWdhYmxlXG4gICAqL1xuICBwdWJsaWMgaXNOYXZpZ2FibGUod2l6YXJkU3RlcDogV2l6YXJkU3RlcCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhd2l6YXJkU3RlcC5zZWxlY3RlZCAmJiAhdGhpcy53aXphcmQuZGlzYWJsZU5hdmlnYXRpb25CYXIgJiZcbiAgICAgIHRoaXMud2l6YXJkLmlzTmF2aWdhYmxlKHRoaXMud2l6YXJkLmdldEluZGV4T2ZTdGVwKHdpemFyZFN0ZXApKTtcbiAgfVxufVxuIl19