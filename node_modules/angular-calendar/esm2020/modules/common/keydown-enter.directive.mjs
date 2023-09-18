import { Directive, Output, EventEmitter, } from '@angular/core';
import * as i0 from "@angular/core";
export class KeydownEnterDirective {
    constructor(host, ngZone, renderer) {
        this.host = host;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.keydown = new EventEmitter(); // eslint-disable-line
        this.keydownListener = null;
    }
    ngOnInit() {
        this.ngZone.runOutsideAngular(() => {
            this.keydownListener = this.renderer.listen(this.host.nativeElement, 'keydown', (event) => {
                if (event.keyCode === 13 ||
                    event.which === 13 ||
                    event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.ngZone.run(() => {
                        this.keydown.emit(event);
                    });
                }
            });
        });
    }
    ngOnDestroy() {
        if (this.keydownListener !== null) {
            this.keydownListener();
            this.keydownListener = null;
        }
    }
}
KeydownEnterDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: KeydownEnterDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
KeydownEnterDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.1.2", type: KeydownEnterDirective, selector: "[mwlKeydownEnter]", outputs: { keydown: "mwlKeydownEnter" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.2", ngImport: i0, type: KeydownEnterDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mwlKeydownEnter]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }]; }, propDecorators: { keydown: [{
                type: Output,
                args: ['mwlKeydownEnter']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5ZG93bi1lbnRlci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNhbGVuZGFyL3NyYy9tb2R1bGVzL2NvbW1vbi9rZXlkb3duLWVudGVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixZQUFZLEdBTWIsTUFBTSxlQUFlLENBQUM7O0FBS3ZCLE1BQU0sT0FBTyxxQkFBcUI7SUFLaEMsWUFDVSxJQUE2QixFQUM3QixNQUFjLEVBQ2QsUUFBbUI7UUFGbkIsU0FBSSxHQUFKLElBQUksQ0FBeUI7UUFDN0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFQRixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQWlCLENBQUMsQ0FBQyxzQkFBc0I7UUFFdEYsb0JBQWUsR0FBd0IsSUFBSSxDQUFDO0lBTWpELENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQ3ZCLFNBQVMsRUFDVCxDQUFDLEtBQW9CLEVBQUUsRUFBRTtnQkFDdkIsSUFDRSxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ3BCLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRTtvQkFDbEIsS0FBSyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQ3JCO29CQUNBLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUV4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7d0JBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMzQixDQUFDLENBQUMsQ0FBQztpQkFDSjtZQUNILENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDakMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs7a0hBdkNVLHFCQUFxQjtzR0FBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBSGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7OElBRTRCLE9BQU87c0JBQWpDLE1BQU07dUJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgTmdab25lLFxuICBSZW5kZXJlcjIsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bEtleWRvd25FbnRlcl0nLFxufSlcbmV4cG9ydCBjbGFzcyBLZXlkb3duRW50ZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoJ213bEtleWRvd25FbnRlcicpIGtleWRvd24gPSBuZXcgRXZlbnRFbWl0dGVyPEtleWJvYXJkRXZlbnQ+KCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICBwcml2YXRlIGtleWRvd25MaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBob3N0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5rZXlkb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICdrZXlkb3duJyxcbiAgICAgICAgKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZXZlbnQua2V5Q29kZSA9PT0gMTMgfHxcbiAgICAgICAgICAgIGV2ZW50LndoaWNoID09PSAxMyB8fFxuICAgICAgICAgICAgZXZlbnQua2V5ID09PSAnRW50ZXInXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMua2V5ZG93bi5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmtleWRvd25MaXN0ZW5lciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5rZXlkb3duTGlzdGVuZXIoKTtcbiAgICAgIHRoaXMua2V5ZG93bkxpc3RlbmVyID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==