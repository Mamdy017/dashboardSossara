import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { WizardComponent } from '../components/wizard.component';
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
export class PreviousStepDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlvdXMtc3RlcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvcHJldmlvdXMtc3RlcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFFL0Q7Ozs7Ozs7Ozs7O0dBV0c7QUFJSCxNQUFNLE9BQU8scUJBQXFCO0lBYWhDOzs7O09BSUc7SUFDSCxZQUFvQixNQUF1QjtRQUF2QixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQWpCM0M7O1dBRUc7UUFFSSxnQkFBVyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTVEOztXQUVHO1FBRUksaUJBQVksR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQVE3RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFDVyxRQUFRLENBQUMsT0FBMkI7UUFDN0MsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFFSSxPQUFPO1FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRSxDQUFDOzs7WUFqREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7YUFDN0I7OztZQWhCTyxlQUFlOzs7MEJBcUJwQixNQUFNOzJCQU1OLE1BQU07dUJBdUJOLE1BQU07c0JBVU4sWUFBWSxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dpemFyZENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy93aXphcmQuY29tcG9uZW50JztcblxuLyoqXG4gKiBUaGUgYGF3UHJldmlvdXNTdGVwYCBkaXJlY3RpdmUgY2FuIGJlIHVzZWQgdG8gbmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHN0ZXAuXG4gKiBDb21wYXJlZCB0byB0aGUgW1tOZXh0U3RlcERpcmVjdGl2ZV1dIGl0J3MgaW1wb3J0YW50IHRvIG5vdGUsIHRoYXQgdGhpcyBkaXJlY3RpdmUgZG9lc24ndCBjb250YWluIGEgYGZpbmFsaXplYCBvdXRwdXQgbWV0aG9kLlxuICpcbiAqICMjIyBTeW50YXhcbiAqXG4gKiBgYGBodG1sXG4gKiA8YnV0dG9uIGF3UHJldmlvdXNTdGVwPi4uLjwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thd1ByZXZpb3VzU3RlcF0nXG59KVxuZXhwb3J0IGNsYXNzIFByZXZpb3VzU3RlcERpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGlzIFtbRXZlbnRFbWl0dGVyXV0gaXMgY2FsbGVkIGRpcmVjdGx5IGJlZm9yZSB0aGUgY3VycmVudCBzdGVwIGlzIGV4aXRlZCBkdXJpbmcgYSB0cmFuc2l0aW9uIHRocm91Z2ggYSBjb21wb25lbnQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcHJlRmluYWxpemU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogVGhpcyBbW0V2ZW50RW1pdHRlcl1dIGlzIGNhbGxlZCBkaXJlY3RseSBhZnRlciB0aGUgY3VycmVudCBzdGVwIGlzIGV4aXRlZCBkdXJpbmcgYSB0cmFuc2l0aW9uIHRocm91Z2ggYSBjb21wb25lbnQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcG9zdEZpbmFsaXplOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBwYXJhbSB3aXphcmQgVGhlIHN0YXRlIG9mIHRoZSB3aXphcmRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgd2l6YXJkOiBXaXphcmRDb21wb25lbnQpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnZlbmllbmNlIGZpZWxkIGZvciBgcHJlRmluYWxpemVgXG4gICAqL1xuICBwdWJsaWMgZ2V0IGZpbmFsaXplKCk6IEV2ZW50RW1pdHRlcjx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMucHJlRmluYWxpemU7XG4gIH1cblxuICAvKipcbiAgICogQSBjb252ZW5pZW5jZSBmaWVsZCBmb3IgYHByZUZpbmFsaXplYFxuICAgKlxuICAgKiBAcGFyYW0gZW1pdHRlciBUaGUgW1tFdmVudEVtaXR0ZXJdXSB0byBiZSBzZXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgc2V0IGZpbmFsaXplKGVtaXR0ZXI6IEV2ZW50RW1pdHRlcjx2b2lkPikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgdGhpcy5wcmVGaW5hbGl6ZSA9IGVtaXR0ZXI7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgbWV0aG9kIGZvciBgY2xpY2tgIGV2ZW50cyBvbiB0aGUgY29tcG9uZW50IHdpdGggdGhpcyBkaXJlY3RpdmUuXG4gICAqIEFmdGVyIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0aGUgd2l6YXJkIHdpbGwgdHJ5IHRvIHRyYW5zaXRpb24gdG8gdGhlIHByZXZpb3VzIHN0ZXBcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgcHVibGljIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy53aXphcmQuZ29Ub1ByZXZpb3VzU3RlcCh0aGlzLnByZUZpbmFsaXplLCB0aGlzLnBvc3RGaW5hbGl6ZSk7XG4gIH1cbn1cbiJdfQ==