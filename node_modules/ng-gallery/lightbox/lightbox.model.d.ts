import { InjectionToken } from '@angular/core';
export declare const LIGHTBOX_CONFIG: InjectionToken<LightboxConfig>;
export interface LightboxConfig {
    backdropClass?: string;
    panelClass?: string;
    hasBackdrop?: boolean;
    keyboardShortcuts?: boolean;
    closeIcon?: string;
    role?: string;
    ariaLabelledBy?: string;
    ariaLabel?: string;
    ariaDescribedBy?: string;
    startAnimationTime?: number;
    exitAnimationTime?: number;
}
