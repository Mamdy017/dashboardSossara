(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('angular-archwizard', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['angular-archwizard'] = {}, global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

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
    var WizardStepSymbolDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepSymbolDirective]]
         */
        function WizardStepSymbolDirective(templateRef) {
            this.templateRef = templateRef;
        }
        return WizardStepSymbolDirective;
    }());
    WizardStepSymbolDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'ng-template[awStepSymbol], ng-template[awWizardStepSymbol]'
                },] }
    ];
    WizardStepSymbolDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };

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
    var WizardStepTitleDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param templateRef A reference to the content of the `ng-template` that contains this [[WizardStepTitleDirective]]
         */
        function WizardStepTitleDirective(templateRef) {
            this.templateRef = templateRef;
        }
        return WizardStepTitleDirective;
    }());
    WizardStepTitleDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: 'ng-template[awStepTitle], ng-template[awWizardStepTitle]'
                },] }
    ];
    WizardStepTitleDirective.ctorParameters = function () { return [
        { type: core.TemplateRef }
    ]; };

    /**
     * Basic functionality every type of wizard step needs to provide
     *
     * @author Marc Arndt
     */
    /* tslint:disable-next-line directive-class-suffix */
    var WizardStep = /** @class */ (function () {
        function WizardStep() {
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
            this.stepEnter = new core.EventEmitter();
            /**
             * This [[EventEmitter]] is called when the step is exited.
             * The bound method can be used to do cleanup work.
             */
            this.stepExit = new core.EventEmitter();
        }
        Object.defineProperty(WizardStep.prototype, "hidden", {
            /**
             * Returns true if this wizard step should be visible to the user.
             * If the step should be visible to the user false is returned, otherwise true
             */
            get: function () {
                return !this.selected;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * This method returns true, if this wizard step can be transitioned with a given direction.
         * Transitioned in this case means either entered or exited, depending on the given `condition` parameter.
         *
         * @param condition A condition variable, deciding if the step can be transitioned
         * @param direction The direction in which this step should be transitioned
         * @returns A [[Promise]] containing `true`, if this step can transitioned in the given direction
         * @throws An `Error` is thrown if `condition` is neither a function nor a boolean
         */
        WizardStep.canTransitionStep = function (condition, direction) {
            if (typeof (condition) === typeof (true)) {
                return Promise.resolve(condition);
            }
            else if (condition instanceof Function) {
                return Promise.resolve(condition(direction));
            }
            else {
                return Promise.reject(new Error("Input value '" + condition + "' is neither a boolean nor a function"));
            }
        };
        /**
         * A function called when the step is entered
         *
         * @param direction The direction in which the step is entered
         */
        WizardStep.prototype.enter = function (direction) {
            this.stepEnter.emit(direction);
        };
        /**
         * A function called when the step is exited
         *
         * @param direction The direction in which the step is exited
         */
        WizardStep.prototype.exit = function (direction) {
            this.stepExit.emit(direction);
        };
        /**
         * This method returns true, if this wizard step can be entered from the given direction.
         * Because this method depends on the value `canEnter`, it will throw an error, if `canEnter` is neither a boolean
         * nor a function.
         *
         * @param direction The direction in which this step should be entered
         * @returns A [[Promise]] containing `true`, if the step can be entered in the given direction, false otherwise
         * @throws An `Error` is thrown if `anEnter` is neither a function nor a boolean
         */
        WizardStep.prototype.canEnterStep = function (direction) {
            return WizardStep.canTransitionStep(this.canEnter, direction);
        };
        /**
         * This method returns true, if this wizard step can be exited into given direction.
         * Because this method depends on the value `canExit`, it will throw an error, if `canExit` is neither a boolean
         * nor a function.
         *
         * @param direction The direction in which this step should be left
         * @returns A [[Promise]] containing `true`, if the step can be exited in the given direction, false otherwise
         * @throws An `Error` is thrown if `canExit` is neither a function nor a boolean
         */
        WizardStep.prototype.canExitStep = function (direction) {
            return WizardStep.canTransitionStep(this.canExit, direction);
        };
        return WizardStep;
    }());
    WizardStep.decorators = [
        { type: core.Directive }
    ];
    WizardStep.propDecorators = {
        stepTitleTemplate: [{ type: core.ContentChild, args: [WizardStepTitleDirective,] }],
        stepSymbolTemplate: [{ type: core.ContentChild, args: [WizardStepSymbolDirective,] }],
        stepId: [{ type: core.Input }],
        stepTitle: [{ type: core.Input }],
        navigationSymbol: [{ type: core.Input }],
        canEnter: [{ type: core.Input }],
        canExit: [{ type: core.Input }],
        stepEnter: [{ type: core.Output }],
        stepExit: [{ type: core.Output }],
        hidden: [{ type: core.HostBinding, args: ['hidden',] }]
    };

    /**
     * Basic functionality every wizard completion step needs to provide
     *
     * @author Marc Arndt
     */
    /* tslint:disable-next-line directive-class-suffix */
    var WizardCompletionStep = /** @class */ (function (_super) {
        __extends(WizardCompletionStep, _super);
        function WizardCompletionStep() {
            var _this = _super.apply(this, __spread(arguments)) || this;
            /**
             * @inheritDoc
             */
            _this.stepExit = new core.EventEmitter();
            /**
             * @inheritDoc
             */
            _this.canExit = false;
            return _this;
        }
        /**
         * @inheritDoc
         */
        WizardCompletionStep.prototype.enter = function (direction) {
            this.completed = true;
            this.stepEnter.emit(direction);
        };
        /**
         * @inheritDoc
         */
        WizardCompletionStep.prototype.exit = function (direction) {
            // set this completion step as incomplete (unless it happens to be initiallyCompleted)
            this.completed = this.initiallyCompleted;
            this.stepExit.emit(direction);
        };
        return WizardCompletionStep;
    }(WizardStep));
    WizardCompletionStep.decorators = [
        { type: core.Directive }
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
    var WizardCompletionStepComponent = /** @class */ (function (_super) {
        __extends(WizardCompletionStepComponent, _super);
        function WizardCompletionStepComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WizardCompletionStepComponent;
    }(WizardCompletionStep));
    WizardCompletionStepComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'aw-wizard-completion-step',
                    template: "<ng-content></ng-content>\n",
                    providers: [
                        { provide: WizardStep, useExisting: core.forwardRef(function () { return WizardCompletionStepComponent; }) },
                        { provide: WizardCompletionStep, useExisting: core.forwardRef(function () { return WizardCompletionStepComponent; }) }
                    ]
                },] }
    ];

    /**
     * The direction in which a step transition was made
     *
     * @author Marc Arndt
     */
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
    })(exports.MovingDirection || (exports.MovingDirection = {}));

    /**
     * Base implementation of [[NavigationMode]]
     *
     * Note: Built-in [[NavigationMode]] classes should be stateless, allowing the library user to easily create
     * an instance of a particular [[NavigationMode]] class and pass it to `<aw-wizard [navigationMode]="...">`.
     *
     * @author Marc Arndt
     */
    var BaseNavigationMode = /** @class */ (function () {
        function BaseNavigationMode() {
        }
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
        BaseNavigationMode.prototype.canGoToStep = function (wizard, destinationIndex) {
            var _this = this;
            var hasStep = wizard.hasStep(destinationIndex);
            var movingDirection = wizard.getMovingDirection(destinationIndex);
            var canExitCurrentStep = function (previous) {
                return previous && wizard.currentStep.canExitStep(movingDirection);
            };
            var canEnterDestinationStep = function (previous) {
                return previous && wizard.getStepAtIndex(destinationIndex).canEnterStep(movingDirection);
            };
            var canTransitionToStep = function (previous) {
                return previous && _this.canTransitionToStep(wizard, destinationIndex);
            };
            return Promise.resolve(hasStep)
                .then(canTransitionToStep)
                // Apply user-defined checks at the end.  They can involve user interaction
                // which is better to be avoided if navigation mode does not actually allow the transition
                // (`canTransitionToStep` returns `false`).
                .then(canExitCurrentStep)
                .then(canEnterDestinationStep);
        };
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
        BaseNavigationMode.prototype.canTransitionToStep = function (wizard, destinationIndex) {
            return this.isNavigable(wizard, destinationIndex);
        };
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
        BaseNavigationMode.prototype.goToStep = function (wizard, destinationIndex, preFinalize, postFinalize) {
            var _this = this;
            this.canGoToStep(wizard, destinationIndex).then(function (navigationAllowed) {
                if (navigationAllowed) {
                    // the current step can be exited in the given direction
                    var movingDirection = wizard.getMovingDirection(destinationIndex);
                    /* istanbul ignore if */
                    if (preFinalize) {
                        preFinalize.emit();
                    }
                    // leave current step
                    wizard.currentStep.completed = true;
                    wizard.currentStep.exit(movingDirection);
                    wizard.currentStep.editing = false;
                    wizard.currentStep.selected = false;
                    _this.transition(wizard, destinationIndex);
                    // remember if the next step is already completed before entering it to properly set `editing` flag
                    var wasCompleted = wizard.completed || wizard.currentStep.completed;
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
                    wizard.currentStep.exit(exports.MovingDirection.Stay);
                    wizard.currentStep.enter(exports.MovingDirection.Stay);
                }
            });
        };
        /**
         * Transitions the wizard to the given step index.
         *
         * Can perform additional actions in particular navigation mode implementations.
         *
         * @param wizard The wizard component to operate on
         * @param destinationIndex The index of the destination wizard step
         */
        BaseNavigationMode.prototype.transition = function (wizard, destinationIndex) {
            wizard.currentStepIndex = destinationIndex;
        };
        /**
         * Resets the state of this wizard.
         *
         * A reset transitions the wizard automatically to the first step and sets all steps as incomplete.
         * In addition the whole wizard is set as incomplete.
         *
         * @param wizard The wizard component to operate on
         */
        BaseNavigationMode.prototype.reset = function (wizard) {
            this.ensureCanReset(wizard);
            // reset the step internal state
            wizard.wizardSteps.forEach(function (step) {
                step.completed = step.initiallyCompleted;
                step.selected = false;
                step.editing = false;
            });
            // set the first step as the current step
            wizard.currentStepIndex = wizard.defaultStepIndex;
            wizard.currentStep.selected = true;
            wizard.currentStep.enter(exports.MovingDirection.Forwards);
        };
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
        BaseNavigationMode.prototype.ensureCanReset = function (wizard) {
            // the wizard doesn't contain a step with the default step index
            if (!wizard.hasStep(wizard.defaultStepIndex)) {
                throw new Error("The wizard doesn't contain a step with index " + wizard.defaultStepIndex);
            }
        };
        return BaseNavigationMode;
    }());

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
    var ConfigurableNavigationMode = /** @class */ (function (_super) {
        __extends(ConfigurableNavigationMode, _super);
        /**
         * Constructor
         *
         * @param navigateBackward Controls whether wizard steps before the current step are navigable
         * @param navigateForward Controls whether wizard steps before the current step are navigable
         */
        function ConfigurableNavigationMode(navigateBackward, navigateForward) {
            if (navigateBackward === void 0) { navigateBackward = null; }
            if (navigateForward === void 0) { navigateForward = null; }
            var _this = _super.call(this) || this;
            _this.navigateBackward = navigateBackward;
            _this.navigateForward = navigateForward;
            _this.navigateBackward = _this.navigateBackward || 'allow';
            _this.navigateForward = _this.navigateForward || 'deny';
            return _this;
        }
        /**
         * @inheritDoc
         */
        ConfigurableNavigationMode.prototype.canTransitionToStep = function (wizard, destinationIndex) {
            // if the destination step can be navigated to using the navigation bar,
            // it should be accessible with [goToStep] as well
            if (this.isNavigable(wizard, destinationIndex)) {
                return true;
            }
            // navigation with [goToStep] is permitted if all previous steps
            // to the destination step have been completed or are optional
            return wizard.wizardSteps
                .filter(function (step, index) { return index < destinationIndex && index !== wizard.currentStepIndex; })
                .every(function (step) { return step.completed || step.optional; });
        };
        /**
         * @inheritDoc
         */
        ConfigurableNavigationMode.prototype.transition = function (wizard, destinationIndex) {
            if (this.navigateForward === 'deny') {
                // set all steps after the destination step to incomplete
                wizard.wizardSteps
                    .filter(function (step, index) { return wizard.currentStepIndex > destinationIndex && index > destinationIndex; })
                    .forEach(function (step) { return step.completed = false; });
            }
            _super.prototype.transition.call(this, wizard, destinationIndex);
        };
        /**
         * @inheritDoc
         */
        ConfigurableNavigationMode.prototype.isNavigable = function (wizard, destinationIndex) {
            // Check if the destination step can be navigated to
            var destinationStep = wizard.getStepAtIndex(destinationIndex);
            if (destinationStep instanceof WizardCompletionStep) {
                // A completion step can only be entered, if all previous steps have been completed, are optional, or selected
                var previousStepsCompleted = wizard.wizardSteps
                    .filter(function (step, index) { return index < destinationIndex; })
                    .every(function (step) { return step.completed || step.optional || step.selected; });
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
                        throw new Error("Invalid value for navigateBackward: " + this.navigateBackward);
                }
            }
            else if (destinationIndex > wizard.currentStepIndex) {
                // If the destination step is after current, apply the `navigateForward` policy
                switch (this.navigateForward) {
                    case 'allow': return true;
                    case 'deny': return false;
                    case 'visited': return destinationStep.completed;
                    default:
                        throw new Error("Invalid value for navigateForward: " + this.navigateForward);
                }
            }
            else {
                // Re-entering the current step is not allowed
                return false;
            }
        };
        /**
         * @inheritDoc
         */
        ConfigurableNavigationMode.prototype.ensureCanReset = function (wizard) {
            _super.prototype.ensureCanReset.call(this, wizard);
            // the default step is a completion step and the wizard contains more than one step
            var defaultWizardStep = wizard.getStepAtIndex(wizard.defaultStepIndex);
            var defaultCompletionStep = defaultWizardStep instanceof WizardCompletionStep;
            if (defaultCompletionStep && wizard.wizardSteps.length !== 1) {
                throw new Error("The default step index " + wizard.defaultStepIndex + " references a completion step");
            }
        };
        return ConfigurableNavigationMode;
    }(BaseNavigationMode));

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
    var WizardComponent = /** @class */ (function () {
        /**
         * Constructor
         */
        function WizardComponent() {
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
        Object.defineProperty(WizardComponent.prototype, "defaultStepIndex", {
            /**
             * The initially selected step, represented by its index
             * Beware: This initial default is only used if no wizard step has been enhanced with the `selected` directive
             */
            get: function () {
                // This value can be either:
                // - the index of a wizard step with a `selected` directive, or
                // - the default step index, set in the [[WizardComponent]]
                var foundDefaultStep = this.wizardSteps.find(function (step) { return step.defaultSelected; });
                if (foundDefaultStep) {
                    return this.getIndexOfStep(foundDefaultStep);
                }
                else {
                    return this._defaultStepIndex;
                }
            },
            set: function (defaultStepIndex) {
                this._defaultStepIndex = defaultStepIndex;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WizardComponent.prototype, "horizontalOrientation", {
            /**
             * Returns true if this wizard uses a horizontal orientation.
             * The wizard uses a horizontal orientation, iff the navigation bar is shown at the top or bottom of this wizard
             *
             * @returns True if this wizard uses a horizontal orientation
             */
            get: function () {
                return this.navBarLocation === 'top' || this.navBarLocation === 'bottom';
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WizardComponent.prototype, "verticalOrientation", {
            /**
             * Returns true if this wizard uses a vertical orientation.
             * The wizard uses a vertical orientation, iff the navigation bar is shown at the left or right of this wizard
             *
             * @returns True if this wizard uses a vertical orientation
             */
            get: function () {
                return this.navBarLocation === 'left' || this.navBarLocation === 'right';
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Initialization work
         */
        WizardComponent.prototype.ngAfterContentInit = function () {
            var _this = this;
            // add a subscriber to the wizard steps QueryList to listen to changes in the DOM
            this.wizardStepsQueryList.changes.subscribe(function (changedWizardSteps) {
                _this.updateWizardSteps(changedWizardSteps.toArray());
            });
            // initialize the model
            this.updateWizardSteps(this.wizardStepsQueryList.toArray());
            // finally reset the whole wizard component
            setTimeout(function () { return _this.reset(); });
        };
        Object.defineProperty(WizardComponent.prototype, "currentStep", {
            /**
             * The WizardStep object belonging to the currently visible and selected step.
             * The currentStep is always the currently selected wizard step.
             * The currentStep can be either completed, if it was visited earlier,
             * or not completed, if it is visited for the first time or its state is currently out of date.
             *
             * If this wizard contains no steps, currentStep is null
             */
            get: function () {
                if (this.hasStep(this.currentStepIndex)) {
                    return this.wizardSteps[this.currentStepIndex];
                }
                else {
                    return null;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WizardComponent.prototype, "completed", {
            /**
             * The completeness of the wizard.
             * If the wizard has been completed, i.e. all steps are either completed or optional, this value is true, otherwise it is false
             */
            get: function () {
                return this.wizardSteps.every(function (step) { return step.completed || step.optional; });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WizardComponent.prototype, "wizardSteps", {
            /**
             * An array representation of all wizard steps belonging to this model
             */
            get: function () {
                return this._wizardSteps;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Updates the wizard steps to the new array
         *
         * @param wizardSteps The updated wizard steps
         */
        WizardComponent.prototype.updateWizardSteps = function (wizardSteps) {
            // the wizard is currently not in the initialization phase
            if (this.wizardSteps.length > 0 && this.currentStepIndex > -1) {
                this.currentStepIndex = wizardSteps.indexOf(this.wizardSteps[this.currentStepIndex]);
            }
            this._wizardSteps = wizardSteps;
        };
        Object.defineProperty(WizardComponent.prototype, "navigation", {
            /**
             * The navigation mode used to navigate inside the wizard
             */
            get: function () {
                return this._navigation;
            },
            /**
             * Updates the navigation mode for this wizard component
             *
             * @param navigation The updated navigation mode
             */
            set: function (navigation) {
                this._navigation = navigation;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Checks if a given index `stepIndex` is inside the range of possible wizard steps inside this wizard
         *
         * @param stepIndex The to be checked index of a step inside this wizard
         * @returns True if the given `stepIndex` is contained inside this wizard, false otherwise
         */
        WizardComponent.prototype.hasStep = function (stepIndex) {
            return this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
        };
        /**
         * Checks if this wizard has a previous step, compared to the current step
         *
         * @returns True if this wizard has a previous step before the current step
         */
        WizardComponent.prototype.hasPreviousStep = function () {
            return this.hasStep(this.currentStepIndex - 1);
        };
        /**
         * Checks if this wizard has a next step, compared to the current step
         *
         * @returns True if this wizard has a next step after the current step
         */
        WizardComponent.prototype.hasNextStep = function () {
            return this.hasStep(this.currentStepIndex + 1);
        };
        /**
         * Checks if this wizard is currently inside its last step
         *
         * @returns True if the wizard is currently inside its last step
         */
        WizardComponent.prototype.isLastStep = function () {
            return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
        };
        /**
         * Finds the [[WizardStep]] at the given index `stepIndex`.
         * If no [[WizardStep]] exists at the given index an Error is thrown
         *
         * @param stepIndex The given index
         * @returns The found [[WizardStep]] at the given index `stepIndex`
         * @throws An `Error` is thrown, if the given index `stepIndex` doesn't exist
         */
        WizardComponent.prototype.getStepAtIndex = function (stepIndex) {
            if (!this.hasStep(stepIndex)) {
                throw new Error("Expected a known step, but got stepIndex: " + stepIndex + ".");
            }
            return this.wizardSteps[stepIndex];
        };
        /**
         * Finds the index of the step with the given `stepId`.
         * If no step with the given `stepId` exists, `-1` is returned
         *
         * @param stepId The given step id
         * @returns The found index of a step with the given step id, or `-1` if no step with the given id is included in the wizard
         */
        WizardComponent.prototype.getIndexOfStepWithId = function (stepId) {
            return this.wizardSteps.findIndex(function (step) { return step.stepId === stepId; });
        };
        /**
         * Finds the index of the given [[WizardStep]] `step`.
         * If the given [[WizardStep]] is not contained inside this wizard, `-1` is returned
         *
         * @param step The given [[WizardStep]]
         * @returns The found index of `step` or `-1` if the step is not included in the wizard
         */
        WizardComponent.prototype.getIndexOfStep = function (step) {
            return this.wizardSteps.indexOf(step);
        };
        /**
         * Calculates the correct [[MovingDirection]] value for a given `destinationStep` compared to the `currentStepIndex`.
         *
         * @param destinationStep The given destination step
         * @returns The calculated [[MovingDirection]]
         */
        WizardComponent.prototype.getMovingDirection = function (destinationStep) {
            var movingDirection;
            if (destinationStep > this.currentStepIndex) {
                movingDirection = exports.MovingDirection.Forwards;
            }
            else if (destinationStep < this.currentStepIndex) {
                movingDirection = exports.MovingDirection.Backwards;
            }
            else {
                movingDirection = exports.MovingDirection.Stay;
            }
            return movingDirection;
        };
        /**
         * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
         *
         * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
         * Navigation by navigation bar is governed by [[isNavigable]].
         *
         * @param destinationIndex The index of the destination step
         * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
         */
        WizardComponent.prototype.canGoToStep = function (destinationIndex) {
            return this.navigation.canGoToStep(this, destinationIndex);
        };
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
        WizardComponent.prototype.goToStep = function (destinationIndex, preFinalize, postFinalize) {
            return this.navigation.goToStep(this, destinationIndex, preFinalize, postFinalize);
        };
        /**
         * Tries to transition the wizard to the previous step
         *
         * @param preFinalize An event emitter, to be called before the step has been transitioned
         * @param postFinalize An event emitter, to be called after the step has been transitioned
         */
        WizardComponent.prototype.goToPreviousStep = function (preFinalize, postFinalize) {
            return this.navigation.goToStep(this, this.currentStepIndex - 1, preFinalize, postFinalize);
        };
        /**
         * Tries to transition the wizard to the next step
         *
         * @param preFinalize An event emitter, to be called before the step has been transitioned
         * @param postFinalize An event emitter, to be called after the step has been transitioned
         */
        WizardComponent.prototype.goToNextStep = function (preFinalize, postFinalize) {
            return this.navigation.goToStep(this, this.currentStepIndex + 1, preFinalize, postFinalize);
        };
        /**
         * Checks, whether the wizard step, located at the given index, can be navigated to using the navigation bar.
         *
         * @param destinationIndex The index of the destination step
         * @returns True if the step can be navigated to, false otherwise
         */
        WizardComponent.prototype.isNavigable = function (destinationIndex) {
            return this.navigation.isNavigable(this, destinationIndex);
        };
        /**
         * Resets the state of this wizard.
         */
        WizardComponent.prototype.reset = function () {
            this.navigation.reset(this);
        };
        return WizardComponent;
    }());
    WizardComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'aw-wizard',
                    template: "<aw-wizard-navigation-bar\n  *ngIf=\"navBarLocation == 'top' || navBarLocation == 'left'\"\n  [ngClass]=\"{\n    'vertical': navBarLocation == 'left',\n    'horizontal': navBarLocation == 'top',\n    'small': navBarLayout == 'small',\n    'large-filled': navBarLayout == 'large-filled',\n    'large-filled-symbols': navBarLayout == 'large-filled-symbols',\n    'large-empty': navBarLayout == 'large-empty',\n    'large-empty-symbols': navBarLayout == 'large-empty-symbols'\n  }\">\n</aw-wizard-navigation-bar>\n\n<div [ngClass]=\"{\n  'wizard-steps': true,\n  'vertical': navBarLocation == 'left' || navBarLocation == 'right',\n  'horizontal': navBarLocation == 'top' || navBarLocation == 'bottom'\n}\">\n  <ng-content></ng-content>\n</div>\n\n<aw-wizard-navigation-bar\n  *ngIf=\"navBarLocation == 'bottom' || navBarLocation == 'right'\"\n  [ngClass]=\"{\n    'vertical': navBarLocation == 'right',\n    'horizontal': navBarLocation == 'bottom',\n    'small': navBarLayout == 'small',\n    'large-filled': navBarLayout == 'large-filled',\n    'large-filled-symbols': navBarLayout == 'large-filled-symbols',\n    'large-empty': navBarLayout == 'large-empty',\n    'large-empty-symbols': navBarLayout == 'large-empty-symbols'\n  }\">\n</aw-wizard-navigation-bar>\n"
                },] }
    ];
    WizardComponent.ctorParameters = function () { return []; };
    WizardComponent.propDecorators = {
        wizardStepsQueryList: [{ type: core.ContentChildren, args: [WizardStep, { descendants: true },] }],
        navBarLocation: [{ type: core.Input }],
        navBarLayout: [{ type: core.Input }],
        navBarDirection: [{ type: core.Input }],
        defaultStepIndex: [{ type: core.Input }],
        disableNavigationBar: [{ type: core.Input }],
        horizontalOrientation: [{ type: core.HostBinding, args: ['class.horizontal',] }],
        verticalOrientation: [{ type: core.HostBinding, args: ['class.vertical',] }]
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
    var WizardNavigationBarComponent = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizard The state the wizard currently resides in
         */
        function WizardNavigationBarComponent(wizard) {
            this.wizard = wizard;
        }
        Object.defineProperty(WizardNavigationBarComponent.prototype, "wizardSteps", {
            /**
             * Returns all [[WizardStep]]s contained in the wizard
             *
             * @returns An array containing all [[WizardStep]]s
             */
            get: function () {
                switch (this.wizard.navBarDirection) {
                    case 'right-to-left':
                        return this.wizard.wizardSteps.slice().reverse();
                    case 'left-to-right':
                    default:
                        return this.wizard.wizardSteps;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WizardNavigationBarComponent.prototype, "numberOfWizardSteps", {
            /**
             * Returns the number of wizard steps, that need to be displaced in the navigation bar
             *
             * @returns The number of wizard steps to be displayed
             */
            get: function () {
                return this.wizard.wizardSteps.length;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Checks, whether a [[WizardStep]] can be marked as `current` in the navigation bar
         *
         * @param wizardStep The wizard step to be checked
         * @returns True if the step can be marked as `current`
         */
        WizardNavigationBarComponent.prototype.isCurrent = function (wizardStep) {
            return wizardStep.selected;
        };
        /**
         * Checks, whether a [[WizardStep]] can be marked as `editing` in the navigation bar
         *
         * @param wizardStep The wizard step to be checked
         * @returns True if the step can be marked as `editing`
         */
        WizardNavigationBarComponent.prototype.isEditing = function (wizardStep) {
            return wizardStep.editing;
        };
        /**
         * Checks, whether a [[WizardStep]] can be marked as `done` in the navigation bar
         *
         * @param wizardStep The wizard step to be checked
         * @returns True if the step can be marked as `done`
         */
        WizardNavigationBarComponent.prototype.isDone = function (wizardStep) {
            return wizardStep.completed;
        };
        /**
         * Checks, whether a [[WizardStep]] can be marked as `optional` in the navigation bar
         *
         * @param wizardStep The wizard step to be checked
         * @returns True if the step can be marked as `optional`
         */
        WizardNavigationBarComponent.prototype.isOptional = function (wizardStep) {
            return wizardStep.optional;
        };
        /**
         * Checks, whether a [[WizardStep]] can be marked as `completed` in the navigation bar.
         *
         * The `completed` class is only applied to completion steps.
         *
         * @param wizardStep The wizard step to be checked
         * @returns True if the step can be marked as `completed`
         */
        WizardNavigationBarComponent.prototype.isCompleted = function (wizardStep) {
            return wizardStep instanceof WizardCompletionStep && this.wizard.completed;
        };
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
        WizardNavigationBarComponent.prototype.isNavigable = function (wizardStep) {
            return !wizardStep.selected && !this.wizard.disableNavigationBar &&
                this.wizard.isNavigable(this.wizard.getIndexOfStep(wizardStep));
        };
        return WizardNavigationBarComponent;
    }());
    WizardNavigationBarComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'aw-wizard-navigation-bar',
                    template: "<ul class=\"steps-indicator steps-{{numberOfWizardSteps}}\">\n  <li [attr.id]=\"step.stepId\" *ngFor=\"let step of wizardSteps\" [ngClass]=\"{\n        'current': isCurrent(step),\n        'editing': isEditing(step),\n        'done': isDone(step),\n        'optional': isOptional(step),\n        'completed': isCompleted(step),\n        'navigable': isNavigable(step)\n  }\">\n    <a [awGoToStep]=\"step\">\n      <div class=\"label\">\n        <ng-container *ngIf=\"step.stepTitleTemplate\" [ngTemplateOutlet]=\"step.stepTitleTemplate.templateRef\"\n          [ngTemplateOutletContext]=\"{wizardStep: step}\"></ng-container>\n        <ng-container *ngIf=\"!step.stepTitleTemplate\">{{step.stepTitle}}</ng-container>\n      </div>\n      <div class=\"step-indicator\"\n        [ngStyle]=\"{ 'font-family': step.stepSymbolTemplate ? '' : step.navigationSymbol.fontFamily }\">\n        <ng-container *ngIf=\"step.stepSymbolTemplate\" [ngTemplateOutlet]=\"step.stepSymbolTemplate.templateRef\"\n          [ngTemplateOutletContext]=\"{wizardStep: step}\"></ng-container>\n        <ng-container *ngIf=\"!step.stepSymbolTemplate\">{{step.navigationSymbol.symbol}}</ng-container>\n      </div>\n    </a>\n  </li>\n</ul>\n"
                },] }
    ];
    WizardNavigationBarComponent.ctorParameters = function () { return [
        { type: WizardComponent }
    ]; };

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
    var WizardStepComponent = /** @class */ (function (_super) {
        __extends(WizardStepComponent, _super);
        function WizardStepComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WizardStepComponent;
    }(WizardStep));
    WizardStepComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'aw-wizard-step',
                    template: "<ng-content></ng-content>\n",
                    providers: [
                        { provide: WizardStep, useExisting: core.forwardRef(function () { return WizardStepComponent; }) }
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
    var EnableBackLinksDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param completionStep The wizard completion step, which should be exitable
         */
        function EnableBackLinksDirective(completionStep) {
            this.completionStep = completionStep;
            /**
             * This EventEmitter is called when the step is exited.
             * The bound method can be used to do cleanup work.
             */
            this.stepExit = new core.EventEmitter();
        }
        /**
         * Initialization work
         */
        EnableBackLinksDirective.prototype.ngOnInit = function () {
            this.completionStep.canExit = true;
            this.completionStep.stepExit = this.stepExit;
        };
        return EnableBackLinksDirective;
    }());
    EnableBackLinksDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awEnableBackLinks]'
                },] }
    ];
    EnableBackLinksDirective.ctorParameters = function () { return [
        { type: WizardCompletionStep, decorators: [{ type: core.Host }] }
    ]; };
    EnableBackLinksDirective.propDecorators = {
        stepExit: [{ type: core.Output }]
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
    var GoToStepDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizard The wizard component
         * @param wizardStep The wizard step, which contains this [[GoToStepDirective]]
         */
        function GoToStepDirective(wizard, wizardStep) {
            this.wizard = wizard;
            this.wizardStep = wizardStep;
            /**
             * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
             */
            this.preFinalize = new core.EventEmitter();
            /**
             * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
             */
            this.postFinalize = new core.EventEmitter();
        }
        Object.defineProperty(GoToStepDirective.prototype, "finalize", {
            /**
             * A convenience field for `preFinalize`
             */
            get: function () {
                return this.preFinalize;
            },
            /**
             * A convenience name for `preFinalize`
             *
             * @param emitter The [[EventEmitter]] to be set
             */
            set: function (emitter) {
                /* istanbul ignore next */
                this.preFinalize = emitter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoToStepDirective.prototype, "destinationStep", {
            /**
             * Returns the destination step of this directive as an absolute step index inside the wizard
             *
             * @returns The index of the destination step
             * @throws If `targetStep` is of an unknown type an `Error` is thrown
             */
            get: function () {
                var destinationStep;
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
                    throw new Error("Input 'targetStep' is neither a WizardStep, StepOffset, StepIndex or StepId");
                }
                return destinationStep;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Listener method for `click` events on the component with this directive.
         * After this method is called the wizard will try to transition to the `destinationStep`
         */
        GoToStepDirective.prototype.onClick = function () {
            this.wizard.goToStep(this.destinationStep, this.preFinalize, this.postFinalize);
        };
        return GoToStepDirective;
    }());
    GoToStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awGoToStep]'
                },] }
    ];
    GoToStepDirective.ctorParameters = function () { return [
        { type: WizardComponent },
        { type: WizardStep, decorators: [{ type: core.Optional }] }
    ]; };
    GoToStepDirective.propDecorators = {
        preFinalize: [{ type: core.Output }],
        postFinalize: [{ type: core.Output }],
        targetStep: [{ type: core.Input, args: ['awGoToStep',] }],
        finalize: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click',] }]
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
    var NextStepDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizard The state of the wizard
         */
        function NextStepDirective(wizard) {
            this.wizard = wizard;
            /**
             * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
             */
            this.preFinalize = new core.EventEmitter();
            /**
             * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
             */
            this.postFinalize = new core.EventEmitter();
        }
        Object.defineProperty(NextStepDirective.prototype, "finalize", {
            /**
             * A convenience field for `preFinalize`
             */
            get: function () {
                return this.preFinalize;
            },
            /**
             * A convenience name for `preFinalize`
             *
             * @param emitter The [[EventEmitter]] to be set
             */
            set: function (emitter) {
                this.preFinalize = emitter;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Listener method for `click` events on the component with this directive.
         * After this method is called the wizard will try to transition to the next step
         */
        NextStepDirective.prototype.onClick = function () {
            this.wizard.goToNextStep(this.preFinalize, this.postFinalize);
        };
        return NextStepDirective;
    }());
    NextStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awNextStep]'
                },] }
    ];
    NextStepDirective.ctorParameters = function () { return [
        { type: WizardComponent }
    ]; };
    NextStepDirective.propDecorators = {
        preFinalize: [{ type: core.Output }],
        postFinalize: [{ type: core.Output }],
        finalize: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click',] }]
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
    var OptionalStepDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizardStep The wizard step, which contains this [[OptionalStepDirective]]
         */
        function OptionalStepDirective(wizardStep) {
            this.wizardStep = wizardStep;
            // tslint:disable-next-line:no-input-rename
            this.optional = true;
        }
        /**
         * Initialization work
         */
        OptionalStepDirective.prototype.ngOnInit = function () {
            // The input receives '' when specified in the template without a value.  In this case, apply the default value (`true`).
            this.wizardStep.optional = this.optional || this.optional === '';
        };
        return OptionalStepDirective;
    }());
    OptionalStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awOptionalStep]'
                },] }
    ];
    OptionalStepDirective.ctorParameters = function () { return [
        { type: WizardStep, decorators: [{ type: core.Host }] }
    ]; };
    OptionalStepDirective.propDecorators = {
        optional: [{ type: core.Input, args: ['awOptionalStep',] }]
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
    var PreviousStepDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizard The state of the wizard
         */
        function PreviousStepDirective(wizard) {
            this.wizard = wizard;
            /**
             * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
             */
            this.preFinalize = new core.EventEmitter();
            /**
             * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
             */
            this.postFinalize = new core.EventEmitter();
        }
        Object.defineProperty(PreviousStepDirective.prototype, "finalize", {
            /**
             * A convenience field for `preFinalize`
             */
            get: function () {
                return this.preFinalize;
            },
            /**
             * A convenience field for `preFinalize`
             *
             * @param emitter The [[EventEmitter]] to be set
             */
            set: function (emitter) {
                /* istanbul ignore next */
                this.preFinalize = emitter;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Listener method for `click` events on the component with this directive.
         * After this method is called the wizard will try to transition to the previous step
         */
        PreviousStepDirective.prototype.onClick = function () {
            this.wizard.goToPreviousStep(this.preFinalize, this.postFinalize);
        };
        return PreviousStepDirective;
    }());
    PreviousStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awPreviousStep]'
                },] }
    ];
    PreviousStepDirective.ctorParameters = function () { return [
        { type: WizardComponent }
    ]; };
    PreviousStepDirective.propDecorators = {
        preFinalize: [{ type: core.Output }],
        postFinalize: [{ type: core.Output }],
        finalize: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click',] }]
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
    var ResetWizardDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizard The wizard component
         */
        function ResetWizardDirective(wizard) {
            this.wizard = wizard;
            /**
             * An [[EventEmitter]] containing some tasks to be done, directly before the wizard is being reset
             */
            this.finalize = new core.EventEmitter();
        }
        /**
         * Resets the wizard
         */
        ResetWizardDirective.prototype.onClick = function () {
            // do some optional cleanup work
            this.finalize.emit();
            // reset the wizard to its initial state
            this.wizard.reset();
        };
        return ResetWizardDirective;
    }());
    ResetWizardDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awResetWizard]'
                },] }
    ];
    ResetWizardDirective.ctorParameters = function () { return [
        { type: WizardComponent }
    ]; };
    ResetWizardDirective.propDecorators = {
        finalize: [{ type: core.Output }],
        onClick: [{ type: core.HostListener, args: ['click',] }]
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
    var SelectedStepDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizardStep The wizard step, which should be selected by default
         */
        function SelectedStepDirective(wizardStep) {
            this.wizardStep = wizardStep;
        }
        /**
         * Initialization work
         */
        SelectedStepDirective.prototype.ngOnInit = function () {
            this.wizardStep.defaultSelected = true;
        };
        return SelectedStepDirective;
    }());
    SelectedStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awSelectedStep]'
                },] }
    ];
    SelectedStepDirective.ctorParameters = function () { return [
        { type: WizardStep, decorators: [{ type: core.Host }] }
    ]; };

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
    var WizardCompletionStepDirective = /** @class */ (function (_super) {
        __extends(WizardCompletionStepDirective, _super);
        function WizardCompletionStepDirective() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WizardCompletionStepDirective;
    }(WizardCompletionStep));
    WizardCompletionStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awWizardCompletionStep]',
                    providers: [
                        { provide: WizardStep, useExisting: core.forwardRef(function () { return WizardCompletionStepDirective; }) },
                        { provide: WizardCompletionStep, useExisting: core.forwardRef(function () { return WizardCompletionStepDirective; }) }
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
    var WizardStepDirective = /** @class */ (function (_super) {
        __extends(WizardStepDirective, _super);
        function WizardStepDirective() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WizardStepDirective;
    }(WizardStep));
    WizardStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awWizardStep]',
                    providers: [
                        { provide: WizardStep, useExisting: core.forwardRef(function () { return WizardStepDirective; }) }
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
    var NavigationModeDirective = /** @class */ (function () {
        function NavigationModeDirective(wizard) {
            this.wizard = wizard;
        }
        NavigationModeDirective.prototype.ngOnChanges = function (changes) {
            this.wizard.navigation = this.getNavigationMode();
        };
        NavigationModeDirective.prototype.getNavigationMode = function () {
            if (this.awNavigationMode) {
                return this.awNavigationMode;
            }
            return new ConfigurableNavigationMode(this.navigateBackward, this.navigateForward);
        };
        return NavigationModeDirective;
    }());
    NavigationModeDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awNavigationMode]',
                },] }
    ];
    NavigationModeDirective.ctorParameters = function () { return [
        { type: WizardComponent }
    ]; };
    NavigationModeDirective.propDecorators = {
        awNavigationMode: [{ type: core.Input }],
        navigateBackward: [{ type: core.Input }],
        navigateForward: [{ type: core.Input }]
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
    var CompletedStepDirective = /** @class */ (function () {
        /**
         * Constructor
         *
         * @param wizardStep The wizard step, which contains this [[CompletedStepDirective]]
         */
        function CompletedStepDirective(wizardStep) {
            this.wizardStep = wizardStep;
            // tslint:disable-next-line:no-input-rename
            this.initiallyCompleted = true;
        }
        /**
         * Initialization work
         */
        CompletedStepDirective.prototype.ngOnInit = function () {
            // The input receives '' when specified in the template without a value.  In this case, apply the default value (`true`).
            this.wizardStep.initiallyCompleted = this.initiallyCompleted || this.initiallyCompleted === '';
        };
        return CompletedStepDirective;
    }());
    CompletedStepDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[awCompletedStep]'
                },] }
    ];
    CompletedStepDirective.ctorParameters = function () { return [
        { type: WizardStep, decorators: [{ type: core.Host }] }
    ]; };
    CompletedStepDirective.propDecorators = {
        initiallyCompleted: [{ type: core.Input, args: ['awCompletedStep',] }]
    };

    /**
     * The module defining all the content inside `angular-archwizard`
     *
     * @author Marc Arndt
     */
    var ArchwizardModule = /** @class */ (function () {
        function ArchwizardModule() {
        }
        /* istanbul ignore next */
        ArchwizardModule.forRoot = function () {
            return {
                ngModule: ArchwizardModule,
                providers: [
                // Nothing here yet
                ]
            };
        };
        return ArchwizardModule;
    }());
    ArchwizardModule.decorators = [
        { type: core.NgModule, args: [{
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
                        common.CommonModule
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

    exports.ArchwizardModule = ArchwizardModule;
    exports.BaseNavigationMode = BaseNavigationMode;
    exports.CompletedStepDirective = CompletedStepDirective;
    exports.ConfigurableNavigationMode = ConfigurableNavigationMode;
    exports.EnableBackLinksDirective = EnableBackLinksDirective;
    exports.GoToStepDirective = GoToStepDirective;
    exports.NavigationModeDirective = NavigationModeDirective;
    exports.NextStepDirective = NextStepDirective;
    exports.OptionalStepDirective = OptionalStepDirective;
    exports.PreviousStepDirective = PreviousStepDirective;
    exports.ResetWizardDirective = ResetWizardDirective;
    exports.SelectedStepDirective = SelectedStepDirective;
    exports.WizardCompletionStep = WizardCompletionStep;
    exports.WizardCompletionStepComponent = WizardCompletionStepComponent;
    exports.WizardCompletionStepDirective = WizardCompletionStepDirective;
    exports.WizardComponent = WizardComponent;
    exports.WizardNavigationBarComponent = WizardNavigationBarComponent;
    exports.WizardStep = WizardStep;
    exports.WizardStepComponent = WizardStepComponent;
    exports.WizardStepDirective = WizardStepDirective;
    exports.WizardStepSymbolDirective = WizardStepSymbolDirective;
    exports.WizardStepTitleDirective = WizardStepTitleDirective;
    exports.isStepId = isStepId;
    exports.isStepIndex = isStepIndex;
    exports.isStepOffset = isStepOffset;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-archwizard.umd.js.map
