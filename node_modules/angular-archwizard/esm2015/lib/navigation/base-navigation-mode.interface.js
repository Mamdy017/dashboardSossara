import { MovingDirection } from '../util/moving-direction.enum';
/**
 * Base implementation of [[NavigationMode]]
 *
 * Note: Built-in [[NavigationMode]] classes should be stateless, allowing the library user to easily create
 * an instance of a particular [[NavigationMode]] class and pass it to `<aw-wizard [navigationMode]="...">`.
 *
 * @author Marc Arndt
 */
export class BaseNavigationMode {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1uYXZpZ2F0aW9uLW1vZGUuaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9uYXZpZ2F0aW9uL2Jhc2UtbmF2aWdhdGlvbi1tb2RlLmludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFJOUQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sT0FBZ0Isa0JBQWtCO0lBRXRDOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBQ0ksV0FBVyxDQUFDLE1BQXVCLEVBQUUsZ0JBQXdCO1FBQ2xFLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVqRCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVwRSxNQUFNLGtCQUFrQixHQUFHLENBQUMsUUFBaUIsRUFBRSxFQUFFO1lBQy9DLE9BQU8sUUFBUSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQztRQUVGLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxRQUFpQixFQUFFLEVBQUU7WUFDcEQsT0FBTyxRQUFRLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUM7UUFFRixNQUFNLG1CQUFtQixHQUFHLENBQUMsUUFBaUIsRUFBRSxFQUFFO1lBQ2hELE9BQU8sUUFBUSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RSxDQUFDLENBQUM7UUFFRixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUMxQiwyRUFBMkU7WUFDM0UsMEZBQTBGO1lBQzFGLDJDQUEyQzthQUMxQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7YUFDeEIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDTyxtQkFBbUIsQ0FBQyxNQUF1QixFQUFFLGdCQUF3QjtRQUM3RSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNJLFFBQVEsQ0FDYixNQUF1QixFQUN2QixnQkFBd0IsRUFDeEIsV0FBZ0MsRUFDaEMsWUFBaUM7UUFFakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNsRSxJQUFJLGlCQUFpQixFQUFFO2dCQUNyQix3REFBd0Q7Z0JBQ3hELE1BQU0sZUFBZSxHQUFvQixNQUFNLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFckYsd0JBQXdCO2dCQUN4QixJQUFJLFdBQVcsRUFBRTtvQkFDZixXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ3BCO2dCQUVELHFCQUFxQjtnQkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNwQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUNuQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7Z0JBRXBDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBRTFDLG1HQUFtRztnQkFDbkcsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFFdEUsa0JBQWtCO2dCQUNsQixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNuQyxJQUFJLFlBQVksRUFBRTtvQkFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNuQztnQkFFRCx3QkFBd0I7Z0JBQ3hCLElBQUksWUFBWSxFQUFFO29CQUNoQixZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ3JCO2FBQ0Y7aUJBQU07Z0JBQ0wsOERBQThEO2dCQUM5RCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoRDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxVQUFVLENBQUMsTUFBdUIsRUFBRSxnQkFBd0I7UUFDcEUsTUFBTSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzdDLENBQUM7SUFPRDs7Ozs7OztPQU9HO0lBQ0ksS0FBSyxDQUFDLE1BQXVCO1FBQ2xDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUIsZ0NBQWdDO1FBQ2hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUgseUNBQXlDO1FBQ3pDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDbEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ08sY0FBYyxDQUFDLE1BQXVCO1FBQzlDLGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1NBQzVGO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNb3ZpbmdEaXJlY3Rpb259IGZyb20gJy4uL3V0aWwvbW92aW5nLWRpcmVjdGlvbi5lbnVtJztcbmltcG9ydCB7TmF2aWdhdGlvbk1vZGV9IGZyb20gJy4vbmF2aWdhdGlvbi1tb2RlLmludGVyZmFjZSc7XG5pbXBvcnQge1dpemFyZENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy93aXphcmQuY29tcG9uZW50JztcblxuLyoqXG4gKiBCYXNlIGltcGxlbWVudGF0aW9uIG9mIFtbTmF2aWdhdGlvbk1vZGVdXVxuICpcbiAqIE5vdGU6IEJ1aWx0LWluIFtbTmF2aWdhdGlvbk1vZGVdXSBjbGFzc2VzIHNob3VsZCBiZSBzdGF0ZWxlc3MsIGFsbG93aW5nIHRoZSBsaWJyYXJ5IHVzZXIgdG8gZWFzaWx5IGNyZWF0ZVxuICogYW4gaW5zdGFuY2Ugb2YgYSBwYXJ0aWN1bGFyIFtbTmF2aWdhdGlvbk1vZGVdXSBjbGFzcyBhbmQgcGFzcyBpdCB0byBgPGF3LXdpemFyZCBbbmF2aWdhdGlvbk1vZGVdPVwiLi4uXCI+YC5cbiAqXG4gKiBAYXV0aG9yIE1hcmMgQXJuZHRcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VOYXZpZ2F0aW9uTW9kZSBpbXBsZW1lbnRzIE5hdmlnYXRpb25Nb2RlIHtcblxuICAvKipcbiAgICogQ2hlY2tzLCB3aGV0aGVyIGEgd2l6YXJkIHN0ZXAsIGFzIGRlZmluZWQgYnkgdGhlIGdpdmVuIGRlc3RpbmF0aW9uIGluZGV4LCBjYW4gYmUgdHJhbnNpdGlvbmVkIHRvLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBjb250cm9scyBuYXZpZ2F0aW9uIGJ5IFtbZ29Ub1N0ZXBdXSwgW1tnb1RvUHJldmlvdXNTdGVwXV0sIGFuZCBbW2dvVG9OZXh0U3RlcF1dIGRpcmVjdGl2ZXMuXG4gICAqIE5hdmlnYXRpb24gYnkgbmF2aWdhdGlvbiBiYXIgaXMgZ292ZXJuZWQgYnkgW1tpc05hdmlnYWJsZV1dLlxuICAgKlxuICAgKiBJbiB0aGlzIGltcGxlbWVudGF0aW9uLCBhIGRlc3RpbmF0aW9uIHdpemFyZCBzdGVwIGNhbiBiZSBlbnRlcmVkIGlmOlxuICAgKiAtIGl0IGV4aXN0c1xuICAgKiAtIHRoZSBjdXJyZW50IHN0ZXAgY2FuIGJlIGV4aXRlZCBpbiB0aGUgZGlyZWN0aW9uIG9mIHRoZSBkZXN0aW5hdGlvbiBzdGVwXG4gICAqIC0gdGhlIGRlc3RpbmF0aW9uIHN0ZXAgY2FuIGJlIGVudGVyZWQgaW4gdGhlIGRpcmVjdGlvbiBmcm9tIHRoZSBjdXJyZW50IHN0ZXBcbiAgICpcbiAgICogU3ViY2xhc3NlcyBjYW4gaW1wb3NlIGFkZGl0aW9uYWwgcmVzdHJpY3Rpb25zLCBzZWUgW1tjYW5UcmFuc2l0aW9uVG9TdGVwXV0uXG4gICAqXG4gICAqIEBwYXJhbSB3aXphcmQgVGhlIHdpemFyZCBjb21wb25lbnQgdG8gb3BlcmF0ZSBvblxuICAgKiBAcGFyYW0gZGVzdGluYXRpb25JbmRleCBUaGUgaW5kZXggb2YgdGhlIGRlc3RpbmF0aW9uIHN0ZXBcbiAgICogQHJldHVybnMgQSBbW1Byb21pc2VdXSBjb250YWluaW5nIGB0cnVlYCwgaWYgdGhlIGRlc3RpbmF0aW9uIHN0ZXAgY2FuIGJlIHRyYW5zaXRpb25lZCB0byBhbmQgYGZhbHNlYCBvdGhlcndpc2VcbiAgICovXG4gIHB1YmxpYyBjYW5Hb1RvU3RlcCh3aXphcmQ6IFdpemFyZENvbXBvbmVudCwgZGVzdGluYXRpb25JbmRleDogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaGFzU3RlcCA9IHdpemFyZC5oYXNTdGVwKGRlc3RpbmF0aW9uSW5kZXgpO1xuXG4gICAgY29uc3QgbW92aW5nRGlyZWN0aW9uID0gd2l6YXJkLmdldE1vdmluZ0RpcmVjdGlvbihkZXN0aW5hdGlvbkluZGV4KTtcblxuICAgIGNvbnN0IGNhbkV4aXRDdXJyZW50U3RlcCA9IChwcmV2aW91czogYm9vbGVhbikgPT4ge1xuICAgICAgcmV0dXJuIHByZXZpb3VzICYmIHdpemFyZC5jdXJyZW50U3RlcC5jYW5FeGl0U3RlcChtb3ZpbmdEaXJlY3Rpb24pO1xuICAgIH07XG5cbiAgICBjb25zdCBjYW5FbnRlckRlc3RpbmF0aW9uU3RlcCA9IChwcmV2aW91czogYm9vbGVhbikgPT4ge1xuICAgICAgcmV0dXJuIHByZXZpb3VzICYmIHdpemFyZC5nZXRTdGVwQXRJbmRleChkZXN0aW5hdGlvbkluZGV4KS5jYW5FbnRlclN0ZXAobW92aW5nRGlyZWN0aW9uKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2FuVHJhbnNpdGlvblRvU3RlcCA9IChwcmV2aW91czogYm9vbGVhbikgPT4ge1xuICAgICAgcmV0dXJuIHByZXZpb3VzICYmIHRoaXMuY2FuVHJhbnNpdGlvblRvU3RlcCh3aXphcmQsIGRlc3RpbmF0aW9uSW5kZXgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGhhc1N0ZXApXG4gICAgICAudGhlbihjYW5UcmFuc2l0aW9uVG9TdGVwKVxuICAgICAgLy8gQXBwbHkgdXNlci1kZWZpbmVkIGNoZWNrcyBhdCB0aGUgZW5kLiAgVGhleSBjYW4gaW52b2x2ZSB1c2VyIGludGVyYWN0aW9uXG4gICAgICAvLyB3aGljaCBpcyBiZXR0ZXIgdG8gYmUgYXZvaWRlZCBpZiBuYXZpZ2F0aW9uIG1vZGUgZG9lcyBub3QgYWN0dWFsbHkgYWxsb3cgdGhlIHRyYW5zaXRpb25cbiAgICAgIC8vIChgY2FuVHJhbnNpdGlvblRvU3RlcGAgcmV0dXJucyBgZmFsc2VgKS5cbiAgICAgIC50aGVuKGNhbkV4aXRDdXJyZW50U3RlcClcbiAgICAgIC50aGVuKGNhbkVudGVyRGVzdGluYXRpb25TdGVwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvc2VzIGFkZGl0aW9uYWwgcmVzdHJpY3Rpb25zIGZvciBgY2FuR29Ub1N0ZXBgIGluIGN1cnJlbnQgbmF2aWdhdGlvbiBtb2RlLlxuICAgKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgdHJhbnNpdGlvbiBpZmYgdGhlIGdpdmVuIHN0ZXAgaXMgbmF2aWdhYmxlIGZyb20gdGhlIG5hdmlnYXRpb24gYmFyIChzZWUgYGlzTmF2aWdhYmxlYCkuXG4gICAqIEhvd2V2ZXIsIGluIHNvbWUgbmF2aWdhdGlvbiBtb2RlcyBgY2FuVHJhbnNpdGlvblRvU3RlcGAgY2FuIGJlIG1vcmUgcmVsYXhlZCB0byBhbGxvdyBuYXZpZ2F0aW9uIHRvIGNlcnRhaW4gc3RlcHNcbiAgICogYnkgcHJldmlvdXMvbmV4dCBidXR0b25zLCBidXQgbm90IHVzaW5nIHRoZSBuYXZpZ2F0aW9uIGJhci5cbiAgICpcbiAgICogQHBhcmFtIHdpemFyZCBUaGUgd2l6YXJkIGNvbXBvbmVudCB0byBvcGVyYXRlIG9uXG4gICAqIEBwYXJhbSBkZXN0aW5hdGlvbkluZGV4IFRoZSBpbmRleCBvZiB0aGUgZGVzdGluYXRpb24gc3RlcFxuICAgKiBAcmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBkZXN0aW5hdGlvbiBzdGVwIGNhbiBiZSB0cmFuc2l0aW9uZWQgdG8gYW5kIGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAqL1xuICBwcm90ZWN0ZWQgY2FuVHJhbnNpdGlvblRvU3RlcCh3aXphcmQ6IFdpemFyZENvbXBvbmVudCwgZGVzdGluYXRpb25JbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNOYXZpZ2FibGUod2l6YXJkLCBkZXN0aW5hdGlvbkluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmllcyB0byB0cmFuc2l0aW9uIHRvIHRoZSB3aXphcmQgc3RlcCwgYXMgZGVub3RlZCBieSB0aGUgZ2l2ZW4gZGVzdGluYXRpb24gaW5kZXguXG4gICAqXG4gICAqIFdoZW4gZW50ZXJpbmcgdGhlIGRlc3RpbmF0aW9uIHN0ZXAsIHRoZSBmb2xsb3dpbmcgYWN0aW9ucyBhcmUgZG9uZTpcbiAgICogLSB0aGUgb2xkIGN1cnJlbnQgc3RlcCBpcyBzZXQgYXMgY29tcGxldGVkXG4gICAqIC0gdGhlIG9sZCBjdXJyZW50IHN0ZXAgaXMgc2V0IGFzIHVuc2VsZWN0ZWRcbiAgICogLSB0aGUgb2xkIGN1cnJlbnQgc3RlcCBpcyBleGl0ZWRcbiAgICogLSB0aGUgZGVzdGluYXRpb24gc3RlcCBpcyBzZXQgYXMgc2VsZWN0ZWRcbiAgICogLSB0aGUgZGVzdGluYXRpb24gc3RlcCBpcyBlbnRlcmVkXG4gICAqXG4gICAqIFdoZW4gdGhlIGRlc3RpbmF0aW9uIHN0ZXAgY291bGRuJ3QgYmUgZW50ZXJlZCwgdGhlIGZvbGxvd2luZyBhY3Rpb25zIGFyZSBkb25lOlxuICAgKiAtIHRoZSBjdXJyZW50IHN0ZXAgaXMgZXhpdGVkIGFuZCBlbnRlcmVkIGluIHRoZSBkaXJlY3Rpb24gYE1vdmluZ0RpcmVjdGlvbi5TdGF5YFxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkIFRoZSB3aXphcmQgY29tcG9uZW50IHRvIG9wZXJhdGUgb25cbiAgICogQHBhcmFtIGRlc3RpbmF0aW9uSW5kZXggVGhlIGluZGV4IG9mIHRoZSBkZXN0aW5hdGlvbiB3aXphcmQgc3RlcCwgd2hpY2ggc2hvdWxkIGJlIGVudGVyZWRcbiAgICogQHBhcmFtIHByZUZpbmFsaXplIEFuIGV2ZW50IGVtaXR0ZXIsIHRvIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHN0ZXAgaGFzIGJlZW4gdHJhbnNpdGlvbmVkXG4gICAqIEBwYXJhbSBwb3N0RmluYWxpemUgQW4gZXZlbnQgZW1pdHRlciwgdG8gYmUgY2FsbGVkIGFmdGVyIHRoZSBzdGVwIGhhcyBiZWVuIHRyYW5zaXRpb25lZFxuICAgKi9cbiAgcHVibGljIGdvVG9TdGVwKFxuICAgIHdpemFyZDogV2l6YXJkQ29tcG9uZW50LFxuICAgIGRlc3RpbmF0aW9uSW5kZXg6IG51bWJlcixcbiAgICBwcmVGaW5hbGl6ZT86IEV2ZW50RW1pdHRlcjx2b2lkPixcbiAgICBwb3N0RmluYWxpemU/OiBFdmVudEVtaXR0ZXI8dm9pZD4pOiB2b2lkIHtcblxuICAgIHRoaXMuY2FuR29Ub1N0ZXAod2l6YXJkLCBkZXN0aW5hdGlvbkluZGV4KS50aGVuKG5hdmlnYXRpb25BbGxvd2VkID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0aW9uQWxsb3dlZCkge1xuICAgICAgICAvLyB0aGUgY3VycmVudCBzdGVwIGNhbiBiZSBleGl0ZWQgaW4gdGhlIGdpdmVuIGRpcmVjdGlvblxuICAgICAgICBjb25zdCBtb3ZpbmdEaXJlY3Rpb246IE1vdmluZ0RpcmVjdGlvbiA9IHdpemFyZC5nZXRNb3ZpbmdEaXJlY3Rpb24oZGVzdGluYXRpb25JbmRleCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChwcmVGaW5hbGl6ZSkge1xuICAgICAgICAgIHByZUZpbmFsaXplLmVtaXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxlYXZlIGN1cnJlbnQgc3RlcFxuICAgICAgICB3aXphcmQuY3VycmVudFN0ZXAuY29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgd2l6YXJkLmN1cnJlbnRTdGVwLmV4aXQobW92aW5nRGlyZWN0aW9uKTtcbiAgICAgICAgd2l6YXJkLmN1cnJlbnRTdGVwLmVkaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgd2l6YXJkLmN1cnJlbnRTdGVwLnNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uKHdpemFyZCwgZGVzdGluYXRpb25JbmRleCk7XG5cbiAgICAgICAgLy8gcmVtZW1iZXIgaWYgdGhlIG5leHQgc3RlcCBpcyBhbHJlYWR5IGNvbXBsZXRlZCBiZWZvcmUgZW50ZXJpbmcgaXQgdG8gcHJvcGVybHkgc2V0IGBlZGl0aW5nYCBmbGFnXG4gICAgICAgIGNvbnN0IHdhc0NvbXBsZXRlZCA9IHdpemFyZC5jb21wbGV0ZWQgfHwgd2l6YXJkLmN1cnJlbnRTdGVwLmNvbXBsZXRlZDtcblxuICAgICAgICAvLyBnbyB0byBuZXh0IHN0ZXBcbiAgICAgICAgd2l6YXJkLmN1cnJlbnRTdGVwLmVudGVyKG1vdmluZ0RpcmVjdGlvbik7XG4gICAgICAgIHdpemFyZC5jdXJyZW50U3RlcC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIGlmICh3YXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICB3aXphcmQuY3VycmVudFN0ZXAuZWRpdGluZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKHBvc3RGaW5hbGl6ZSkge1xuICAgICAgICAgIHBvc3RGaW5hbGl6ZS5lbWl0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHN0ZXAgY2FuJ3QgYmUgbGVmdCwgcmVlbnRlciB0aGUgY3VycmVudCBzdGVwXG4gICAgICAgIHdpemFyZC5jdXJyZW50U3RlcC5leGl0KE1vdmluZ0RpcmVjdGlvbi5TdGF5KTtcbiAgICAgICAgd2l6YXJkLmN1cnJlbnRTdGVwLmVudGVyKE1vdmluZ0RpcmVjdGlvbi5TdGF5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2l0aW9ucyB0aGUgd2l6YXJkIHRvIHRoZSBnaXZlbiBzdGVwIGluZGV4LlxuICAgKlxuICAgKiBDYW4gcGVyZm9ybSBhZGRpdGlvbmFsIGFjdGlvbnMgaW4gcGFydGljdWxhciBuYXZpZ2F0aW9uIG1vZGUgaW1wbGVtZW50YXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkIFRoZSB3aXphcmQgY29tcG9uZW50IHRvIG9wZXJhdGUgb25cbiAgICogQHBhcmFtIGRlc3RpbmF0aW9uSW5kZXggVGhlIGluZGV4IG9mIHRoZSBkZXN0aW5hdGlvbiB3aXphcmQgc3RlcFxuICAgKi9cbiAgcHJvdGVjdGVkIHRyYW5zaXRpb24od2l6YXJkOiBXaXphcmRDb21wb25lbnQsIGRlc3RpbmF0aW9uSW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHdpemFyZC5jdXJyZW50U3RlcEluZGV4ID0gZGVzdGluYXRpb25JbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW5oZXJpdERvY1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGlzTmF2aWdhYmxlKFdpemFyZENvbXBvbmVudDogV2l6YXJkQ29tcG9uZW50LCBkZXN0aW5hdGlvbkluZGV4OiBudW1iZXIpOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIHN0YXRlIG9mIHRoaXMgd2l6YXJkLlxuICAgKlxuICAgKiBBIHJlc2V0IHRyYW5zaXRpb25zIHRoZSB3aXphcmQgYXV0b21hdGljYWxseSB0byB0aGUgZmlyc3Qgc3RlcCBhbmQgc2V0cyBhbGwgc3RlcHMgYXMgaW5jb21wbGV0ZS5cbiAgICogSW4gYWRkaXRpb24gdGhlIHdob2xlIHdpemFyZCBpcyBzZXQgYXMgaW5jb21wbGV0ZS5cbiAgICpcbiAgICogQHBhcmFtIHdpemFyZCBUaGUgd2l6YXJkIGNvbXBvbmVudCB0byBvcGVyYXRlIG9uXG4gICAqL1xuICBwdWJsaWMgcmVzZXQod2l6YXJkOiBXaXphcmRDb21wb25lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmVuc3VyZUNhblJlc2V0KHdpemFyZCk7XG5cbiAgICAvLyByZXNldCB0aGUgc3RlcCBpbnRlcm5hbCBzdGF0ZVxuICAgIHdpemFyZC53aXphcmRTdGVwcy5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgICAgc3RlcC5jb21wbGV0ZWQgPSBzdGVwLmluaXRpYWxseUNvbXBsZXRlZDtcbiAgICAgIHN0ZXAuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHN0ZXAuZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gc2V0IHRoZSBmaXJzdCBzdGVwIGFzIHRoZSBjdXJyZW50IHN0ZXBcbiAgICB3aXphcmQuY3VycmVudFN0ZXBJbmRleCA9IHdpemFyZC5kZWZhdWx0U3RlcEluZGV4O1xuICAgIHdpemFyZC5jdXJyZW50U3RlcC5zZWxlY3RlZCA9IHRydWU7XG4gICAgd2l6YXJkLmN1cnJlbnRTdGVwLmVudGVyKE1vdmluZ0RpcmVjdGlvbi5Gb3J3YXJkcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHdpemFyZCBjb25maWd1cmF0aW9uIGFsbG93cyB0byBwZXJmb3JtIHJlc2V0LlxuICAgKlxuICAgKiBBIGNoZWNrIGZhaWx1cmUgaXMgaW5kaWNhdGVkIGJ5IHRocm93aW5nIGFuIGBFcnJvcmAgd2l0aCB0aGUgbWVzc2FnZSBkaXNjcmliaW5nIHRoZSBkaXNjb3ZlcmVkIG1pc2NvbmZpZ3VyYXRpb24gaXNzdWUuXG4gICAqXG4gICAqIENhbiBpbmNsdWRlIGFkZGl0aW9uYWwgY2hlY2tzIGluIHBhcnRpY3VsYXIgbmF2aWdhdGlvbiBtb2RlIGltcGxlbWVudGF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHdpemFyZCBUaGUgd2l6YXJkIGNvbXBvbmVudCB0byBvcGVyYXRlIG9uXG4gICAqIEB0aHJvd3MgQW4gYEVycm9yYCBpcyB0aHJvd24sIGlmIGEgbWljY29uZmlndXJhdGlvbiBpc3N1ZSBpcyBkaXNjb3ZlcmVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIGVuc3VyZUNhblJlc2V0KHdpemFyZDogV2l6YXJkQ29tcG9uZW50KTogdm9pZCB7XG4gICAgLy8gdGhlIHdpemFyZCBkb2Vzbid0IGNvbnRhaW4gYSBzdGVwIHdpdGggdGhlIGRlZmF1bHQgc3RlcCBpbmRleFxuICAgIGlmICghd2l6YXJkLmhhc1N0ZXAod2l6YXJkLmRlZmF1bHRTdGVwSW5kZXgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSB3aXphcmQgZG9lc24ndCBjb250YWluIGEgc3RlcCB3aXRoIGluZGV4ICR7d2l6YXJkLmRlZmF1bHRTdGVwSW5kZXh9YCk7XG4gICAgfVxuICB9XG59XG4iXX0=