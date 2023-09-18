import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../../shared/shared.module";
import { ProjectRoutingModule } from './project-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectComponent } from './create-project/create-project.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProjectRoutingModule,
    NgxDropzoneModule
  ],
  declarations: [ProjectListComponent, CreateProjectComponent]
})
export class ProjectModule { }
