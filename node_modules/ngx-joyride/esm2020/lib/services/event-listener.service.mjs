import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./dom.service";
export class Scroll {
}
export class EventListenerService {
    constructor(rendererFactory, DOMService) {
        this.rendererFactory = rendererFactory;
        this.DOMService = DOMService;
        this.scrollEvent = new Subject();
        this.resizeEvent = new Subject();
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    startListeningScrollEvents() {
        this.scrollUnlisten = this.renderer.listen('document', 'scroll', evt => {
            this.scrollEvent.next({
                scrollX: this.DOMService.getNativeWindow().pageXOffset,
                scrollY: this.DOMService.getNativeWindow().pageYOffset
            });
        });
    }
    startListeningResizeEvents() {
        this.resizeUnlisten = this.renderer.listen('window', 'resize', evt => {
            this.resizeEvent.next(evt);
        });
    }
    stopListeningScrollEvents() {
        this.scrollUnlisten();
    }
    stopListeningResizeEvents() {
        this.resizeUnlisten();
    }
}
EventListenerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: EventListenerService, deps: [{ token: i0.RendererFactory2 }, { token: i1.DomRefService }], target: i0.ɵɵFactoryTarget.Injectable });
EventListenerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: EventListenerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: EventListenerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.RendererFactory2 }, { type: i1.DomRefService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtbGlzdGVuZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1qb3lyaWRlL3NyYy9saWIvc2VydmljZXMvZXZlbnQtbGlzdGVuZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFHL0IsTUFBTSxPQUFPLE1BQU07Q0FHbEI7QUFHRCxNQUFNLE9BQU8sb0JBQW9CO0lBUTdCLFlBQTZCLGVBQWlDLEVBQW1CLFVBQXlCO1FBQTdFLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUFtQixlQUFVLEdBQVYsVUFBVSxDQUFlO1FBSDFHLGdCQUFXLEdBQW9CLElBQUksT0FBTyxFQUFVLENBQUM7UUFDckQsZ0JBQVcsR0FBb0IsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUdqRCxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCwwQkFBMEI7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ25FLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxXQUFXO2dCQUN0RCxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxXQUFXO2FBQ3pELENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDBCQUEwQjtRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDakUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQseUJBQXlCO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQseUJBQXlCO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDOztpSEFqQ1Esb0JBQW9CO3FIQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFJlbmRlcmVyMiwgUmVuZGVyZXJGYWN0b3J5MiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRG9tUmVmU2VydmljZSB9IGZyb20gJy4vZG9tLnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgU2Nyb2xsIHtcbiAgICBzY3JvbGxYOiBudW1iZXI7XG4gICAgc2Nyb2xsWTogbnVtYmVyO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRXZlbnRMaXN0ZW5lclNlcnZpY2Uge1xuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgICBwcml2YXRlIHNjcm9sbFVubGlzdGVuOiBhbnk7XG4gICAgcHJpdmF0ZSByZXNpemVVbmxpc3RlbjogYW55O1xuXG4gICAgc2Nyb2xsRXZlbnQ6IFN1YmplY3Q8U2Nyb2xsPiA9IG5ldyBTdWJqZWN0PFNjcm9sbD4oKTtcbiAgICByZXNpemVFdmVudDogU3ViamVjdDxudW1iZXI+ID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIsIHByaXZhdGUgcmVhZG9ubHkgRE9NU2VydmljZTogRG9tUmVmU2VydmljZSkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXJGYWN0b3J5LmNyZWF0ZVJlbmRlcmVyKG51bGwsIG51bGwpO1xuICAgIH1cblxuICAgIHN0YXJ0TGlzdGVuaW5nU2Nyb2xsRXZlbnRzKCkge1xuICAgICAgICB0aGlzLnNjcm9sbFVubGlzdGVuID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3Njcm9sbCcsIGV2dCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEV2ZW50Lm5leHQoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFg6IHRoaXMuRE9NU2VydmljZS5nZXROYXRpdmVXaW5kb3coKS5wYWdlWE9mZnNldCxcbiAgICAgICAgICAgICAgICBzY3JvbGxZOiB0aGlzLkRPTVNlcnZpY2UuZ2V0TmF0aXZlV2luZG93KCkucGFnZVlPZmZzZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGFydExpc3RlbmluZ1Jlc2l6ZUV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5yZXNpemVVbmxpc3RlbiA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAncmVzaXplJywgZXZ0ID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplRXZlbnQubmV4dChldnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdG9wTGlzdGVuaW5nU2Nyb2xsRXZlbnRzKCkge1xuICAgICAgICB0aGlzLnNjcm9sbFVubGlzdGVuKCk7XG4gICAgfVxuXG4gICAgc3RvcExpc3RlbmluZ1Jlc2l6ZUV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5yZXNpemVVbmxpc3RlbigpO1xuICAgIH1cbn1cbiJdfQ==