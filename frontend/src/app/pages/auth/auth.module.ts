import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  declarations: [AuthComponent, LoginComponent, ResetPasswordComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],
})
export class AuthModule {}
