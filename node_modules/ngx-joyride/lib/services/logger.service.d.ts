import { JoyrideOptionsService } from './joyride-options.service';
import * as i0 from "@angular/core";
export declare class LoggerService {
    private readonly optionService;
    constructor(optionService: JoyrideOptionsService);
    debug(message?: string, data?: any): void;
    info(message?: string, data?: any): void;
    warn(message?: string, data?: any): void;
    error(message?: string, data?: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoggerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LoggerService>;
}
