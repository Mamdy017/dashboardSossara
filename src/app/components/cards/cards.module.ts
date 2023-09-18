import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { CardsRoutingModule } from './cards-routing.module';

import { BasicComponent } from './basic/basic.component';
import { CreativeComponent } from './creative/creative.component';
import { DraggableComponent } from './draggable/draggable.component';
import { TabbedComponent } from './tabbed/tabbed.component';
import { TabsModule } from 'ngx-tabset';

@NgModule({
  declarations: [BasicComponent, CreativeComponent,DraggableComponent, TabbedComponent],
  imports: [
    CommonModule,
    CardsRoutingModule,
    DragulaModule.forRoot(),
    NgbModule,
    SharedModule,
    TabsModule
  ]
})
export class CardsModule { }
