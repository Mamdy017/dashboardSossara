import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { GeneralComponent } from './general/general.component';
import { ChartComponent } from './chart/chart.component';


const routes: Routes = [
  {
    path: '',
    children: [
  
      {
        path: 'chart',
        component: ChartComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsRoutingModule { }
