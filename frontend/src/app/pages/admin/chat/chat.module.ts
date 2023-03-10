import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { FormsModule } from '@angular/forms';
import { ChatFinishComponent } from './chat-finish/chat-finish.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [{ path: ':id', component: ChatFormComponent }],
  },
];

@NgModule({
  declarations: [ChatComponent, ChatFormComponent, ChatFinishComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class ChatModule {}
