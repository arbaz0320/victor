import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MenuItemComponent } from './sidebar/menu-item/menu-item.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FieldsComponent } from './fields/fields.component';
import { SignatoriesComponent } from './signatories/signatories.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MenuItemComponent,
    EditorComponent,
    FieldsComponent,
    SignatoriesComponent,
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    RouterModule,
    CKEditorModule,
    NgbPaginationModule,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MenuItemComponent,
    EditorComponent,
    FieldsComponent,
    SignatoriesComponent,
  ],
})
export class SharedModule {}
