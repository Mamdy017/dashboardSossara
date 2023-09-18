import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ProjectListComponent
      },
      {
        path: 'create',
        component: CreateProjectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
