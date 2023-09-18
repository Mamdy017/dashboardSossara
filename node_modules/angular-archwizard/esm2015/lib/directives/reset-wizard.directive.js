import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { WizardComponent } from '../components/wizard.component';
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
export class ResetWizardDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtd2l6YXJkLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi9zcmMvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9yZXNldC13aXphcmQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRS9EOzs7Ozs7Ozs7OztHQVdHO0FBSUgsTUFBTSxPQUFPLG9CQUFvQjtJQU8vQjs7OztPQUlHO0lBQ0gsWUFBb0IsTUFBdUI7UUFBdkIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFYM0M7O1dBRUc7UUFFSSxhQUFRLEdBQXVCLElBQUksWUFBWSxFQUFFLENBQUM7SUFRekQsQ0FBQztJQUVEOztPQUVHO0lBRUksT0FBTztRQUNaLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUM7OztZQTNCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjthQUM1Qjs7O1lBaEJPLGVBQWU7Ozt1QkFxQnBCLE1BQU07c0JBY04sWUFBWSxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIE91dHB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dpemFyZENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy93aXphcmQuY29tcG9uZW50JztcblxuLyoqXG4gKiBUaGUgYGF3UmVzZXRXaXphcmRgIGRpcmVjdGl2ZSBjYW4gYmUgdXNlZCB0byByZXNldCB0aGUgd2l6YXJkIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuICogVGhpcyBkaXJlY3RpdmUgYWNjZXB0cyBhbiBvdXRwdXQsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgc29tZSBjdXN0b20gY2xlYW51cCB3b3JrIGR1cmluZyB0aGUgcmVzZXQgcHJvY2Vzcy5cbiAqXG4gKiAjIyMgU3ludGF4XG4gKlxuICogYGBgaHRtbFxuICogPGJ1dHRvbiBhd1Jlc2V0V2l6YXJkIChmaW5hbGl6ZSk9XCJjdXN0b20gcmVzZXQgdGFza1wiPi4uLjwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thd1Jlc2V0V2l6YXJkXSdcbn0pXG5leHBvcnQgY2xhc3MgUmVzZXRXaXphcmREaXJlY3RpdmUge1xuICAvKipcbiAgICogQW4gW1tFdmVudEVtaXR0ZXJdXSBjb250YWluaW5nIHNvbWUgdGFza3MgdG8gYmUgZG9uZSwgZGlyZWN0bHkgYmVmb3JlIHRoZSB3aXphcmQgaXMgYmVpbmcgcmVzZXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgZmluYWxpemU6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHdpemFyZCBUaGUgd2l6YXJkIGNvbXBvbmVudFxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3aXphcmQ6IFdpemFyZENvbXBvbmVudCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgd2l6YXJkXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIHB1YmxpYyBvbkNsaWNrKCk6IHZvaWQge1xuICAgIC8vIGRvIHNvbWUgb3B0aW9uYWwgY2xlYW51cCB3b3JrXG4gICAgdGhpcy5maW5hbGl6ZS5lbWl0KCk7XG4gICAgLy8gcmVzZXQgdGhlIHdpemFyZCB0byBpdHMgaW5pdGlhbCBzdGF0ZVxuICAgIHRoaXMud2l6YXJkLnJlc2V0KCk7XG4gIH1cbn1cbiJdfQ==