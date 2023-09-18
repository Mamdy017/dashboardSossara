import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { WizardComponent } from '../components/wizard.component';
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
export class NextStepDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV4dC1zdGVwLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9uZXh0LXN0ZXAuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRS9EOzs7Ozs7Ozs7O0dBVUc7QUFJSCxNQUFNLE9BQU8saUJBQWlCO0lBYTVCOzs7O09BSUc7SUFDSCxZQUFvQixNQUF1QjtRQUF2QixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQWpCM0M7O1dBRUc7UUFFSSxnQkFBVyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTVEOztXQUVHO1FBRUksaUJBQVksR0FBdUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQVE3RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFDVyxRQUFRLENBQUMsT0FBMkI7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUVJLE9BQU87UUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNoRSxDQUFDOzs7WUFoREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2FBQ3pCOzs7WUFmTyxlQUFlOzs7MEJBb0JwQixNQUFNOzJCQU1OLE1BQU07dUJBdUJOLE1BQU07c0JBU04sWUFBWSxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dpemFyZENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy93aXphcmQuY29tcG9uZW50JztcblxuLyoqXG4gKiBUaGUgYGF3TmV4dFN0ZXBgIGRpcmVjdGl2ZSBjYW4gYmUgdXNlZCB0byBuYXZpZ2F0ZSB0byB0aGUgbmV4dCBzdGVwLlxuICpcbiAqICMjIyBTeW50YXhcbiAqXG4gKiBgYGBodG1sXG4gKiA8YnV0dG9uIGF3TmV4dFN0ZXAgKGZpbmFsaXplKT1cImZpbmFsaXplIG1ldGhvZFwiPi4uLjwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thd05leHRTdGVwXSdcbn0pXG5leHBvcnQgY2xhc3MgTmV4dFN0ZXBEaXJlY3RpdmUge1xuICAvKipcbiAgICogVGhpcyBbW0V2ZW50RW1pdHRlcl1dIGlzIGNhbGxlZCBkaXJlY3RseSBiZWZvcmUgdGhlIGN1cnJlbnQgc3RlcCBpcyBleGl0ZWQgZHVyaW5nIGEgdHJhbnNpdGlvbiB0aHJvdWdoIGEgY29tcG9uZW50IHdpdGggdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcHVibGljIHByZUZpbmFsaXplOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgW1tFdmVudEVtaXR0ZXJdXSBpcyBjYWxsZWQgZGlyZWN0bHkgYWZ0ZXIgdGhlIGN1cnJlbnQgc3RlcCBpcyBleGl0ZWQgZHVyaW5nIGEgdHJhbnNpdGlvbiB0aHJvdWdoIGEgY29tcG9uZW50IHdpdGggdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcHVibGljIHBvc3RGaW5hbGl6ZTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gd2l6YXJkIFRoZSBzdGF0ZSBvZiB0aGUgd2l6YXJkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdpemFyZDogV2l6YXJkQ29tcG9uZW50KSB7XG4gIH1cblxuICAvKipcbiAgICogQSBjb252ZW5pZW5jZSBmaWVsZCBmb3IgYHByZUZpbmFsaXplYFxuICAgKi9cbiAgcHVibGljIGdldCBmaW5hbGl6ZSgpOiBFdmVudEVtaXR0ZXI8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLnByZUZpbmFsaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udmVuaWVuY2UgbmFtZSBmb3IgYHByZUZpbmFsaXplYFxuICAgKlxuICAgKiBAcGFyYW0gZW1pdHRlciBUaGUgW1tFdmVudEVtaXR0ZXJdXSB0byBiZSBzZXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgc2V0IGZpbmFsaXplKGVtaXR0ZXI6IEV2ZW50RW1pdHRlcjx2b2lkPikge1xuICAgIHRoaXMucHJlRmluYWxpemUgPSBlbWl0dGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbmVyIG1ldGhvZCBmb3IgYGNsaWNrYCBldmVudHMgb24gdGhlIGNvbXBvbmVudCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICAgKiBBZnRlciB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgdGhlIHdpemFyZCB3aWxsIHRyeSB0byB0cmFuc2l0aW9uIHRvIHRoZSBuZXh0IHN0ZXBcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgcHVibGljIG9uQ2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy53aXphcmQuZ29Ub05leHRTdGVwKHRoaXMucHJlRmluYWxpemUsIHRoaXMucG9zdEZpbmFsaXplKTtcbiAgfVxufVxuIl19