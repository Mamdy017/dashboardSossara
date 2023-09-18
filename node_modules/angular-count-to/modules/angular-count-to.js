import { Directive, ElementRef, Input, NgModule } from '@angular/core';

class CountToDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.from = 0;
        this.duration = 4;
        this.e = this.el.nativeElement;
        this.refreshInterval = 30;
        this.step = 0;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.CountTo) {
            this.start();
        }
    }
    /**
     * @return {?}
     */
    calculate() {
        this.duration = this.duration * 1000;
        this.steps = Math.ceil(this.duration / this.refreshInterval);
        this.increment = ((this.CountTo - this.from) / this.steps);
        this.num = this.from;
    }
    /**
     * @return {?}
     */
    tick() {
        setTimeout(() => {
            this.num += this.increment;
            this.step++;
            if (this.step >= this.steps) {
                this.num = this.CountTo;
                this.e.textContent = this.CountTo;
            }
            else {
                this.e.textContent = Math.round(this.num);
                this.tick();
            }
        }, this.refreshInterval);
    }
    /**
     * @return {?}
     */
    start() {
        this.calculate();
        this.tick();
    }
}
CountToDirective.decorators = [
    { type: Directive, args: [{
                selector: '[CountTo]'
            },] },
];
/**
 * @nocollapse
 */
CountToDirective.ctorParameters = () => [
    { type: ElementRef, },
];
CountToDirective.propDecorators = {
    'CountTo': [{ type: Input },],
    'from': [{ type: Input },],
    'duration': [{ type: Input },],
};

class CountToModule {
    /**
     * Use in AppModule
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: CountToModule,
            providers: []
        };
    }
    /**
     * Use in features modules with lazy loading
     * @return {?}
     */
    static forChild() {
        return {
            ngModule: CountToModule,
            providers: []
        };
    }
}
CountToModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    CountToDirective
                    // Pipes.
                    // Directives.
                ],
                exports: [
                    CountToDirective
                    // Pipes.
                    // Directives.
                ]
            },] },
];
/**
 * @nocollapse
 */
CountToModule.ctorParameters = () => [];

// Public classes.

/**
 * Angular library starter.
 * Build an Angular library compatible with AoT compilation & Tree shaking.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular-count-to
 */
/**
 * Entry point for all public APIs of the package.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CountToDirective, CountToModule };
//# sourceMappingURL=angular-count-to.js.map
