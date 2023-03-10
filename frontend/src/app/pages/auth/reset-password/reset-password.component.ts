import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  send = false;
  constructor(private service: AuthService, public tools: ToolsService) {}

  ngOnInit(): void {}

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.loading = true;
    this.service
      .resetPassword(form.value)
      .then((res) => {
        this.send = true;
      })
      .finally(() => (this.loading = false));
  }
}
