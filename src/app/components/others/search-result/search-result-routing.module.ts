import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultComponent } from './search-result.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SearchResultComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchResultRoutingModule { }
