import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { CountToModule } from 'angular-count-to';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { TeamDetailsComponent } from './team-details/team-details.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import 'hammerjs';
import 'mousetrap';

@NgModule({
  declarations: [TeamDetailsComponent, ProfileComponent, EditProfileComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CountToModule,
    GalleryModule,

  ]
})
export class UsersModule { }
