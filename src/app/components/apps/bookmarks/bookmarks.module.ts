import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';

import { BookmarksComponent } from './bookmarks.component';
import { AddBookmarkComponent } from './modal/add-bookmark/add-bookmark.component';
import { EditBookmarkComponent } from './modal/edit-bookmark/edit-bookmark.component';
import { CreateTagComponent } from './modal/create-tag/create-tag.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BookmarksRoutingModule
  ],
  declarations: [BookmarksComponent, AddBookmarkComponent, EditBookmarkComponent, CreateTagComponent]
})
export class BookmarksModule { }
