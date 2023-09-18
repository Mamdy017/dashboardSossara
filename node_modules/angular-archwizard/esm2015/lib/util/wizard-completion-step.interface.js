import { EventEmitter, Directive } from '@angular/core';
import { WizardStep } from './wizard-step.interface';
/**
 * Basic functionality every wizard completion step needs to provide
 *
 * @author Marc Arndt
 */
/* tslint:disable-next-line directive-class-suffix */
export class WizardCompletionStep extends WizardStep {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLWNvbXBsZXRpb24tc3RlcC5pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWwvd2l6YXJkLWNvbXBsZXRpb24tc3RlcC5pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFlBQVksRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBR25EOzs7O0dBSUc7QUFFSCxxREFBcUQ7QUFDckQsTUFBTSxPQUFnQixvQkFBcUIsU0FBUSxVQUFVO0lBRjdEOztRQUdFOztXQUVHO1FBQ0ksYUFBUSxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRXREOztXQUVHO1FBQ0ksWUFBTyxHQUF3RCxLQUFLLENBQUM7SUFrQjlFLENBQUM7SUFoQkM7O09BRUc7SUFDSSxLQUFLLENBQUMsU0FBMEI7UUFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLFNBQTBCO1FBQ3BDLHNGQUFzRjtRQUN0RixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoQyxDQUFDOzs7WUE1QkYsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyLCBEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXaXphcmRTdGVwfSBmcm9tICcuL3dpemFyZC1zdGVwLmludGVyZmFjZSc7XG5pbXBvcnQge01vdmluZ0RpcmVjdGlvbn0gZnJvbSAnLi9tb3ZpbmctZGlyZWN0aW9uLmVudW0nO1xuXG4vKipcbiAqIEJhc2ljIGZ1bmN0aW9uYWxpdHkgZXZlcnkgd2l6YXJkIGNvbXBsZXRpb24gc3RlcCBuZWVkcyB0byBwcm92aWRlXG4gKlxuICogQGF1dGhvciBNYXJjIEFybmR0XG4gKi9cbkBEaXJlY3RpdmUoKVxuLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lIGRpcmVjdGl2ZS1jbGFzcy1zdWZmaXggKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBXaXphcmRDb21wbGV0aW9uU3RlcCBleHRlbmRzIFdpemFyZFN0ZXAge1xuICAvKipcbiAgICogQGluaGVyaXREb2NcbiAgICovXG4gIHB1YmxpYyBzdGVwRXhpdCA9IG5ldyBFdmVudEVtaXR0ZXI8TW92aW5nRGlyZWN0aW9uPigpO1xuXG4gIC8qKlxuICAgKiBAaW5oZXJpdERvY1xuICAgKi9cbiAgcHVibGljIGNhbkV4aXQ6ICgoZGlyZWN0aW9uOiBNb3ZpbmdEaXJlY3Rpb24pID0+IGJvb2xlYW4pIHwgYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAaW5oZXJpdERvY1xuICAgKi9cbiAgcHVibGljIGVudGVyKGRpcmVjdGlvbjogTW92aW5nRGlyZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5jb21wbGV0ZWQgPSB0cnVlO1xuICAgIHRoaXMuc3RlcEVudGVyLmVtaXQoZGlyZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW5oZXJpdERvY1xuICAgKi9cbiAgcHVibGljIGV4aXQoZGlyZWN0aW9uOiBNb3ZpbmdEaXJlY3Rpb24pOiB2b2lkIHtcbiAgICAvLyBzZXQgdGhpcyBjb21wbGV0aW9uIHN0ZXAgYXMgaW5jb21wbGV0ZSAodW5sZXNzIGl0IGhhcHBlbnMgdG8gYmUgaW5pdGlhbGx5Q29tcGxldGVkKVxuICAgIHRoaXMuY29tcGxldGVkID0gdGhpcy5pbml0aWFsbHlDb21wbGV0ZWQ7XG4gICAgdGhpcy5zdGVwRXhpdC5lbWl0KGRpcmVjdGlvbik7XG4gIH1cbn1cbiJdfQ==