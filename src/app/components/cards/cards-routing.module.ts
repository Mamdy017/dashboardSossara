import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicComponent } from './basic/basic.component';
import { CreativeComponent } from './creative/creative.component';
import { DraggableComponent } from './draggable/draggable.component';
import { TabbedComponent } from './tabbed/tabbed.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic',
        component: BasicComponent
      },
      {
        path: 'creative',
        component: CreativeComponent
      },
      {
        path: 'dragable',
        component: DraggableComponent
      },
      {
        path: 'tabbed',
        component: TabbedComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardsRoutingModule { }
