import { Directive, EventEmitter, HostListener, Input, Optional, Output } from '@angular/core';
import { isStepId } from '../util/step-id.interface';
import { isStepIndex } from '../util/step-index.interface';
import { isStepOffset } from '../util/step-offset.interface';
import { WizardStep } from '../util/wizard-step.interface';
import { WizardComponent } from '../components/wizard.component';
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
export class GoToStepDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ28tdG8tc3RlcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvZ28tdG8tc3RlcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9GLE9BQU8sRUFBRSxRQUFRLEVBQVUsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsV0FBVyxFQUFhLE1BQU0sOEJBQThCLENBQUM7QUFDdEUsT0FBTyxFQUFFLFlBQVksRUFBYyxNQUFNLCtCQUErQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFakU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFJSCxNQUFNLE9BQU8saUJBQWlCO0lBdUI1Qjs7Ozs7T0FLRztJQUNILFlBQW9CLE1BQXVCLEVBQXNCLFVBQXNCO1FBQW5FLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQXNCLGVBQVUsR0FBVixVQUFVLENBQVk7UUE1QnZGOztXQUVHO1FBRUksZ0JBQVcsR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU1RDs7V0FFRztRQUVJLGlCQUFZLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7SUFtQjdELENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUNXLFFBQVEsQ0FBQyxPQUEyQjtRQUM3QywwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFBVyxlQUFlO1FBQ3hCLElBQUksZUFBdUIsQ0FBQztRQUU1QixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDaEMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1NBQzdDO2FBQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3BDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUU7YUFBTSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDcEUsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztTQUM1RjthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsWUFBWSxVQUFVLEVBQUU7WUFDaEQsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMvRDthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDO1NBQ2hHO1FBRUQsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUVJLE9BQU87UUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xGLENBQUM7OztZQXBGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7YUFDekI7OztZQXBDUSxlQUFlO1lBRGYsVUFBVSx1QkFtRTZCLFFBQVE7OzswQkF6QnJELE1BQU07MkJBTU4sTUFBTTt5QkFVTixLQUFLLFNBQUMsWUFBWTt1QkF3QmxCLE1BQU07c0JBa0NOLFlBQVksU0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9wdGlvbmFsLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hdmlnYXRpb25Nb2RlIH0gZnJvbSAnLi4vbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLW1vZGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IGlzU3RlcElkLCBTdGVwSWQgfSBmcm9tICcuLi91dGlsL3N0ZXAtaWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IGlzU3RlcEluZGV4LCBTdGVwSW5kZXggfSBmcm9tICcuLi91dGlsL3N0ZXAtaW5kZXguaW50ZXJmYWNlJztcbmltcG9ydCB7IGlzU3RlcE9mZnNldCwgU3RlcE9mZnNldCB9IGZyb20gJy4uL3V0aWwvc3RlcC1vZmZzZXQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFdpemFyZFN0ZXAgfSBmcm9tICcuLi91dGlsL3dpemFyZC1zdGVwLmludGVyZmFjZSc7XG5pbXBvcnQgeyBXaXphcmRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3dpemFyZC5jb21wb25lbnQnO1xuXG4vKipcbiAqIFRoZSBgYXdHb1RvU3RlcGAgZGlyZWN0aXZlIGNhbiBiZSB1c2VkIHRvIG5hdmlnYXRlIHRvIGEgZ2l2ZW4gc3RlcC5cbiAqIFRoaXMgc3RlcCBjYW4gYmUgZGVmaW5lZCBpbiBvbmUgb2YgbXVsdGlwbGUgZm9ybWF0c1xuICpcbiAqICMjIyBTeW50YXhcbiAqXG4gKiBXaXRoIGFic29sdXRlIHN0ZXAgaW5kZXg6XG4gKlxuICogYGBgaHRtbFxuICogPGJ1dHRvbiBbYXdHb1RvU3RlcF09XCJ7IHN0ZXBJbmRleDogYWJzb2x1dGUgc3RlcCBpbmRleCB9XCIgKGZpbmFsaXplKT1cImZpbmFsaXplIG1ldGhvZFwiPi4uLjwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogV2l0aCB1bmlxdWUgc3RlcCBpZDpcbiAqXG4gKiBgYGBodG1sXG4gKiA8YnV0dG9uIFthd0dvVG9TdGVwXT1cInsgc3RlcElkOiAnc3RlcCBpZCBvZiBkZXN0aW5hdGlvbiBzdGVwJyB9XCIgKGZpbmFsaXplKT1cImZpbmFsaXplIG1ldGhvZFwiPi4uLjwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogV2l0aCBhIHdpemFyZCBzdGVwIG9iamVjdDpcbiAqXG4gKiBgYGBodG1sXG4gKiA8YnV0dG9uIFthd0dvVG9TdGVwXT1cIndpemFyZCBzdGVwIG9iamVjdFwiIChmaW5hbGl6ZSk9XCJmaW5hbGl6ZSBtZXRob2RcIj4uLi48L2J1dHRvbj5cbiAqIGBgYFxuICpcbiAqIFdpdGggYW4gb2Zmc2V0IHRvIHRoZSBkZWZpbmluZyBzdGVwOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxidXR0b24gW2F3R29Ub1N0ZXBdPVwieyBzdGVwT2Zmc2V0OiBvZmZzZXQgfVwiIChmaW5hbGl6ZSk9XCJmaW5hbGl6ZSBtZXRob2RcIj4uLi48L2J1dHRvbj5cbiAqIGBgYFxuICpcbiAqIEBhdXRob3IgTWFyYyBBcm5kdFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYXdHb1RvU3RlcF0nXG59KVxuZXhwb3J0IGNsYXNzIEdvVG9TdGVwRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIFRoaXMgW1tFdmVudEVtaXR0ZXJdXSBpcyBjYWxsZWQgZGlyZWN0bHkgYmVmb3JlIHRoZSBjdXJyZW50IHN0ZXAgaXMgZXhpdGVkIGR1cmluZyBhIHRyYW5zaXRpb24gdGhyb3VnaCBhIGNvbXBvbmVudCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwcmVGaW5hbGl6ZTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBUaGlzIFtbRXZlbnRFbWl0dGVyXV0gaXMgY2FsbGVkIGRpcmVjdGx5IGFmdGVyIHRoZSBjdXJyZW50IHN0ZXAgaXMgZXhpdGVkIGR1cmluZyBhIHRyYW5zaXRpb24gdGhyb3VnaCBhIGNvbXBvbmVudCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBwb3N0RmluYWxpemU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIHN0ZXAsIHRvIHdoaWNoIHRoZSB3aXphcmQgc2hvdWxkIG5hdmlnYXRlLCBhZnRlciB0aGUgY29tcG9uZW50LCBoYXZpbmcgdGhpcyBkaXJlY3RpdmUgaGFzIGJlZW4gYWN0aXZhdGVkLlxuICAgKiBUaGlzIGRlc3RpbmF0aW9uIHN0ZXAgY2FuIGJlIGdpdmVuIGVpdGhlciBhcyBhIFtbV2l6YXJkU3RlcF1dIGNvbnRhaW5pbmcgdGhlIHN0ZXAgZGlyZWN0bHksXG4gICAqIGEgW1tTdGVwT2Zmc2V0XV0gYmV0d2VlbiB0aGUgY3VycmVudCBzdGVwIGFuZCB0aGUgYHdpemFyZFN0ZXBgLCBpbiB3aGljaCB0aGlzIGRpcmVjdGl2ZSBoYXMgYmVlbiB1c2VkLFxuICAgKiBvciBhIHN0ZXAgaW5kZXggYXMgYSBudW1iZXIgb3Igc3RyaW5nXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXG4gIEBJbnB1dCgnYXdHb1RvU3RlcCcpXG4gIHB1YmxpYyB0YXJnZXRTdGVwOiBXaXphcmRTdGVwIHwgU3RlcE9mZnNldCB8IFN0ZXBJbmRleCB8IFN0ZXBJZDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZCBUaGUgd2l6YXJkIGNvbXBvbmVudFxuICAgKiBAcGFyYW0gd2l6YXJkU3RlcCBUaGUgd2l6YXJkIHN0ZXAsIHdoaWNoIGNvbnRhaW5zIHRoaXMgW1tHb1RvU3RlcERpcmVjdGl2ZV1dXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdpemFyZDogV2l6YXJkQ29tcG9uZW50LCBAT3B0aW9uYWwoKSBwcml2YXRlIHdpemFyZFN0ZXA6IFdpemFyZFN0ZXApIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnZlbmllbmNlIGZpZWxkIGZvciBgcHJlRmluYWxpemVgXG4gICAqL1xuICBwdWJsaWMgZ2V0IGZpbmFsaXplKCk6IEV2ZW50RW1pdHRlcjx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMucHJlRmluYWxpemU7XG4gIH1cblxuICAvKipcbiAgICogQSBjb252ZW5pZW5jZSBuYW1lIGZvciBgcHJlRmluYWxpemVgXG4gICAqXG4gICAqIEBwYXJhbSBlbWl0dGVyIFRoZSBbW0V2ZW50RW1pdHRlcl1dIHRvIGJlIHNldFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBzZXQgZmluYWxpemUoZW1pdHRlcjogRXZlbnRFbWl0dGVyPHZvaWQ+KSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICB0aGlzLnByZUZpbmFsaXplID0gZW1pdHRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBzdGVwIG9mIHRoaXMgZGlyZWN0aXZlIGFzIGFuIGFic29sdXRlIHN0ZXAgaW5kZXggaW5zaWRlIHRoZSB3aXphcmRcbiAgICpcbiAgICogQHJldHVybnMgVGhlIGluZGV4IG9mIHRoZSBkZXN0aW5hdGlvbiBzdGVwXG4gICAqIEB0aHJvd3MgSWYgYHRhcmdldFN0ZXBgIGlzIG9mIGFuIHVua25vd24gdHlwZSBhbiBgRXJyb3JgIGlzIHRocm93blxuICAgKi9cbiAgcHVibGljIGdldCBkZXN0aW5hdGlvblN0ZXAoKTogbnVtYmVyIHtcbiAgICBsZXQgZGVzdGluYXRpb25TdGVwOiBudW1iZXI7XG5cbiAgICBpZiAoaXNTdGVwSW5kZXgodGhpcy50YXJnZXRTdGVwKSkge1xuICAgICAgZGVzdGluYXRpb25TdGVwID0gdGhpcy50YXJnZXRTdGVwLnN0ZXBJbmRleDtcbiAgICB9IGVsc2UgaWYgKGlzU3RlcElkKHRoaXMudGFyZ2V0U3RlcCkpIHtcbiAgICAgIGRlc3RpbmF0aW9uU3RlcCA9IHRoaXMud2l6YXJkLmdldEluZGV4T2ZTdGVwV2l0aElkKHRoaXMudGFyZ2V0U3RlcC5zdGVwSWQpO1xuICAgIH0gZWxzZSBpZiAoaXNTdGVwT2Zmc2V0KHRoaXMudGFyZ2V0U3RlcCkgJiYgdGhpcy53aXphcmRTdGVwICE9PSBudWxsKSB7XG4gICAgICBkZXN0aW5hdGlvblN0ZXAgPSB0aGlzLndpemFyZC5nZXRJbmRleE9mU3RlcCh0aGlzLndpemFyZFN0ZXApICsgdGhpcy50YXJnZXRTdGVwLnN0ZXBPZmZzZXQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRhcmdldFN0ZXAgaW5zdGFuY2VvZiBXaXphcmRTdGVwKSB7XG4gICAgICBkZXN0aW5hdGlvblN0ZXAgPSB0aGlzLndpemFyZC5nZXRJbmRleE9mU3RlcCh0aGlzLnRhcmdldFN0ZXApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElucHV0ICd0YXJnZXRTdGVwJyBpcyBuZWl0aGVyIGEgV2l6YXJkU3RlcCwgU3RlcE9mZnNldCwgU3RlcEluZGV4IG9yIFN0ZXBJZGApO1xuICAgIH1cblxuICAgIHJldHVybiBkZXN0aW5hdGlvblN0ZXA7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgbWV0aG9kIGZvciBgY2xpY2tgIGV2ZW50cyBvbiB0aGUgY29tcG9uZW50IHdpdGggdGhpcyBkaXJlY3RpdmUuXG4gICAqIEFmdGVyIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0aGUgd2l6YXJkIHdpbGwgdHJ5IHRvIHRyYW5zaXRpb24gdG8gdGhlIGBkZXN0aW5hdGlvblN0ZXBgXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIHB1YmxpYyBvbkNsaWNrKCk6IHZvaWQge1xuICAgIHRoaXMud2l6YXJkLmdvVG9TdGVwKHRoaXMuZGVzdGluYXRpb25TdGVwLCB0aGlzLnByZUZpbmFsaXplLCB0aGlzLnBvc3RGaW5hbGl6ZSk7XG4gIH1cbn1cbiJdfQ==